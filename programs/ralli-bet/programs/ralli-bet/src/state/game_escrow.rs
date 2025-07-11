use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct GameEscrow {
    pub game: Pubkey,
    pub total_amount: u64,
    pub bump: u8,
}

