import { NextResponse } from 'next/server'
import { backendUrl } from '@/constants'

export async function GET() {
  try {
    if (!backendUrl) {
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 })
    }

    const response = await fetch(`${backendUrl}/api/v1/matchups/test/sync-error`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch games' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
