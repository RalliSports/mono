import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { avatarUrl } = await request.json()

    // Call your server API to update the user's avatar
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/update-user`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // Add your auth headers here
      },
      body: JSON.stringify({ avatar: avatarUrl }),
    })

    if (!response.ok) {
      throw new Error('Failed to update avatar')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating avatar:', error)
    return NextResponse.json({ error: 'Failed to update avatar' }, { status: 500 })
  }
}
