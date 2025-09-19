import { NextRequest, NextResponse } from 'next/server'

// TypeScript interface for the request data
interface CreateLinesForMatchupRequest {
  matchupId: string
}

// Validation function with detailed error reporting
function validateCreateLineData(data: unknown): { isValid: boolean; errors?: string[] } {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Request body must be an object'] }
  }

  const errors: string[] = []
  const obj = data as Record<string, unknown>

  if (typeof obj.matchupId !== 'string') errors.push('matchupId must be a string')

  return { isValid: errors.length === 0, errors: errors.length > 0 ? errors : undefined }
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
    const validation = validateCreateLineData(body)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Invalid data format',
          issues: validation.errors,
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
    const response = await fetch(`${backendUrl}/api/v1/matchups/create-lines`, {
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
          error: 'errorData',
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
