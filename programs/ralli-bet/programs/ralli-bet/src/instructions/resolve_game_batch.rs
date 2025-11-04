use crate::constants::*;
use crate::errors::RalliError;
use crate::state::*;
use crate::state::Bet; // Import the Bet struct
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked},
};

const MAX_WINNERS_PER_TX: usize = 15; // Now 15 pairs (30 accounts)

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
        let number_of_losers = total_players - number_of_winners; 
        let num_winners_u32 = self.game.num_winners; 
        let payout_progress = self.game.payout_progress;
        let calculation_complete = self.game.calculation_complete;
        let game_status = self.game.status.clone();
        let program_id = self.game.to_account_info().owner; 

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
        require!(total_players > 0, RalliError::NoPlayersInGame);

        require!(
            remaining_accounts.len() > 0 && remaining_accounts.len() % 2 == 0,
            RalliError::InvalidRemainingAccounts // Add to errors.rs
        );

        let winners_in_this_batch = remaining_accounts.len() / 2;
        require!(
            winners_in_this_batch <= MAX_WINNERS_PER_TX,
            RalliError::TooManyAccountsInBatch
        );

        require!(
            batch_index == payout_progress,
            RalliError::InvalidBatchIndex
        );

        if payout_progress == 0 {
            self.game.status = GameStatus::Resolving;
            msg!("Game {} is now Resolving.", game_id);
        }
        
        let winners_remaining = num_winners_u32 - payout_progress;
        require!(
            (winners_in_this_batch as u32) <= winners_remaining,
            RalliError::TooManyWinnersInBatch
        );

        // Calculate payouts
        let (total_per_winner, fee_from_losers, net_losers_pool) = 
            if number_of_winners == 0 {
                (0, 0, 0) // Should be unreachable
            } else if number_of_winners == total_players {
                // All win, refund entry fee
                (entry_fee, 0, 0)
            } else {
                // Normal case: some winners, some losers
                let losers_pool = entry_fee * number_of_losers as u64;
                let fee = (losers_pool as u128 * fee_percentage as u128) / 10000u128;
                let fee = fee as u64;
                let net_pool = losers_pool - fee;
                let winnings = net_pool / number_of_winners as u64;
                (entry_fee + winnings, fee, net_pool)
            };

        require!(total_per_winner > 0, RalliError::PayoutAmountZero);

        // --- Process this batch's winners ---
        for account_chunk in remaining_accounts.chunks_exact(2) {
            let bet_account_info = &account_chunk[0];
            let token_account_info = &account_chunk[1];

            let mut bet = Account::<Bet>::try_from(bet_account_info)?;

            let token_account = InterfaceAccount::<TokenAccount>::try_from(token_account_info)?;

            require!(!bet.paid, RalliError::BetAlreadyPaid); 

            require!(bet.game == self.game.key(), RalliError::BetAccountMismatch);

            require!(bet.player == token_account.owner, RalliError::BetAccountMismatch);

            require!(
                (bet.num_correct as u32) == (self.game.correct_votes_to_be_winner as u32),
                RalliError::NotAWinner
            );
            
            self.transfer_to_winner(
                token_account_info,
                total_per_winner,
                game_id,
                game_bump,
            )?;

            bet.paid = true;

            bet.exit(program_id)?;
        }

        self.game.payout_progress += winners_in_this_batch as u32;

        // Finalize if all winners are now paid
        if self.game.payout_progress >= num_winners_u32 {
            let remainder_to_treasury = if number_of_winners > 0 && number_of_winners < total_players {
                net_losers_pool % number_of_winners as u64
            } else {
                0
            };
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
        winner_account_info: &AccountInfo<'info>, // Renamed for clarity
        amount: u64,
        game_id: u64,
        game_bump: u8,
    ) -> Result<()> {
        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = TransferChecked {
            from: self.game_vault.to_account_info(),
            to: winner_account_info.clone(),
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

