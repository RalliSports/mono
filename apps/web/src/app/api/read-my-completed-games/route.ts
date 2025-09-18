import { NextRequest, NextResponse } from 'next/server'
import { backendUrl } from '@/constants'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')

  try {
    if (!backendUrl) {
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 })
    }

    // Make the request to the backend
    const response = await fetch(`${backendUrl}/api/v1/games/my-completed-games?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
