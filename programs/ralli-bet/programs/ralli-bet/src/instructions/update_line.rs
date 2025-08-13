use crate::constants::*;
use crate::errors::RalliError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdateLine<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        mut,
        seeds = [b"line", line.key().as_ref()],
        bump = line.bump
    )]
    pub line: Account<'info, Line>,
}

impl<'info> UpdateLine<'info> {
    pub fn update_line(&mut self, new_predicted_value: f64) -> Result<()> {
        let admin = &self.admin;
        let line = &mut self.line;

        // Only admin can update lines
        require!(
            is_admin(&admin.key()),
            RalliError::UnauthorizedLineUpdate
        );

        // Ensure line hasn't been resolved yet
        require!(line.result.is_none(), RalliError::LineAlreadyResolved);

        // Ensure line hasn't started yet
        let current_time = Clock::get()?.unix_timestamp;
        require!(current_time < line.starts_at, RalliError::LineAlreadyStarted);

        require!(new_predicted_value > 0.0, RalliError::InvalidPredictedValue);

        // Ensure the new value is actually different
        require!(
            (line.predicted_value - new_predicted_value).abs() > f64::EPSILON,
            RalliError::SamePredictedValue
        );

        let old_predicted_value = line.predicted_value;

        // Update now
        line.predicted_value = new_predicted_value;

        msg!(
            "Updated line {} - Changed predicted value from {} to {}",
            line.key(),
            old_predicted_value,
            new_predicted_value
        );

        Ok(())
    }
}