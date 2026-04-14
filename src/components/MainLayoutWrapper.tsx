"use client";

import React from "react";
import dynamic from "next/dynamic";
import { LazyMotion, domAnimation } from "framer-motion";
import { ThemeProvider } from "@/lib/theme";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { ToastProvider } from "@/components/ToastNotification";
import { SmartProvider } from "@/context/SmartContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import IOSMetaTags from "@/components/IOSMetaTags";

// Dynamically import only client-side specific components
const LanguageSwitcher = dynamic(() => import("@/components/LanguageSwitcher"), { ssr: false });
const PWAInstallPrompt = dynamic(() => import("@/components/PWAInstallPrompt"), { ssr: false });
const ServiceWorkerRegistration = dynamic(() => import("@/components/ServiceWorkerRegistration"), { ssr: false });
const SimpleIntro = dynamic(() => import("@/components/SimpleIntro"), { ssr: false });
const DynamicManifest = dynamic(() => import("@/components/DynamicManifest"), { ssr: false });
const GlobalProgressBar = dynamic(() => import("@/components/GlobalProgressBar"), { ssr: false });
const RouteRefreshControl = dynamic(() => import("@/components/RouteRefreshControl"), { ssr: false });

interface MainLayoutWrapperProps {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}

export default function MainLayoutWrapper({ children, header, footer }: MainLayoutWrapperProps) {
  return (
    <LazyMotion features={domAnimation}>
      <ThemeProvider>
        <I18nProvider>
          <AuthProvider>
            <ToastProvider>
              <SmartProvider>
                <ErrorBoundary>
                  <IOSMetaTags />
                  <ServiceWorkerRegistration />
                  <RouteRefreshControl />
                  <DynamicManifest />
                  <SimpleIntro />
                  <PWAInstallPrompt />
                  <LanguageSwitcher />
                  {header}
                  <GlobalProgressBar />
                  <main className="min-h-screen pb-[calc(70px+env(safe-area-inset-bottom))] md:pb-0">
                    {children}
                  </main>
                  {footer}
                </ErrorBoundary>
              </SmartProvider>
            </ToastProvider>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </LazyMotion>
  );
}
