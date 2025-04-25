// Mock implementation for the Gemini API

/**
 * Simple function to simulate AI responses during development/build
 */
export async function askGemini(prompt: string): Promise<string> {
  // During build, just return a placeholder
  if (!process.env.GEMINI_API_KEY) {
    console.log("No GEMINI_API_KEY found, using mock response");
    return `This is a mock response to: "${prompt.substring(0, 50)}..."`;
  }
  
  // In production with API key, implement actual Gemini API call
  // This would be replaced with the actual implementation
  return `Response to: "${prompt.substring(0, 50)}..."`;
} 