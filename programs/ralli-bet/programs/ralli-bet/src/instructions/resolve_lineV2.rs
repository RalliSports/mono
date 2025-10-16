use crate::constants::*;
use crate::errors::RalliError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(player_id: String, matchup_id: u64, stat_id: u16, line_value: i32)]
pub struct ResolveLineV2<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        mut,
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
}

impl<'info> ResolveLineV2<'info> {
    pub fn resolve_lineV2(
        &mut self,
        player_id: String,
        matchup_id: u64,
        stat_id: u16,
        line_value: i32,
        result: DirectionV2,
        actual_value: i32,
        should_refund_bettors: bool,
    ) -> Result<()> {
        let admin = &self.admin;
        let player_line = &mut self.player_line;

        require!(
            is_admin(&admin.key()),
            RalliError::UnauthorizedLineResolution
        );

        require!(
            player_line.result.is_none(),
            RalliError::LineAlreadyResolved
        );

        if should_refund_bettors {
            player_line.should_refund_bettors = true;
            msg!(
                "Line marked for refund - Player: {}, Matchup: {}, Stat: {}, Line Value: {}",
                player_id,
                matchup_id,
                stat_id,
                line_value
            );
            return Ok(());
        }

        let current_time = Clock::get()?.unix_timestamp;
        msg!("current_time: {}", current_time);
        msg!("player_line.starts_at: {}", player_line.starts_at);
        msg!(
            "current_time - player_line.starts_at: {}",
            current_time - player_line.starts_at
        );
        require!(
            current_time >= player_line.starts_at,
            RalliError::LineNotStarted
        );

        match result {
            DirectionV2::Over => {
                require!(
                    actual_value > player_line.line_value,
                    RalliError::DirectionMismatch
                );
            }
            DirectionV2::Under => {
                require!(
                    actual_value < player_line.line_value,
                    RalliError::DirectionMismatch
                );
            }
        }

        // Ensure line should not be refunded
        require!(
            player_line.should_refund_bettors == false,
            RalliError::LineShouldBeRefunded
        );

        // Update the result fields
        player_line.result = Some(result);
        player_line.actual_value = Some(actual_value);

        msg!(
            "Resolved player line {} - Player: {}, Matchup: {}, Stat: {}, Line Value: {}, Actual Value: {}, Result: {:?}",
            player_line.key(),
            player_id,
            matchup_id,
            stat_id,
            line_value,
            actual_value,
            result
        );

        Ok(())
    }
}