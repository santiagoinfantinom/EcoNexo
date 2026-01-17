"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createOAuthService } from '@/lib/oauth';
import { useI18n } from '@/lib/i18n';

export default function OutlookCallbackPage() {
  const router = useRouter();
  const { locale } = useI18n();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const oauthService = await createOAuthService();
        const result = await oauthService.handleOutlookRedirect();

        if (result.success && result.user) {
          // Store user data in localStorage
          const user = result.user;

          localStorage.setItem('econexo_user', JSON.stringify(user));
          localStorage.setItem('econexo_auth_provider', 'outlook');

          // Store OAuth data
          localStorage.setItem('oauth_data', JSON.stringify({
            name: user.name,
            email: user.email,
            picture: user.picture,
            provider: 'outlook',
            locale: user.locale || 'en',
            verified_email: true,
          }));

          // Parse name into first and last name for Outlook
          let firstName = '';
          let lastName = '';
          if (user.name) {
            const nameParts = user.name.trim().split(' ');
            if (nameParts.length > 0) {
              firstName = nameParts[0];
              lastName = nameParts.slice(1).join(' ');
            }
          }

          // Store profile data with all available fields
          localStorage.setItem('econexo:profile', JSON.stringify({
            full_name: user.name || '',
            first_name: firstName,
            last_name: lastName,
            email: user.email,
            avatar_url: user.picture || '/logo-econexo.svg',
            preferred_language: user.locale || 'en',
            oauth_provider: 'outlook',
            oauth_imported: true,
          }));

          setStatus('success');
          setMessage(
            locale === 'en' ? 'Authentication successful! Redirecting...' :
              locale === 'de' ? 'Authentifizierung erfolgreich! Weiterleitung...' :
                '¡Autenticación exitosa! Redirigiendo...'
          );

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push('/perfil');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(result.error || (
            locale === 'en' ? 'Authentication error' :
              locale === 'de' ? 'Authentifizierungsfehler' :
                'Error de autenticación'
          ));

          // Automatically redirect to home after 3 seconds
          setTimeout(() => {
            router.push('/');
          }, 3000);
        }
      } catch (error) {
        console.error('Redirect error:', error);
        setStatus('error');
        setMessage(
          locale === 'en' ? 'Internal server error' :
            locale === 'de' ? 'Interner Serverfehler' :
              'Error interno del servidor'
        );
      }
    };

    handleRedirect();
  }, [router]);

  return (
    <div className="min-h-screen bg-gls-primary flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
            {status === 'loading' && (
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
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
