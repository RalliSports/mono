import { NextRequest, NextResponse } from 'next/server'
import { backendUrl } from '@/constants'

// Validation function with detailed error reporting
function validateCreateGameData(data: unknown): { isValid: boolean; errors?: string[] } {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Request body must be an object'] }
  }

  const errors: string[] = []
  const obj = data as Record<string, unknown>

  if (typeof obj.title !== 'string') errors.push('title must be a string')
  if (typeof obj.depositAmount !== 'number') errors.push('depositAmount must be a number')
  if (typeof obj.currency !== 'string') errors.push('currency must be a string')
  if (typeof obj.maxParticipants !== 'number') errors.push('maxParticipants must be a number')
  if (typeof obj.numBets !== 'number') errors.push('numBets must be a number')
  if (typeof obj.matchupGroup !== 'string') errors.push('matchupGroup must be a string')
  if (typeof obj.depositToken !== 'string') errors.push('depositToken must be a string')
  if (typeof obj.isPrivate !== 'boolean') errors.push('isPrivate must be a boolean')
  if (typeof obj.type !== 'string') errors.push('type must be a string')
  if (typeof obj.userControlType !== 'string') errors.push('userControlType must be a string')
  if (typeof obj.gameModeId !== 'string') errors.push('gameModeId must be a string')
  if (typeof obj.tokenId !== 'string') errors.push('tokenId must be a string')
  if (typeof obj.imageUrl !== 'string') errors.push('imageUrl must be a string')

  return { isValid: errors.length === 0, errors: errors.length > 0 ? errors : undefined }
}

export async function POST(request: NextRequest) {
  try {
    if (!backendUrl) {
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 })
    }

    // Parse the request body
    const body = await request.json()

    // Validate the data structure
    const validation = validateCreateGameData(body)
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
