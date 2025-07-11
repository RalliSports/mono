use anchor_lang::prelude::*;
use anchor_lang::system_program;
use crate::state::*;
use crate::errors::RalliError;

#[derive(Accounts)]
pub struct JoinGame<'info> {
    #[account(
        mut,
        seeds = [b"game", game.game_id.to_le_bytes().as_ref()],
        bump = game.bump
    )]
    pub game: Account<'info, Game>,
    
    #[account(
        mut,
        seeds = [b"escrow", game.key().as_ref()],
        bump = game_escrow.bump
    )]
    pub game_escrow: Account<'info, GameEscrow>,
    
    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<JoinGame>) -> Result<()> {
    let game = &mut ctx.accounts.game;
    let game_escrow = &mut ctx.accounts.game_escrow;
    let player = &ctx.accounts.player;
    
    // Validation checks
    require_eq!(game.status, GameStatus::Open, RalliError::GameNotOpen);
    require_ne!(game.creator, player.key(), RalliError::CannotJoinOwnGame);
    require!(
        !game.players.contains(&player.key()),
        RalliError::PlayerAlreadyJoined
    );
    require!(
        game.players.len() < game.max_players as usize,
        RalliError::GameFull
    );
    
    // Transfer entry fee to escrow
    let transfer_instruction = system_program::Transfer {
        from: player.to_account_info(),
        to: game_escrow.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        transfer_instruction,
    );
    system_program::transfer(cpi_ctx, game.entry_fee)?;
    
    // Add player to game
    game.players.push(player.key());
    game_escrow.total_amount += game.entry_fee;
    
    msg!("Player {} joined game {}", player.key(), game.game_id);
    Ok(())
}