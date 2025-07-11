#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

pub mod state;
pub mod instructions;
pub mod errors;

use instructions::*;


declare_id!("2dCihkBppHzVaE4yKJCUNQBteW2cA4YmLR9xViTQSwpD");

#[program]
pub mod ralli_bet {
    use super::*;

    pub fn create_game(
        ctx: Context<CreateGame>,
        game_id: u64,
        max_players: u8,
        entry_fee: u64,
    ) -> Result<()> {
        instructions::create_game::handler(ctx, game_id, max_players, entry_fee)
    }

    pub fn join_game(ctx: Context<JoinGame>) -> Result<()> {
        instructions::join_game::handler(ctx)
    }

    pub fn submit_bet(ctx: Context<SubmitBet>, picks: Vec<state::Pick>) -> Result<()> {
        instructions::submit_bet::handler(ctx, picks)
    }

    pub fn lock_game(ctx: Context<LockGame>) -> Result<()> {
        instructions::lock_game::handler(ctx)
    }

    pub fn resolve_game(
        ctx: Context<ResolveGame>,
        stat_results: Vec<(u16, u16)>, // (stat_id, actual_value)
    ) -> Result<()> {
        instructions::resolve_game::handler(ctx, stat_results)
    }

    pub fn cancel_game(ctx: Context<CancelGame>) -> Result<()> {
        instructions::cancel_game::handler(ctx)
    }

    pub fn update_game(
        ctx: Context<UpdateGame>,
        max_players: Option<u8>,
        entry_fee: Option<u64>,
    ) -> Result<()> {
        instructions::update_game::handler(ctx, max_players, entry_fee)
    }

    pub fn refund_entry(ctx: Context<RefundEntry>) -> Result<()> {
        instructions::refund_entry::handler(ctx)
    }
}
