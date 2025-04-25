import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize the Google Generative AI with API key
const getGeminiClient = () => {
  // Ensure this only runs on the server side
  if (typeof window === 'undefined') {
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }
  throw new Error('Gemini client can only be initialized on the server');
};

// Configure safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Configure generation parameters
const generationConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.9,
  maxOutputTokens: 1024,
};

/**
 * Generate text using Gemini Pro
 * @param prompt The text prompt to send to Gemini
 * @returns The generated text response
 */
export async function generateText(prompt: string): Promise<string> {
  try {
    const genAI = getGeminiClient();
    
    // Get the Gemini Pro model
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      safetySettings,
      generationConfig,
    });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    return response.text();
  } catch (error) {
    console.error("Error generating text with Gemini:", error);
    throw error;
  }
}

/**
 * Chat with Gemini Pro using a history of messages
 * @param messages The chat history as an array of {role, content} objects
 * @returns The generated response text
 */
export async function chatWithGemini(
  messages: { role: "user" | "model"; content: string }[]
): Promise<string> {
  try {
    const genAI = getGeminiClient();
    
    // Get the Gemini Pro model
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      safetySettings,
      generationConfig,
    });

    // Create a chat session
    const chat = model.startChat({
      history: messages.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    });

    // Generate a response to the last message
    const lastUserMessage = messages.filter(msg => msg.role === "user").pop();
    if (!lastUserMessage) {
      throw new Error("No user message found in the chat history");
    }

    const result = await chat.sendMessage(lastUserMessage.content);
    return result.response.text();
  } catch (error) {
    console.error("Error chatting with Gemini:", error);
    throw error;
  }
} 