use anchor_lang::prelude::*;

#[account]
pub struct Line {
    pub stat_id: u16,
    pub predicted_value: u64,
    pub actual_value: Option<u64>,
    pub athlete_id: Pubkey,
    pub starts_at: i64,
    pub result: Option<Direction>,
    pub should_refund_bettors: bool,
    pub bump: u8,
}

impl Line {
    pub const MAX_SIZE: usize = 8 + 2 + 8 + 32 + 8 + (1 + 1) + 1 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum Direction {
    Over,
    Under,
}
