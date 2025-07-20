use crate::errors::RalliError;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

#[derive(Accounts)]
pub struct RefundEntry<'info> {
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

    #[account(
        mut,
        constraint = game_creator.key() == game.creator @ RalliError::UnauthorizedRefund
    )]
    pub game_creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> RefundEntry<'info> {
    pub fn refund_all_users(&mut self, remaining_accounts: &[AccountInfo<'info>]) -> Result<()> {
        let game = &mut self.game;
        let game_escrow = &mut self.game_escrow;
        let game_result = &self.game_result;

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

        // 6. Verify escrow calculations with overflow protection
        let expected_total = game
            .entry_fee
            .checked_mul(game.users.len() as u64)
            .ok_or(RalliError::ArithmeticOverflow)?;

        require_eq!(
            game_escrow.total_amount,
            expected_total,
            RalliError::EscrowAmountMismatch
        );

        // 7. Ensure escrow has sufficient balance for refunds
        require!(
            game_escrow.to_account_info().lamports() >= expected_total,
            RalliError::InsufficientEscrowBalance
        );

        // 8. Validate escrow account integrity
        require!(
            game_escrow.game == game.key(),
            RalliError::EscrowGameMismatch
        );

        // 9. Check for duplicate user accounts in remaining_accounts
        let mut seen_accounts = std::collections::HashSet::new();
        for account in remaining_accounts {
            require!(
                seen_accounts.insert(account.key()),
                RalliError::DuplicateUserAccount
            );
        }

        // 10. Validate game_result account belongs to this game
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

        // Verify escrow has enough funds
        let expected_total = game.entry_fee * game.users.len() as u64;
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

        // Update escrow total to zero
        game_escrow.total_amount = 0;

        // Clear users list
        game.users.clear();

        // Set game status to cancelled
        game.status = GameStatus::Cancelled;

        // Record cancellation timestamp
        game.locked_at = Some(Clock::get()?.unix_timestamp);

        msg!(
            "Successfully refunded all {} users for game {} (ID: {})",
            remaining_accounts.len(),
            game.key(),
            game.game_id
        );

        Ok(())
    }
