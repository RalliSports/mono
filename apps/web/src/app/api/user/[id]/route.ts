import { NextRequest, NextResponse } from 'next/server'

// GET one user
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    // Call your server API to get user by id
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add your auth headers here
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: response.status })
    }

    const user = await response.json()

    return NextResponse.json(user, {status: response.status})
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}
