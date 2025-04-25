import { NextRequest, NextResponse } from "next/server";
import { askGemini } from "@/lib/ai/gemini";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  const answer = await askGemini(
    `You are a 2025 university teacher. Answer with current academic integrity policy in mind:\n${question}`
  );
  return NextResponse.json({ answer });
} 