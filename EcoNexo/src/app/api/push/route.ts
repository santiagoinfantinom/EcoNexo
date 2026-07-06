import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey || 
      supabaseUrl === "your_supabase_url_here" || 
      supabaseKey === "your_supabase_anon_key_here") {
    return null;
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return new Response(JSON.stringify({ error: 'Supabase not configured' }), { status: 500 });
    }
    
    const { error } = await supabase.from('push_subscriptions').upsert({
      endpoint: body?.endpoint,
      p256dh: body?.keys?.p256dh,
      auth: body?.keys?.auth,
    }, { onConflict: 'endpoint' } as any);
    
    if (error) throw error;
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'bad request' }), { status: 400 });
  }
}


