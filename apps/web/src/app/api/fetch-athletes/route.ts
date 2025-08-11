import { NextRequest, NextResponse } from 'next/server'
import { backendUrl } from '@/constants'

interface Athlete {
  id: string
  name: string
  team: string
  position: string
  jerseyNumber: number
  age: number
  picture?: string // optional
}

export async function GET(request: NextRequest) {
  try {
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
    // Get the backend URL from environment variables
    if (!backendUrl) {
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 })
    }

    // Fetch athletes from the backend API
    const response = await fetch(`${backendUrl}/api/v1/athletes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(tokenString && { 'x-para-session': tokenString }),
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch athletes' }, { status: response.status })
    }

    const athletes: Athlete[] = await response.json()

    return NextResponse.json(athletes)
  } catch (error) {
    console.error('Error fetching athletes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
