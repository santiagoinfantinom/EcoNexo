import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabaseClient";

type Profile = {
  id: string;
  name: string;
  email: string;
  bio: string;
  interests: string;
  language: "es" | "en" | "de";
};

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
      return NextResponse.json((data as Profile) || { ...MOCK_PROFILE, id });
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
      const { data, error } = await supabase.from("profiles").upsert(body).select().single();
      if (error) throw error;
      return NextResponse.json(data as Profile);
    } catch {
      // echo back for mock
      return NextResponse.json(body);
    }
  } catch (e) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}


