use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Game {
    pub game_id: u64,
    pub mint: Pubkey,
    pub first_line_starts_at: i64,
    pub creator: Pubkey,
    pub admin: Pubkey,
    #[max_len(10)]
    pub users: Vec<Pubkey>,
    pub max_users: u8,
    pub entry_fee: u64,
    pub status: GameStatus,
    pub created_at: i64,
    pub locked_at: Option<i64>,
    pub number_of_lines: u8,
    #[max_len(40)]
    pub involved_lines: Vec<Pubkey>,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug, InitSpace)]
pub struct GameLine {
    pub line_id: u64,
    pub is_active: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug, InitSpace, Copy)]
pub enum GameStatus {
    Open,
    Locked,
    Resolved,
    Cancelled,
}

impl core::fmt::Display for GameStatus {
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        match self {
            GameStatus::Open => write!(f, "Open"),
            GameStatus::Cancelled => write!(f, "Cancelled"),
            GameStatus::Locked => write!(f, "Locked"),
            GameStatus::Resolved => write!(f, "Resolved"),
        }
    }
}
