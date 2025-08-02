use crate::state::line::Direction;
use anchor_lang::prelude::*;

#[account]
pub struct Bet {
    pub game: Pubkey,
    pub user: Pubkey,
    pub picks: Vec<Pick>,
    pub correct_count: u8,
    pub submitted_at: i64,
    pub bump: u8,
}

impl Bet {
    // Adjusted size for the new Pick structure
    pub const MAX_SIZE: usize = 8 + 32 + 32 + (4 + 6 * (32 + 1)) + 1 + 8 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Pick {
    pub line_id: Pubkey,
    pub direction: Direction,
}
