import { NextRequest, NextResponse } from 'next/server'
import { backendUrl } from '@/constants'
import { CreateGameDtoType } from '@repo/server'

// Validation function with detailed error reporting
function validateCreateGameData(data: CreateGameDtoType): { isValid: boolean; errors?: string[] } {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Request body must be an object'] }
  }

  const errors: string[] = []
  const obj = data as unknown as Record<string, unknown>

  // Required fields
  if (typeof obj.title !== 'string') errors.push('title must be a string')
  if (typeof obj.depositAmount !== 'number') errors.push('depositAmount must be a number')
  if (typeof obj.maxParticipants !== 'number') errors.push('maxParticipants must be a number')
  if (typeof obj.numBets !== 'number') errors.push('numBets must be a number')
  if (typeof obj.matchupGroup !== 'string') errors.push('matchupGroup must be a string')
  if (typeof obj.isPrivate !== 'boolean') errors.push('isPrivate must be a boolean')
  if (typeof obj.type !== 'string') errors.push('type must be a string')
  if (typeof obj.userControlType !== 'string') errors.push('userControlType must be a string')

  // Optional fields (only validate type if present)
  if (obj.gameModeId !== undefined && typeof obj.gameModeId !== 'string') {
    errors.push('gameModeId must be a string if provided')
  }
  if (obj.imageUrl !== undefined && typeof obj.imageUrl !== 'string') {
    errors.push('imageUrl must be a string if provided')
  }

  // Validate enum values
  if (obj.type && !['1v1', 'limited', 'unlimited'].includes(obj.type as string)) {
    errors.push('type must be one of: 1v1, limited, unlimited')
  }
  if (obj.userControlType && !['whitelist', 'blacklist', 'none'].includes(obj.userControlType as string)) {
    errors.push('userControlType must be one of: whitelist, blacklist, none')
  }

  return { isValid: errors.length === 0, errors: errors.length > 0 ? errors : undefined }
}

export async function POST(request: NextRequest) {
  try {
    if (!backendUrl) {
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 })
    }

    // Parse the request body
    const body = await request.json()

    // Log the incoming request for debugging

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
    const requestUrl = `${backendUrl}/api/v1/create-game`
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...(tokenString && { 'x-para-session': tokenString }),
    }

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(body),
    })

    // Check if the backend request was successful
    if (!response.ok) {
      // Get the raw response text first
      const rawResponseText = await response.text()

      let errorData
      try {
        // Try to parse as JSON
        errorData = JSON.parse(rawResponseText)
      } catch (parseError) {
        console.log('Failed to parse JSON, using raw text:', parseError)
        errorData = rawResponseText
      }

      return NextResponse.json(
        {
          error: 'Backend validation failed',
          message: errorData.message,
          rawBackendResponse: rawResponseText,
          parsedBackendData: errorData,
          status: response.status,
          statusText: response.statusText,
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
