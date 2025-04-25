import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const body = await req.json();
  await supabase.from("session_events").insert(body);
  return NextResponse.json({ ok: true });
} 