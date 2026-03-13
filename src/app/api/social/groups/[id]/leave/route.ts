import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabaseClient";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = params.id;
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Don't allow creator to leave
    const { data: group } = await supabase
      .from("local_groups")
      .select("created_by")
      .eq("id", groupId)
      .single();

    if (group && group.created_by === user.id) {
      return NextResponse.json({ error: "Creator cannot leave group" }, { status: 400 });
    }

    // Remove membership
    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

