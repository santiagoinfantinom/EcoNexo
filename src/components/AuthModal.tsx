"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

import { CaptchaComponent, MathCaptchaComponent } from "@/lib/captcha";
import EcoNexoLogo from "./EcoNexoLogo";
import { Leaf, X, Mail, Globe, LogIn, UserPlus } from "lucide-react";

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

  // Ocultar errores de reCAPTCHA que aparecen en el DOM
  useEffect(() => {
    if (!isOpen) return;

    const hideRecaptchaErrors = () => {
      // Ocultar mensajes de error comunes de reCAPTCHA
      const errorSelectors = [
        '.g-recaptcha-error',
        '.g-recaptcha-error-message',
        'div[class*="recaptcha-error"]',
        'div[class*="recaptcha"][class*="error"]',
        '[data-sitekey] + div[class*="error"]',
        'iframe[src*="recaptcha"] + div',
      ];

      errorSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.display = 'none';
            htmlEl.style.visibility = 'hidden';
            htmlEl.style.opacity = '0';
            htmlEl.style.height = '0';
            htmlEl.style.width = '0';
            htmlEl.style.overflow = 'hidden';
          });
        } catch (e) {
          // Ignorar errores de selector
        }
      });

      // Buscar por texto de error común en todos los elementos
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const htmlEl = el as HTMLElement;
        const text = htmlEl.textContent || '';
        if (text.includes('ERROR for site owner') ||
          text.includes('Invalid site key') ||
          text.includes('Error in security verification') ||
          text.includes('Error en la verificación de seguridad') ||
          text.includes('Fehler bei der Sicherheitsüberprüfung')) {
          htmlEl.style.display = 'none';
          htmlEl.style.visibility = 'hidden';
          htmlEl.style.opacity = '0';
          htmlEl.style.height = '0';
          htmlEl.style.width = '0';
          htmlEl.style.overflow = 'hidden';
        }
      });
    };

    // Ejecutar inmediatamente y luego periódicamente
    hideRecaptchaErrors();
    const interval = setInterval(hideRecaptchaErrors, 50);

    // También usar MutationObserver para detectar nuevos elementos
    const observer = new MutationObserver(hideRecaptchaErrors);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, [isOpen]);

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
        // Don't show generic errors for configuration issues
        const errorMessage = result.message || t("errorSendingEmail");
        // Filter out reCAPTCHA errors and security verification errors if not configured
        const isRecaptchaError = errorMessage.includes("Invalid site key") ||
          errorMessage.includes("site owner") ||
          errorMessage.includes("Error in security verification") ||
          errorMessage.includes("Error en la verificación de seguridad") ||
          errorMessage.includes("Fehler bei der Sicherheitsüberprüfung");
        if (!isRecaptchaError) {
          setError(errorMessage);
        } else {
          // If it's a reCAPTCHA error, just show a generic message
          setError(t("errorSendingEmail"));
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      // Don't show reCAPTCHA-related errors if not configured
      const isRecaptchaError = errorMessage.includes("Invalid site key") ||
        errorMessage.includes("site owner") ||
        errorMessage.includes("Error in security verification") ||
        errorMessage.includes("Error en la verificación de seguridad") ||
        errorMessage.includes("Fehler bei der Sicherheitsüberprüfung");
      if (!isRecaptchaError) {
        setError(t("unexpectedError") + (errorMessage ? `: ${errorMessage}` : ""));
      } else {
        setError(t("unexpectedError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signInWithOAuth("google");

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        // Redirect is handled by Supabase
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(t("unexpectedError") + ": " + errorMessage);
      setIsLoading(false);
    }
  };

  const handleOutlookAuth = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Use 'azure' provider for Microsoft/Outlook
      const result = await signInWithOAuth("azure");

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
      }
      // Redirect is handled by Supabase
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
    } else {
      // Clear any previous errors when verification succeeds
      setError("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-foreground/10 dark:border-white/10">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary via-secondary to-cta px-8 py-10 text-white rounded-t-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl border border-white/20 hover-lift">
                <Leaf size={32} className="text-white" />
              </div>
              <div className="font-sans">
                <h2 className="text-2xl font-bold tracking-tight">
                  {mode === "login" ? t("welcomeBack") : t("joinEcoNexo")}
                </h2>
                <p className="text-white/80 text-xs mt-1 font-mono uppercase tracking-wider">
                  {mode === "login"
                    ? t("signInToContinue")
                    : t("createAccountToStart")
                  }
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 p-2 rounded-full cursor-pointer"
            >
              <X size={24} />
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
            <p className="text-sm text-gray-600 dark:text-white mb-6 text-center font-bold tracking-wide">
              {mode === "login" ? t("orContinueWith") : t("registerWith")}
            </p>

            <div className="space-y-3">
              {/* Google Button */}
              <button
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-background dark:bg-slate-800 border border-foreground/10 dark:border-white/10 rounded-2xl hover:bg-foreground/5 dark:hover:bg-white/5 transition-all duration-300 shadow-sm hover:shadow-xl hover-lift group cursor-pointer"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="font-bold text-foreground dark:text-white md:text-base text-sm font-sans tracking-tight">Google</span>
              </button>

              {/* Outlook Button */}
              <button
                onClick={handleOutlookAuth}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-background dark:bg-slate-800 border border-foreground/10 dark:border-white/10 rounded-2xl hover:bg-foreground/5 dark:hover:bg-white/5 transition-all duration-300 shadow-sm hover:shadow-xl hover-lift group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail className="w-5 h-5 text-[#0078D4] group-hover:scale-110 transition-transform" />
                <span className="font-bold text-foreground dark:text-white md:text-base text-sm font-sans tracking-tight">Microsoft Outlook</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-900 text-gray-500 dark:text-white font-medium">{t("or")}</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-white mb-2">
                {t("email")}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                className="w-full px-4 py-3 border border-foreground/10 dark:border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-foreground/5 dark:bg-slate-800 text-foreground dark:text-white placeholder:text-foreground/40 dark:placeholder:text-white/50 font-bold transition-all"
                required
              />
            </div>

            {/* Captcha for registration */}
            {mode === "register" && (
              <div className="space-y-3">
                {/* Google reCAPTCHA - only show if configured AND not localhost */}
                {(() => {
                  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
                  const isLocalhost = typeof window !== 'undefined' &&
                    (window.location.hostname === 'localhost' ||
                      window.location.hostname === '127.0.0.1');
                  const isConfigured = siteKey &&
                    siteKey !== 'your_recaptcha_site_key_here' &&
                    siteKey !== 'demo-site-key' &&
                    !isLocalhost; // No mostrar reCAPTCHA en localhost

                  if (isConfigured) {
                    return (
                      <>
                        <CaptchaComponent
                          onVerify={handleCaptchaVerify}
                          onError={() => {
                            // Silently handle errors - don't show them to users
                            // Clear any previous errors
                            setError("");
                          }}
                          onExpire={() => {
                            setCaptchaVerified(false);
                            setCaptchaToken("");
                          }}
                          theme={locale === "es" ? "light" : "light"}
                        />
                        {/* Math Captcha as fallback */}
                        <div className="text-center text-sm text-gray-500 dark:text-gray-400">{t("or")}</div>
                      </>
                    );
                  }
                  return null;
                })()}

                {/* Math Captcha - always available */}
                <MathCaptchaComponent
                  onVerify={handleMathCaptchaVerify}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (mode === "register" && !captchaVerified)}
              className="w-full bg-primary text-white py-4 px-4 rounded-xl font-bold hover:shadow-xl transition-all hover-lift cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t("processing")}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  {mode === "login" ? <LogIn size={20} /> : <UserPlus size={20} />}
                  {mode === "login" ? t("signInButton") : t("createAccountButton")}
                </div>
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-300">
              {mode === "login" ? t("bySigningIn") : t("byRegistering")}{" "}
              <a href="/terms" className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                {t("termsOfService")}
              </a>{" "}
              {t("and")}{" "}
              <a href="/privacy" className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                {t("privacyPolicy")}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}