use anchor_lang::prelude::*;

#[error_code]
pub enum RalliError {
    #[msg("Game is full")]
    GameFull,

    #[msg("Game is not open for joining")]
    GameNotOpen,

    #[msg("Game is not locked")]
    GameNotLocked,

    #[msg("Game is already resolved")]
    GameAlreadyResolved,

    #[msg("User already joined")]
    UserAlreadyJoined,

    #[msg("User not in game")]
    UserNotInGame,

    #[msg("Invalid pick count (must be between 2 and 6)")]
    InvalidPickCount,

    #[msg("Duplicate stat in picks")]
    DuplicateStatInPicks,

    #[msg("Bet already submitted")]
    BetAlreadySubmitted,

    #[msg("Not enough users to lock game")]
    NotEnoughUsers,

    #[msg("Only game creator can perform this action")]
    OnlyCreator,

    #[msg("Game must be open to cancel")]
    GameMustBeOpen,

    #[msg("Cannot join own game")]
    CannotJoinOwnGame,

    #[msg("Insufficient funds")]
    InsufficientFunds,

    #[msg("Game already locked")]
    GameAlreadyLocked,

    #[msg("Invalid stat result")]
    InvalidStatResult,

    #[msg("All users must submit bets before locking")]
    AllUsersMustSubmitBets,

    #[msg("Player is not in this game")]
    PlayerNotInGame,

    #[msg("Invalid entry fee")]
    InvalidEntryFee,

    #[msg("Invalid account count for operation")]
    AccountNotWritable,

    #[msg("Account mismatch")]
    AccountMismatch,

    #[msg("Unauthorized refund action")]
    UnauthorizedRefund,

    #[msg("Game is not refundable")]
    GameNotRefundable,

    #[msg("Game already cancelled")]
    GameAlreadyCancelled,

    #[msg("No users to refund")]
    NoUsersToRefund,

    #[msg("Invalid account count for operation")]
    InvalidAccountCount,

    #[msg("Insufficient balance in escrow to refund users")]
    InsufficientEscrowBalance,

    #[msg("Escrow amount mismatch")]
    EscrowAmountMismatch,

    #[msg("Invalid account owner")]
    InvalidAccountOwner,
}
