use crate::constants::*;
use crate::errors::RalliError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(player_id: String, matchup_id: u64, stat_id: u16, line_value: i32)]
pub struct CreateLineV2<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        init,
        payer = admin,
        space = 8 + PlayerLine::MAX_SIZE,
        seeds = [
            b"player_line",
            player_id.as_bytes(),
            matchup_id.to_le_bytes().as_ref(),
            stat_id.to_le_bytes().as_ref(),
            line_value.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub player_line: Account<'info, PlayerLine>,

    #[account(
        init_if_needed,
        payer = admin,
        space = 8 + LinePointer::MAX_SIZE,
        seeds = [
            b"line_pointer",
            player_id.as_bytes(),
            matchup_id.to_le_bytes().as_ref(),
            stat_id.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub line_pointer: Account<'info, LinePointer>,

    pub system_program: Program<'info, System>,
}

impl<'info> CreateLineV2<'info> {
    pub fn create_lineV2(
        &mut self,
        player_id: String,
        matchup_id: u64,
        stat_id: u16,
        line_value: i32,
        odds: i32,
        starts_at: i64,
        bumps: &CreateLineV2Bumps,
    ) -> Result<()> {
        let admin = &self.admin;
        let player_line = &mut self.player_line;
        let line_pointer = &mut self.line_pointer;

        require!(
            is_admin(&admin.key()),
            RalliError::UnauthorizedLineCreation
        );

        let current_time = Clock::get()?.unix_timestamp;
        require!(starts_at > current_time, RalliError::InvalidLineStartTime);

        require!(stat_id > 0, RalliError::InvalidStatId);

        require!(!player_id.is_empty(), RalliError::InvalidPlayerId);

        require!(line_value != 0, RalliError::InvalidLineValue);

        require!(odds != 0, RalliError::InvalidOdds);

        // Initialize the PlayerLine account
        player_line.set_inner(PlayerLine {
            player_id: player_id.clone(),
            matchup_id,
            stat_id,
            line_value,
            odds,
            actual_value: None,
            starts_at,
            created_at: current_time,
            result: None,
            is_active: true,
            should_refund_bettors: false,
            bump: bumps.player_line,
        });

        // Update/initialize the LinePointer to point to this new line
        line_pointer.current_line_value = line_value;
        line_pointer.current_odds = odds;
        line_pointer.current_line_pubkey = player_line.key();
        line_pointer.last_updated = current_time;
        line_pointer.bump = bumps.line_pointer;

        msg!(
            "Created player line {} - Player: {}, Matchup: {}, Stat: {}, Line Value: {}, Odds: {}, Starts: {}",
            player_line.key(),
            player_id,
            matchup_id,
            stat_id,
            line_value,
            odds,
            starts_at
        );

        Ok(())
    }
}