use crate::errors::RalliError;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

#[derive(Accounts)]
pub struct JoinGame<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

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

    pub system_program: Program<'info, System>,
}

impl<'info> JoinGame<'info> {
    pub fn join_game(&mut self) -> Result<()> {
        let game = &mut self.game;
        let game_escrow = &mut self.game_escrow;
        let user = &self.user;

        // require_eq!(game.status, GameStatus::Open, RalliError::GameNotOpen);

        if game.status != GameStatus::Open {
            return Err(RalliError::GameNotOpen.into());
        }

        require!(
            !game.users.contains(&user.key()),
            RalliError::UserAlreadyJoined
        );
        require!(
            game.users.len() < game.max_users as usize,
            RalliError::GameFull
        );

        // Transfer The entry fee to escrow (in game-escrow)
        let transfer_instruction = Transfer {
            from: user.to_account_info(),
            to: game_escrow.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(
            self.system_program.to_account_info(),
            transfer_instruction,
        );
        transfer(cpi_ctx, game.entry_fee)?;

        // Adding The user to game
        game.users.push(user.key());
        game_escrow.total_amount += game.entry_fee;

        Ok(())
    }
}
