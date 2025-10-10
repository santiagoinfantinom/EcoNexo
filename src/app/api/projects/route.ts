import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabaseClient";

// Required for static export
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  try {
    let data: unknown = [];
    try {
      const supabase = getSupabase();
      const res = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (res.error) throw res.error;
      data = res.data;
    } catch {
      // fallback: no env or table → return empty list to avoid 500s in dev
      data = [];
    }
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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


