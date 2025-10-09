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
        batch_index: u32,
        remaining_accounts: &'info [AccountInfo<'info>],
    ) -> Result<()> {
        let game_id = self.game.game_id;
        let game_bump = self.game.bump;
        let entry_fee = self.game.entry_fee;
        let total_players = self.game.users.len();
        let number_of_winners = self.game.num_winners as usize;
        let num_winners = self.game.num_winners;
        let payout_progress = self.game.payout_progress;
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

        let number_of_losers = total_players - number_of_winners;

        require!(total_players > 0, RalliError::NoPlayersInGame);

        if batch_index == 0 {
            self.game.status = GameStatus::Resolving;

            if number_of_winners == total_players {
                for winner_account in remaining_accounts.iter() {
                    self.transfer_to_winner(
                        winner_account,
                        entry_fee,
                        game_id,
                        game_bump,
                    )?;
                }
                
                self.game.payout_progress += remaining_accounts.len() as u32;
                
                if self.game.payout_progress >= num_winners {
                    self.game_escrow.total_amount = 0;
                    self.game.status = GameStatus::Resolved;
                    msg!(
                        "Game {} fully resolved - All {} players won (returned entry fees)",
                        game_id,
                        total_players
                    );
                }
                return Ok(());
            }

            if number_of_winners == 0 {
                for player_account in remaining_accounts.iter() {
                    self.transfer_to_winner(
                        player_account,
                        entry_fee,
                        game_id,
                        game_bump,
                    )?;
                }
                
                self.game.payout_progress += remaining_accounts.len() as u32;
                
                if self.game.payout_progress >= total_players as u32 {
                    self.game_escrow.total_amount = 0;
                    self.game.status = GameStatus::Resolved;
                    msg!(
                        "Game {} fully resolved - No winners, all {} players refunded",
                        game_id,
                        total_players
                    );
                }
                return Ok(());
            }
        }

        let losers_pool = entry_fee * number_of_losers as u64;
        let fee_from_losers = (losers_pool as u128 * fee_percentage as u128) / 10000u128;
        let fee_from_losers = fee_from_losers as u64;
        let net_losers_pool = losers_pool - fee_from_losers;
        let winnings_per_winner = net_losers_pool / number_of_winners as u64;
        let total_per_winner = entry_fee + winnings_per_winner;

        let winners_remaining = num_winners - payout_progress;
        require!(
            remaining_accounts.len() <= winners_remaining as usize,
            RalliError::TooManyWinnersInBatch
        );

        for winner_account in remaining_accounts.iter() {
            self.transfer_to_winner(
                winner_account,
                total_per_winner,
                game_id,
                game_bump,
            )?;
        }

        self.game.payout_progress += remaining_accounts.len() as u32;

        if self.game.payout_progress >= num_winners {
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
                "Game {} fully resolved - Winners: {}, Losers: {}, Fees: {}, Total batches: {}",
                game_id,
                number_of_winners,
                number_of_losers,
                fee_from_losers,
                batch_index + 1
            );
        } else {
            msg!(
                "Game {} batch {} complete - Progress: {}/{}",
                game_id,
                batch_index,
                self.game.payout_progress,
                num_winners
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