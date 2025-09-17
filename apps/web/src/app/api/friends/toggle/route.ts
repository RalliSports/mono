import { backendUrl } from '@/constants'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')

    // Extract the JWT token from the request headers
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

    // Make the request to the backend
    const response = await fetch(`${backendUrl}/api/v1/friends/toggle?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(tokenString && { 'x-para-session': tokenString }),
      },
    })
    
    const data = await response.json()

    return NextResponse.json({ message: data.message }, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
