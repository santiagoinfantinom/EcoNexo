import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    // Get IP from headers (standard for Vercel/proxies)
    const ip = request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown";

    // Handle comma-separated IPs (x-forwarded-for can have multiple)
    const clientIp = ip.split(',')[0].trim();

    return NextResponse.json({
        ip: clientIp,
        timestamp: new Date().toISOString()
    });
}
