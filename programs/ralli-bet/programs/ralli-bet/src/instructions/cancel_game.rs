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

    #[account(
        seeds = [b"game_result", game.key().as_ref()],
        bump = game_result.bump
    )]
    pub game_result: Account<'info, GameResult>,

    #[account(mut)]
    pub admin_or_user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> CancelGame<'info> {
    pub fn cancel_game(&mut self, remaining_accounts: &[AccountInfo<'info>]) -> Result<()> {
        let game = &mut self.game;
        let game_escrow = &mut self.game_escrow;
        let game_result = &self.game_result;
        let admin_or_user = &self.admin_or_user;

        // Not resolved (something went wrong)
        require!(
            game.status == GameStatus::Locked || !game_result.resolved,
            RalliError::GameNotRefundable
        );

        // If game is resolved, it cannot be refunded
        require!(!game_result.resolved, RalliError::GameAlreadyResolved);

        // Game must not be already cancelled
        require_neq!(
            game.status.clone(),
            GameStatus::Cancelled,
            RalliError::GameAlreadyCancelled
        );

        // Game must have users to refund
        require!(!game.users.is_empty(), RalliError::NoUsersToRefund);

        // Check authorization: Admin can always cancel, or single user can cancel their own game
        let is_admin = admin_or_user.key() == game.admin; // Assuming admin field exists in Game struct
        let is_single_user_game = game.users.len() == 1 && game.users[0] == admin_or_user.key();

        require!(
            is_admin || is_single_user_game,
            RalliError::UnauthorizedCancellation
        );

        // If there are 2+ players, verify none of the bets have started yet (first_line_starts_at check)
        if game.users.len() >= 2 {
            let current_time = Clock::get()?.unix_timestamp;

            // Check if any of the lines in this game have started
            // Assuming game has a lines field with first_line_starts_at timestamps
            for line in &game.lines {
                require!(
                    current_time < line.first_line_starts_at,
                    RalliError::BetsAlreadyStarted
                );
            }

            // For admin cancellation of multi-player games, check should_refund_bettors
            if is_admin {
                let mut should_cancel = false;
                for line in &game.lines {
                    if line.should_refund_bettors {
                        should_cancel = true;
                        break;
                    }
                }
                require!(should_cancel, RalliError::NoValidReasonToCancel);
            }
        }

        // Validate entry fee is reasonable (prevent overflow attacks)
        require!(
            game.entry_fee > 0 && game.entry_fee < u64::MAX / game.users.len() as u64,
            RalliError::InvalidEntryFee
        );

        // Validate max_users is reasonable
        require!(
            game.max_users > 0 && game.max_users <= 10, // Adjust limit as needed
            RalliError::InvalidMaxUsers
        );

        // Time-based validations
        let current_time = Clock::get()?.unix_timestamp;

        // Game should exist for reasonable time before refund
        require!(
            current_time >= game.created_at,
            RalliError::InvalidGameCreationTime
        );

        // If game is locked, validate it was locked recently enough to refund
        if let Some(locked_time) = game.locked_at {
            let max_refund_window = 24 * 60 * 60; // 24 hours
            require!(
                current_time - locked_time <= max_refund_window,
                RalliError::RefundWindowExpired
            );
        }

        // Verify escrow calculations with overflow protection
        let expected_total = game
            .entry_fee
            .checked_mul(game.users.len() as u64)
            .ok_or(RalliError::ArithmeticOverflow)?;

        require_eq!(
            game_escrow.total_amount,
            expected_total,
            RalliError::EscrowAmountMismatch
        );

        // Ensure escrow has sufficient balance for refunds
        require!(
            game_escrow.to_account_info().lamports() >= expected_total,
            RalliError::InsufficientEscrowBalance
        );

        // Validate escrow account integrity
        require!(
            game_escrow.game == game.key(),
            RalliError::EscrowGameMismatch
        );

        // Check for duplicate user accounts in remaining_accounts
        let mut seen_accounts = std::collections::HashSet::new();
        for account in remaining_accounts {
            require!(
                seen_accounts.insert(account.key()),
                RalliError::DuplicateUserAccount
            );
        }

        // Validate game_result account belongs to this game
        require!(
            game_result.game == game.key(),
            RalliError::GameResultMismatch
        );

        // Ensure we have remaining accounts for all users
        require_eq!(
            remaining_accounts.len(),
            game.users.len(),
            RalliError::InvalidAccountCount
        );

        // Prepare escrow seeds for signing
        let binding = game.key();
        let escrow_seeds = &[b"escrow", binding.as_ref(), &[game_escrow.bump]];
        let signer = &[&escrow_seeds[..]];

        // Refund each user
        for (i, user_account) in remaining_accounts.iter().enumerate() {
            // Verify this account matches the user in the game
            require_eq!(
                user_account.key(),
                game.users[i],
                RalliError::AccountMismatch
            );

            // Ensure user account is writable
            require!(user_account.is_writable, RalliError::AccountNotWritable);

            // Ensure user account is owned by system program (for lamport transfers)
            require!(
                user_account.owner == &anchor_lang::system_program::ID,
                RalliError::InvalidAccountOwner
            );

            // Transfer refund from escrow to user
            let transfer_instruction = Transfer {
                from: game_escrow.to_account_info(),
                to: user_account.clone(),
            };

            let cpi_ctx = CpiContext::new_with_signer(
                self.system_program.to_account_info(),
                transfer_instruction,
                signer,
            );

            transfer(cpi_ctx, game.entry_fee)?;

            msg!(
                "Refunded {} lamports to user {}",
                game.entry_fee,
                user_account.key()
            );
        }

        // Verify treasury is actually empty before setting total_amount to 0
        require!(
            game_escrow.to_account_info().lamports() == 0
                || game_escrow.to_account_info().lamports() < game.entry_fee,
            RalliError::TreasuryNotEmpty
        );

        // Update escrow total to zero
        game_escrow.total_amount = 0;

        // Clear users list
        game.users.clear();

        // Set game status to cancelled
        game.status = GameStatus::Cancelled;

        // Record cancellation timestamp
        game.locked_at = Some(Clock::get()?.unix_timestamp);

        msg!(
            "Successfully cancelled and refunded all {} users for game {} (ID: {})",
            remaining_accounts.len(),
            game.key(),
            game.game_id
        );

        Ok(())
    }
}
