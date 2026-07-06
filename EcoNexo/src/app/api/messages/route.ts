import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabaseClient";

// Required for static export
export const dynamic = 'force-static';
export const revalidate = false;

type Message = { id: string; from: string; to: string; text: string; ts: string };

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user = searchParams.get("user") || "demo-user";
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("messages" as any)
        .select("*")
        .or(`from.eq.${user},to.eq.${user}`)
        .order("ts", { ascending: true });
      if (error) throw error;
      return NextResponse.json((data || []) as unknown as Message[]);
    } catch {
      return NextResponse.json([
        { id: "1", from: "Ana", to: user, text: "Hola!", ts: new Date(Date.now()-60000).toISOString() },
        { id: "2", from: user, to: "Ana", text: "¿Vamos al evento del sábado?", ts: new Date(Date.now()-30000).toISOString() },
      ] satisfies Message[]);
    }
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Message;
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.from("messages" as any).insert(body as any).select().single();
      if (error) throw error;
      return NextResponse.json(data as unknown as Message);
    } catch {
      return NextResponse.json(body);
    }
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}


