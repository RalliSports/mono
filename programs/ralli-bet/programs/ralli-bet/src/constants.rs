use anchor_lang::prelude::*;

pub const ADMIN_PUBKEYS: [Pubkey; 6] = [
    pubkey!("2oNQCTWsVdx8Hxis1Aq6kJhfgh8cdo6Biq6m9nxRTVuk"), // Jack-para
    pubkey!("BuxU7uwwkoobF8p4Py7nRoTgxWRJfni8fc4U3YKGEXKs"), // Jack
    pubkey!("GkiKqSVfnU2y4TeUW7up2JS9Z8g1yjGYJ8x2QNf4K6Y"),  // Prakhar
    pubkey!("MNG3SoboXMyjse4ggiyBWJreNhfxyni5VJFxSLmXM5n"),  // Ahindra
    pubkey!("2GuAG65KTq1oFwztWoGAR4g9jBYVZ2eiMDfEESVumZoc"), //Grey-para
    pubkey!("2XXmrxgq5JfdWVGo9TE3Q6275WkAdmx35USiuamAreE9"), // please add your ProgramIDs and update the array size please
];

// pub const ADMIN_PUBLIC_KEY: Pubkey = pubkey!("2XXmrxgq5JfdWVGo9TE3Q6275WkAdmx35USiuamAreE9"); //TEST PUBLICKEY

pub fn is_admin(pubkey: &Pubkey) -> bool {
    ADMIN_PUBKEYS.contains(pubkey)
}

pub const MAX_USERS_LIMIT: u8 = 50;
pub const MIN_USERS_REQUIRED: u8 = 2;
pub const MAX_LINES_PER_GAME: u8 = 12;
pub const MIN_LINES_PER_GAME: u8 = 2;
