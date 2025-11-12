"use client";
import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { createOAuthService } from "@/lib/oauth";
import { CaptchaComponent, MathCaptchaComponent } from "@/lib/captcha";
import EcoNexoLogo from "./EcoNexoLogo";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const { t, locale } = useI18n();
  const { signInWithMagicLink, signInWithOAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  
  // Check if Supabase is configured
  const isSupabaseReady = isSupabaseConfigured();

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");
    
    try {
      if (mode === "register" && !captchaVerified) {
        setError(t("pleaseCompleteSecurityVerification"));
        setIsLoading(false);
        return;
      }

      // Send verification email with welcome message
      const response = await fetch('/api/email/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          locale,
          captchaToken: captchaToken || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setShowEmailVerification(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 3000);
      } else {
        setError(result.message || t("errorSendingEmail"));
      }
    } catch (err) {
      setError(t("unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    // ALERT INMEDIATO al inicio para confirmar que se ejecuta
    alert('🚀 handleGoogleAuth INICIADO\n\nRevisa la consola para ver los logs.\n\nHaz clic en OK para continuar...');
    
    console.log('🚀 handleGoogleAuth llamado');
    console.log('📍 window.location:', typeof window !== 'undefined' ? window.location.href : 'SERVER');
    console.log('📍 window.location.origin:', typeof window !== 'undefined' ? window.location.origin : 'SERVER');
    
    setIsLoading(true);
    setError("");
    
    try {
      // Check if Google Client ID is configured
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      console.log('📍 process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID:', clientId);
      
      if (!clientId || clientId === 'demo-client-id' || clientId === 'your_google_client_id_here') {
        setError(t("errorStartingGoogleAuth") + " - Google Client ID no configurado");
        setIsLoading(false);
        console.error('❌ Google Client ID no configurado:', clientId);
        return;
      }

      console.log('🔐 Iniciando autenticación con Google...');
      console.log('📍 Client ID:', clientId);
      console.log('📍 Creando OAuth Service...');
      
      const oauthService = await createOAuthService();
      console.log('📍 OAuth Service creado, llamando authenticateWithGoogle...');
      
      const result = await oauthService.authenticateWithGoogle();
      console.log('📍 Resultado de authenticateWithGoogle:', result);
      
      if (!result.success) {
        setError(result.error || t("errorStartingGoogleAuth"));
        setIsLoading(false);
        console.error('❌ Error en autenticación:', result.error);
      } else {
        console.log('✅ Redirección iniciada a Google OAuth');
        // If successful, user will be redirected to Google OAuth
        // Don't set loading to false, let the redirect happen
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(t("unexpectedError") + ": " + errorMessage);
      setIsLoading(false);
      console.error('❌ Error inesperado:', err);
    }
  };

  const handleOutlookAuth = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const oauthService = await createOAuthService();
      const result = await oauthService.authenticateWithOutlook();
      
      if (!result.success) {
        setError(result.error || t("errorStartingOutlookAuth"));
        setIsLoading(false);
      }
      // If successful, user will be redirected to Outlook OAuth
    } catch (err) {
      setError(t("unexpectedError"));
      setIsLoading(false);
    }
  };

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    setCaptchaVerified(true);
  };

  const handleMathCaptchaVerify = (isValid: boolean) => {
    setCaptchaVerified(isValid);
    if (!isValid) {
      setError(t("securityVerificationIncorrect"));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 px-8 py-8 text-white rounded-t-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🌿</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {mode === "login" ? t("welcomeBack") : t("joinEcoNexo")}
                </h2>
                <p className="text-green-100 text-sm mt-1">
                  {mode === "login" 
                    ? t("signInToContinue") 
                    : t("createAccountToStart")
                  }
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 p-2 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <div className="flex items-center gap-3 text-green-800 dark:text-green-200">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-200 text-sm">✓</span>
                </div>
                <span className="text-sm font-medium">
                  {showEmailVerification 
                    ? t("welcomeEmailSent")
                    : t("authenticationSuccessful")
                  }
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex items-center gap-3 text-red-800 dark:text-red-200">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                  <span className="text-red-600 dark:text-red-200 text-sm">✕</span>
                </div>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="mb-8">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center font-medium">
              {mode === "login" ? t("orContinueWith") : t("registerWith")}
            </p>
            
            <div className="space-y-3">
              {/* Google Button */}
              <button
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium text-gray-700 dark:text-gray-200">Google</span>
              </button>

              {/* Outlook Button - Disabled */}
              {/* <button
                onClick={handleOutlookAuth}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0078D4">
                  <path d="M7.462 8.85h9.076c.398 0 .724-.326.724-.724V4.724c0-.398-.326-.724-.724-.724H7.462c-.398 0-.724.326-.724.724v3.402c0 .398.326.724.724.724zM7.462 15.15h9.076c.398 0 .724-.326.724-.724v-3.402c0-.398-.326-.724-.724-.724H7.462c-.398 0-.724.326-.724.724v3.402c0 .398.326.724.724.724zM2.462 8.85h4.076c.398 0 .724-.326.724-.724V4.724c0-.398-.326-.724-.724-.724H2.462c-.398 0-.724.326-.724.724v3.402c0 .398.326.724.724.724zM2.462 15.15h4.076c.398 0 .724-.326.724-.724v-3.402c0-.398-.326-.724-.724-.724H2.462c-.398 0-.724.326-.724.724v3.402c0 .398.326.724.724.724z"/>
                </svg>
                <span className="font-medium text-gray-700 dark:text-gray-200">Microsoft Outlook</span>
              </button> */}
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-800 text-gray-500">{t("or")}</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("email")}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white"
                required
              />
            </div>

            {/* Captcha for registration */}
            {mode === "register" && (
              <div className="space-y-3">
                {/* Google reCAPTCHA */}
                <CaptchaComponent
                  onVerify={handleCaptchaVerify}
                  onError={() => setError(t("errorInSecurityVerification"))}
                  onExpire={() => {
                    setCaptchaVerified(false);
                    setCaptchaToken("");
                  }}
                  theme={locale === "es" ? "light" : "light"}
                />
                
                {/* Math Captcha as fallback */}
                <div className="text-center text-sm text-gray-500">{t("or")}</div>
                <MathCaptchaComponent
                  onVerify={handleMathCaptchaVerify}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (mode === "register" && !captchaVerified)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t("processing")}
                </div>
              ) : (
                mode === "login" ? t("signInButton") : t("createAccountButton")
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {mode === "login" ? t("bySigningIn") : t("byRegistering")}{" "}
              <a href="/terms" className="text-green-600 hover:text-green-700">
                {t("termsOfService")}
              </a>{" "}
              {t("and")}{" "}
              <a href="/privacy" className="text-green-600 hover:text-green-700">
                {t("privacyPolicy")}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}