use crate::constants::*;
use crate::errors::RalliError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(line_seed: u64)]
pub struct CreateLine<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        init,
        payer = admin,
        space = 8 + Line::MAX_SIZE,
        seeds = [b"line", line_seed.to_le_bytes().as_ref()],
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
        predicted_value: f64,
        athlete_id: u64,
        starts_at: i64,
        bumps: &CreateLineBumps,
    ) -> Result<()> {
        let admin = &self.admin;
        let line = &mut self.line;

        // Only admin can create lines
        require_eq!(
            admin.key(),
            ADMIN_PUBLIC_KEY,
            RalliError::UnauthorizedLineCreation
        );

        // Validate line start time is in the future
        let current_time = Clock::get()?.unix_timestamp;
        require!(starts_at > current_time, RalliError::InvalidLineStartTime);

        // Validate predicted value is reasonable (prevent edge cases)
        require!(predicted_value > 0.0, RalliError::InvalidPredictedValue);

        // Validate stat_id is reasonable
        require!(stat_id > 0, RalliError::InvalidStatId);

        // Initialize the Line account
        line.set_inner(Line {
            stat_id,
            predicted_value,
            actual_value: None,
            athlete_id,
            starts_at,
            result: None,
            seed: line_seed,
            should_refund_bettors: false,
            bump: bumps.line,
        });

        msg!(
            "Created independent line {} - Athlete: {}, Stat: {}, Predicted Value: {}, Starts: {}",
            line.key(),
            athlete_id,
            stat_id,
            predicted_value,
            starts_at
        );

        Ok(())
    }
}
