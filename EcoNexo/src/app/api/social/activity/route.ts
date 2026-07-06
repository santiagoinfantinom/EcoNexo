import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    
    // If user_id is provided, get that user's activity, otherwise get feed from followed users
    let query = supabase
      .from("activity_feed")
      .select(`
        *,
        profiles!activity_feed_user_id_fkey(id, full_name, avatar_url)
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (user_id) {
      query = query.eq("user_id", user_id);
    } else if (user) {
      // Get activity from users being followed
      const { data: follows } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user.id);

      if (follows && follows.length > 0) {
        const followingIds = follows.map(f => f.following_id);
        query = query.in("user_id", followingIds);
      } else {
        // If not following anyone, return empty
        return NextResponse.json([]);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { activity_type, activity_data } = await req.json();
    
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("activity_feed")
      .insert({
        user_id: user.id,
        activity_type,
        activity_data,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

