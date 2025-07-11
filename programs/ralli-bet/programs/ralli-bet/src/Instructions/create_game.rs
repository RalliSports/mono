use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::RalliError;

#[derive(Accounts)]
#[instruction(game_id: u64)]
pub struct CreateGame<'info> {
    #[account(
        init,
        payer = creator,
        space = Game::MAX_SIZE,
        seeds = [b"game", game_id.to_le_bytes().as_ref()],
        bump
    )]
    pub game: Account<'info, Game>,
    
    #[account(
        init,
        payer = creator,
        space = GameEscrow::SIZE,
        seeds = [b"escrow", game.key().as_ref()],
        bump
    )]
    pub game_escrow: Account<'info, GameEscrow>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateGame>,
    game_id: u64,
    max_players: u8,
    entry_fee: u64,
) -> Result<()> {
    require!(max_players >= 2, RalliError::NotEnoughPlayers);
    require!(max_players <= 50, RalliError::GameFull);
    
    let game = &mut ctx.accounts.game;
    let game_escrow = &mut ctx.accounts.game_escrow;
    let clock = Clock::get()?;
    
    game.game_id = game_id;
    game.creator = ctx.accounts.creator.key();
    game.players = Vec::new();
    game.max_players = max_players;
    game.entry_fee = entry_fee;
    game.status = GameStatus::Open;
    game.created_at = clock.unix_timestamp;
    game.locked_at = None;
    game.bump = ctx.bumps.game;
    
    game_escrow.game = game.key();
    game_escrow.total_amount = 0;
    game_escrow.bump = ctx.bumps.game_escrow;
    
    msg!("Game created with ID: {}", game_id);
    Ok(())
}