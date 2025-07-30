use crate::errors::RalliError;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

#[derive(Accounts)]
pub struct WithdrawSubmission<'info> {
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

impl<'info> WithdrawSubmission<'info> {
    pub fn withdraw_submission(&mut self) -> Result<()> {
        let game = &mut self.game;
        let game_escrow = &mut self.game_escrow;
        let user = &self.user;

        // Can only withdraw from open games
        require_eq!(
            game.status.clone(),
            GameStatus::Open,
            RalliError::GameMustBeOpen
        );

        // Check if user is a valid participant in the game (including creator)
        let is_valid_user = game.users.contains(&user.key()) || game.creator == user.key();
        require!(is_valid_user, RalliError::UserNotInGame);

        // Game should not be full (if game is full, users should wait for it to be locked/resolved)
        require!(
            game.users.len() < game.max_users as usize,
            RalliError::GameIsFull
        );

        // Check if there are at least 2 players before checking first_line_starts_at
        if game.users.len() >= 2 {
            let current_time = Clock::get()?.unix_timestamp;

            // Check using the global first_line_starts_at on the Game object
            require!(
                current_time < game.first_line_starts_at,
                RalliError::BetsAlreadyStarted
            );
        }
        // If there's only 1 player (the user themselves), they can always withdraw

        // Verify escrow has the expected amount
        let expected_escrow_amount = game.entry_fee * game.users.len() as u64;
        require_eq!(
            game_escrow.total_amount,
            expected_escrow_amount,
            RalliError::EscrowAmountMismatch
        );

        // Ensure escrow has sufficient balance for the refund
        require!(
            game_escrow.to_account_info().lamports() >= game.entry_fee,
            RalliError::InsufficientEscrowBalance
        );

        let binding = game.key();
        let escrow_seeds = &[b"escrow", binding.as_ref(), &[game_escrow.bump]];
        let signer = &[&escrow_seeds[..]];

        // Refund the calling user their entry fee
        let user_refund_amount = game.entry_fee;

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

        // If no users left after removal, mark game as cancelled and clear vectors
        if game.users.is_empty() {
            game.status = GameStatus::Cancelled;
            game.locked_at = Some(Clock::get()?.unix_timestamp);
            
            // Clear lines and involved_lines when game is cancelled
            game.lines.clear();
            game.involved_lines.clear();
            
            // Reset first_line_starts_at when no users left
            game.first_line_starts_at = i64::MAX;

            msg!(
                "Game {} fully cancelled - no users remaining. Final withdrawal by user {}",
                game.game_id,
                user.key()
            );
        } else {
            msg!(
                "User {} withdrew from game {} (ID: {}). {} users remaining. Refunded {} lamports",
                user.key(),
                game.key(),
                game.game_id,
                game.users.len(),
                user_refund_amount
            );
        }

        Ok(())
    }
}