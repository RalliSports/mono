import { GameMode } from '@repo/db/types'

export interface User {
  id: string
  emailAddress: string
  walletAddress: string
  paraUserId: string
  firstName?: string
  lastName?: string
  username?: string
  avatar?: string
}

export interface Bet {
  id: string
  userId: string
  participantId: string
  lineId: string
  gameId: string
  predictedDirection: string
  isCorrect: boolean
  createdAt: Date
  user: User
  line: Line
}

export interface Line {
  id: string
  createdAt: Date
  athleteId: string
  statId: string
  matchupId: string
  predictedValue: number
  actualValue: number
  matchup: Matchup
  athlete: Athlete
}

export interface Athlete {
  id: string
  name: string
  picture: string
}

export interface Matchup {
  id: string
  homeTeam: string
  awayTeam: string
  gameDate: Date
  status: string
  scoreHome: number
  scoreAway: number
  createdAt: Date
  startsAt: Date
}

export interface Participant {
  id: string
  user: User
  isWinner: boolean
  joinedAt: Date
  bets: Bet[]
}

export interface Game {
  id: string
  title: string
  creatorId: string
  depositAmount: number
  currency: string
  createdAt: Date
  status: string
  maxParticipants: number
  numBets: number
  gameCode: string
  matchupGroup: string
  depositToken: string
  createdTxnSignature: string
  resolvedTxnSignature: string
  isPrivate: boolean
  type: 'parlay' | 'head_to_head' | 'pool'
  userControlType: 'whitelist' | 'blacklist' | 'none'
  gameModeId: string
  gameMode: GameMode
  creator: User
  participants: Participant[]
}

export interface Achievement {
  name: string
  desc: string
  unlocked: boolean
  icon: string
}
