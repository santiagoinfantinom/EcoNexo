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

// Register token in memory (server or client call)
export function registerVerificationToken(token: string, email: string) {
  verificationTokens.set(token, {
    email,
    expires: Date.now() + 24 * 60 * 60 * 1000,
    verified: false,
  });
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
