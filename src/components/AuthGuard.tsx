"use client";
import { ReactNode } from 'react';
import { useRequireAuth } from '@/lib/useAuthGuard';
import AuthButton from '@/components/AuthButton';
import { useI18n } from '@/lib/i18n';
import EcoNexoLogo from '@/components/EcoNexoLogo';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  fallback,
  redirectTo = '/' 
}: AuthGuardProps) {
  const { isAuthorized, isLoading } = useRequireAuth(redirectTo);
  const { t } = useI18n();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <EcoNexoLogo className="w-16 h-16 mx-auto mb-4" size={64} />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t("authenticationRequired")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t("signInToAccessThisPage")}
              </p>
            </div>
            
            <div className="space-y-4">
              <AuthButton size="lg" />
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>{t("whySignIn")}</p>
                <ul className="mt-2 text-left space-y-1">
                  <li>• {t("personalizedExperience")}</li>
                  <li>• {t("savePreferences")}</li>
                  <li>• {t("trackProgress")}</li>
                  <li>• {t("connectWithCommunity")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
