"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";
import AuthButton from "./AuthButton";
import EcoNexoLogo from "./EcoNexoLogo";

export default function HeaderNav() {
  const { t, locale } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // To avoid hydration mismatch, the initial render on client must match server
  // Rendering a fully consistent layout from the start
  return (
    <>
      <header className="bg-gls-primary text-gls-primary px-4 sm:px-6 lg:px-8 py-4 sm:py-5 relative shadow-lg z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Left: User Info / Auth */}
          <div className="flex-1 flex items-center justify-start">
            <AuthButton variant="outline" size="sm" />
          </div>

          {/* Center: Brand Logo & Title */}
          <div className="flex-[2] flex items-center justify-center">
            <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
              <EcoNexoLogo size={40} className="sm:w-14 sm:h-14" />
              <span className="text-xl sm:text-2xl lg:text-3xl text-white font-black tracking-tight drop-shadow-md">
                {t("app")}
              </span>
            </Link>
          </div>

          {/* Right: Menu Button */}
          <div className="flex-1 flex items-center justify-end">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all shadow-sm backdrop-blur-sm border border-white/10"
            >
              <span className="text-lg">☰</span>
              <span className="hidden sm:inline font-medium">{t("menu") || "Menú"}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 mx-4 sm:mx-8 bg-slate-900/95 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-50 p-4">
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { href: "/", label: t("map"), icon: "🗺️" },
                { href: "/calendario", label: t("calendar"), icon: "📅" },
                { href: "/trabajos", label: t("jobs"), icon: "💼" },
                { href: "/chat", label: t("chat"), icon: "💬" },
                { href: "/matching", label: "Matching", icon: "🎯" },
                { href: "/comunidad", label: locale === 'es' ? 'Comunidad' : 'Community', icon: "👥" },
                { href: "/perfil", label: t("profile"), icon: "👤" },
                { href: "/about", label: t("aboutUs"), icon: "ℹ️" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-white font-medium hover:bg-white/10 rounded-xl transition-colors flex items-center gap-3"
                >
                  <span className="text-xl">{item.icon}</span> {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Floating Support Button - Bottom Left */}
      <Link
        href={process.env.NEXT_PUBLIC_PAYPAL_URL || "#"}
        target="_blank"
        className="fixed bottom-6 left-6 z-50 group"
        aria-label={t("supportUs")}
      >
        <div className="absolute inset-0 bg-green-500 rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity duration-300 animate-pulse"></div>
        <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all duration-300 border border-green-400/30">
          <span className="text-2xl animate-bounce-slow">💚</span>
          <span className="hidden sm:inline shadow-black drop-shadow-md">{t("supportUs")}</span>
        </div>
      </Link>
    </>
  );
}
