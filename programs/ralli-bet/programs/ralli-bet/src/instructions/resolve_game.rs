use crate::constants::*;
use crate::errors::RalliError;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

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

    /// CHECK: Treasury account to receive fees (can be any account)
    #[account(mut)]
    pub treasury: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> ResolveGame<'info> {
    pub fn resolve_game(
        &mut self,
        fee_percentage: u16,
        remaining_accounts: &'info [AccountInfo<'info>],
    ) -> Result<()> {
        let game = &mut self.game;
        let game_escrow = &mut self.game_escrow;
        let admin = &self.admin;

        // Only admin can resolve games
        require_eq!(
            admin.key(),
            ADMIN_PUBLIC_KEY,
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
        let line_accounts = &remaining_accounts[game.users.len()..];

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

        let game_key = game.key();

        // Handle edge case where everyone wins
        if number_of_winners == total_players {
            // Just return everyone's money, no fees
            for user_key in &game.users {
                let transfer_instruction = Transfer {
                    from: game_escrow.to_account_info(),
                    to: remaining_accounts
                        .iter()
                        .find(|acc| acc.key() == *user_key)
                        .ok_or(RalliError::UserAccountNotFound)?
                        .clone(),
                };

                let seeds = &[b"escrow", game_key.as_ref(), &[game_escrow.bump]];
                let signer_seeds = &[&seeds[..]];

                let cpi_ctx = CpiContext::new_with_signer(
                    self.system_program.to_account_info(),
                    transfer_instruction,
                    signer_seeds,
                );
                transfer(cpi_ctx, game.entry_fee)?;
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
        for winner_key in &winners {
            let winner_account = remaining_accounts
                .iter()
                .find(|acc| acc.key() == *winner_key)
                .ok_or(RalliError::UserAccountNotFound)?;

            let transfer_instruction = Transfer {
                from: game_escrow.to_account_info(),
                to: winner_account.to_account_info(),
            };

            let seeds = &[b"escrow", game_key.as_ref(), &[game_escrow.bump]];
            let signer_seeds = &[&seeds[..]];

            let cpi_ctx = CpiContext::new_with_signer(
                self.system_program.to_account_info(),
                transfer_instruction,
                signer_seeds,
            );
            transfer(cpi_ctx, total_per_winner)?;
            game_escrow.total_amount -= total_per_winner;
        }

        // Transfer fees and remainder to treasury if any
        let total_treasury_amount = fee_from_losers + remainder_to_treasury;
        if total_treasury_amount > 0 {
            let transfer_instruction = Transfer {
                from: game_escrow.to_account_info(),
                to: self.treasury.to_account_info(),
            };

            let seeds = &[b"escrow", game_key.as_ref(), &[game_escrow.bump]];
            let signer_seeds = &[&seeds[..]];

            let cpi_ctx = CpiContext::new_with_signer(
                self.system_program.to_account_info(),
                transfer_instruction,
                signer_seeds,
            );
            transfer(cpi_ctx, total_treasury_amount)?;
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
