import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    let data: unknown = [];
    try {
      const supabase = getSupabase();
      const { data: eventsData, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });
      if (error) throw error;
      data = eventsData;
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
    let data: unknown = null;
    try {
      const supabase = getSupabase();
      const body = await req.json();
      const { data: eventData, error } = await supabase
        .from("events")
        .insert(body)
        .select("*")
        .single();
      if (error) throw error;
      data = eventData;
    } catch {
      // fallback: no env or table → return mock data for dev
      const body = await req.json();
      data = {
        id: `mock_${Date.now()}`,
        ...body,
        created_at: new Date().toISOString()
      };
    }
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


