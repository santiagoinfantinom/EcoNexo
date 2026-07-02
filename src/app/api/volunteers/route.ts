import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabaseClient";
import { rateLimit } from "@/lib/rateLimiter";

export const dynamic = 'force-dynamic';
export const revalidate = 15;
const cacheHeaders = {
  'Cache-Control': 'public, max-age=15, stale-while-revalidate=30',
};

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(req, 'volunteers-write', 20, 60000);
    if (!rl.success) {
      return NextResponse.json({ error: 'Too many requests, please try again later.' }, {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      });
    }

    const supabase = getSupabase();
    const body = await req.json();
    const { data, error } = await supabase
      .from("volunteers")
      .insert(body)
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("project_id");

    let query = supabase.from("volunteers").select("*").order("created_at", { ascending: false });

    if (projectId) {
      query = query.eq("project_id", projectId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data, { status: 200, headers: cacheHeaders });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
