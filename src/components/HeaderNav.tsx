"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { useToast } from "./ToastNotification";
import AuthButton from "./AuthButton";
import EcoNexoLogo from "./EcoNexoLogo";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  Menu,
  Map as MapIcon,
  Calendar,
  Briefcase,
  MessageCircle,
  Target,
  Users,
  User,
  Info,
  Heart,
  Newspaper
} from "lucide-react";

import OnboardingTour from "./OnboardingTour";

export default function HeaderNav() {
  const { t, locale } = useI18n();
  const { user, loading } = useAuth();
  const { showToast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const previousUser = useRef(user);

  useEffect(() => {
    if (!loading && user) {
      const welcomed = sessionStorage.getItem('econexo_welcomed');
      if (!welcomed) {
        sessionStorage.setItem('econexo_welcomed', 'true');
        const name = user.profile?.first_name || user.profile?.full_name || '';
        showToast(locale === 'es' ? `¡Bienvenido/a de nuevo, ${name}!` : `Welcome back, ${name}!`, "success");
      }
    }
  }, [user, loading, showToast, locale]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // To avoid hydration mismatch, the initial render on client must match server
  // Rendering a fully consistent layout from the start
  return (
    <>
      <OnboardingTour />
      <header className="bg-[#0b2b26] text-white border-b border-white/10 relative shadow-2xl z-30">
        <div className="max-w-[1600px] mx-auto px-6 py-8 flex flex-col lg:flex-row items-center justify-between gap-10">

          {/* Left: Brand Identity */}
          <div className="flex-shrink-0 flex items-center justify-between w-full md:w-auto">
            <Link href="/" className="flex items-center gap-4 group transition-all">
              <div className="w-[80px] h-[80px] sm:w-[150px] sm:h-[150px] flex items-center justify-center flex-shrink-0">
                <EcoNexoLogo size={140} className="w-full h-full" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-none">
                  EcoNexo
                </h1>
                <div className="flex items-center gap-2 mt-1 sm:mt-2">
                  <div className="h-[2px] w-6 sm:w-12 bg-green-400"></div>
                  <span className="text-[9px] sm:text-sm text-green-300 font-bold tracking-[0.3em] uppercase">
                    Sustainability
                  </span>
                </div>
              </div>
            </Link>
            {/* Top row: User Identity for Mobile */}
            <div className="md:hidden">
              <AuthButton variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-green-500/20 px-4 py-2 rounded-xl text-sm font-bold transition-all" />
            </div>
          </div>

          {/* Right: Actions & Nav Grid */}
          <div className="hidden md:flex flex-col items-center lg:items-end gap-6 w-full lg:w-auto">
            {/* Top row: User Identity Desktop */}
            <div className="flex justify-end w-full px-2">
              <AuthButton variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-green-500/20 px-6 py-2 rounded-xl text-base font-bold transition-all" />
            </div>

            {/* Navigation Grid Desktop */}
            <nav className="flex flex-row-reverse flex-wrap justify-end gap-2 max-w-[900px]">
              {[
                { href: "/", label: t("map"), icon: MapIcon },
                { href: "/noticias", label: t("news") || "Noticias", icon: Newspaper },
                { href: "/calendario", label: t("calendar"), icon: Calendar },
                { href: "/trabajos", label: t("jobs"), icon: Briefcase },
                { href: "/chat", label: t("chat"), icon: MessageCircle },
                { href: "/matching", label: "Matching", icon: Target },
                { href: "/comunidad", label: locale === 'es' ? 'Comunidad' : 'Community', icon: Users },
                { href: "/perfil", label: t("profile"), icon: User },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  id={`nav-${item.href === '/' ? 'map' : item.href.substring(1)}`}
                  className="flex items-center gap-3 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-green-500/20 border border-white/5 transition-all group min-w-[150px]"
                >
                  <item.icon className="w-4 h-4 text-green-400 group-hover:text-green-300" />
                  <span className="font-bold text-xs text-white/80 group-hover:text-white uppercase tracking-wider">{item.label}</span>
                </Link>
              ))}
              <Link
                href="/about"
                id="nav-about"
                className="w-full flex items-center justify-center gap-3 px-6 py-2 rounded-xl bg-white/5 hover:bg-green-500/20 border border-white/5 transition-all group"
              >
                <Info className="w-4 h-4 text-green-300" />
                <span className="font-bold text-[10px] text-white/50 group-hover:text-white uppercase tracking-widest">{t("aboutUs")}</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Floating Support Button - Bottom Left */}
      <Link
        href={process.env.NEXT_PUBLIC_PAYPAL_URL || "#"}
        target="_blank"
        className="fixed bottom-[calc(80px+env(safe-area-inset-bottom))] md:bottom-6 left-4 md:left-6 z-50 group"
        aria-label={t("supportUs")}
      >
        <div className="absolute inset-0 bg-green-500 rounded-full blur opacity-30"></div>
        <div className="relative bg-gradient-to-r from-[#0b2b26] to-[#154a40] text-white font-bold px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-green-400/20">
          <Heart className="w-5 h-5 fill-red-500/20" />
          <span className="hidden sm:inline text-sm">{t("supportUs")}</span>
        </div>
      </Link>
    </>
  );
}
