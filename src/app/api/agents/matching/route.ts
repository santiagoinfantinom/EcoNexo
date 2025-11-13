import { NextRequest, NextResponse } from 'next/server';

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:8001';

interface MatchRequest {
  user_id: string;
  query: string;
  context?: Record<string, any>;
}

interface MatchResponse {
  matches: Array<{
    id: string;
    name: string;
    name_en?: string;
    name_de?: string;
    description?: string;
    description_en?: string;
    description_de?: string;
    category: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
    spots?: number;
    image_url?: string;
    info_url?: string;
    startsAt?: string;
    endsAt?: string;
    isPermanent?: boolean;
  }>;
  explanations: Record<string, string>;
  suggestions: string[];
  score_summary: Record<string, number>;
}

export async function POST(req: NextRequest) {
  try {
    const body: MatchRequest = await req.json();
    
    if (!body.user_id || !body.query) {
      return NextResponse.json(
        { error: 'user_id and query are required' },
        { status: 400 }
      );
    }

    // Call MCP server
    const response = await fetch(`${MCP_SERVER_URL}/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: body.user_id,
        query: body.query,
        context: body.context || {},
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('MCP server error:', error);
      return NextResponse.json(
        { error: 'Matching service unavailable', details: error },
        { status: response.status }
      );
    }

    const data: MatchResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in matching API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET() {
  try {
    const response = await fetch(`${MCP_SERVER_URL}/health`);
    if (!response.ok) {
      return NextResponse.json(
        { status: 'unhealthy', mcp_server: 'down' },
        { status: 503 }
      );
    }
    const data = await response.json();
    return NextResponse.json({ status: 'healthy', ...data });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', mcp_server: 'unreachable' },
      { status: 503 }
    );
  }
}

