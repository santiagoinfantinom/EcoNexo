import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const country = searchParams.get("country");
    const user_id = searchParams.get("user_id");

    const supabase = getSupabase();
    let query = supabase
      .from("local_groups")
      .select(`
        *,
        profiles!local_groups_created_by_fkey(id, full_name, avatar_url)
      `)
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (city) {
      query = query.eq("city", city);
    }
    if (country) {
      query = query.eq("country", country);
    }
    if (user_id) {
      // Get groups where user is a member
      const { data: memberships } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", user_id);

      if (memberships && memberships.length > 0) {
        const groupIds = memberships.map(m => m.group_id);
        query = query.in("id", groupIds);
      } else {
        return NextResponse.json([]);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform data to include member counts
    const groupsWithStats = await Promise.all(
      (data || []).map(async (group) => {
        const { count: membersCount } = await supabase
          .from("group_members")
          .select("*", { count: "exact", head: true })
          .eq("group_id", group.id);

        const { count: eventsCount } = await supabase
          .from("events")
          .select("*", { count: "exact", head: true })
          .eq("group_id", group.id);

        return {
          ...group,
          members_count: membersCount || 0,
          events_count: eventsCount || 0,
          created_by_name: group.profiles?.full_name || "Unknown",
        };
      })
    );

    return NextResponse.json(groupsWithStats);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, city, country, region, is_public, tags } = body;

    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("local_groups")
      .insert({
        name,
        description,
        city,
        country,
        region,
        is_public: is_public !== false,
        tags: tags || [],
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    // Add creator as admin member
    await supabase
      .from("group_members")
      .insert({
        group_id: data.id,
        user_id: user.id,
        role: "admin",
      });

    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

