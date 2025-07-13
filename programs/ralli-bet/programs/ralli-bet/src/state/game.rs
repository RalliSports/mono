use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Game {
    pub game_id: u64,
    pub creator: Pubkey,
    #[max_len(10)]
    pub users: Vec<Pubkey>,
    pub max_users: u8,
    pub entry_fee: u64,
    pub status: GameStatus,
    pub created_at: i64,
    pub locked_at: Option<i64>,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug, InitSpace)]
pub enum GameStatus {
    Open,
    Locked,
    Resolved,
    Cancelled,
}
