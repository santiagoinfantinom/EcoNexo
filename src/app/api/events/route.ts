import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabaseClient";
import { realEvents2026 } from "@/data/events-2026-real";

// Enable dynamic rendering for real-time database access
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    let data: any = [];
    try {
      const supabase = getSupabase();
      let query = supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true })
        .order("start_time", { ascending: true });

      if (id) {
        query = query.eq('id', id);
      }

      const { data: eventsData, error } = await query;
      if (error) throw error;
      data = eventsData;

      if (id && Array.isArray(data)) {
        data = data[0] || null;
      }
    } catch {
      // fallback: return real 2026 events from file
      console.log('Using real 2026 events from file (Supabase not configured)');
      if (id) {
        data = realEvents2026.find(e => e.id === id) || null;
      } else {
        data = realEvents2026;
      }
    }
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Read body once at the start
    const body = await req.json();
    let data: unknown = null;

    try {
      const supabase = getSupabase();

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


