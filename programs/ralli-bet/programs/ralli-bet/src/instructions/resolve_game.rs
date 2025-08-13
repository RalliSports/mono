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

    /// CHECK: Treasury account to receive fees (can be any account)
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
        number_of_winners_expected: u16,
        remaining_accounts: &'info [AccountInfo<'info>],
    ) -> Result<()> {
        // Extract values we need before mutable borrow
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

        // Ensure game is Open
        require_eq!(
            game.status,
            GameStatus::Open,
            RalliError::GameAlreadyResolved
        );

        require!(!game.involved_lines.is_empty(), RalliError::NoLinesInGame);

        // Validate fee percentage
        require!(fee_percentage <= 1000, RalliError::ExcessiveFee);

        let bet_accounts = &remaining_accounts[..game.users.len()];
        let winners_accounts = &remaining_accounts
            [game.users.len()..game.users.len() + number_of_winners_expected as usize];
        let line_accounts =
            &remaining_accounts[game.users.len() + number_of_winners_expected as usize..];

        require_eq!(
            line_accounts.len(),
            game.involved_lines.len(),
            RalliError::MissingLineAccounts
        );

        // Verify all lines are resolved
        for line_account_info in line_accounts.iter() {
            let line_account = Account::<Line>::try_from(line_account_info)
                .map_err(|_| error!(RalliError::InvalidLineAccount))?;

            require!(line_account.result.is_some(), RalliError::LineNotResolved);

            require!(
                game.involved_lines.contains(&line_account_info.key()),
                RalliError::LineNotInGame
            );
        }

        // Calculate winners and losers
        let mut winners: Vec<Pubkey> = Vec::new();
        let mut all_bets: Vec<Account<Bet>> = Vec::new();
        let mut correct_picks_count_for_winners = 0;
        let mut number_of_winners = 0;

        // Load and validate all bet accounts
        for (_i, bet_account_info) in bet_accounts.iter().enumerate() {
            let bet_account = Account::<Bet>::try_from(bet_account_info)
                .map_err(|_| error!(RalliError::InvalidBetAccount))?;

            // Verify bet belongs to this game
            require_eq!(bet_account.game, game.key(), RalliError::BetNotInGame);

            // Verify bet belongs to a user in the game
            require!(
                game.users.contains(&bet_account.player),
                RalliError::InvalidBetPlayer
            );

            // Calculate correct picks for this bet
            let mut correct_count = 0;
            for pick in &bet_account.picks {
                // Find the corresponding line
                if let Some(line_account_info) =
                    line_accounts.iter().find(|line| line.key() == pick.line_id)
                {
                    let line_account = Account::<Line>::try_from(line_account_info)
                        .map_err(|_| error!(RalliError::InvalidLineAccount))?;

                    if let Some(result) = &line_account.result {
                        if *result == pick.direction {
                            correct_count += 1;
                        }
                    }
                }
            }

            // Player wins if they got ALL picks correct
            if correct_count == correct_picks_count_for_winners {
                winners.push(bet_account.player);
                number_of_winners += 1;
            } else if correct_count > correct_picks_count_for_winners {
                correct_picks_count_for_winners = correct_count;
                winners.clear();
                winners.push(bet_account.player);
                number_of_winners = 1;
            }

            all_bets.push(bet_account);
        }

        let total_players = game.users.len();
        let number_of_winners = winners.len();
        let number_of_losers = total_players - number_of_winners;

        require!(total_players > 0, RalliError::NoPlayersInGame);
        require!(
            number_of_winners == winners.len(),
            RalliError::NumberOfWinnersMismatch
        );

        let _game_key = game.key();

        require!(
            number_of_winners_expected == number_of_winners as u16,
            RalliError::NumberOfWinnersExpectedMismatch
        );

        // Handle edge case where everyone wins
        if number_of_winners == total_players {
            // Just return everyone's money, no fees
            for (i, user_key) in game.users.iter().enumerate() {
                if i < winners_accounts.len() {
                    let cpi_program = self.token_program.to_account_info();
                    let cpi_accounts = TransferChecked {
                        from: self.game_vault.to_account_info(),
                        to: winners_accounts[i].clone(),
                        authority: game_account_info.clone(),
                        mint: self.mint.to_account_info(),
                    };
                    // Set the seeds
                    let seeds = &["game".as_bytes(), &game_id.to_le_bytes(), &[game_bump]];
                    // Make them in the expected format
                    let signer_seeds = &[&seeds[..]];
                    // Set the cpi context
                    let cpi_ctx =
                        CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
                    // Transfer the tokens
                    transfer_checked(cpi_ctx, game.entry_fee, self.mint.decimals)?;
                }
            }

            game_escrow.total_amount = 0;
            game.status = GameStatus::Resolved;
            return Ok(());
        }

        // Formulas Used!
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
        for (i, winner_key) in winners.iter().enumerate() {
            if i < winners_accounts.len() {
                let cpi_program = self.token_program.to_account_info();
                let cpi_accounts = TransferChecked {
                    from: self.game_vault.to_account_info(),
                    to: winners_accounts[i].clone(),
                    authority: game_account_info.clone(),
                    mint: self.mint.to_account_info(),
                };
                // Set the seeds
                let seeds = &["game".as_bytes(), &game_id.to_le_bytes(), &[game_bump]];
                // Make them in the expected format
                let signer_seeds = &[&seeds[..]];
                // Set the cpi context
                let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
                // Transfer the tokens
                transfer_checked(cpi_ctx, total_per_winner, self.mint.decimals)?;
            }
        }

        // Transfer fees and remainder to treasury if any
        let total_treasury_amount = fee_from_losers + remainder_to_treasury;
        if total_treasury_amount > 0 {
            let cpi_program = self.token_program.to_account_info();
            let cpi_accounts = TransferChecked {
                from: self.game_vault.to_account_info(),
                to: self.treasury_vault.to_account_info(),
                authority: game_account_info.clone(),
                mint: self.mint.to_account_info(),
            };
            // Set the seeds
            let seeds = &["game".as_bytes(), &game_id.to_le_bytes(), &[game_bump]];
            // Make them in the expected format
            let signer_seeds = &[&seeds[..]];
            // Set the cpi context
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
            // Transfer the tokens
            transfer_checked(cpi_ctx, total_treasury_amount, self.mint.decimals)?;
        }

        // Update escrow balance
        let total_distributed =
            (total_per_winner * number_of_winners as u64) + total_treasury_amount;
        game_escrow.total_amount -= total_distributed;

        require!(game_escrow.total_amount == 0, RalliError::EscrowNotEmpty);

        // Mark game as resolved
        game.status = GameStatus::Resolved;

        msg!(
            "Game {} resolved - Winners: {}, Losers: {}, Fees collected: {} lamports",
            game.game_id,
            number_of_winners,
            number_of_losers,
            fee_from_losers
        );

        Ok(())
    }
}
