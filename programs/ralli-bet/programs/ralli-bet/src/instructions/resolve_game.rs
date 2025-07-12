use anchor_lang::prelude::*;
use anchor_lang::system_program;
use crate::state::*;
use crate::errors::RalliError;
use std::collections::HashMap;

#[derive(Accounts)]
pub struct ResolveGame<'info> {
    #[account(
        mut,
        seeds = [b"game", game.game_id.to_le_bytes().as_ref()],
        bump = game.bump,
        has_one = creator
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
        payer = creator,
        space = GameResult::MAX_SIZE,
        seeds = [b"result", game.key().as_ref()],
        bump
    )]
    pub game_result: Account<'info, GameResult>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<ResolveGame>,
    stat_results: Vec<(u16, u16)>, // (stat_id, actual_value)
) -> Result<()> {
    let game = &mut ctx.accounts.game;
    let game_escrow = &mut ctx.accounts.game_escrow;
    let game_result = &mut ctx.accounts.game_result;
    let clock = Clock::get()?;
    
    // Validation checks
    require_eq!(game.status, GameStatus::Locked, RalliError::GameNotLocked);
    
    // Convert stat results to HashMap for quick lookup
    let results_map: HashMap<u16, u16> = stat_results.into_iter().collect();
    
    // This is a simplified version - you'll need to iterate through all bet accounts
    // For now, we'll initialize the game result structure
    game_result.game = game.key();
    game_result.resolved = true;
    game_result.winners = Vec::new();
    game_result.highest_correct = 0;
    game_result.total_pool = game_escrow.total_amount;
    game_result.resolved_at = clock.unix_timestamp;
    game_result.bump = ctx.bumps.game_result;
    
    // Update game status
    game.status = GameStatus::Resolved;
    
    msg!("Game {} resolved", game.game_id);
    
    // Note: In a real implementation, you would:
    // 1. Iterate through all BetState accounts for this game
    // 2. Calculate correct picks for each player
    // 3. Determine winners with highest correct count
    // 4. Distribute funds directly to winners
    // This requires additional context accounts and more complex logic
    
    Ok(())
}

// Helper function to calculate correct picks
pub fn calculate_correct_picks(picks: &[Pick], results: &HashMap<u16, u16>) -> u8 {
    let mut correct = 0;
    
    for pick in picks {
        if let Some(&actual_value) = results.get(&pick.stat_id) {
            let is_correct = match pick.direction {
                Direction::Over => actual_value > pick.threshold,
                Direction::Under => actual_value < pick.threshold,
            };
            
            if is_correct {
                correct += 1;
            }
        }
    }
    
    correct
}