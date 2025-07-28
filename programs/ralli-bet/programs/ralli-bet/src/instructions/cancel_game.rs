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
        // require_eq!(
        //     game.status.clone(),
        //     GameStatus::Open,
        //     RalliError::GameMustBeOpen
        // );

        // Check if user is a valid participant in the game (including creator)
        let is_valid_user = game.users.contains(&user.key()) || game.creator == user.key();
        require!(is_valid_user, RalliError::UserNotInGame);

        // 1. Game should not be full (if game is full, users should wait for it to be locked/resolved)
        require!(
            game.users.len() < game.max_users as usize,
            RalliError::GameIsFull
        );

        // 2. Check if game has been running for too long without filling up
        // This prevents indefinite open games
        let current_time = Clock::get()?.unix_timestamp;
        let game_age = current_time - game.created_at;
        let max_open_duration = 24 * 60 * 60; // 24 hours in seconds

        let can_cancel_due_to_timeout = game_age > max_open_duration;
        let can_cancel_due_to_low_participation = game.users.len() <= (game.max_users as usize / 2);

        // 3. Allow cancellation only if:
        //    - Game has low participation (less than half full), OR
        //    - Game has been open too long without filling u
        require!(
            can_cancel_due_to_low_participation || can_cancel_due_to_timeout,
            RalliError::GameCannotBeCancelled
        );

        // 4. Verify escrow has the expected amount
        let expected_escrow_amount = game.entry_fee * game.users.len() as u64;
        require_eq!(
            game_escrow.total_amount,
            expected_escrow_amount,
            RalliError::EscrowAmountMismatch
        );

        // 5. Ensure escrow has sufficient balance for the refund
        require!(
            game_escrow.to_account_info().lamports() >= game.entry_fee,
            RalliError::InsufficientEscrowBalance
        );

        // Prepare escrow seeds for signing
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

        // If no users left after removal, mark game as cancelled
        if game.users.is_empty() {
            game.status = GameStatus::Cancelled;
            game.locked_at = Some(current_time);

            msg!(
                "Game {} fully cancelled - no users remaining. Final cancellation by user {}",
                game.game_id,
                user.key()
            );
        } else {
            msg!(
                "User {} left game {} (ID: {}). {} users remaining. Refunded {} lamports",
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
