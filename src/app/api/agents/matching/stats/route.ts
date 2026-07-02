import { NextRequest, NextResponse } from 'next/server';

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:8001';
const cacheHeaders = {
  'Cache-Control': 'public, max-age=15, stale-while-revalidate=30',
};

export async function GET() {
    try {
        const response = await fetch(`${MCP_SERVER_URL}/stats`, {
            signal: AbortSignal.timeout(1000)
        });
        if (!response.ok) {
            return NextResponse.json({
                status: 'fallback',
                active_threads: 0,
                saturation_index: 0.1,
                rate_limits: {
                    remaining_requests: 100
                }
            }, { headers: cacheHeaders });
        }
        const data = await response.json();
        return NextResponse.json(data, { headers: cacheHeaders });
    } catch (error) {
        console.warn('MCP server unreachable for stats, falling back to mock stats');
        return NextResponse.json({
            status: 'fallback',
            active_threads: 0,
            saturation_index: 0.1,
            rate_limits: {
                remaining_requests: 100
            }
        }, { headers: cacheHeaders });
    }
}
