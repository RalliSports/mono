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

    #[msg("Invalid line start time - must be in the future")]
    InvalidLineStartTime,

    #[msg("Line start time does not match provided line account")]
    LineStartTimeMismatch,

    #[msg("Line is not part of this game")]
    LineNotInGame,

    #[msg("Unauthorized to create lines - admin only")]
    UnauthorizedLineCreation,

    #[msg("Game is not open for line creation")]
    GameNotOpenforLine,

    #[msg("Maximum lines per game reached")]
    MaxLinesReached,

    #[msg("Unauthorized to resolve line")]
    UnauthorizedLineResolution,

    #[msg("Line has already been resolved")]
    LineAlreadyResolved,

    #[msg("Line should be refunded")]
    LineShouldBeRefunded,

    #[msg("Line has not started yet")]
    LineNotStarted,

    #[msg("Invalid predicted value - must be greater than 0")]
    InvalidPredictedValue,

    #[msg("Direction has a mismatch!")]
    DirectionMismatch,

    #[msg("Invalid stat ID - must be greater than 0")]
    InvalidStatId,

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

    #[msg("Game is full")]
    GameIsFull,

    #[msg("Game cannot be cancelled")]
    GameCannotBeCancelled,

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

    #[msg("Escrow game mismatch")]
    EscrowGameMismatch,

    #[msg("Refund window has expired")]
    RefundWindowExpired,

    #[msg("Invalid game creation time")]
    InvalidGameCreationTime,

    #[msg("Arithmetic overflow occurred")]
    ArithmeticOverflow,

    #[msg("Invalid max users")]
    InvalidMaxUsers,

    #[msg("Game result mismatch")]
    GameResultMismatch,

    #[msg("Duplicate user account")]
    DuplicateUserAccount,

    #[msg("Unauthorized cancellation")]
    UnauthorizedCancellation,

    #[msg("Bets have already started")]
    BetsAlreadyStarted,

    #[msg("No valid reason to cancel the game")]
    NoValidReasonToCancel,

    #[msg("Treasury is not empty")]
    TreasuryNotEmpty,

    #[msg("Empty picks provided")]
    EmptyPicks,

    #[msg("Picks do not match the expected line")]
    PicksLinesMismatch,

    #[msg("Invalid line account provided")]
    InvalidLineAccount,

    #[msg("Line already started")]
    LineAlreadyStarted,

    #[msg("Invalid remaining accounts count")]
    InvalidRemainingAccountsCount,

    #[msg("Invalid number of lines")]
    InvalidNumberOfLines,

    #[msg("Too few lines")]
    TooFewLines,

    #[msg("Too many lines")]
    TooManyLines,

    #[msg("Line mismatch")]
    LineMismatch,

    #[msg("Only admin can resolve games")]
    UnauthorizedGameResolution,

    #[msg("Game does not have any lines")]
    NoLinesInGame,

    #[msg("Line accounts are missing")]
    MissingLineAccounts,

    #[msg("Line is yet to be resolved")]
    LineNotResolved,

    #[msg("Unrealistic fees")]
    ExcessiveFee,

    #[msg("Bet account should be valid")]
    InvalidBetAccount,

    #[msg("This bet is not involved in thisgame")]
    BetNotInGame,

    #[msg("This bet does not belong to this user")]
    InvalidBetPlayer,

    #[msg("No users in the game")]
    NoPlayersInGame,

    #[msg("User account is not available")]
    UserAccountNotFound,

    #[msg("Number of winners does not match length of winners array")]
    NumberOfWinnersMismatch,

    #[msg("Escrow not empty")]
    EscrowNotEmpty,
}
