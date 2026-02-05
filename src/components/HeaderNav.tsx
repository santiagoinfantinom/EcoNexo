"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";
import AuthButton from "./AuthButton";
import EcoNexoLogo from "./EcoNexoLogo";
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
  Heart
} from "lucide-react";

import OnboardingTour from "./OnboardingTour";

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
      <OnboardingTour />
      <header className="bg-gls-primary text-white stitch-border-b relative shadow-2xl z-30">
        <div className="w-full px-4 sm:px-8 lg:px-12 py-6 flex flex-col items-center justify-between gap-8">

          {/* Top: Logo & Title Cluster - Large & Prominent */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 group transition-all hover:scale-[1.02]">
              <EcoNexoLogo size={120} className="sm:w-[140px] sm:h-[140px] lg:w-[100px] lg:h-[100px]" />
              <div className="flex flex-col lg:flex-row lg:items-baseline gap-2 lg:gap-6 text-center lg:text-left">
                <h1 className="text-6xl sm:text-7xl lg:text-8xl text-white font-black tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-none">
                  EcoNexo
                </h1>
                <span className="text-lg lg:text-2xl text-green-300 font-black tracking-[0.15em] uppercase drop-shadow-md whitespace-nowrap">
                  Sustainability Network
                </span>
              </div>
            </Link>
          </div>

          {/* Bottom Section: Nav + Auth */}
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 w-full">

            {/* Auth Button - Placed before Nav (Between Logo and Map) on Desktop */}
            <div className="order-2 lg:order-1 flex-shrink-0">
              <AuthButton
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-6 py-2 rounded-xl font-bold transition-all hover:border-green-400/50"
              />
            </div>

            {/* Main Navigation */}
            <nav className="order-1 lg:order-2 hidden xl:flex items-center justify-center gap-1">
              {[
                { href: "/", label: t("map"), icon: MapIcon },
                { href: "/calendario", label: t("calendar"), icon: Calendar },
                { href: "/trabajos", label: t("jobs"), icon: Briefcase },
                { href: "/chat", label: t("chat"), icon: MessageCircle },
                { href: "/matching", label: "Matching", icon: Target },
                { href: "/comunidad", label: locale === 'es' ? 'Comunidad' : 'Community', icon: Users },
                { href: "/perfil", label: t("profile"), icon: User },
                { href: "/about", label: t("aboutUs"), icon: Info },
              ].map((item) => (
                <Link
                  key={item.href}
                  id={`nav-${item.href.replace(/^\//, "") || "map"}`}
                  href={item.href}
                  className="flex flex-col items-center gap-2 px-6 py-3 rounded-2xl hover:bg-white/10 transition-all group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-green-400/0 group-hover:bg-green-400/5 transition-colors"></div>
                  <item.icon className="w-8 h-8 text-green-400 group-hover:text-green-300 group-hover:scale-110 transition-all duration-300" />
                  <span className="font-extrabold text-sm tracking-wide text-white/90 group-hover:text-white transition-colors">{item.label}</span>
                  <div className="w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></div>
                </Link>
              ))}
            </nav>

            {/* Medium screen Nav (md-xl) */}
            <nav className="order-1 lg:order-2 hidden md:flex xl:hidden flex-wrap justify-center gap-3">
              {[
                { href: "/", label: t("map"), icon: MapIcon },
                { href: "/calendario", label: t("calendar"), icon: Calendar },
                { href: "/trabajos", label: t("jobs"), icon: Briefcase },
                { href: "/chat", label: t("chat"), icon: MessageCircle },
                { href: "/matching", label: "Matching", icon: Target },
                { href: "/comunidad", label: locale === 'es' ? 'Comunidad' : 'Community', icon: Users },
                { href: "/perfil", label: t("profile"), icon: User },
                { href: "/about", label: t("aboutUs"), icon: Info },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                >
                  <item.icon className="w-5 h-5 text-green-400 group-hover:text-green-300" />
                  <span className="font-bold text-xs text-white/90">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="order-1 md:hidden w-full flex justify-end">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-3xl text-white transition-all shadow-2xl backdrop-blur-md border border-white/20 group"
              >
                <Menu className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
                <span className="font-extrabold text-xl tracking-tight">{t("menu") || "Menú"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 mx-4 bg-slate-900/98 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl z-50 p-6 animate-in slide-in-from-top-4 fade-in duration-300">
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: "/", label: t("map"), icon: MapIcon },
                { href: "/calendario", label: t("calendar"), icon: Calendar },
                { href: "/trabajos", label: t("jobs"), icon: Briefcase },
                { href: "/chat", label: t("chat"), icon: MessageCircle },
                { href: "/matching", label: "Matching", icon: Target },
                { href: "/comunidad", label: locale === 'es' ? 'Comunidad' : 'Community', icon: Users },
                { href: "/perfil", label: t("profile"), icon: User },
                { href: "/about", label: t("aboutUs"), icon: Info },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-6 py-4 text-white font-bold text-lg hover:bg-white/10 rounded-2xl transition-all flex items-center gap-4 group"
                >
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-green-400/20 transition-colors">
                    <item.icon className="w-6 h-6 text-green-400 transition-transform group-hover:scale-110" />
                  </div>
                  {item.label}
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
          <Heart className="w-6 h-6 animate-pulse fill-white/20" />
          <span className="hidden sm:inline shadow-black drop-shadow-md">{t("supportUs")}</span>
        </div>
      </Link>
    </>
  );
}
