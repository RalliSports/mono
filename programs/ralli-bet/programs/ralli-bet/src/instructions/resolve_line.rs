use crate::constants::*;
use crate::errors::RalliError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct ResolveLine<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        mut,
        seeds = [b"line", line.key().as_ref()],
        bump = line.bump
    )]
    pub line: Account<'info, Line>,
}

impl<'info> ResolveLine<'info> {
    pub fn resolve_line(&mut self, result: Direction, actual_value: i64) -> Result<()> {
        let admin = &self.admin;
        let line = &mut self.line;

        // Only admin can resolve lines
        require_eq!(
            admin.key(),
            ADMIN_PUBLIC_KEY,
            RalliError::UnauthorizedLineResolution
        );

        // Ensure line hasn't already been resolved
        require!(line.result.is_none(), RalliError::LineAlreadyResolved);

        // Ensure line has started (can only resolve after start time)
        let current_time = Clock::get()?.unix_timestamp;
        require!(current_time >= line.starts_at, RalliError::LineNotStarted);

        // this verifies that predicted vs actual reflects the direction passed
        match direction {
            Direction::Over => {
                require!(
                    actual_value > predicted_value,
                    RalliError::DirectionMismatch
                );
            }
            Direction::Under => {
                require!(
                    actual_value < predicted_value,
                    RalliError::DirectionMismatch
                );
            }
        }

        // Update the result field
        line.result = Some(result.clone());
        line.actual_value = Some(actual_value);

        msg!("Resolved line {} with result: {:?}", line.key(), result);

        Ok(())
    }
}
