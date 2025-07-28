#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

pub mod state;
pub mod instructions;
pub mod errors;

use instructions::*;

declare_id!("9EM9kPnP6wtHXDWhW8eKr7WNKW1QVjohfroCb1Mtz9rp");

#[program]
pub mod ralli_bet {
    use super::*;

    pub fn create_game(
        ctx: Context<CreateGame>,
        game_id: u64,
        max_players: u8,
        entry_fee: u64,
    ) -> Result<()> {
        ctx.accounts.create_game(game_id, max_players, entry_fee,&ctx.bumps)
    }

    pub fn join_game(ctx: Context<JoinGame>) -> Result<()> {
        ctx.accounts.join_game()
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

    pub fn cancel_game(ctx: Context<CancelGame>) -> Result<()> {
        ctx.accounts.cancel_game()
    }

    // removed update_game, it can be vulnerable, this can create some sortof backdoor

    pub fn refund_entry(ctx: Context<RefundEntry>) -> Result<()> {
        ctx.accounts.refund_all_users(&ctx.remaining_accounts)
    }
}
