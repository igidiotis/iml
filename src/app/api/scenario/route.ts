import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  .getGenerativeModel({ model: "gemini-2.0-flash" });

// Helper function to extract JSON from a potentially markdown-formatted response
function extractJSON(text: string): string {
  // Check if the response is wrapped in markdown code blocks
  const jsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const match = text.match(jsonRegex);
  
  // If we found a markdown code block, extract the JSON inside it
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // Otherwise return the original text (assuming it's already JSON)
  return text.trim();
}

export async function POST(req: NextRequest) {
  try {
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
Make sure the dilemma matches the persona's role and domain.
Do not include any markdown formatting or code blocks.`;

    const res = await model.generateContent(prompt);
    const rawText = res.response.text();
    
    // Extract JSON from potential markdown formatting
    const jsonText = extractJSON(rawText);
    
    try {
      const parsedData = JSON.parse(jsonText);
      return NextResponse.json(parsedData);
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      console.error("Raw response:", rawText);
      return NextResponse.json({ 
        error: "Failed to parse AI response",
        text: "An error occurred while generating your scenario. Please try again."
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in scenario API:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      text: "An error occurred while processing your request. Please try again."
    }, { status: 500 });
  }
} 