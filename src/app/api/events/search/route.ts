import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimiter';

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:8001';

interface SearchRequest {
    city: string;
    query?: string;
}

export async function POST(req: NextRequest) {
    try {
        const rl = rateLimit(req, 'events-search', 10, 60000);
        if (!rl.success) {
            return NextResponse.json({ error: 'Too many requests, please try again later.' }, {
                status: 429,
                headers: {
                    'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
                },
            });
        }

        const body: SearchRequest = await req.json();

        if (!body.city) {
            return NextResponse.json(
                { error: 'City is required' },
                { status: 400 }
            );
        }

        // Call MCP server
        const response = await fetch(`${MCP_SERVER_URL}/events/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                city: body.city,
                query: body.query || '',
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('MCP server error:', error);
            return NextResponse.json(
                { error: 'Event search service unavailable', details: error },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in event search API:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
