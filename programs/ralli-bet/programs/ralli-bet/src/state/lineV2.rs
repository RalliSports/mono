use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct PlayerLine {

    #[max_len(20)]
    pub player_id: String,
    pub matchup_id: u64,
    pub stat_id: u16,
    pub line_value: i32,
    pub odds: i32,
    pub actual_value: Option<i32>,
    pub starts_at: i64,
    pub created_at: i64,
    pub result: Option<DirectionV2>,
    pub is_active: bool,
    pub should_refund_bettors: bool,
    pub bump: u8,
}

impl PlayerLine {
    pub const MAX_SIZE: usize = 8 + 
        (4 + 20) + 
        8 +        
        2 +        
        4 +      
        4 +     
        (1 + 4) +  
        8 +       
        8 +      
        (1 + 1) + 
        1 +      
        1 +     
        1;      

    pub fn to_decimal_odds(&self) -> f64 {
        if self.odds < 0 {
            (100.0 / self.odds.abs() as f64) + 1.0
        } else {
            (self.odds as f64 / 100.0) + 1.0
        }
    }
    
    pub fn calculate_payout(&self, stake: u64) -> u64 {
        let decimal_odds = self.to_decimal_odds();
        (stake as f64 * decimal_odds) as u64
    }
    
    pub fn calculate_profit(&self, stake: u64) -> u64 {
        let payout = self.calculate_payout(stake);
        payout.saturating_sub(stake)
    }
}

#[account]
#[derive(InitSpace)]
pub struct LinePointer {

    #[max_len(40)]
    pub player_id: String,
    pub matchup_id: u64,
    pub stat_id: u16,
    pub current_line_value: i32,
    pub current_odds: i32,
    pub current_line_pubkey: Pubkey,
    pub last_updated: i64,
    pub bump: u8,
}

impl LinePointer {
    pub const MAX_SIZE: usize = 8 + 
        (4 + 20) +
        8 +      
        2 +        
        4 +   
        4 +      
        8 +
        1;     
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Copy, Debug, InitSpace)]
pub enum DirectionV2 {
    Over,
    Under,
}