import { NextRequest, NextResponse } from 'next/server';
import { generateVerificationToken, registerVerificationToken } from '@/lib/emailVerification';
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

    // Generate and register verification token (in-memory demo store)
    const token = generateVerificationToken();
    registerVerificationToken(token, email);

    // Try to send email on the server (dynamic import to avoid client bundling)
    try {
      const hasSmtp = !!(process.env.SMTP_USER && process.env.SMTP_PASS);
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const verificationUrl = `${baseUrl}/verify-email?token=${token}`;
      if (hasSmtp) {
        const nodemailer = (await import('nodemailer')).default;
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });
        await transporter.sendMail({
          from: process.env.NEXT_PUBLIC_EMAIL_FROM || 'noreply@econexo.app',
          to: email,
          subject: 'EcoNexo - Verifica tu cuenta',
          html: `<p>Bienvenido a EcoNexo 🌿</p><p>Verifica tu cuenta: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
        });
      } else {
        console.log('📧 SMTP no configurado. URL de verificación:', verificationUrl);
      }
    } catch (e) {
      console.warn('Fallo al enviar email (continuamos):', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Email de bienvenida procesado. Revisa tu correo o usa el enlace de verificación.',
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
