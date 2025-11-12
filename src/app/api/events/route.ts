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
      const { data: eventsData, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true })
        .order("start_time", { ascending: true });
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
      
      // Insert event
      const { data: eventData, error } = await supabase
        .from("events")
        .insert(body)
        .select("*")
        .single();
      if (error) throw error;
      data = eventData;
      
      // If created_by is set, add the creator as an administrator
      if (eventData.created_by && eventData.id) {
        await supabase
          .from("event_administrators")
          .insert({
            event_id: eventData.id,
            user_id: eventData.created_by
          })
          .catch(err => {
            console.warn("Error adding creator as administrator:", err);
            // Don't fail the entire request if this fails
          });
      }
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


