import { NextRequest, NextResponse } from 'next/server';

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:8001';

export async function GET() {
    try {
        const response = await fetch(`${MCP_SERVER_URL}/stats`);
        if (!response.ok) {
            return NextResponse.json(
                { error: 'Stats service unavailable', details: await response.text() },
                { status: response.status }
            );
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in stats API:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
