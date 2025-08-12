import { NextRequest, NextResponse } from 'next/server'
import { backendUrl } from '@/constants'

// TypeScript interface for the request data
interface CreateGameRequest {
  title: string
  depositAmount: number
  currency: string
  maxParticipants: number
  maxBets: number
  matchupGroup: string
  depositToken: string
  isPrivate: boolean
  type: string
  userControlType: string
  gameModeId: string
}

// Validation function
function validateCreateGameData(data: any): data is CreateGameRequest {
  return (
    typeof data.title === 'string' &&
    typeof data.depositAmount === 'number' &&
    typeof data.currency === 'string' &&
    typeof data.maxParticipants === 'number' &&
    typeof data.maxBets === 'number' &&
    typeof data.matchupGroup === 'string' &&
    typeof data.depositToken === 'string' &&
    typeof data.isPrivate === 'boolean' &&
    typeof data.type === 'string' &&
    typeof data.userControlType === 'string' &&
    typeof data.gameModeId === 'string'
  )
}

export async function POST(request: NextRequest) {
  try {
    if (!backendUrl) {
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 })
    }

    // Parse the request body
    const body = await request.json()

    // Validate the data structure
    if (!validateCreateGameData(body)) {
      return NextResponse.json(
        {
          error: 'Invalid data format',
          required: {
            title: 'string',
            depositAmount: 'number',
            currency: 'string',
            maxParticipants: 'number',
            maxBets: 'number',
            matchupGroup: 'string',
            depositToken: 'string',
            isPrivate: 'boolean',
            type: 'string',
            userControlType: 'string',
            gameModeId: 'string',
          },
        },
        { status: 400 },
      )
    }

    // Extract the JWT token from the request headers
    const tokenString = request.headers.get('x-para-session')

    // Check if the JWT token is missing
    if (!tokenString) {
      return NextResponse.json(
        {
          error: 'Session ID missing',
          message: 'Unauthorized access. Please provide a valid session ID.',
        },
        { status: 401 },
      )
    }

    // Make the request to the backend
    const response = await fetch(`${backendUrl}/api/v1/create-game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(tokenString && { 'x-para-session': tokenString }),
      },
      body: JSON.stringify(body),
    })

    // Check if the backend request was successful
    if (!response.ok) {
      const errorData = await response.text()
      return NextResponse.json(
        {
          error: 'Backend request failed',
          details: errorData,
          status: response.status,
        },
        { status: response.status },
      )
    }

    // Parse and return the backend response
    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Create game API error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
