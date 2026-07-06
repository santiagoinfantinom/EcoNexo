import { NextRequest, NextResponse } from 'next/server';
import { HealthChecker } from '@/lib/healthCheck';

export async function GET(request: NextRequest) {
  try {
    const checker = HealthChecker.getInstance();
    const status = await checker.performHealthCheck();
    
    return NextResponse.json(status, {
      status: status.status === 'unhealthy' ? 503 : 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: Date.now(),
      checks: {
        build: false,
        api: false,
        database: false,
        auth: false,
        calendar: false,
        jobs: false,
      },
      errors: ['Health check service unavailable']
    }, { status: 503 });
  }
}

export async function HEAD(request: NextRequest) {
  try {
    const checker = HealthChecker.getInstance();
    const status = await checker.performHealthCheck();
    
    return new NextResponse(null, {
      status: status.status === 'unhealthy' ? 503 : 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  }
}
