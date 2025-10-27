import { backendUrl } from '@/constants'
import { NextRequest, NextResponse } from 'next/server'

// GET one user
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')

  try {
    // Call your server API to get user by id
    const response = await fetch(`${backendUrl}/api/v1/friends/followers?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch followers' }, { status: response.status })
    }

    const followers = await response.json()

    return NextResponse.json(followers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch followers' }, { status: 500 })
  }
}
