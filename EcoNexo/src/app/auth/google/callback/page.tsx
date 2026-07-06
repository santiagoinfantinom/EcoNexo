"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { createOAuthService } from '@/lib/oauth';

function GoogleCallbackContent() {
  const router = useRouter();
  const { locale } = useI18n();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      // Implicit flow: Google returns access_token in URL fragment (#access_token=...)
      const hash = window.location.hash.substring(1); // remove leading #
      const params = new URLSearchParams(hash);

      const accessToken = params.get('access_token');
      const error = params.get('error');

      if (error) {
        setStatus('error');
        setMessage(
          (locale === 'en' ? 'Authentication error: ' :
            locale === 'de' ? 'Authentifizierungsfehler: ' :
              'Error de autenticación: ') + error
        );
        return;
      }

      if (!accessToken) {
        // Also check query params (in case Google used query string instead of hash)
        const urlParams = new URLSearchParams(window.location.search);
        const queryError = urlParams.get('error');
        if (queryError) {
          setStatus('error');
          setMessage(
            (locale === 'en' ? 'Authentication error: ' :
              locale === 'de' ? 'Authentifizierungsfehler: ' :
                'Error de autenticación: ') + queryError
          );
          return;
        }

        setStatus('error');
        setMessage(
          locale === 'en' ? 'No access token received. Please sign in from the main page.' :
            locale === 'de' ? 'Kein Zugriffstoken erhalten. Bitte melden Sie sich von der Hauptseite an.' :
              'No se recibió token de acceso. Por favor, inicia sesión desde la página principal.'
        );
        setTimeout(() => router.push('/'), 3000);
        return;
      }

      try {
        // Use OAuthService to handle the token
        const oauthService = await createOAuthService();
        const result = await oauthService.handleGoogleTokenCallback(accessToken);

        if (result.success && result.user) {
          setStatus('success');
          setMessage(
            locale === 'en' ? 'Authentication successful! Redirecting...' :
              locale === 'de' ? 'Authentifizierung erfolgreich! Weiterleitung...' :
                '¡Autenticación exitosa! Redirigiendo...'
          );

          localStorage.setItem('econexo_auth_provider', 'google');
          // Force a full reload so AuthProvider re-initializes from localStorage/Supabase state.
          setTimeout(() => {
            window.location.href = '/perfil';
          }, 1200);
        } else {
          throw new Error(result.error || 'Authentication failed');
        }

      } catch (err: any) {
        console.error('Google callback error:', err);
        setStatus('error');
        setMessage(
          (locale === 'en' ? 'Error processing authentication: ' :
            locale === 'de' ? 'Fehler bei der Authentifizierung: ' :
              'Error al procesar la autenticación: ') + (err.message || '')
        );
      }
    };

    handleCallback();
  }, [router, locale]);

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
            {status === 'loading' && (locale === 'en' ? 'Processing authentication...' : locale === 'de' ? 'Authentifizierung wird verarbeitet...' : 'Procesando autenticación...')}
            {status === 'success' && (locale === 'en' ? 'Authentication successful!' : locale === 'de' ? 'Authentifizierung erfolgreich!' : '¡Autenticación exitosa!')}
            {status === 'error' && (locale === 'en' ? 'Authentication error' : locale === 'de' ? 'Authentifizierungsfehler' : 'Error de autenticación')}
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
              {locale === 'en' ? 'Back to home' : locale === 'de' ? 'Zurück zur Startseite' : 'Volver al inicio'}
            </button>
            <button
              onClick={() => router.push('/auth')}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {locale === 'en' ? 'Try again' : locale === 'de' ? 'Erneut versuchen' : 'Intentar de nuevo'}
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
