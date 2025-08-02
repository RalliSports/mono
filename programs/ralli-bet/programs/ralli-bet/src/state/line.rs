use anchor_lang::prelude::*;

#[account]
pub struct Line {
    pub stat_id: u16,
    pub predicted_value: i64,
    pub actual_value: Option<i64>,
    pub athlete_id: u64,
    pub starts_at: i64,
    pub result: Option<Direction>,
    pub should_refund_bettors: bool,
    pub bump: u8,
}

impl Line {
    pub const MAX_SIZE: usize = 8 + 2 + + 8 + (1 + 8) + 8 + 8 + (1 + 1) + 1 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum Direction {
    Over,
    Under,
}
