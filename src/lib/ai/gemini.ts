import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Function to interact with Gemini model API
 */
export async function askGemini(prompt: string): Promise<string> {
  // During build or without API key, return a mock response
  if (!process.env.GEMINI_API_KEY) {
    console.log("No GEMINI_API_KEY found, using mock response");
    return `This is a mock response to: "${prompt.substring(0, 50)}..."`;
  }
  
  try {
    // Initialize the Generative AI API with the API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Generate a response
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return response;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I couldn't process that request. Please try again later.";
  }
} 