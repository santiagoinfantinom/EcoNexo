import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Inter_Tight } from "next/font/google";
import "./globals.css";
import "../styles/global-config.css";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/lib/auth";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CreateEventFAB from "@/components/CreateEventFAB";
import HeaderNav from "@/components/HeaderNav";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import SimpleIntro from "@/components/SimpleIntro";
import PlausibleProvider from "next-plausible";
import DynamicManifest from "@/components/DynamicManifest";
import ErrorBoundary from "@/components/ErrorBoundary";
import { generateMetadata } from "@/lib/metadata";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interTight.className} ${geistSans.variable} ${geistMono.variable} antialiased bg-gls-primary`}
      >
        <div className="animated-gradient-bg" />
        <PlausibleProvider domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "econexo.app"}>
          <ThemeProvider>
            <I18nProvider>
              <AuthProvider>
                <ErrorBoundary>
                  <ServiceWorkerRegistration />
                  <DynamicManifest />
                  <SimpleIntro />
                  <LanguageSwitcher />
                  <HeaderNav />
                  <main className="min-h-screen">{children}</main>
                  <CreateEventFAB />
                </ErrorBoundary>
              </AuthProvider>
            </I18nProvider>
          </ThemeProvider>
        </PlausibleProvider>
      </body>
    </html>
  );
}
