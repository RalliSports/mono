use anchor_lang::prelude::*;

#[account]
pub struct Game {
    pub game_id: u64,
    pub creator: Pubkey,
    pub players: Vec<Pubkey>,
    pub max_players: u8,
    pub entry_fee: u64,
    pub status: GameStatus,
    pub created_at: i64,
    pub locked_at: Option<i64>,
    pub bump: u8,
}

impl Game {
    pub const MAX_SIZE: usize = 8 + 8 + 32 + (4 + 32 * 50) + 1 + 8 + 1 + 8 + (1 + 8) + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum GameStatus {
    Open,
    Locked,
    Resolved,
    Cancelled,
}
