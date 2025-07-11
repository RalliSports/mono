use anchor_lang::prelude::*;
use anchor_lang::system_program;
use crate::state::*;
use crate::errors::RalliError;

#[derive(Accounts)]
pub struct CancelGame<'info> {
    #[account(
        mut,
        seeds = [b"game", game.game_id.to_le_bytes().as_ref()],
        bump = game.bump,
        has_one = creator,
        close = creator
    )]
    pub game: Account<'info, Game>,
    
    #[account(
        mut,
        seeds = [b"escrow", game.key().as_ref()],
        bump = game_escrow.bump,
        close = creator
    )]
    pub game_escrow: Account<'info, GameEscrow>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CancelGame>) -> Result<()> {
    let game = &ctx.accounts.game;
    let game_escrow = &ctx.accounts.game_escrow;
    
    // Validation checks
    require_eq!(game.status, GameStatus::Open, RalliError::GameMustBeOpen);
    
    // Refund all players
    if game_escrow.total_amount > 0 {
        let escrow_seeds = &[
            b"escrow",
            game.key().as_ref(),
            &[game_escrow.bump],
        ];
        let signer = &[&escrow_seeds[..]];
        
        // In a real implementation, you would need to iterate through all players
        // and refund them individually. This requires additional logic to track
        // which players paid and refund them accordingly.
        
        // For now, we'll transfer remaining funds back to creator
        let transfer_instruction = system_program::Transfer {
            from: game_escrow.to_account_info(),
            to: ctx.accounts.creator.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            transfer_instruction,
            signer,
        );
        system_program::transfer(cpi_ctx, game_escrow.total_amount)?;
    }
    
    msg!("Game {} cancelled", game.game_id);
    Ok(())
}