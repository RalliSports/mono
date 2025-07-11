use anchor_lang::prelude::*;

#[account]
pub struct GameResult {
    pub game: Pubkey,
    pub resolved: bool,
    pub winners: Vec<Pubkey>,
    pub highest_correct: u8,
    pub total_pool: u64,
    pub resolved_at: i64,
    pub bump: u8,
}

impl GameResult {
    pub const MAX_SIZE: usize = 8 + 32 + 1 + (4 + 32 * 50) + 1 + 8 + 8 + 1;
}
