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
    homeTeam: string
    awayTeam: string
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

export interface User {
  id: string
  emailAddress: string
  walletAddress: string
  paraUserId: string
  firstName?: string
  lastName?: string
  username?: string
  avatar?: string
  hasBeenFaucetedSol: boolean
}
