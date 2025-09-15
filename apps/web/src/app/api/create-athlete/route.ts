import { NextRequest, NextResponse } from 'next/server'
import { backendUrl } from '@/constants'

function validateCreateAthleteData(data: unknown): { isValid: boolean; errors?: string[] } {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Request body must be an object'] }
  }

  const errors: string[] = []
  const obj = data as Record<string, unknown>

  if (typeof obj.name !== 'string') errors.push('name must be a string')
  if (typeof obj.team !== 'string') errors.push('team must be a string')
  if (typeof obj.position !== 'string') errors.push('position must be a string')
  if (typeof obj.jerseyNumber !== 'number') errors.push('jerseyNumber must be a number')
  if (typeof obj.age !== 'number') errors.push('age must be a number')
  if (obj.picture !== undefined && typeof obj.picture !== 'string') {
    errors.push('picture must be a string (optional)')
  }

  return { isValid: errors.length === 0, errors: errors.length > 0 ? errors : undefined }
}

export async function POST(request: NextRequest) {
  try {
    // Get the backend URL from environment variables
    if (!backendUrl) {
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 })
    }

    // Parse the request body
    const body = await request.json()

    // Validate the data structure
    const validation = validateCreateAthleteData(body)
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
    const response = await fetch(`${backendUrl}/api/v1/create-athlete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(tokenString && { 'x-para-session': tokenString }),
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: errorData.error || 'Failed to create athlete' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating athlete:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
