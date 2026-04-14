import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabaseClient";

// Required for static export
export const dynamic = 'force-static';
export const revalidate = false;

type Profile = {
  id: string;
  name: string;
  email: string;
  bio: string;
  interests: string;
  language: "es" | "en" | "de";
};

const mapDbProfileToProfile = (row: any, id: string): Profile => ({
  id,
  name: row?.full_name || row?.name || "",
  email: row?.email || "",
  bio: row?.bio || row?.about_me || "",
  interests: row?.interests || "",
  language: (row?.preferred_language || row?.language || "es") as Profile["language"],
});

const MOCK_PROFILE: Profile = {
  id: "demo-user",
  name: "",
  email: "",
  bio: "",
  interests: "",
  language: "es",
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id") || "demo-user";
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
      if (error && error.code !== "PGRST116") throw error; // not found different from other errors
      return NextResponse.json(data ? mapDbProfileToProfile(data, id) : { ...MOCK_PROFILE, id });
    } catch {
      return NextResponse.json({ ...MOCK_PROFILE, id });
    }
  } catch (e) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Profile;
    try {
      const supabase = getSupabase();
      const dbPayload = {
        id: body.id,
        full_name: body.name,
        email: body.email,
        bio: body.bio,
        interests: body.interests,
        preferred_language: body.language,
      };
      const { data, error } = await supabase.from("profiles").upsert(dbPayload).select().single();
      if (error) throw error;
      return NextResponse.json(mapDbProfileToProfile(data, body.id));
    } catch {
      // echo back for mock
      return NextResponse.json(body);
    }
  } catch (e) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}


