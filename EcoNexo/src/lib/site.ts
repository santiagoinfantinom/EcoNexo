/** Canonical production URL (Vercel). Override with NEXT_PUBLIC_SITE_URL in env. */
export const PRODUCTION_SITE_URL = "https://econexo-web.vercel.app";

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_SITE_URL;
}
