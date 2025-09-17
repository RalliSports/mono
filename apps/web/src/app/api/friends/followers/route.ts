import { backendUrl } from '@/constants'
import { NextRequest, NextResponse } from 'next/server'

// GET one user
export async function GET(req: NextRequest) {
  const tokenString = req.headers.get('x-para-session')

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

  try {
    // Call your server API to get user by id
    const response = await fetch(`${backendUrl}/api/v1/friends/followers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(tokenString && { 'x-para-session': tokenString }),
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch followers' }, { status: response.status })
    }

    const followes = await response.json()

    return NextResponse.json({ success: true, followes })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch followers' }, { status: 500 })
  }
}
