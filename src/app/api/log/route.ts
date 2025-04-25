import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Only attempt to use Supabase if in production with proper credentials
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      await supabase.from("session_events").insert({
        participant: body.participant,
        persona: body.persona,
        event_type: body.event_type,
        payload: body.payload,
      });
    } else {
      console.log("Skipping Supabase log in development/build:", body);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in log API:", error);
    return NextResponse.json({ ok: false, error: "Logging failed" }, { status: 500 });
  }
} 