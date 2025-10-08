import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Inter_Tight } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CreateEventFAB from "@/components/CreateEventFAB";
import HeaderNav from "@/components/HeaderNav";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${interTight.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <I18nProvider>
            <LanguageSwitcher />
            <HeaderNav />
            <main className="p-6">{children}</main>
            <CreateEventFAB />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
