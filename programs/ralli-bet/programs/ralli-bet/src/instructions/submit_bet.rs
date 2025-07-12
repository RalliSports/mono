use anchor_lang::prelude::*;
use anchor_lang::system_program;
use crate::state::*;
use crate::errors::RalliError;
use std::collections::HashSet;

#[derive(Accounts)]
pub struct SubmitBet<'info> {
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
    
    #[account(
        init,
        payer = player,
        space = Bet::MAX_SIZE,
        seeds = [b"bet", game.key().as_ref(), player.key().as_ref()],
        bump
    )]
    pub bet: Account<'info, Bet>,
    
    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<SubmitBet>, picks: Vec<Pick>) -> Result<()> {
    let game = &mut ctx.accounts.game;
    let game_escrow = &mut ctx.accounts.game_escrow;
    let bet = &mut ctx.accounts.bet;
    let player = &ctx.accounts.player;
    let clock = Clock::get()?;
    
    // Validation checks
    require_eq!(game.status, GameStatus::Open, RalliError::GameNotOpen);
    require!(picks.len() >= 2 && picks.len() <= 6, RalliError::InvalidPickCount);
    
    // Check if player is in game or is the creator
    let is_player_in_game = game.players.contains(&player.key()) || 
                           game.creator == player.key();
    require!(is_player_in_game, RalliError::PlayerNotInGame);
    
    // Check for duplicate stats
    let mut stat_set = HashSet::new();
    for pick in &picks {
        require!(stat_set.insert(pick.stat_id), RalliError::DuplicateStatInPicks);
    }
    
    // If creator is submitting bet, transfer entry fee
    if game.creator == player.key() && !game.players.contains(&player.key()) {
        let transfer_instruction = system_program::Transfer {
            from: player.to_account_info(),
            to: game_escrow.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_instruction,
        );
        system_program::transfer(cpi_ctx, game.entry_fee)?;
        
        game.players.push(player.key());
        game_escrow.total_amount += game.entry_fee;
    }
    
    // Initialize bet state
    bet.game = game.key();
    bet.player = player.key();
    bet.picks = picks;
    bet.correct_count = 0;
    bet.submitted_at = clock.unix_timestamp;
    bet.bump = ctx.bumps.bet;
    
    msg!("Bet submitted by player {} for game {}", player.key(), game.game_id);
    Ok(())
}