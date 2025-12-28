import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabaseClient";

// Get all administrators for an event
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    
    // Mock events (starting with 'e') don't have administrators in the database
    // Return empty array instead of trying to query Supabase
    if (eventId.startsWith('e') && eventId.match(/^e\d+/)) {
      return NextResponse.json([]);
    }
    
    const supabase = getSupabase();
    if (!supabase) {
      // If Supabase is not configured, return empty array for mock events
      return NextResponse.json([]);
    }
    
    // Get administrators with user profiles
    const { data, error } = await supabase
      .from("event_administrators")
      .select("*, profiles!user_id(*)")
      .eq("event_id", eventId);
    
    if (error) {
      // If table doesn't exist or there's an error, return empty array instead of 500
      console.warn(`[administrators API] Error fetching administrators for event ${eventId}:`, error);
      return NextResponse.json([]);
    }
    
    return NextResponse.json(data || []);
  } catch (e) {
    // Always return empty array instead of 500 error for better UX
    console.warn(`[administrators API] Exception fetching administrators for event:`, e);
    return NextResponse.json([]);
  }
}

// Add a new administrator
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const body = await req.json();
    const { user_id } = body;
    
    if (!user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }
    
    const supabase = getSupabase();
    
    // Add administrator
    const { data, error } = await supabase
      .from("event_administrators")
      .insert({
        event_id: eventId,
        user_id
      })
      .select()
      .single();
    
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Delete an administrator
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");
    
    if (!userId) {
      return NextResponse.json(
        { error: "user_id query parameter is required" },
        { status: 400 }
      );
    }
    
    const supabase = getSupabase();
    
    // Remove administrator
    const { error } = await supabase
      .from("event_administrators")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", userId);
    
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

