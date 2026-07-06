import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import "../styles/global-config.css";
import HeaderNav from "@/components/HeaderNav";
import MobileBottomTabBar from "@/components/MobileBottomTabBar";
import GreenCompass from "@/components/GreenCompass";
import PlausibleProvider from "next-plausible";
import { generateMetadata, generateViewport } from "@/lib/metadata";
import MainLayoutWrapper from "@/components/MainLayoutWrapper";

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
        className={`${interTight.className} antialiased bg-gls-primary`}
      >
        <div className="fixed top-0 left-0 w-full h-1 bg-ecosia-green z-50 shadow-sm" />
        <div className="animated-gradient-bg" />
        <PlausibleProvider domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "econexo.app"}>
          <MainLayoutWrapper 
            header={<HeaderNav />} 
            footer={
              <>
                <MobileBottomTabBar />
                <GreenCompass />
              </>
            }
          >
            {children}
          </MainLayoutWrapper>
        </PlausibleProvider>
      </body>
    </html>
  );
}
