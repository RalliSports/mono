

export enum GameStatus {
  WAITING = 'waiting',           // Game is open for participants
  IN_PROGRESS = 'in_progress',   // Game has started
  COMPLETED = 'completed',       // Game has finished
  CANCELLED = 'cancelled',       // Game was cancelled
  EXPIRED = 'expired',           // Game expired due to inactivity
}

export enum GameAccessStatus {
  WHITELISTED = 'whitelisted',
  BLACKLISTED = 'blacklisted',
}

export enum PredictionDirection {
  HIGHER = 'higher',
  LOWER = 'lower',
}
