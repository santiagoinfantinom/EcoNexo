"use client";
import React, { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useI18n } from '@/lib/i18n';

export interface CaptchaProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark';
  size?: 'compact' | 'normal' | 'invisible';
  className?: string;
}

export function CaptchaComponent({
  onVerify,
  onError,
  onExpire,
  theme = 'light',
  size = 'normal',
  className = '',
}: CaptchaProps) {
  const { t } = useI18n();
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  
  // Check if we're on localhost
  const isLocalhost = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1');

  // Don't show reCAPTCHA if site key is not configured, is a placeholder, or we're on localhost
  if (!siteKey || 
      siteKey === 'your_recaptcha_site_key_here' || 
      siteKey === 'demo-site-key' ||
      isLocalhost) {
    // Return null instead of showing an error - let Math Captcha handle it
    return null;
  }

  // Ocultar errores de reCAPTCHA que aparecen directamente del widget
  useEffect(() => {
    const hideRecaptchaErrors = () => {
      // Ocultar mensajes de error comunes de reCAPTCHA
      const errorSelectors = [
        '.g-recaptcha-error',
        '.g-recaptcha-error-message',
        'div[class*="recaptcha-error"]',
        'div[class*="recaptcha"][class*="error"]',
        '[data-sitekey] + div[class*="error"]',
      ];
      
      errorSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          (el as HTMLElement).style.display = 'none';
        });
      });
      
      // También buscar por texto de error común
      const allDivs = document.querySelectorAll('div');
      allDivs.forEach(div => {
        const text = div.textContent || '';
        if (text.includes('ERROR for site owner') || 
            text.includes('Invalid site key') ||
            text.includes('Error in security verification')) {
          div.style.display = 'none';
        }
      });
    };
    
    // Ejecutar inmediatamente y luego periódicamente
    hideRecaptchaErrors();
    const interval = setInterval(hideRecaptchaErrors, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex justify-center ${className}`} style={{ position: 'relative' }}>
      <ReCAPTCHA
        sitekey={siteKey}
        onChange={onVerify}
        onErrored={(error) => {
          // Silently handle errors - don't show them to users
          // The component should not render if site key is invalid anyway
          console.warn('reCAPTCHA error (silent):', error);
          // Don't call onError to prevent error messages from showing
        }}
        onExpired={onExpire}
        theme={theme}
        size={size}
      />
    </div>
  );
}

/**
 * Verify reCAPTCHA token on server side
 */
export async function verifyCaptchaToken(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    console.warn('reCAPTCHA secret key not configured');
    return true; // Allow in development
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return false;
  }
}

/**
 * Simple math captcha as fallback
 */
export function generateMathCaptcha(locale: string = 'en'): { question: string; answer: number } {
  const operations = ['+', '-', '*'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let num1: number, num2: number, answer: number;
  
  switch (operation) {
    case '+':
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
      answer = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * 50) + 25;
      num2 = Math.floor(Math.random() * 25) + 1;
      answer = num1 - num2;
      break;
    case '*':
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = num1 * num2;
      break;
    default:
      num1 = 1;
      num2 = 1;
      answer = 2;
  }
  
  const howMuchIs = locale === 'de' ? 'Wie viel ist' : locale === 'es' ? '¿Cuánto es' : 'How much is';
  
  return {
    question: `${howMuchIs} ${num1} ${operation} ${num2}?`,
    answer,
  };
}

export interface MathCaptchaProps {
  onVerify: (isValid: boolean) => void;
  className?: string;
}

export function MathCaptchaComponent({ onVerify, className = '' }: MathCaptchaProps) {
  const { t, locale } = useI18n();
  const [captcha, setCaptcha] = useState(() => generateMathCaptcha(locale));
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = parseInt(userAnswer) === captcha.answer;
    setIsVerified(isValid);
    onVerify(isValid);
    
    if (!isValid) {
      // Generate new captcha on wrong answer
      setCaptcha(generateMathCaptcha(locale));
      setUserAnswer('');
    }
  };

  if (isVerified) {
    return (
      <div className={`p-3 bg-green-50 border border-green-200 rounded-lg ${className}`}>
        <div className="flex items-center gap-2 text-green-800">
          <span>✅</span>
          <span className="text-sm font-medium">{t("verificationCompleted")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-gray-50 border border-gray-200 rounded-lg ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="text-sm text-gray-700">
          <p className="font-medium mb-2">{t("securityVerification")}</p>
          <p className="text-lg font-mono bg-white p-2 rounded border">
            {captcha.question}
          </p>
        </div>
        
        <div className="flex gap-2">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder={t("yourAnswer")}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {t("verify")}
          </button>
        </div>
      </form>
    </div>
  );
}
