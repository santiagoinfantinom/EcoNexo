"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { createOAuthService } from '@/lib/oauth';

function GitHubCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useI18n();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage(`GitHub OAuth error: ${error}`);
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setMessage(
          locale === 'en'
            ? 'Missing GitHub OAuth parameters.'
            : locale === 'de'
              ? 'Fehlende GitHub OAuth-Parameter.'
              : 'Faltan parámetros de GitHub OAuth.'
        );
        return;
      }

      try {
        const oauthService = await createOAuthService();
        const result = await oauthService.handleGithubCallback(code, state);

        if (!result.success || !result.user) {
          throw new Error(result.error || 'GitHub authentication failed.');
        }

        const user = result.user;
        localStorage.setItem('econexo_user', JSON.stringify(user));
        localStorage.setItem('econexo_auth_provider', 'github');
        localStorage.setItem('oauth_data', JSON.stringify({
          name: user.name,
          email: user.email,
          picture: user.picture,
          provider: 'github',
          locale: user.locale || 'en',
          verified_email: user.verified_email ?? true,
        }));
        localStorage.setItem('econexo:profile', JSON.stringify({
          full_name: user.name || '',
          first_name: user.given_name || '',
          last_name: user.family_name || '',
          email: user.email || '',
          avatar_url: user.picture || '/logo-econexo.png',
          preferred_language: user.locale || 'en',
          oauth_provider: 'github',
          oauth_imported: true,
        }));

        setStatus('success');
        setMessage(
          locale === 'en'
            ? 'Authentication successful! Redirecting...'
            : locale === 'de'
              ? 'Authentifizierung erfolgreich! Weiterleitung...'
              : '¡Autenticación exitosa! Redirigiendo...'
        );

        setTimeout(() => {
          window.location.href = '/perfil';
        }, 1200);
      } catch (err: any) {
        setStatus('error');
        setMessage(
          (locale === 'en'
            ? 'Error processing authentication: '
            : locale === 'de'
              ? 'Fehler bei der Authentifizierung: '
              : 'Error al procesar la autenticación: ') + (err.message || '')
        );
      }
    };

    handleCallback();
  }, [searchParams, locale, router]);

  return (
    <div className="min-h-screen bg-gls-primary flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
          {status === 'loading' && <div className="w-8 h-8 border-4 border-slate-600 border-t-transparent rounded-full animate-spin"></div>}
          {status === 'success' && <span className="text-2xl">✅</span>}
          {status === 'error' && <span className="text-2xl">❌</span>}
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {status === 'loading' ? 'GitHub OAuth...' : status === 'success' ? 'GitHub OK' : 'GitHub Error'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
}

export default function GitHubCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gls-primary" />}>
      <GitHubCallbackContent />
    </Suspense>
  );
}
