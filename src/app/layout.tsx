import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Inter_Tight } from "next/font/google";
import "./globals.css";
import "../styles/global-config.css";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/lib/auth";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import GreenCompass from "@/components/GreenCompass";
import HeaderNav from "@/components/HeaderNav";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import SimpleIntro from "@/components/SimpleIntro";
import PlausibleProvider from "next-plausible";
import DynamicManifest from "@/components/DynamicManifest";
import ErrorBoundary from "@/components/ErrorBoundary";
import IOSMetaTags from "@/components/IOSMetaTags";
import { generateMetadata, generateViewport } from "@/lib/metadata";
import { ToastProvider } from "@/components/ToastNotification";
import { SmartProvider } from "@/context/SmartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const interTight = Inter_Tight({ subsets: ["latin"] });

export const metadata: Metadata = generateMetadata("en");
export const viewport = generateViewport();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body
        className={`${interTight.className} ${geistSans.variable} ${geistMono.variable} antialiased bg-gls-primary`}
      >
        <div className="fixed top-0 left-0 w-full h-1 bg-ecosia-green z-50 shadow-sm" />
        <div className="animated-gradient-bg" />
        <PlausibleProvider domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "econexo.app"}>
          <ThemeProvider>
            <I18nProvider>
              <AuthProvider>
                <ToastProvider>
                  <SmartProvider>
                    <ErrorBoundary>
                      <IOSMetaTags />
                      <ServiceWorkerRegistration />
                      <DynamicManifest />
                      <SimpleIntro />
                      <LanguageSwitcher />
                      <HeaderNav />
                      <main className="min-h-screen">{children}</main>
                      <GreenCompass />
                    </ErrorBoundary>
                  </SmartProvider>
                </ToastProvider>
              </AuthProvider>
            </I18nProvider>
          </ThemeProvider>
        </PlausibleProvider>
      </body>
    </html>
  );
}
