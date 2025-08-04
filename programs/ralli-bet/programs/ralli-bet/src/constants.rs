use anchor_lang::prelude::*;

// Prakhar
// pub const ADMIN_PUBLIC_KEY: Pubkey = pubkey!("9EM9kPnP6wtHXDWhW8eKr7WNKW1QVjohfroCb1Mtz9rp"); // this is just the declare_id
// Jack
pub const ADMIN_PUBLIC_KEY: Pubkey = pubkey!("BuxU7uwwkoobF8p4Py7nRoTgxWRJfni8fc4U3YKGEXKs"); // this is just the declare_id

pub const MAX_USERS_LIMIT: u8 = 50;
pub const MIN_USERS_REQUIRED: u8 = 2;
pub const MAX_LINES_PER_GAME: u8 = 12;
pub const MIN_LINES_PER_GAME: u8 = 2;
