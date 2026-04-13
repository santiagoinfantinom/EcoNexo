"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import AuthModal from "./AuthModal";

interface AuthButtonProps {
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  showUserMenu?: boolean;
}

export default function AuthButton({
  className = "",
  variant = "primary",
  size = "md",
  showUserMenu = true
}: AuthButtonProps) {
  const { t, locale } = useI18n();
  const { user, signOut, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${size === "sm" ? "h-8 w-20" : size === "lg" ? "h-12 w-32" : "h-10 w-24"}`}></div>
    );
  }

  const getButtonClasses = () => {
    const baseClasses = "font-medium transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2";

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base"
    };

    const variantClasses = {
      primary: className.includes('bg-') ? "" : "bg-green-600 hover:bg-green-700 text-white",
      secondary: className.includes('bg-') ? "" : "bg-gray-600 hover:bg-gray-700 text-white",
      outline: className.includes('border-') ? "" : "border border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20"
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} rounded-lg`;
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserDropdown(false);
  };

  if (user) {
    const displayName =
      user.profile?.full_name ||
      user.profile?.first_name ||
      user.email?.split('@')[0] ||
      t("myAccount");
    const avatarUrl = user.profile?.avatar_url;
    const signOutLabel = locale === "es" ? "Salir" : locale === "de" ? "Abmelden" : "Sign out";

    return (
      <div className="flex items-center gap-2">
        <Link
          href="/perfil"
          className={`${getButtonClasses()} flex items-center gap-2`}
          title={t("myProfile")}
        >
          <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-green-600 dark:text-green-400 text-xs font-bold uppercase">
                {displayName.charAt(0) || "U"}
              </span>
            )}
          </div>
          <span className="hidden sm:inline whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
            {displayName}
          </span>
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg border border-white/20 text-white/90 hover:bg-white/10 transition-colors"
          title={signOutLabel}
        >
          {signOutLabel}
        </button>
      </div>
    );
  }

  // Special styling for header buttons (outline + sm) to match Support Us button exactly
  const isHeaderButton = variant === "outline" && size === "sm";

  // Exact same classes as Support Us button
  const headerButtonClasses = "btn-gls-primary text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5 shadow-md hover:shadow-lg";

  return (
    <>
      <div className="flex gap-2">
        {isHeaderButton ? (
          <>
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setIsAuthModalOpen(true);
              }}
              className={headerButtonClasses}
            >
              {t("signIn")}
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("register");
                setIsAuthModalOpen(true);
              }}
              className={headerButtonClasses}
            >
              {t("signUp")}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setAuthMode("login");
                setIsAuthModalOpen(true);
              }}
              className={`${getButtonClasses()} ${className}`}
            >
              {t("signIn")}
            </button>
            <button
              onClick={() => {
                setAuthMode("register");
                setIsAuthModalOpen(true);
              }}
              className={`${getButtonClasses()} bg-green-500 hover:bg-green-600 text-black border border-transparent px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold transition-all hover:scale-105 shadow-[0_0_15px_rgba(34,197,94,0.4)]`}
            >
              {t("signUp")}
            </button>
          </>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
      />
    </>
  );
}
