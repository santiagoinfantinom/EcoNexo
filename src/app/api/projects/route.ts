import { PROJECTS } from "@/data/projects";
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabaseClient";
import { rateLimit } from "@/lib/rateLimiter";

export const dynamic = 'force-dynamic';
export const revalidate = 30;
const cacheHeaders = {
  'Cache-Control': 'public, max-age=30, stale-while-revalidate=30',
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // If a specific id is requested, try Supabase for that id first, then fall back to local dataset
    if (id) {
      try {
        const supabase = getSupabase();
        const res = await supabase
          .from("projects")
          .select("*")
          .eq('id', id)
          .maybeSingle();
        if (!res.error && res.data) {
          return NextResponse.json(res.data, { headers: cacheHeaders });
        }
      } catch {
        // ignore and fall back to local dataset
      }
      const local = PROJECTS.find((p: any) => String(p.id) === String(id));
      if (local) return NextResponse.json(local, { headers: cacheHeaders });
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }

    // Try Supabase first
    try {
      const supabase = getSupabase();
      const res = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (!res.error && Array.isArray(res.data) && res.data.length) {
        return NextResponse.json(res.data, { headers: cacheHeaders });
      }
    } catch {
      // ignore and fall back to local dataset
    }
    // Fallback to in-repo dataset so the app always works
    return NextResponse.json(PROJECTS, { headers: cacheHeaders });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(req, 'projects-write', 15, 60000);
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
      .from("projects")
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

export async function PUT(req: NextRequest) {
  try {
    const rl = rateLimit(req, 'projects-write', 15, 60000);
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
    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const { data, error } = await supabase
      .from("projects")
      .update(rest)
      .eq('id', id)
      .select("*")
      .maybeSingle();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


