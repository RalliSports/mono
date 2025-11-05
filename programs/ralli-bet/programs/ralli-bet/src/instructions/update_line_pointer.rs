use crate::constants::*;
use crate::errors::RalliError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(player_id: String, matchup_id: u64, stat_id: u16, line_value: i32)]
pub struct UpdateLinePointer<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    /// The existing PlayerLine account we're pointing to
    #[account(
        seeds = [
            b"player_line",
            player_id.as_bytes(),
            matchup_id.to_le_bytes().as_ref(),
            stat_id.to_le_bytes().as_ref(),
            line_value.to_le_bytes().as_ref()
        ],
        bump = player_line.bump
    )]
    pub player_line: Account<'info, PlayerLine>,

    /// The LinePointer we're updating
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

impl<'info> UpdateLinePointer<'info> {
    pub fn update_line_pointer(
        &mut self,
        player_id: String,
        matchup_id: u64,
        stat_id: u16,
        line_value: i64,
    ) -> Result<()> {
        let admin = &self.admin;
        let player_line = &self.player_line;
        let line_pointer = &mut self.line_pointer;

        require!(
            is_admin(&admin.key()),
            RalliError::UnauthorizedLineUpdate
        );

        require_eq!(
            player_line.player_id.clone(),
            player_id,
            RalliError::LineAccountMismatch
        );

        require_eq!(
            player_line.matchup_id,
            matchup_id,
            RalliError::LineAccountMismatch
        );

        require_eq!(
            player_line.stat_id,
            stat_id,
            RalliError::LineAccountMismatch
        );

        require_eq!(
            player_line.line_value,
            line_value,
            RalliError::LineAccountMismatch
        );

        require!(
            player_line.is_active,
            RalliError::LineNotActive
        );
        
        require!(
            player_line.result.is_none(),
            RalliError::LineAlreadyResolved
        );

        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time < player_line.starts_at,
            RalliError::LineAlreadyStarted
        );

        // Update the LinePointer to point to this PlayerLine
        line_pointer.current_line_value = player_line.line_value;
        line_pointer.current_odds = player_line.odds;
        line_pointer.current_line_pubkey = player_line.key();
        line_pointer.last_updated = current_time;

        msg!(
            "Updated line pointer for Player: {}, Matchup: {}, Stat: {} -> Line Value: {}, Odds: {}, Line Account: {}",
            player_id,
            matchup_id,
            stat_id,
            line_value,
            player_line.odds,
            player_line.key()
        );

        Ok(())
    }
}