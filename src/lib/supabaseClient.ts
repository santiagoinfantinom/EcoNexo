import { createClient } from "@supabase/supabase-js";

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url === "your_supabase_url_here" || key === "your_supabase_anon_key_here") {
    // Return a mock client for development
    return createClient("https://mock.supabase.co", "mock-key");
  }
  
  return createClient(url, key);
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return Boolean(
    url && 
    key && 
    url !== "your_supabase_url_here" && 
    key !== "your_supabase_anon_key_here" &&
    url.startsWith("http")
  );
}


