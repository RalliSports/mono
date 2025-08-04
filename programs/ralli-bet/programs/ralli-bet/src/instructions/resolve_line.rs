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
        seeds = [b"line", line.seed.to_le_bytes().as_ref()],
        bump = line.bump
    )]
    pub line: Account<'info, Line>,
}

impl<'info> ResolveLine<'info> {
    pub fn resolve_line(
        &mut self,
        result: Direction,
        actual_value: f64,
        should_refund_bettors: bool,
    ) -> Result<()> {
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

        if should_refund_bettors {
            line.should_refund_bettors = true;
            return Ok(());
        }

        // Ensure line has started (can only resolve after start time)
        let current_time = Clock::get()?.unix_timestamp;
        msg!("current_time: {}", current_time);
        msg!("line.starts_at: {}", line.starts_at);
        msg!(
            "current_time - line.starts_at: {}",
            current_time - line.starts_at
        );
        require!(current_time >= line.starts_at, RalliError::LineNotStarted);

        // this verifies that predicted vs actual reflects the direction passed
        match result {
            Direction::Over => {
                require!(
                    actual_value > line.predicted_value,
                    RalliError::DirectionMismatch
                );
            }
            Direction::Under => {
                require!(
                    actual_value < line.predicted_value,
                    RalliError::DirectionMismatch
                );
            }
        }

        require!(
            line.should_refund_bettors == false,
            RalliError::LineShouldBeRefunded
        );

        // Update the result field
        line.result = Some(result.clone());
        line.actual_value = Some(actual_value);

        msg!("Resolved line {} with result: {:?}", line.key(), result);

        Ok(())
    }
}
