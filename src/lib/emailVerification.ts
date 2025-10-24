import crypto from 'crypto';

// Email verification token storage (in production, use Redis or database)
const verificationTokens = new Map<string, { email: string; expires: number; verified: boolean }>();

export interface EmailVerificationResult {
  success: boolean;
  message: string;
  token?: string;
}

export interface VerifyTokenResult {
  success: boolean;
  message: string;
  email?: string;
}

/**
 * Generate a secure verification token
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Send verification email (server-side only)
 */
export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<EmailVerificationResult> {
  try {
    // For now, we'll use a simple approach without nodemailer
    // In production, you would configure nodemailer here
    
    const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email?token=${token}`;
    
    // Store token with expiration (24 hours)
    verificationTokens.set(token, {
      email,
      expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      verified: false,
    });

    // Log the verification URL for development
    console.log(`Verification email for ${email}: ${verificationUrl}`);

    return {
      success: true,
      message: 'Email de verificación enviado correctamente',
      token,
    };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return {
      success: false,
      message: 'Error al enviar el email de verificación',
    };
  }
}

/**
 * Verify email token
 */
export function verifyEmailToken(token: string): VerifyTokenResult {
  const tokenData = verificationTokens.get(token);
  
  if (!tokenData) {
    return {
      success: false,
      message: 'Token de verificación inválido',
    };
  }
  
  if (tokenData.expires < Date.now()) {
    verificationTokens.delete(token);
    return {
      success: false,
      message: 'Token de verificación expirado',
    };
  }
  
  if (tokenData.verified) {
    return {
      success: false,
      message: 'Email ya verificado anteriormente',
    };
  }
  
  // Mark as verified
  tokenData.verified = true;
  verificationTokens.set(token, tokenData);
  
  return {
    success: true,
    message: 'Email verificado correctamente',
    email: tokenData.email,
  };
}

/**
 * Check if email is verified
 */
export function isEmailVerified(email: string): boolean {
  for (const [token, data] of verificationTokens.entries()) {
    if (data.email === email && data.verified) {
      return true;
    }
  }
  return false;
}

/**
 * Clean expired tokens (call this periodically)
 */
export function cleanExpiredTokens(): void {
  const now = Date.now();
  for (const [token, data] of verificationTokens.entries()) {
    if (data.expires < now) {
      verificationTokens.delete(token);
    }
  }
}
