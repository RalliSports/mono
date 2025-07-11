use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::RalliError;

#[derive(Accounts)]
pub struct UpdateGame<'info> {
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

pub fn handler(
    ctx: Context<UpdateGame>,
    max_players: Option<u8>,
    entry_fee: Option<u64>,
) -> Result<()> {
    let game = &mut ctx.accounts.game;
    
    // Can only update open games
    require_eq!(game.status, GameStatus::Open, RalliError::GameNotOpen);
    
    // Update max players if provided
    if let Some(new_max_players) = max_players {
        require!(new_max_players >= 2, RalliError::NotEnoughPlayers);
        require!(new_max_players <= 50, RalliError::GameFull);
        require!(
            new_max_players as usize >= game.players.len(),
            RalliError::GameFull
        );
        game.max_players = new_max_players;
    }
    
    // Update entry fee if provided (only if no players have joined yet)
    if let Some(new_entry_fee) = entry_fee {
        require!(
            game.players.is_empty(),
            RalliError::PlayerAlreadyJoined
        );
        game.entry_fee = new_entry_fee;
    }
    
    msg!("Game {} updated", game.game_id);
    Ok(())
}