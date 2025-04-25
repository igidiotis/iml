import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const body = await req.json(); // { participant_id, persona, grand_concern }
  await supabase.from("sessions").insert(body);
  return NextResponse.json({ ok: true });
} 