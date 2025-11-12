import type { Metadata, Viewport } from "next";
import { DICTS } from "@/lib/i18n";

export function generateMetadata(locale: string = "en"): Metadata {
  // Fallback values
  const fallbackTitle = "EcoNexo - Sustainable Projects in Europe";
  const fallbackDescription = "Connect with sustainable projects and events across Europe. Join the community building a greener future.";
  
  let title = fallbackTitle;
  let description = fallbackDescription;
  
  try {
    const dict = DICTS[locale as keyof typeof DICTS];
    if (dict && dict.appTitle) {
      title = dict.appTitle;
    }
    if (dict && dict.appDescription) {
      description = dict.appDescription;
    }
  } catch (error) {
    console.warn("Error loading translations for metadata:", error);
  }
  
  return {
    title,
    description,
    manifest: "/api/manifest?locale=" + locale,
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "EcoNexo",
    },
    icons: {
      apple: [
        { url: "/logo-econexo.png", sizes: "180x180", type: "image/png" },
      ],
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function generateViewport(): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: "#1a5f3f",
    viewportFit: "cover", // Para iPhone X y posteriores
  };
}
