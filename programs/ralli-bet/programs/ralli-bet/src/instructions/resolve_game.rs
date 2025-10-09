use crate::constants::*;
use crate::errors::RalliError;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked},
};

#[derive(Accounts)]
pub struct ResolveGame<'info> {
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

    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> ResolveGame<'info> {
    pub fn resolve_game(
        &mut self,
        fee_percentage: u16,
        remaining_accounts: &'info [AccountInfo<'info>],
    ) -> Result<()> {
        // Extract values needed before mutable borrow
        let game_id = self.game.game_id;
        let game_bump = self.game.bump;
        let game_account_info = self.game.to_account_info();

        let game = &mut self.game;
        let game_escrow = &mut self.game_escrow;
        let admin = &self.admin;

        // Only admin can resolve games
        require!(
            is_admin(&admin.key()),
            RalliError::UnauthorizedGameResolution
        );

        // Ensure game is still Open
        require_eq!(game.status, GameStatus::Open, RalliError::GameAlreadyResolved);

        // Ensure calculation phase is complete
        require!(game.calculation_complete, RalliError::CalculationNotComplete);

        // Validate fee percentage
        require!(fee_percentage <= 1000, RalliError::ExcessiveFee);

        // remaining_accounts should be winner token accounts only
        let winner_accounts = remaining_accounts;
        
        // Verify we have the correct number of winner accounts
        require_eq!(
            winner_accounts.len(),
            game.num_winners as usize,
            RalliError::IncorrectWinnerAccountCount
        );

        let total_players = game.users.len();
        let number_of_winners = game.num_winners as usize;
        let number_of_losers = total_players - number_of_winners;

        require!(total_players > 0, RalliError::NoPlayersInGame);

        // Handle edge case where everyone wins (no losers)
        if number_of_winners == total_players {
            // Just return everyone's money, no fees
            for winner_account in winner_accounts.iter() {
                let cpi_program = self.token_program.to_account_info();
                let cpi_accounts = TransferChecked {
                    from: self.game_vault.to_account_info(),
                    to: winner_account.clone(),
                    authority: game_account_info.clone(),
                    mint: self.mint.to_account_info(),
                };

                let seeds = &["game".as_bytes(), &game_id.to_le_bytes(), &[game_bump]];
                let signer_seeds = &[&seeds[..]];
                let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
                
                transfer_checked(cpi_ctx, game.entry_fee, self.mint.decimals)?;
            }

            game_escrow.total_amount = 0;
            game.status = GameStatus::Resolved;
            return Ok(());
        }

        // Handle edge case where no one wins (everyone loses/ties)
        if number_of_winners == 0 {
        // Return everyone's money, no fees
        // Note: remaining_accounts should contain all player token accounts in this case
            for player_account in winner_accounts.iter() {
            let cpi_program = self.token_program.to_account_info();
            let cpi_accounts = TransferChecked {
                from: self.game_vault.to_account_info(),
                to: player_account.clone(),
                authority: game_account_info.clone(),
                mint: self.mint.to_account_info(),
            };

            let seeds = &["game".as_bytes(), &game_id.to_le_bytes(), &[game_bump]];
            let signer_seeds = &[&seeds[..]];
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        
            transfer_checked(cpi_ctx, game.entry_fee, self.mint.decimals)?;
        }

        game_escrow.total_amount = 0;
        game.status = GameStatus::Resolved;
        return Ok(());
    }

        // Normal case: some winners, some losers
        // Use your fee formula:
        // Winner gets: entry_fee + (entry_fee * number_of_losers * (1 - fee)) / number_of_winners
        // Treasury gets: (entry_fee * number_of_losers * fee) / number_of_winners per winner

        let losers_pool = game.entry_fee * number_of_losers as u64;
        let fee_from_losers = (losers_pool as u128 * fee_percentage as u128) / 10000u128;
        let fee_from_losers = fee_from_losers as u64;
        let net_losers_pool = losers_pool - fee_from_losers;
        let winnings_per_winner = net_losers_pool / number_of_winners as u64;
        let remainder_to_treasury = net_losers_pool % number_of_winners as u64;
        let total_per_winner = game.entry_fee + winnings_per_winner;

        // Transfer winnings to each winner
        for winner_account in winner_accounts.iter() {
            let cpi_program = self.token_program.to_account_info();
            let cpi_accounts = TransferChecked {
                from: self.game_vault.to_account_info(),
                to: winner_account.clone(),
                authority: game_account_info.clone(),
                mint: self.mint.to_account_info(),
            };

            let seeds = &["game".as_bytes(), &game_id.to_le_bytes(), &[game_bump]];
            let signer_seeds = &[&seeds[..]];
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
            
            transfer_checked(cpi_ctx, total_per_winner, self.mint.decimals)?;
        }

        // Transfer fees and remainder to treasury
        let total_treasury_amount = fee_from_losers + remainder_to_treasury;
        if total_treasury_amount > 0 {
            let cpi_program = self.token_program.to_account_info();
            let cpi_accounts = TransferChecked {
                from: self.game_vault.to_account_info(),
                to: self.treasury_vault.to_account_info(),
                authority: game_account_info.clone(),
                mint: self.mint.to_account_info(),
            };

            let seeds = &["game".as_bytes(), &game_id.to_le_bytes(), &[game_bump]];
            let signer_seeds = &[&seeds[..]];
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
            
            transfer_checked(cpi_ctx, total_treasury_amount, self.mint.decimals)?;
        }

        // Update escrow and mark as resolved
        game_escrow.total_amount = 0;
        game.status = GameStatus::Resolved;

        msg!(
            "Game {} resolved - Winners: {}, Losers: {}, Fees collected: {} tokens",
            game.game_id,
            number_of_winners,
            number_of_losers,
            fee_from_losers
        );

        Ok(())
    }
}