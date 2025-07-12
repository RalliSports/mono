use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::RalliError;

#[derive(Accounts)]
pub struct LockGame<'info> {
    #[account(
        mut,
        seeds = [b"game", game.game_id.to_le_bytes().as_ref()],
        bump = game.bump,
        has_one = creator
    )]
    pub game: Account<'info, Game>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
}

pub fn handler(ctx: Context<LockGame>) -> Result<()> {
    let game = &mut ctx.accounts.game;
    let clock = Clock::get()?;
    
    // Validation checks
    require_eq!(game.status, GameStatus::Open, RalliError::GameNotOpen);
    require!(game.players.len() >= 2, RalliError::NotEnoughPlayers);
    
    // Lock the game
    game.status = GameStatus::Locked;
    game.locked_at = Some(clock.unix_timestamp);
    
    msg!("Game {} locked with {} players", game.game_id, game.players.len());
    Ok(())
}