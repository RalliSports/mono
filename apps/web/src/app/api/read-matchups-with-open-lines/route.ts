import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('=== FRONTEND API ROUTE CALLED ===')
  console.log('Request method:', request.method)
  console.log('Request URL:', request.url)

  try {
    // Get the backend URL from environment variables
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL
    console.log('Backend URL:', backendUrl)

    if (!backendUrl) {
      console.log('ERROR: Backend URL not configured')
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 })
    }

    // Extract the JWT token from the request headers
    const tokenString = request.headers.get('x-para-session')
    console.log('Session token present:', !!tokenString)

    // Check if the JWT token is missing
    if (!tokenString) {
      console.log('ERROR: Session ID missing')
      return NextResponse.json(
        {
          error: 'Session ID missing',
          message: 'Unauthorized access. Please provide a valid session ID.',
        },
        { status: 401 },
      )
    }

    // Make the request to the backend
    const requestUrl = `${backendUrl}/api/v1/matchups/read-matchups-with-open-lines`
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...(tokenString && { 'x-para-session': tokenString }),
    }

    console.log('Making request to:', requestUrl)
    console.log('Request headers:', requestHeaders)

    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: requestHeaders,
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    // Check if the backend request was successful
    if (!response.ok) {
      // Get the raw response text first
      const rawResponseText = await response.text()
      console.log('Backend error response (raw):', rawResponseText)

      let errorData
      try {
        // Try to parse as JSON
        errorData = JSON.parse(rawResponseText)
        console.log('Backend error response (parsed):', errorData)
      } catch (parseError) {
        console.log('Failed to parse JSON, using raw text:', parseError)
        errorData = rawResponseText
      }

      // Extract specific validation errors if they exist
      let validationErrors = []
      let errorMessage = 'Unknown backend error'

      if (errorData) {
        if (typeof errorData === 'string') {
          errorMessage = errorData
        } else if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.error) {
          errorMessage = errorData.error
        }

        // Check for validation error arrays in various possible locations
        if (errorData.message && Array.isArray(errorData.message)) {
          validationErrors = errorData.message
        } else if (errorData.errors && Array.isArray(errorData.errors)) {
          validationErrors = errorData.errors
        } else if (errorData.validationErrors && Array.isArray(errorData.validationErrors)) {
          validationErrors = errorData.validationErrors
        } else if (errorData.details && Array.isArray(errorData.details)) {
          validationErrors = errorData.details
        } else if (errorData.issues && Array.isArray(errorData.issues)) {
          validationErrors = errorData.issues
        }
      }

      return NextResponse.json(
        {
          error: 'Backend request failed',
          message: errorMessage,
          validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
          rawBackendResponse: rawResponseText,
          parsedBackendData: errorData,
          status: response.status,
          statusText: response.statusText,
        },
        { status: response.status },
      )
    }

    // Parse and return the backend response
    const data = await response.json()
    console.log('Backend success response:', data)

    // Check if the response contains an error (even with 200 status)
    if (data.error) {
      console.log('Backend returned error in response body:', data.error)
      return NextResponse.json(
        {
          error: 'Backend returned error',
          message: data.error,
          details: data,
          status: 500, // Treat as server error
        },
        { status: 500 },
      )
    }
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
