use crate::errors::RalliError;
use crate::state::*;
use crate::constants::*;
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
    pub fn resolve_line(
        &mut self,
        result: Direction,
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
        require!(
            line.result.is_none(),
            RalliError::LineAlreadyResolved
        );

        // Ensure line has started (can only resolve after start time)
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time >= line.starts_at,
            RalliError::LineNotStarted
        );

        // Update the result field
        line.result = Some(result.clone());

        msg!(
            "Resolved line {} with result: {:?}",
            line.key(),
            result
        );

        Ok(())
    }
}