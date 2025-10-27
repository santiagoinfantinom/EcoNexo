import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail, generateVerificationToken } from '@/lib/emailVerification';
import { verifyCaptchaToken } from '@/lib/captcha';

export async function POST(request: NextRequest) {
  try {
    const { email, captchaToken, locale } = await request.json();

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

    // Generate verification token
    const token = generateVerificationToken();

    // Send verification email with welcome message
    const result = await sendVerificationEmail(email, token, locale || 'en');

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email de bienvenida enviado correctamente. Por favor verifica tu correo.',
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
