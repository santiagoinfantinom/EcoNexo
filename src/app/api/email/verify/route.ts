import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/emailVerification';
import { verifyCaptchaToken } from '@/lib/captcha';

export async function POST(request: NextRequest) {
  try {
    const { email, captchaToken } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Verify captcha if provided
    if (captchaToken) {
      const isCaptchaValid = await verifyCaptchaToken(captchaToken);
      if (!isCaptchaValid) {
        return NextResponse.json(
          { success: false, message: 'Captcha inválido' },
          { status: 400 }
        );
      }
    }

    // Send verification email
    const result = await sendVerificationEmail(email, 'temp-token');

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email de verificación enviado correctamente',
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
