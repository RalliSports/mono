use anchor_lang::prelude::*;

#[account]
pub struct GameEscrow {
    pub game: Pubkey,
    pub total_amount: u64,
    pub bump: u8,
}

impl GameEscrow {
    pub const SIZE: usize = 8 + 32 + 8 + 1;
}
