"use client";
import { useState, useEffect } from "react";
import { Download, X, Share } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function PWAInstallPrompt() {
  const { t, locale } = useI18n();
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); // Default a true para evitar parpadeos
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if we are running in browser (not standalone PWA)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in window.navigator && (window.navigator as any).standalone === true);
    setIsStandalone(isInStandaloneMode);

    // Detectar iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // Si estás en móvil y no en standalone, verificamos si ya cerró el banner antes
    if (!isInStandaloneMode && (isIOSDevice || /android/.test(userAgent))) {
      const bannerDismissed = localStorage.getItem('econexo_pwa_dismissed');
      if (!bannerDismissed) {
        // Retrasamos la aparición un poco para no ser intrusivos nada más entrar
        const timer = setTimeout(() => setShowPrompt(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const dismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('econexo_pwa_dismissed', 'true');
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-[110] animate-fade-in-up">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 flex gap-4 items-start border border-green-500/20">
        <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-xl flex-shrink-0">
          <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        
        <div className="flex-1 pt-1">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
            {locale === 'es' ? 'Instala EcoNexo App' : 'Install EcoNexo App'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
            {isIOS 
              ? (locale === 'es' ? 'Toca el botón Compartir abajo y selecciona "Añadir a pantalla de inicio".' : 'Tap the Share button below and select "Add to Home Screen".')
              : (locale === 'es' ? 'Añade EcoNexo a tu pantalla de inicio para una experiencia más rápida.' : 'Add EcoNexo to your home screen for a faster experience.')
            }
          </p>
          
          {isIOS && (
            <div className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-700 p-2 rounded-lg text-gray-600 dark:text-gray-300">
              <Share className="w-4 h-4" /> 
              <span>{locale === 'es' ? '1. Compartir' : '1. Share'} ➔ </span>
              <span className="font-semibold px-1 py-0.5 border dark:border-slate-500 rounded bg-white dark:bg-slate-600">
                + {locale === 'es' ? 'Añadir a inicio' : 'Add to home'}
              </span>
            </div>
          )}
        </div>
        
        <button 
          onClick={dismissPrompt}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
