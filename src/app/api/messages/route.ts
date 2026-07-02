import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabaseClient";
import { rateLimit } from "@/lib/rateLimiter";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    const rl = rateLimit(req, 'messages-write', 20, 60000);
    if (!rl.success) {
      return NextResponse.json({ error: 'Too many requests, please try again later.' }, {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      });
    }

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


