use anchor_lang::prelude::*;
use anchor_lang::system_program;
use crate::state::*;
use crate::errors::RalliError;

#[derive(Accounts)]
pub struct RefundEntry<'info> {
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
    
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
    /// CHECK: This account will be validated in the handler
    #[account(mut)]
    pub refund_recipient: UncheckedAccount<'info>,
}

pub fn handler(ctx: Context<RefundEntry>) -> Result<()> {
    let game = &mut ctx.accounts.game;
    let game_escrow = &mut ctx.accounts.game_escrow;
    let refund_recipient = &ctx.accounts.refund_recipient;
    
    // Can only refund from locked games (emergency situations like bad weather)
    require_eq!(game.status, GameStatus::Locked, RalliError::GameNotLocked);
    
    // Check if recipient is a valid player in the game
    let is_valid_player = game.players.contains(&refund_recipient.key()) ||
                         game.creator == refund_recipient.key();
    require!(is_valid_player, RalliError::PlayerNotInGame);
    
    // Remove player from game and refund entry fee
    if let Some(pos) = game.players.iter().position(|&x| x == refund_recipient.key()) {
        game.players.remove(pos);
    }
    
    // Transfer refund from escrow
    let escrow_seeds = &[
        b"escrow",
        game.key().as_ref(),
        &[game_escrow.bump],
    ];
    let signer = &[&escrow_seeds[..]];
    
    let transfer_instruction = system_program::Transfer {
        from: game_escrow.to_account_info(),
        to: refund_recipient.to_account_info(),
    };
    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.system_program.to_account_info(),
        transfer_instruction,
        signer,
    );
    system_program::transfer(cpi_ctx, game.entry_fee)?;
    
    // Update escrow total
    game_escrow.total_amount = game_escrow.total_amount.saturating_sub(game.entry_fee);
    
    // If no players left, cancel the game
    if game.players.is_empty() {
        game.status = GameStatus::Cancelled;
    }
    
    msg!("Refunded {} SOL to player {}", game.entry_fee, refund_recipient.key());
    Ok(())
}