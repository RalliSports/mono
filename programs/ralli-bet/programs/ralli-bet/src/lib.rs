use anchor_lang::prelude::*;

declare_id!("2dCihkBppHzVaE4yKJCUNQBteW2cA4YmLR9xViTQSwpD");

#[program]
pub mod ralli_bet {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
