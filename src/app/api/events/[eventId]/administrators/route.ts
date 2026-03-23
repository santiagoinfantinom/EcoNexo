import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabaseClient";

// Get all administrators for an event
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;

    // Verify if eventId is a valid UUID (mock events use short IDs)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId);

    if (!isUuid) {
      console.log(`[administrators API] Skipping DB for mock/invalid event ID: ${eventId}`);
      return NextResponse.json([]);
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json([]);
    }

    // 1. Get administrator IDs
    const { data: adminLinks, error: linkError } = await (supabase
      .from("event_administrators") as any)
      .select("user_id")
      .eq("event_id", eventId);

    if (linkError) {
      console.warn(`[administrators API] Error fetching admin links:`, linkError);
      return NextResponse.json([]);
    }

    if (!adminLinks || adminLinks.length === 0) {
      return NextResponse.json([]);
    }

    const userIds = (adminLinks as any[]).map(link => link.user_id);

    // 2. Get profiles for these users
    const { data: profiles, error: profileError } = await (supabase
      .from("profiles") as any)
      .select("*")
      .in("id", userIds);

    if (profileError) {
      console.warn(`[administrators API] Error fetching profiles:`, profileError);
      // Return empty if we can't get profiles, or maybe partial data? 
      // Safer to return empty for now to avoid breaking UI
      return NextResponse.json([]);
    }

    // Transform to expected format (mimicking the original joined structure if needed, or just profiles)
    // The UI likely expects the profile data directly or an object with profile. 
    // Checking previous code: .select("*, profiles!user_id(*)")
    // This would return [{ ...adminLink, profiles: { ...profile } }]

    const result = (adminLinks as any[]).map(link => {
      const profile = (profiles as any[])?.find(p => p.id === link.user_id);
      return {
        ...link,
        profiles: profile || null
      };
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error(`[administrators API] Critical error:`, e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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

    // Verify if eventId is a valid UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId);
    if (!isUuid) {
      console.log(`[administrators API] POST: Skipping DB for mock/invalid event ID: ${eventId}`);
      return NextResponse.json({ error: "Cannot add admins to mock events" }, { status: 400 });
    }

    const supabase = getSupabase();

    // Add administrator
    const { data, error } = await (supabase
      .from("event_administrators") as any)
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

    // Verify if eventId is a valid UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId);
    if (!isUuid) {
      console.log(`[administrators API] DELETE: Skipping DB for mock/invalid event ID: ${eventId}`);
      return NextResponse.json({ error: "Cannot delete admins from mock events" }, { status: 400 });
    }

    const supabase = getSupabase();

    // Remove administrator
    const { error } = await (supabase
      .from("event_administrators") as any)
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

