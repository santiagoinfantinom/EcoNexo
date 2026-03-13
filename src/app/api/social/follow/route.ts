import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const { following_id } = await req.json();
    const supabase = getSupabase();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("follows")
      .insert({
        follower_id: user.id,
        following_id,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Already following" }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const following_id = searchParams.get("following_id");
    
    if (!following_id) {
      return NextResponse.json({ error: "following_id required" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", following_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    const type = searchParams.get("type") || "followers"; // followers or following

    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const targetUserId = user_id || user.id;

    let query;
    if (type === "followers") {
      query = supabase
        .from("follows")
        .select("follower_id, profiles!follows_follower_id_fkey(*)")
        .eq("following_id", targetUserId);
    } else {
      query = supabase
        .from("follows")
        .select("following_id, profiles!follows_following_id_fkey(*)")
        .eq("follower_id", targetUserId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

