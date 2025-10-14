import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Inter_Tight } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/lib/auth";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CreateEventFAB from "@/components/CreateEventFAB";
import HeaderNav from "@/components/HeaderNav";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const interTight = Inter_Tight({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EcoNexo",
  description: "Mapa de proyectos y eventos sostenibles en Europa",
  manifest: "/manifest.json",
  themeColor: "#1a5f3f",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EcoNexo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" data-theme="dark">
      <body
        className={`${interTight.className} ${geistSans.variable} ${geistMono.variable} antialiased bg-gls-primary`}
      >
        <ThemeProvider>
          <I18nProvider>
            <AuthProvider>
              <ServiceWorkerRegistration />
              <LanguageSwitcher />
              <HeaderNav />
              <main className="min-h-screen">{children}</main>
              <CreateEventFAB />
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
