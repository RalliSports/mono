import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL

    if (!backendUrl) {
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get('sortBy') || 'bettingAccuracy'

    const response = await fetch(`${backendUrl}/api/v1/leaderboard/my-position?sortBy=${sortBy}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

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

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('My leaderboard position API error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
