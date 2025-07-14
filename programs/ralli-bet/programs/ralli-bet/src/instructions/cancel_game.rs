use crate::errors::RalliError;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

#[derive(Accounts)]
pub struct CancelGame<'info> {
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
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> CancelGame<'info> {
    pub fn cancel_game(&mut self) -> Result<()> {
        let game = &mut self.game;
        let game_escrow = &mut self.game_escrow;
        let user = &self.user;

        // Can only cancel open games
        require_eq!(
            game.status.clone(),
            GameStatus::Open,
            RalliError::GameMustBeOpen
        );

        // Check if user is a valid player in the game (including creator)
        let is_valid_user = game.users.contains(&user.key()) || game.creator == user.key();
        require!(is_valid_user, RalliError::PlayerNotInGame);

        // Set game status to cancelled
        game.status = GameStatus::Cancelled;

        // Refund the calling user their entry fee
        let user_refund_amount = game.entry_fee;

        let binding = game.key();
        let escrow_seeds = &[b"escrow", binding.as_ref(), &[game_escrow.bump]];
        let signer = &[&escrow_seeds[..]];

        let transfer_instruction = Transfer {
            from: game_escrow.to_account_info(),
            to: user.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(
            self.system_program.to_account_info(),
            transfer_instruction,
            signer,
        );

        transfer(cpi_ctx, user_refund_amount)?;

        // Update escrow total
        game_escrow.total_amount = game_escrow.total_amount.saturating_sub(user_refund_amount);

        // Remove user from game
        if let Some(pos) = game.users.iter().position(|&x| x == user.key()) {
            game.users.remove(pos);
        }

        msg!(
            "Game {} cancelled by user {}. Refunded {} lamports",
            game.game_id,
            user.key(),
            user_refund_amount
        );
        Ok(())
    }
}
