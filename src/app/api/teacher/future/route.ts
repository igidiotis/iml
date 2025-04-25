import { NextRequest, NextResponse } from "next/server";
import { askGemini } from "../../../../lib/ai/gemini";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  const answer = await askGemini(
    `You are the **same** teacher in 2045 looking back at 20 years of AI-driven education.
    
Keep your response concise (maximum 100 words), friendly, and conversational as if talking to a student.

Question: ${question}`
  );
  return NextResponse.json({ answer });
} 