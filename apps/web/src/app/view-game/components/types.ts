export interface GameMode {
  id: string
  label: string
  description: string
  createdAt: string
}

export interface Creator {
  id: string
  walletAddress: string
  username: string
  emailAddress: string | null
  paraUserId: string
  createdAt: string
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
  date: string
  startsAt: string
}

export interface Stat {
  id: string
  name: string
  description: string
  customId: number
  createdAt: string
}

export interface Line {
  id: string
  athleteId: string
  athlete: Athlete
  matchup: Matchup
  stat: Stat
  statId: string
  matchupId: string
  predictedValue: number
  actualValue: number
}

export interface Prediction {
  id: string
  participantId: string
  lineId: string
  gameId: string
  predictedDirection: string
  isCorrect: boolean
  line: Line
}

export interface Participant {
  id: string
  userId: string
  gameId: string
  joinedAt: string
  isWinner: boolean
  txnId: string | null
  user: Creator
  bets: Prediction[]
}

export interface Game {
  id: string
  title: string
  creatorId: string
  depositAmount: number
  currency: string
  createdAt: string
  status: string
  maxParticipants: number
  numBets: number | null
  gameCode: string
  matchupGroup: string
  depositToken: string
  isPrivate: boolean
  type: string
  userControlType: string
  gameModeId: string
  txnId: string | null
  gameMode: GameMode
  creator: Creator
  participants: Participant[]
}
