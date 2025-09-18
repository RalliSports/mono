import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL

    if (!backendUrl) {
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 })
    }

    const tokenString = request.headers.get('x-para-session')

    if (!tokenString) {
      return NextResponse.json(
        {
          error: 'Session ID missing',
          message: 'Unauthorized access. Please provide a valid session ID.',
        },
        { status: 401 },
      )
    }

    const body = await request.json()
    const { subscriptionId, title, body: messageBody, url } = body

    const missingFields: string[] = []
    if (!subscriptionId) missingFields.push('subscriptionId')
    if (!title) missingFields.push('title')
    if (!messageBody) missingFields.push('body')

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          missingFields: missingFields,
        },
        { status: 400 },
      )
    }

    const response = await fetch(`${backendUrl}/api/v1/user/send-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-para-session': tokenString,
      },
      body: JSON.stringify({
        subscriptionId,
        title,
        body: messageBody,
        url,
      }),
    })

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

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Send notification API error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
