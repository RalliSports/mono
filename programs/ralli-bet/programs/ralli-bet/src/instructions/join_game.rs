use crate::errors::RalliError;
use crate::state::*;
use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked},
};
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

    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = user,
    )]
    pub user_tokens: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = game,
    )]
    pub game_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,

    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> JoinGame<'info> {
    pub fn join_game(&mut self) -> Result<()> {
        let game = &mut self.game;
        let game_escrow = &mut self.game_escrow;
        let user = &self.user;

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

        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = TransferChecked {
            from: self.user_tokens.to_account_info(),
            to: self.game_vault.to_account_info(),
            authority: self.user.to_account_info(),
            mint: self.mint.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        transfer_checked(cpi_ctx, game.entry_fee, self.mint.decimals)?;

        // Adding The user to game
        game.users.push(user.key());
        game_escrow.total_amount += game.entry_fee;

        Ok(())
    }
}
