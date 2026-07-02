import { NextRequest, NextResponse } from 'next/server';
import { verifyCaptchaToken } from '@/lib/captcha';
import { rateLimit } from '@/lib/rateLimiter';

export async function POST(request: NextRequest) {
  try {
    const rl = rateLimit(request, 'captcha-verify', 15, 60000);
    if (!rl.success) {
      return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 });
    }

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token de captcha es requerido' },
        { status: 400 }
      );
    }

    const isValid = await verifyCaptchaToken(token);

    return NextResponse.json({
      success: isValid,
      message: isValid ? 'Captcha válido' : 'Captcha inválido',
    });
  } catch (error) {
    console.error('Captcha verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
