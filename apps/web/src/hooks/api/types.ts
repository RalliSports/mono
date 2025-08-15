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

export interface User {
  id: string
  username: string
  avatar: string
  walletAddress: string
  balance?: number
  emailAddress?: string
  paraUserId?: string
  firstName?: string
  lastName?: string
}

export interface Game {
  id: string
  title: string
  participants?: { id: string; userId: string; user: { username: string; avatar: string; id: string } }[]
  maxParticipants?: number
  depositAmount?: number
  maxBet?: number
  gameMode?: { label: string }
  creator?: { walletAddress: string; username: string; avatar: string }
  status: 'waiting' | 'active' | 'complete' | 'pending'
}

export interface Athlete {
  id: string
  name: string
  team?: string
  position?: string
  sport?: string
}

export interface Line {
  id: string
  athleteId: string
  stat: string
  value: number
  type: 'over' | 'under'
  odds: number
}

export interface Bet {
  id: string
  gameId: string
  lineId: string
  amount: number
  prediction: 'over' | 'under'
}

export interface Team {
  id: string
  name: string
  logo?: string
  sport: string
}

export interface Matchup {
  id: string
  homeTeam: string
  awayTeam: string
  date: string
  sport: string
}

export interface Stat {
  id: string
  athleteId: string
  stat: string
  value: number
  gameDate: string
}

export interface CreateGameData {
  title: string
  gameMode?: string
  gameModeId?: string
  maxParticipants: number
  depositAmount: number
  maxBet?: number
  currency?: string
  numBets?: number
  matchupGroup?: string
  depositToken?: string
  isPrivate?: boolean
  type?: string
  userControlType?: string
}

export interface CreateBetData {
  gameId: string
  bets: {
    lineId: string
    prediction: 'over' | 'under'
  }[]
}

export interface UpdateUserData {
  username?: string
  avatar?: string
  firstName?: string
  lastName?: string
}
