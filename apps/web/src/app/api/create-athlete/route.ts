import { NextRequest, NextResponse } from 'next/server'
import { backendUrl } from '@/constants'

interface CreateAthleteRequest {
    name: string;
    team: string;
    position: string;
    jerseyNumber: number;
    age: number;
    picture?: string; // optional
}

function validateCreateAthleteData(data: any): data is CreateAthleteRequest {
    return (
        typeof data.name === 'string' &&
        typeof data.team === 'string' &&
        typeof data.position === 'string' &&
        typeof data.jerseyNumber === 'number' &&
        typeof data.age === 'number' &&
        (data.picture === undefined || typeof data.picture === 'string')
    );
}

export async function POST(request: NextRequest) {
    try {
        // Get the backend URL from environment variables
        if (!backendUrl) {
            return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
        }

        // Parse the request body
        const body = await request.json();

        // Validate the data structure
        if (!validateCreateAthleteData(body)) {
            return NextResponse.json(
                {
                    error: 'Invalid data format',
                    required: {
                        name: 'string',
                        team: 'string',
                        position: 'string',
                        jerseyNumber: 'number',
                        age: 'number',
                        picture: 'string (optional)',
                    },
                },
                { status: 400 },
            );
        }

        // Extract the JWT token from the request headers
        const tokenString = request.headers.get('x-para-session');

        // Check if the JWT token is missing
        if (!tokenString) {
            return NextResponse.json(
                {
                    error: 'Session ID missing',
                    message: 'Unauthorized access. Please provide a valid session ID.',
                },
                { status: 401 },
            );
        }

        // Make the request to the backend
        const response = await fetch(`${backendUrl}/api/v1/create-athlete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(tokenString && { 'x-para-session': tokenString }),
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.error || 'Failed to create athlete' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Error creating athlete:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}