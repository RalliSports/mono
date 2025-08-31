use crate::constants::*;
use crate::errors::RalliError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct CalculateWinners<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        mut,
        seeds = [b"game", game.game_id.to_le_bytes().as_ref()],
        bump = game.bump
    )]
    pub game: Account<'info, Game>,
}

impl<'info> CalculateWinners<'info> {
    pub fn calculate_winners(
        &mut self,
        remaining_accounts: &'info [AccountInfo<'info>],
    ) -> Result<()> {
        let admin = &self.admin;
        let game = &mut self.game;

        // Only admin can finalize game stats
        require!(
            is_admin(&admin.key()),
            RalliError::UnauthorizedGameFinalization
        );

        // Ensure game is still Open
        require_eq!(game.status, GameStatus::Open, RalliError::GameNotOpen);

        // Ensure calculation hasn't been completed yet
        require!(!game.calculation_complete, RalliError::CalculationAlreadyComplete);

        let bet_accounts = remaining_accounts;
        
        require!(!bet_accounts.is_empty(), RalliError::NoBetsInGame);

        let mut max_correct = 0u8;
        let mut total_bets_processed = 0u32;

        // First pass: find the maximum number of correct picks
        for bet_account_info in bet_accounts.iter() {
            let bet_account = Account::<Bet>::try_from(bet_account_info)
                .map_err(|_| error!(RalliError::InvalidBetAccount))?;

            require_eq!(bet_account.game, game.key(), RalliError::BetNotInGame);

            if bet_account.num_correct > max_correct {
                max_correct = bet_account.num_correct;
            }

            total_bets_processed += 1;
        }

        // Second pass: count how many bets have the maximum correct picks (winners)
        let mut winner_count = 0u32;
        for bet_account_info in bet_accounts.iter() {
            let bet_account = Account::<Bet>::try_from(bet_account_info)
                .map_err(|_| error!(RalliError::InvalidBetAccount))?;

            if bet_account.num_correct == max_correct {
                winner_count += 1;
            }
        }

        //Updating
        game.correct_votes_to_be_winner = max_correct;
        game.num_winners = winner_count;
        game.calculation_complete = true;

        msg!(
            "Finalized game {} stats - Winners: {}, Correct picks needed: {}, Total bets: {}",
            game.game_id,
            winner_count,
            max_correct,
            total_bets_processed
        );

        Ok(())
    }
}