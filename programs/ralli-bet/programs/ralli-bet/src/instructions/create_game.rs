use crate::constants::ADMIN_PUBKEYS;
use crate::constants::*;
use crate::errors::RalliError;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{Mint, TokenAccount, TokenInterface},
};
#[derive(Accounts)]
#[instruction(game_id: u64)]
pub struct CreateGame<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        space = 8 + Game::INIT_SPACE,
        seeds = [b"game", game_id.to_le_bytes().as_ref()],
        bump
    )]
    pub game: Account<'info, Game>,

    #[account(
        init,
        payer = creator,
        space = 8 + GameEscrow::INIT_SPACE,
        seeds = [b"escrow", game.key().as_ref()],
        bump
    )]
    pub game_escrow: Account<'info, GameEscrow>,

    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        init,
        payer = creator,
        associated_token::mint = mint,
        associated_token::authority = game,
    )]
    pub game_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,

    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> CreateGame<'info> {
    pub fn create_game(
        &mut self,
        game_id: u64,
        max_users: u8,
        entry_fee: u64,
        number_of_lines: u8,
        _admin: Option<Pubkey>,
        bumps: &CreateGameBumps,
    ) -> Result<()> {
        require!(max_users >= 2, RalliError::NotEnoughUsers);
        require!(max_users <= 50, RalliError::GameFull);
        require!(entry_fee > 0, RalliError::InvalidEntryFee);
        require!(
            number_of_lines >= MIN_LINES_PER_GAME,
            RalliError::TooFewLines
        );
        require!(
            number_of_lines <= MAX_LINES_PER_GAME,
            RalliError::TooManyLines
        );

        let game = &mut self.game;
        let game_escrow = &mut self.game_escrow;
        let clock = Clock::get()?;

        game.set_inner(Game {
            game_id,
            mint: self.mint.key(),
            first_line_starts_at: i64::MAX, // Initialize to max value (no lines yet)
            creator: self.creator.key(),
            admin: ADMIN_PUBKEYS.to_vec(),
            users: Vec::new(),
            max_users,
            entry_fee,
            status: GameStatus::Open,
            created_at: clock.unix_timestamp,
            number_of_lines,
            locked_at: None,
            involved_lines: Vec::new(), // Initialize empty involved_lines vector
            bump: bumps.game,
        });

        game_escrow.set_inner(GameEscrow {
            game: game.key(),
            total_amount: 0,
            bump: bumps.game_escrow,
        });

        Ok(())
    }
}
