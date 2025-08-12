import { NextRequest, NextResponse } from 'next/server'
import { backendUrl } from '@/constants'

// fetch or get from backend/api/v1/games

interface GameMode {
  id: string
  label: string
  description: string
  createdAt: string
}

interface Creator {
  id: string
  walletAddress: string
  emailAddress: string | null
  paraUserId: string
  createdAt: string
}

interface Line {
  id: string
  athleteId: string
  statId: string
  matchupId: string
  predictedValue: number
  actualValue: number
}
interface Prediction {
  id: string
  participantId: string
  lineId: string
  gameId: string
  predictedDirection: string
  isCorrect: boolean
  line: Line
}
interface Participant {
  id: string
  userId: string
  gameId: string
  joinedAt: string
  isWinner: boolean
  txnId: string | null
  user: Creator
  predictions: Prediction[]
}

interface Game {
  id: string
  title: string
  creatorId: string
  depositAmount: number
  currency: string
  createdAt: string
  status: string
  maxParticipants: number
  maxBet: number | null
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

export async function GET(request: NextRequest) {
  try {
    if (!backendUrl) {
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 })
    }

    const gameId = request.nextUrl.searchParams.get('id')

    if (!gameId) {
      return NextResponse.json({ error: 'Game ID is required' }, { status: 400 })
    }

    const response = await fetch(`${backendUrl}/api/v1/game/${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch games' }, { status: response.status })
    }

    const data: Game[] = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
