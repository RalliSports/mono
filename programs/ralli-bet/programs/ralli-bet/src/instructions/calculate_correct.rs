use crate::constants::*;
use crate::errors::RalliError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct CalculateCorrect<'info> {
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
        seeds = [b"bet", game.key().as_ref(), bet.player.as_ref()],
        bump = bet.bump
    )]
    pub bet: Account<'info, Bet>,
}

impl<'info> CalculateCorrect<'info> {
    pub fn calculate_correct(
        &mut self,
        remaining_accounts: &'info [AccountInfo<'info>],
    ) -> Result<()> {
        let admin = &self.admin;
        let game = &mut self.game;
        let bet = &mut self.bet;

        // Only admin can calculate corrects
        require!(
            is_admin(&admin.key()),
            RalliError::UnauthorizedCalculation
        );

        // Ensure game is still Open (not resolved yet)
        require_eq!(game.status, GameStatus::Open, RalliError::GameNotOpen);

        // Ensure all involved lines are resolved
        require!(!game.involved_lines.is_empty(), RalliError::NoLinesInGame);

        // Verify bet belongs to this game
        require_eq!(bet.game, game.key(), RalliError::BetNotInGame);

        // Remaining accounts should be the line accounts
        let line_accounts = remaining_accounts;
        require_eq!(
            line_accounts.len(),
            game.involved_lines.len(),
            RalliError::MissingLineAccounts
        );

        // Verify all lines are resolved before calculating
        for line_account_info in line_accounts.iter() {
            let line_account = Account::<Line>::try_from(line_account_info)
                .map_err(|_| error!(RalliError::InvalidLineAccount))?;

            require!(line_account.result.is_some(), RalliError::LineNotResolved);
            require!(
                game.involved_lines.contains(&line_account_info.key()),
                RalliError::LineNotInGame
            );
        }

        // Calculate correct picks for this bet
        let mut correct_count = 0u8;
        for pick in &bet.picks {
            // Find the corresponding line
            if let Some(line_account_info) = line_accounts.iter()
                .find(|line| line.key() == pick.line_id) {
                
                let line_account = Account::<Line>::try_from(line_account_info)
                    .map_err(|_| error!(RalliError::InvalidLineAccount))?;

                if let Some(result) = &line_account.result {
                    if *result == pick.direction {
                        correct_count += 1;
                    }
                }
            }
        }

        // Update the bet with calculated corrects
        bet.num_correct = correct_count;

        msg!(
            "Calculated correct for bet {} - Player: {}, Correct: {}/{}",
            bet.key(),
            bet.player,
            correct_count,
            game.number_of_lines
        );

        Ok(())
    }
}