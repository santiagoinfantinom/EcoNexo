"use client";
import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

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
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    console.warn('reCAPTCHA site key not configured');
    return (
      <div className={`p-4 border border-yellow-300 bg-yellow-50 rounded-lg ${className}`}>
        <p className="text-yellow-800 text-sm">
          ⚠️ reCAPTCHA no configurado. Contacta al administrador.
        </p>
      </div>
    );
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <ReCAPTCHA
        sitekey={siteKey}
        onChange={onVerify}
        onErrored={onError}
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
export function generateMathCaptcha(): { question: string; answer: number } {
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
  
  return {
    question: `¿Cuánto es ${num1} ${operation} ${num2}?`,
    answer,
  };
}

export interface MathCaptchaProps {
  onVerify: (isValid: boolean) => void;
  className?: string;
}

export function MathCaptchaComponent({ onVerify, className = '' }: MathCaptchaProps) {
  const [captcha, setCaptcha] = useState(() => generateMathCaptcha());
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = parseInt(userAnswer) === captcha.answer;
    setIsVerified(isValid);
    onVerify(isValid);
    
    if (!isValid) {
      // Generate new captcha on wrong answer
      setCaptcha(generateMathCaptcha());
      setUserAnswer('');
    }
  };

  if (isVerified) {
    return (
      <div className={`p-3 bg-green-50 border border-green-200 rounded-lg ${className}`}>
        <div className="flex items-center gap-2 text-green-800">
          <span>✅</span>
          <span className="text-sm font-medium">Verificación completada</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-gray-50 border border-gray-200 rounded-lg ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="text-sm text-gray-700">
          <p className="font-medium mb-2">Verificación de seguridad:</p>
          <p className="text-lg font-mono bg-white p-2 rounded border">
            {captcha.question}
          </p>
        </div>
        
        <div className="flex gap-2">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Tu respuesta"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Verificar
          </button>
        </div>
      </form>
    </div>
  );
}
