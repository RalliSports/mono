import { NextRequest, NextResponse } from 'next/server'

// TypeScript interface for the request data
interface CreateMatchupRequest {
  homeTeamId: string
  awayTeamId: string
  gameDate: string
}

// Validation function
function validateCreateMatchupData(data: unknown): data is CreateMatchupRequest {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>
  return typeof d.homeTeamId === 'string' && typeof d.awayTeamId === 'string' && typeof d.gameDate === 'string'
}

export async function POST(request: NextRequest) {
  try {
    // Get the backend URL from environment variables
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL

    if (!backendUrl) {
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 })
    }

    // Parse the request body
    const body = await request.json()

    // Validate the data structure
    if (!validateCreateMatchupData(body)) {
      return NextResponse.json(
        {
          error: 'Invalid data format',
          required: {
            homeTeamId: 'string',
            awayTeamId: 'string',
            gameDate: 'string',
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
    const response = await fetch(`${backendUrl}/api/v1/matchups/create`, {
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
