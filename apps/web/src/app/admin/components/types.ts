// Types for the admin panel
export interface Stat {
  id: string
  name: string
  description: string
  customId: number
  createdAt: string
}

export interface Team {
  id: string
  name: string
  city: string
  country: string
  createdAt: Date
}

export interface Player {
  id: string
  name: string
  team: {
    name: string
  }
  jerseyNumber: number
  position: string
  age: number
  picture?: string
}

export interface Line {
  id: string
  createdAt: string
  athleteId: string
  statId: string
  matchupId: string
  predictedValue: number
  actualValue: number
  isHigher: boolean
  sport?: string
  playerName?: string
  value?: number
  stat: {
    id: string
    customId: number
    name: string
    description: string
    createdAt: Date
  }
  matchup: {
    id: string
    homeTeam: Team
    awayTeam: Team
    gameDate: Date
    status: string
    scoreHome: number
    scoreAway: number
    createdAt: Date
  }
  athlete: {
    id: string
    name: string
    team: string
    position: string
    jerseyNumber: number
    age: number
    picture: string
    createdAt: Date
  }
}

export interface GameMode {
  id: string
  label: string
  description: string
  createdAt: string
}

export interface User {
  id: string
  emailAddress: string
  walletAddress: string
  paraUserId: string
  // @ApiProperty()
  // role: Role;
}

export interface Participant {
  id: string
  userId: string
  gameId: string
  joinedAt: string
  isWinner: boolean
  txnId: string | null
}

export interface Game {
  id: string
  title: string
  participants: Participant[]
  creatorId: string
  depositAmount: number
  currency: string
  createdAt: Date
  status: string
  maxParticipants: number
  maxBet: number
  gameCode: string
  matchupGroup: string
  depositToken: string
  isPrivate: boolean
  type: 'parlay' | 'head_to_head' | 'pool'
  userControlType: 'whitelist' | 'blacklist' | 'none'
  gameModeId: string
  gameMode: GameMode
  creator: User
}

export interface MatchUp {
  id: string
  homeTeam: Team
  awayTeam: Team
  date: Date
}

export type TabType = 'stats' | 'lines' | 'players' | 'resolve-lines' | 'resolve-games' | 'matchups'
