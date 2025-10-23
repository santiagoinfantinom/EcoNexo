"use client";
import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
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
  
  // Check if Supabase is configured
  const isSupabaseReady = isSupabaseConfigured();

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");
    
    try {
      const { error } = await signInWithMagicLink(email);
      if (error) {
        setError(error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 3000);
      }
    } catch (err) {
      setError("Error inesperado. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthAuth = async (provider: "google" | "github" | "azure") => {
    setIsLoading(true);
    setError("");
    
    try {
      const { error } = await signInWithOAuth(provider);
      if (error) {
        if (error === "Supabase not configured") {
          setError("🔧 Configuración de autenticación en progreso. Por favor, usa el login por email temporalmente.");
        } else if (error.includes("redirect_uri_mismatch")) {
          setError("🔧 Error de configuración OAuth. Contacta al administrador.");
        } else {
          setError(`Error de autenticación: ${error}`);
        }
      }
    } catch (err) {
      setError("Error inesperado. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Redirect directly to Gmail login page
      window.location.href = "https://mail.google.com";
    } catch (err) {
      setError("Error inesperado. Intenta de nuevo.");
      setIsLoading(false);
    }
  };

  const handleOutlookAuth = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Redirect directly to Outlook login page
      window.location.href = "https://outlook.live.com";
    } catch (err) {
      setError("Error inesperado. Intenta de nuevo.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-6 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <EcoNexoLogo className="w-8 h-8" size={32} />
              <div>
                <h2 className="text-xl font-bold">
                  {mode === "login" ? t("welcomeBack") : t("joinEcoNexo")}
                </h2>
                <p className="text-green-100 text-sm">
                  {mode === "login" 
                    ? t("signInToContinue") 
                    : t("createAccountToStart")
                  }
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-green-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>
                  {mode === "login" 
                    ? t("checkEmailForLogin") 
                    : t("checkEmailForVerification")
                  }
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <div>
                  <div className="font-semibold">Configuración requerida</div>
                  <div className="text-sm mt-1">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Email Authentication */}
          <form onSubmit={handleEmailAuth} className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t("email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:opacity-50"
                placeholder={t("enterEmail")}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t("sending") : 
                mode === "login" ? t("sendLoginLink") : t("sendVerificationLink")
              }
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-800 text-gray-500">
                {t("orContinueWith")}
              </span>
            </div>
          </div>

          {/* OAuth Providers */}
          <div className="space-y-3">
            <div className="text-center text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              🔗 <strong>Redirección Directa:</strong> Te lleva directamente a Gmail y Outlook para iniciar sesión
            </div>
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg border border-gray-300 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t("continueWithGoogle")}
            </button>

            <button
              onClick={() => handleOAuthAuth("github")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              {t("continueWithGitHub")}
            </button>

            <button
              onClick={handleOutlookAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 12L11 2L13.5 4.5L6.5 11.5H23L13 21.5L10.5 19L17.5 12H1Z"/>
              </svg>
              {t("continueWithMicrosoft")}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {mode === "login" ? (
              <>
                {t("dontHaveAccount")}{" "}
                <button
                  onClick={() => window.location.reload()}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  {t("signUp")}
                </button>
              </>
            ) : (
              <>
                {t("alreadyHaveAccount")}{" "}
                <button
                  onClick={() => window.location.reload()}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  {t("signIn")}
                </button>
              </>
            )}
          </div>

          {/* Help Section */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                ¿Problemas con la autenticación?
              </p>
              <button
                onClick={() => {
                  const helpText = `
🔧 CONFIGURACIÓN DE SUPABASE REQUERIDA

Para usar la autenticación OAuth (Google/Microsoft), necesitas configurar Supabase:

1. Ve a https://supabase.com y crea un proyecto
2. Obtén tu URL y clave anónima
3. Crea un archivo .env.local con:
   NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_aqui

📋 Instrucciones completas en: SUPABASE_SETUP_INSTRUCTIONS.md

🚀 Alternativa: Usa el modo demo (datos en localStorage)
                  `;
                  alert(helpText);
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Ver instrucciones de configuración
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
