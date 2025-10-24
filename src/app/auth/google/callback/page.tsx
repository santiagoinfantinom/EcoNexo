"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createOAuthService } from '@/lib/oauth';
import { verifyCaptchaToken } from '@/lib/captcha';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage('Error de autenticación: ' + error);
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setMessage('Parámetros de autenticación faltantes');
        return;
      }

      try {
        const oauthService = createOAuthService();
        const result = await oauthService.handleGoogleCallback(code, state);

        if (result.success && result.user) {
          // Store user data in localStorage
          localStorage.setItem('econexo_user', JSON.stringify(result.user));
          localStorage.setItem('econexo_auth_provider', 'google');
          
          setStatus('success');
          setMessage('¡Autenticación exitosa! Redirigiendo...');
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push('/perfil');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(result.error || 'Error de autenticación');
        }
      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
        setMessage('Error interno del servidor');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gls-primary flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            {status === 'loading' && (
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            )}
            {status === 'success' && (
              <span className="text-2xl">✅</span>
            )}
            {status === 'error' && (
              <span className="text-2xl">❌</span>
            )}
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {status === 'loading' && 'Procesando autenticación...'}
            {status === 'success' && '¡Autenticación exitosa!'}
            {status === 'error' && 'Error de autenticación'}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300">
            {message}
          </p>
        </div>

        {status === 'error' && (
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Volver al inicio
            </button>
            <button
              onClick={() => router.push('/auth')}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Intentar de nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gls-primary flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Cargando...
          </h2>
        </div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}
