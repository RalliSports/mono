use crate::constants::*;
use crate::errors::RalliError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(
    player_id: String,
    matchup_id: u64,
    stat_id: u16,
    old_line_value: i32,
    new_line_value: i32
)]
pub struct UpdateLineV2<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        mut,
        seeds = [
            b"player_line",
            player_id.as_bytes(),
            matchup_id.to_le_bytes().as_ref(),
            stat_id.to_le_bytes().as_ref(),
            old_line_value.to_le_bytes().as_ref()
        ],
        bump = existing_line.bump
    )]
    pub existing_line: Account<'info, PlayerLine>,

    #[account(
        init_if_needed,
        payer = admin,
        space = 8 + PlayerLine::MAX_SIZE,
        seeds = [
            b"player_line",
            player_id.as_bytes(),
            matchup_id.to_le_bytes().as_ref(),
            stat_id.to_le_bytes().as_ref(),
            new_line_value.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub new_line: Account<'info, PlayerLine>,

    #[account(
        mut,
        seeds = [
            b"line_pointer",
            player_id.as_bytes(),
            matchup_id.to_le_bytes().as_ref(),
            stat_id.to_le_bytes().as_ref()
        ],
        bump = line_pointer.bump
    )]
    pub line_pointer: Account<'info, LinePointer>,

    pub system_program: Program<'info, System>,
}

impl<'info> UpdateLineV2<'info> {
    pub fn update_player_line(
        &mut self,
        player_id: String,
        matchup_id: u64,
        stat_id: u16,
        old_line_value: i32,
        new_line_value: i32,
        new_odds: i32,
        new_starts_at: i64,
        should_refund_bettors: bool,
        bumps: &UpdateLineV2Bumps,
    ) -> Result<()> {
        let admin = &self.admin;
        let existing_line = &mut self.existing_line;
        let new_line = &mut self.new_line;
        let line_pointer = &mut self.line_pointer;

        // Only admin can update lines
        require!(
            is_admin(&admin.key()),
            RalliError::UnauthorizedLineUpdate
        );

        // Ensure existing line hasn't been resolved yet
        require!(
            existing_line.result.is_none(),
            RalliError::LineAlreadyResolved
        );

        // Ensure existing line hasn't started yet
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time < existing_line.starts_at,
            RalliError::LineAlreadyStarted
        );

        // Validate new starts_at is in the future
        require!(
            new_starts_at > current_time,
            RalliError::InvalidLineStartTime
        );

        // Validate new line value is reasonable (not zero)
        require!(new_line_value != 0, RalliError::InvalidLineValue);

        // Validate new odds is reasonable (not zero)
        require!(new_odds != 0, RalliError::InvalidOdds);

        // Check if line value is changing or just odds/starts_at
        if old_line_value != new_line_value {
            // CASE 1: Line value is changing - create new line, mark old as inactive

            // Ensure the new value is actually different (redundant but explicit)
            require!(
                old_line_value != new_line_value,
                RalliError::SameLineValue
            );

            // Mark existing line as inactive and set refund flag
            existing_line.is_active = false;
            existing_line.should_refund_bettors = should_refund_bettors;

            // Initialize the new line account
            new_line.set_inner(PlayerLine {
                player_id: player_id.clone(),
                matchup_id,
                stat_id,
                line_value: new_line_value,
                odds: new_odds,
                actual_value: None,
                starts_at: new_starts_at,
                created_at: current_time,
                result: None,
                is_active: true,
                should_refund_bettors: false,
                bump: bumps.new_line,
            });

            // Update line pointer to point to new line
            line_pointer.current_line_value = new_line_value;
            line_pointer.current_odds = new_odds;
            line_pointer.last_updated = current_time;

            msg!(
                "Updated player line - Player: {}, Matchup: {}, Stat: {}, Old Value: {}, New Value: {}, New Odds: {}, Refund Old: {}",
                player_id,
                matchup_id,
                stat_id,
                old_line_value,
                new_line_value,
                new_odds,
                should_refund_bettors
            );
        } else {
            // CASE 2: Just updating odds/starts_at on existing line (same line value)
            // existing_line and new_line are the same account in this case

            let old_odds = existing_line.odds;
            let old_starts_at = existing_line.starts_at;

            // Update fields on existing line
            existing_line.odds = new_odds;
            existing_line.starts_at = new_starts_at;

            // Update line pointer
            line_pointer.current_odds = new_odds;
            line_pointer.last_updated = current_time;

            msg!(
                "Updated player line odds/time - Player: {}, Matchup: {}, Stat: {}, Line Value: {}, Old Odds: {}, New Odds: {}, Old Starts: {}, New Starts: {}",
                player_id,
                matchup_id,
                stat_id,
                old_line_value,
                old_odds,
                new_odds,
                old_starts_at,
                new_starts_at
            );
        }

        Ok(())
    }
}