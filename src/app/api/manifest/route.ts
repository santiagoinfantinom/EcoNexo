import { NextRequest, NextResponse } from 'next/server';
import { DICTS } from '@/lib/i18n';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'es';
  
  const dict = DICTS[locale as keyof typeof DICTS] || DICTS.es;
  
  const manifest = {
    name: dict.appTitle || "EcoNexo - Plataforma de Sostenibilidad",
    short_name: "EcoNexo",
    description: dict.appDescription || "Conectando comunidades sostenibles en Europa",
    start_url: "/",
    display: "standalone",
    background_color: "#1a5f3f",
    theme_color: "#1a5f3f",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ],
    categories: ["environment", "lifestyle", "social"],
    lang: locale,
    dir: "ltr",
    scope: "/",
    prefer_related_applications: false
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
