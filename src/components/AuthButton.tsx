"use client";
import React, { useState } from "react";
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

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${size === "sm" ? "h-8 w-20" : size === "lg" ? "h-12 w-32" : "h-10 w-24"}`}></div>
    );
  }

  const getButtonClasses = () => {
    const baseClasses = "font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2";
    
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base"
    };

    const variantClasses = {
      primary: "bg-green-600 hover:bg-green-700 text-white",
      secondary: "bg-gray-600 hover:bg-gray-700 text-white",
      outline: "border border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20"
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} rounded-lg`;
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserDropdown(false);
  };

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowUserDropdown(!showUserDropdown)}
          className={`${getButtonClasses()} flex items-center gap-2`}
        >
          <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <span className="text-green-600 dark:text-green-400 text-xs font-bold">
              {user.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <span className="hidden sm:inline">
            {user.email?.split("@")[0] || t("myAccount")}
          </span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showUserDropdown && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowUserDropdown(false)}
            ></div>
            
            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-20">
              <div className="py-1">
                <a
                  href="/perfil"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                  onClick={() => setShowUserDropdown(false)}
                >
                  👤 {t("myProfile")}
                </a>
                <a
                  href="/eventos"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                  onClick={() => setShowUserDropdown(false)}
                >
                  📅 {t("myEvents")}
                </a>
                <a
                  href="/trabajos"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                  onClick={() => setShowUserDropdown(false)}
                >
                  💼 {t("myJobs")}
                </a>
                <div className="border-t border-gray-200 dark:border-slate-700 my-1"></div>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  🚪 {t("signOut")}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-2">
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
          className={`${getButtonClasses().replace("bg-green-600 hover:bg-green-700", "bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-300")} ${className}`}
        >
          {t("signUp")}
        </button>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
      />
    </>
  );
}
