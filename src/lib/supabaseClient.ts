import { createClient } from "@supabase/supabase-js";

export function getSupabase() {
  // 1. Core Config (Environment Variables)
  const envUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const envKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

  // 2. Hard-coded fallbacks for GitHub Pages (where environment injection during static build can be flaky)
  const fallbackUrl = "https://inxwrvmdspmajqqjenlr.supabase.co";
  const fallbackKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlueHdydm1kc3BtYWpxcWplbmxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMjAxMTEsImV4cCI6MjA4NTc5NjExMX0.gI9ueU6Ot93g_rKgmPNo0BsUO_oTGQMRG99alCGENEg";

  const url = envUrl || fallbackUrl;
  const key = envKey || fallbackKey;

  // Logging (safe for production as it doesn't leak secrets, just helps trace)
  if (typeof window !== "undefined") {
    const isMock = url.includes("mock.supabase.co");
    const isFallback = url === fallbackUrl && !envUrl;
    console.log(`Supabase Init: ${isMock ? "MOCK" : isFallback ? "FALLBACK" : "ENV"} | URL: ${!!url} | Key: ${!!key}`);
  }

  if (!url || !key || url.includes("your_supabase_url_here") || key.includes("your_supabase_anon_key_here")) {
    return createClient("https://mock.supabase.co", "mock-key");
  }

  return createClient(url, key);
}

export function isSupabaseConfigured(): boolean {
  const envUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const url = envUrl || "https://inxwrvmdspmajqqjenlr.supabase.co"; // Matches fallback above

  if (!url || url.includes("your_supabase_url_here") || url === "https://mock.supabase.co") {
    return false;
  }

  return true;
}
