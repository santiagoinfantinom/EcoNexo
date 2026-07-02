import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailToken } from '@/lib/emailVerification';
import { rateLimit } from '@/lib/rateLimiter';

export async function POST(request: NextRequest) {
    try {
        const rl = rateLimit(request, 'email-verify-token', 20, 60000);
        if (!rl.success) {
            return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 });
        }

        const { token } = await request.json();

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Token es requerido' },
                { status: 400 }
            );
        }

        const result = verifyEmailToken(token);

        if (result.success) {
            return NextResponse.json(result);
        } else {
            return NextResponse.json(result, { status: 400 });
        }
    } catch (error) {
        console.error('Token verification error:', error);
        return NextResponse.json(
            { success: false, message: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
