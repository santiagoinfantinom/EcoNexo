import { createClient } from "@supabase/supabase-js";

export function getSupabase() {
  // Try to get values from various possible process.env locations
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

  // Logging (safe for production as it doesn't leak secrets, just helps trace)
  if (typeof window !== "undefined") {
    console.log("Supabase Client Init: URL present:", !!url, "Key present:", !!key);
  }

  if (!url || !key || url.includes("your_supabase_url_here") || key.includes("your_supabase_anon_key_here")) {
    // Return a mock client for development/missing config
    return createClient("https://mock.supabase.co", "mock-key");
  }

  return createClient(url, key);
}

export function isSupabaseConfigured(): boolean {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

  if (!url || !key || url.includes("your_supabase_url_here") || key.includes("your_supabase_anon_key_here") || url === "https://mock.supabase.co") {
    return false;
  }

  return true;
}
