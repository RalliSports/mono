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
    homeTeam: {
      id: string
      name: string
      abbreviation: string
    }
    awayTeam: {
      id: string
      name: string
      abbreviation: string
    }
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

export interface Athlete {
  id: string
  name: string
  team: string
  position: string
  jerseyNumber: number
  age: number
  picture: string
  customId: number
  createdAt: Date
  lines: Line[]
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
  isPrivate: boolean
  type: 'parlay' | 'head_to_head' | 'pool'
  userControlType: 'whitelist' | 'blacklist' | 'none'
  gameModeId: string
  gameMode: GameMode
  creator: User
}

export interface User {
  id: string
  emailAddress: string
  walletAddress: string
  paraUserId: string
}

export interface GameMode {
  id: string
  label: string
  description: string
  createdAt: string
}

export interface SelectedPick {
  lineId: string
  athleteId: string
  predictedDirection: 'over' | 'under'
  picture: string
}
