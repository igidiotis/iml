import { GoogleGenerativeAI } from "@google/generative-ai";
const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!).getGenerativeModel({ model:"gemini-2.0-flash" });

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

export async function summariseChat(chat: string): Promise<{summary:string; theme:string}>{
  const prompt = `Summarise the following academic integrity chat in <=80 words and label the dominant ethical theme in one or two words.
Return JSON {summary:string, theme:string}.
Chat:
"""${chat}"""
Do not include any markdown formatting or code blocks.`;

  try {
    const res = await model.generateContent(prompt);
    const rawText = res.response.text();
    
    // Extract JSON from potential markdown formatting
    const jsonText = extractJSON(rawText);
    
    try {
      return JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      console.error("Raw response:", rawText);
      return {
        summary: "Error summarizing conversation.",
        theme: "Error"
      };
    }
  } catch (error) {
    console.error("Error in summariseChat:", error);
    return {
      summary: "Failed to generate summary.",
      theme: "Error"
    };
  }
} 