import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  .getGenerativeModel({ model: "gemini-2.0-flash" });

export async function POST(req: NextRequest) {
  const { persona } = await req.json();

  const prompt = `
You are designing an academic-integrity dilemma for the persona "${persona}" in the year 2035.
Return ONLY valid JSON like:
{
  "text": "...opening dilemma...",
  "options": [
    { "label": "Option A", "score": -2 },
    { "label": "Option B", "score": 0 },
    { "label": "Option C", "score": 2 }
  ]
}
Make sure the dilemma matches the persona's role and domain.`;

  const res = await model.generateContent(prompt);
  return NextResponse.json(JSON.parse(res.response.text()));
} 