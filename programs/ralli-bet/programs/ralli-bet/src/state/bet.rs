use anchor_lang::prelude::*;

#[account]
pub struct Bet {
    pub game: Pubkey,
    pub player: Pubkey,
    pub picks: Vec<Pick>,
    pub correct_count: u8,
    pub submitted_at: i64,
    pub bump: u8,
}

impl Bet {
    pub const MAX_SIZE: usize = 8 + 32 + 32 + (4 + 6 * (2 + 1 + 8)) + 1 + 8 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Pick {
    pub stat_id: u16,
    pub direction: Direction,
    pub threshold: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum Direction {
    Over,
    Under,
}
