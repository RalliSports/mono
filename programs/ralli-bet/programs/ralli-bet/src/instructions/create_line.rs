use crate::errors::RalliError;
use crate::state::*;
use crate::constants::*;
use anchor_lang::prelude::*;


#[derive(Accounts)]
#[instruction(line_seed: u64)]
pub struct CreateLine<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        mut,
        seeds = [b"game", game.game_id.to_le_bytes().as_ref()],
        bump = game.bump
    )]
    pub game: Account<'info, Game>,

    #[account(
        init,
        payer = admin,
        space = 8 + Line::MAX_SIZE,
        seeds = [b"line", game.key().as_ref(), line_seed.to_le_bytes().as_ref()],
        bump
    )]
    pub line: Account<'info, Line>,

    pub system_program: Program<'info, System>,
}

impl<'info> CreateLine<'info> {
    pub fn create_line(
        &mut self,
        line_seed: u64,
        stat_id: u16,
        threshold: u64,
        athlete_id: Pubkey,
        starts_at: i64,
        bumps: &CreateLineBumps,
    ) -> Result<()> {
        let admin = &self.admin;
        let game = &mut self.game;
        let line = &mut self.line;

        // Only admin can create lines
        require_eq!(
            admin.key(),
            ADMIN_PUBLIC_KEY,
            RalliError::UnauthorizedLineCreation
        );

        // Game must be open to add lines
        require_eq!(
            game.status.clone(),
            GameStatus::Open,
            RalliError::GameNotOpen
        );

        // Check if game has reached max lines limit (maybe this is not needed)
        require!(
            game.lines.len() < MAX_LINES_PER_GAME.into(),
            RalliError::MaxLinesReached
        );

        // Validate line start time is in the future
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            starts_at > current_time,
            RalliError::InvalidLineStartTime
        );

        // Validate threshold is reasonable (prevent edge cases)
        require!(threshold > 0, RalliError::InvalidThreshold);

        // Validate stat_id is reasonable (you might want specific ranges)
        require!(stat_id > 0, RalliError::InvalidStatId);

        // Check if this line would be the earliest starting line
        let is_earliest_line = starts_at < game.first_line_starts_at;

        // Initialize the Line account
        line.set_inner(Line {
            stat_id,
            threshold,
            athlete_id,
            starts_at,
            result: None, // Not resolved yet
            should_refund_bettors: false, // Default to false
            bump: bumps.line,
        });

        // Add line metadata to game.lines
        let game_line = GameLine {
            line_id: line_seed,
            is_active: true,
        };
        game.lines.push(game_line);

        // Add line PDA to involved_lines for efficient access
        game.involved_lines.push(line.key());

        // Update first_line_starts_at if this line starts earlier
        if is_earliest_line {
            game.first_line_starts_at = starts_at;
            msg!(
                "Updated game {} first_line_starts_at to {}",
                game.game_id,
                starts_at
            );
        }

        msg!(
            "Created line {} for game {} - Athlete: {}, Stat: {}, Threshold: {}, Starts: {}",
            line.key(),
            game.game_id,
            athlete_id,
            stat_id,
            threshold,
            starts_at
        );

        Ok(())
    }
}