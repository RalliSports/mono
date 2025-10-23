use crate::constants::*;
use crate::errors::RalliError;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked},
};

const MAX_WINNERS_PER_TX: usize = 30;

#[derive(Accounts)]
pub struct ResolveGameBatch<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        mut,
        seeds = [b"game", game.game_id.to_le_bytes().as_ref()],
        bump = game.bump
    )]
    pub game: Account<'info, Game>,

    #[account(
        mut,
        seeds = [b"escrow", game.key().as_ref()],
        bump = game_escrow.bump
    )]
    pub game_escrow: Account<'info, GameEscrow>,

    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = game,
    )]
    pub game_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    /// CHECK: Treasury account to receive fees
    #[account(mut)]
    pub treasury: AccountInfo<'info>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = treasury,
    )]
    pub treasury_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> ResolveGameBatch<'info> {
    pub fn resolve_game_batch(
        &mut self,
        fee_percentage: u16,
        batch_index: u32, // Represents the number of winners *already paid*
        remaining_accounts: &'info [AccountInfo<'info>],
    ) -> Result<()> {
        let game_id = self.game.game_id;
        let game_bump = self.game.bump;
        let entry_fee = self.game.entry_fee;
        let total_players = self.game.users.len();
        let number_of_winners = self.game.num_winners as usize;
        let num_winners_u32 = self.game.num_winners; // u32
        let payout_progress = self.game.payout_progress; // Tracks total winners paid
        let calculation_complete = self.game.calculation_complete;
        let game_status = self.game.status.clone();

        require!(
            is_admin(&self.admin.key()),
            RalliError::UnauthorizedGameResolution
        );

        require!(
            game_status == GameStatus::Open || game_status == GameStatus::Resolving,
            RalliError::GameAlreadyResolved
        );

        require!(calculation_complete, RalliError::CalculationNotComplete);
        require!(fee_percentage <= 1000, RalliError::ExcessiveFee);
        require!(
            remaining_accounts.len() <= MAX_WINNERS_PER_TX,
            RalliError::TooManyAccountsInBatch
        );
        require!(total_players > 0, RalliError::NoPlayersInGame);

        require!(
            batch_index == payout_progress,
            RalliError::InvalidBatchIndex
        );

        if payout_progress == 0 {
            self.game.status = GameStatus::Resolving;
            msg!("Game {} is now Resolving.", game_id);
        }

        //NO WINNERS
        if number_of_winners == total_players || number_of_winners == 0 {
            let (player_list, reason) = if number_of_winners == 0 {
                (total_players as u32, "No winners, all players refunded")
            } else {
                (num_winners_u32, "All players won, returned entry fees")
            };
            
            require!(batch_index == 0, RalliError::InvalidBatchIndex);
            require!(
                remaining_accounts.len() == player_list as usize,
                RalliError::BatchSizeMismatch
            );

            for player_account in remaining_accounts.iter() {
                self.transfer_to_winner(
                    player_account,
                    entry_fee,
                    game_id,
                    game_bump,
                )?;
            }

            self.game.payout_progress = player_list; 
            self.game_escrow.total_amount = 0;
            self.game.status = GameStatus::Resolved;
            msg!("Game {} fully resolved - {}", game_id, reason);
            
            return Ok(());
        }

        // Ensure we don't exceed the number of winners
        let winners_remaining = num_winners_u32 - payout_progress;
        require!(
            remaining_accounts.len() as u32 <= winners_remaining,
            RalliError::TooManyWinnersInBatch
        );
        
        // Calculate payouts
        let number_of_losers = total_players - number_of_winners;
        let losers_pool = entry_fee * number_of_losers as u64;
        let fee_from_losers = (losers_pool as u128 * fee_percentage as u128) / 10000u128;
        let fee_from_losers = fee_from_losers as u64;
        let net_losers_pool = losers_pool - fee_from_losers;
        let winnings_per_winner = net_losers_pool / number_of_winners as u64;
        let total_per_winner = entry_fee + winnings_per_winner;

        // Pay this batch's winners
        for winner_account in remaining_accounts.iter() {
            self.transfer_to_winner(
                winner_account,
                total_per_winner,
                game_id,
                game_bump,
            )?;
        }

        self.game.payout_progress += remaining_accounts.len() as u32;

        if self.game.payout_progress >= num_winners_u32 {
            let remainder_to_treasury = net_losers_pool % number_of_winners as u64;
            let total_treasury_amount = fee_from_losers + remainder_to_treasury;

            if total_treasury_amount > 0 {
                let cpi_program = self.token_program.to_account_info();
                let cpi_accounts = TransferChecked {
                    from: self.game_vault.to_account_info(),
                    to: self.treasury_vault.to_account_info(),
                    authority: self.game.to_account_info(),
                    mint: self.mint.to_account_info(),
                };

                let seeds = &["game".as_bytes(), &game_id.to_le_bytes(), &[game_bump]];
                let signer_seeds = &[&seeds[..]];
                let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

                transfer_checked(cpi_ctx, total_treasury_amount, self.mint.decimals)?;
            }

            self.game_escrow.total_amount = 0;
            self.game.status = GameStatus::Resolved;

            msg!(
                "Game {} fully resolved - Winners: {}, Losers: {}, Fees: {}",
                game_id,
                number_of_winners,
                number_of_losers,
                fee_from_losers
            );
        } else {
            msg!(
                "Game {} batch complete - Progress: {}/{}",
                game_id,
                self.game.payout_progress,
                num_winners_u32
            );
        }

        Ok(())
    }

    fn transfer_to_winner(
        &self,
        winner_account: &AccountInfo<'info>,
        amount: u64,
        game_id: u64,
        game_bump: u8,
    ) -> Result<()> {
        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = TransferChecked {
            from: self.game_vault.to_account_info(),
            to: winner_account.clone(),
            authority: self.game.to_account_info(),
            mint: self.mint.to_account_info(),
        };

        let seeds = &["game".as_bytes(), &game_id.to_le_bytes(), &[game_bump]];
        let signer_seeds = &[&seeds[..]];
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        transfer_checked(cpi_ctx, amount, self.mint.decimals)?;
        Ok(())
    }
}

