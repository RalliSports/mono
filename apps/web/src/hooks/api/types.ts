export interface ApiResponse<T = unknown> {
  success?: boolean
  data?: T
  message?: string
  error?: string
}

export interface ApiError {
  message: string
  status?: number
}

export interface LeaderboardUser {
  id: string
  username: string
  avatar: string
  gamesPlayed: number
  gamesWon: number
  winPercentage: number
  totalAmountWon: number
  totalAmountDeposited: number
  netProfit: number
  rank: number
  totalCorrectBets: number
  totalBets: number
  bettingAccuracy: number
}

export interface LeaderboardResponse {
  users: LeaderboardUser[]
  totalUsers: number
  page: number
  limit: number
  totalPages: number
}

export interface UserLeaderboardPosition {
  user: LeaderboardUser
  position: number
  totalUsers: number
}

export interface TopPerformersResponse {
  byWinRate: LeaderboardUser[]
  byTotalWinnings: LeaderboardUser[]
  byNetProfit: LeaderboardUser[]
  byBettingAccuracy: LeaderboardUser[]
}

export type LeaderboardSortBy = 'winRate' | 'totalWinnings' | 'netProfit' | 'bettingAccuracy'
