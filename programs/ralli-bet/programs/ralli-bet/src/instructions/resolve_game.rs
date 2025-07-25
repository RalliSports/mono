use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::RalliError;
use std::collections::HashMap;

#[derive(Accounts)]
pub struct ResolveGame<'info> {
    #[account(mut, seeds = [b"game", game.game_id.to_le_bytes().as_ref()], bump = game.bump, has_one = creator)]
    pub game: Account<'info, Game>,

    #[account(mut, seeds = [b"escrow", game.key().as_ref()], bump = game_escrow.bump)]
    pub game_escrow: Account<'info, GameEscrow>,

    #[account(init, payer = creator, space = GameResult::MAX_SIZE, seeds = [b"result", game.key().as_ref()], bump)]
    pub game_result: Account<'info, GameResult>,

    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
    // Pass the Line accounts in remaining_accounts
}

pub fn handler(ctx: Context<ResolveGame>) -> Result<()> {
    let game = &mut ctx.accounts.game;
    let game_escrow = &mut ctx.accounts.game_escrow;
    let game_result = &mut ctx.accounts.game_result;
    let clock = Clock::get()?;

    require_eq!(game.status, GameStatus::Locked, RalliError::GameNotLocked);

    let lines: Vec<Account<Line>> = ctx.remaining_accounts.iter().map(|acc| Account::try_from(acc).unwrap()).collect();

    // In a real implementation, iterate through all Bet accounts for this game
    // and use the `lines` vector to calculate correct picks.
    // This is a simplified representation.

    game_result.game = game.key();
    game_result.resolved = true;
    game_result.winners = Vec::new();
    game_result.highest_correct = 0;
    game_result.total_pool = game_escrow.total_amount;
    game_result.resolved_at = clock.unix_timestamp;
    game_result.bump = ctx.bumps.game_result;

    game.status = GameStatus::Resolved;

    msg!("Game {} resolved", game.game_id);
    Ok(())
}

pub fn calculate_correct_picks(picks: &[Pick], lines: &[Account<Line>]) -> u8 {
    let mut correct = 0;
    let line_map: HashMap<Pubkey, &Account<Line>> = lines.iter().map(|line| (line.key(), line)).collect();

    for pick in picks {
        if let Some(line) = line_map.get(&pick.line_id) {
            if let Some(result) = &line.result {
                if pick.direction == *result {
                    correct += 1;
                }
            }
        }
    }
    correct
}