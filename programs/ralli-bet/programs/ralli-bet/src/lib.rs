#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;
use state::*;

declare_id!("9EM9kPnP6wtHXDWhW8eKr7WNKW1QVjohfroCb1Mtz9rp");

#[program]
pub mod ralli_bet {
    use crate::state::{Direction, Pick};

    use super::*;

    pub fn create_game(
        ctx: Context<CreateGame>,
        game_id: u64,
        max_users: u8,
        entry_fee: u64,
        number_of_lines: u8,
        admin: Option<Pubkey>,
    ) -> Result<()> {
        ctx.accounts.create_game(
            game_id,
            max_users,
            entry_fee,
            number_of_lines,
            admin,
            &ctx.bumps,
        )
    }

    pub fn join_game(ctx: Context<JoinGame>) -> Result<()> {
        ctx.accounts.join_game()
    }

    pub fn create_line(
        ctx: Context<CreateLine>,
        line_seed: u64,
        stat_id: u16,
        predicted_value: f64,
        athlete_id: u64,
        starts_at: i64,
    ) -> Result<()> {
        ctx.accounts.create_line(
            line_seed,
            stat_id,
            predicted_value,
            athlete_id,
            starts_at,
            &ctx.bumps,
        )
    }
    pub fn withdraw_submission(
        ctx: Context<WithdrawSubmission>,
        new_first_line_starts_at: Option<i64>,
    ) -> Result<()> {
        ctx.accounts.withdraw_submission(new_first_line_starts_at)
    }

    pub fn cancel_game<'info>(ctx: Context<'_, '_, 'info, 'info, CancelGame<'info>>) -> Result<()> {
        let remaining_accounts = ctx.remaining_accounts;
        ctx.accounts.cancel_game(remaining_accounts)
    }

    pub fn submit_bet<'info>(
        ctx: Context<'_, '_, 'info, 'info, SubmitBet<'info>>,
        picks: Vec<Pick>,
    ) -> Result<()> {
        let remaining_accounts = ctx.remaining_accounts;
        ctx.accounts
            .submit_bet(picks, &ctx.bumps, remaining_accounts)
    }

    // pub fn submit_bet(ctx: Context<SubmitBet>, picks: Vec<state::Pick>) -> Result<()> {
    //     instructions::submit_bet::handler(ctx, picks)
    // }

    // pub fn lock_game(ctx: Context<LockGame>) -> Result<()> {
    //     instructions::lock_game::handler(ctx)
    // }

    // pub fn resolve_game(
    //     ctx: Context<ResolveGame>,
    //     stat_results: Vec<(u16, u16)>, // (stat_id, actual_value)
    // ) -> Result<()> {
    //     instructions::resolve_game::handler(ctx, stat_results)
    // }

    // pub fn cancel_game(ctx: Context<CancelGame>) -> Result<()> {
    //     ctx.accounts.cancel_game()
    // }

    // pub fn refund_entry(ctx: Context<RefundEntry>) -> Result<()> {
    //     ctx.accounts.refund_all_users(&ctx.remaining_accounts)
    // }
}
