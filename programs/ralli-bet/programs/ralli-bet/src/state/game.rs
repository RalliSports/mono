use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Game {
    pub game_id: u64,
    pub creator: Pubkey,
    pub admin: Pubkey, // Added admin field for authorization
    #[max_len(10)]
    pub users: Vec<Pubkey>,
    pub max_users: u8,
    pub entry_fee: u64,
    pub status: GameStatus,
    pub created_at: i64,
    pub locked_at: Option<i64>,
    #[max_len(12)] // Adjust max length as needed
    pub lines: Vec<GameLine>,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug, InitSpace)]
pub struct GameLine {
    pub line_id: u64,
    pub first_line_starts_at: i64,
    pub should_refund_bettors: bool,
    pub line_type: LineType,
    #[max_len(50)]
    pub description: String,
    pub odds: i64,
    pub is_active: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug, InitSpace)]
pub enum LineType {
    Moneyline,
    Spread,
    OverUnder,
    Prop,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug, InitSpace)]
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

impl core::fmt::Display for LineType {
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        match self {
            LineType::Moneyline => write!(f, "Moneyline"),
            LineType::Spread => write!(f, "Spread"),
            LineType::OverUnder => write!(f, "Over/Under"),
            LineType::Prop => write!(f, "Prop Bet"),
        }
    }
}
