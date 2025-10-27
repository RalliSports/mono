use crate::errors::RalliError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct SubmitBet<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [b"game", game.game_id.to_le_bytes().as_ref()],
        bump = game.bump
    )]
    pub game: Account<'info, Game>,
    #[account(
        init,
        payer = user,
        space = 8 + Bet::MAX_SIZE,
        seeds = [b"bet", game.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub bet: Account<'info, Bet>,
    pub system_program: Program<'info, System>,
}

impl<'info> SubmitBet<'info> {
    pub fn submit_bet(
        &mut self,
        picks: Vec<Pick>,
        bumps: &SubmitBetBumps,
        remaining_accounts: &'info [AccountInfo<'info>],
    ) -> Result<()> {
        let game = &mut self.game;
        let bet = &mut self.bet;
        let user = &self.user;
        let clock = Clock::get()?;

        // Validation checks
        require_eq!(game.status, GameStatus::Open, RalliError::GameNotOpen);
        require!(game.users.contains(&user.key()), RalliError::UserNotInGame);
        require!(!picks.is_empty(), RalliError::EmptyPicks);
        require!(
            picks.len() == game.number_of_lines as usize,
            RalliError::InvalidPickCount
        );

        // Validate remaining accounts (these should be the Line accounts)
        let line_accounts = remaining_accounts;

        require_eq!(
            picks.len(),
            line_accounts.len(),
            RalliError::PicksLinesMismatch
        );

        // Validate all lines exist and are part of the game
        let mut pick_structs: Vec<Pick> = Vec::new();
        for (i, line_account_info) in line_accounts.iter().enumerate() {
            // Deserialize the line account to validate it exists and get its data

            let line_account = Account::<Line>::try_from(line_account_info)
                .map_err(|_| error!(RalliError::InvalidLineAccount))?;

            // Check if this line is part of the game
            let line_pubkey = line_account_info.key();
            if !game.involved_lines.contains(&line_pubkey) {
                game.involved_lines.push(line_pubkey);
            }

            // Check if the line hasn't started yet (can still bet on it)
            require!(
                clock.unix_timestamp < line_account.starts_at,
                RalliError::LineAlreadyStarted
            );

            // Check if the line doesn't have a result yet
            require!(
                line_account.result.is_none(),
                RalliError::LineAlreadyResolved
            );
            let line_pk = picks[i].line_id;
            require_eq!(line_pk, line_pubkey, RalliError::LineMismatch);
            let line_direction = picks[i].direction;

            // Create the pick struct
            pick_structs.push(Pick {
                line_id: line_pubkey,
                direction: line_direction,
            });
        }

        // Initialize the bet
        bet.set_inner(Bet {
            game: game.key(),
            player: user.key(),
            picks: pick_structs,
            correct_count: 0, // Will be updated when lines are resolved
            num_correct: 0, // Will be updated as game proceeds
            submitted_at: clock.unix_timestamp,
            paid: false,
            bump: bumps.bet,
        });

        Ok(())
    }
}
