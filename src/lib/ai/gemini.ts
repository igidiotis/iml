import { GoogleGenerativeAI } from "@google/generative-ai";

// Mock responses for development/testing
const MOCK_RESPONSES = {
  now: {
    policies: "Current academic integrity policies strongly discourage using AI for completing assignments without proper citation. Students must acknowledge all AI assistance in their work, similar to citing research sources. Using AI to generate entire assignments or exams is considered cheating. Teachers are advised to design assignments that leverage AI as a tool while still requiring critical thinking and original analysis.",
    detection: "Universities use specialized AI detection tools to identify AI-generated content in student submissions. These tools analyze writing patterns, vocabulary usage, and structural elements that are characteristic of AI models. However, they're not perfect and can sometimes flag human writing or miss sophisticated AI content.",
    fallback: "As a teacher in 2025, I need to balance embracing new technologies while maintaining academic standards. AI tools are useful for research and learning but should supplement rather than replace student work."
  },
  future: {
    policies: "Academic integrity has evolved over the past 20 years. Instead of restricting AI use, we now focus on proper attribution and collaboration. Students must document how they used AI in their work processes, and assignments are designed to leverage AI assistance while ensuring the final product demonstrates unique human insight.",
    detection: "We no longer focus on 'detecting' AI usage since it's an expected part of the educational process. Instead, we assess how effectively students direct, critique, and build upon AI-generated content. The best work shows a clear human-AI partnership where the human provides direction and critical evaluation.",
    evolution: "Over the past 20 years, AI has transformed from a controversial tool to an integral part of education. Initially restricted, we now teach students to collaborate with AI as co-creators and thinking partners. The focus shifted from preventing AI use to teaching responsible AI collaboration and critical evaluation of AI outputs.",
    skills: "The most valued skills now are those AI can't replicate: creative problem-solving, ethical reasoning, interpersonal intelligence, and the ability to direct and evaluate AI output. Students learn to be 'AI conductors' rather than mere content producers.",
    fallback: "Looking back from 2045, it's remarkable how much education changed once we embraced AI as a collaborative tool rather than seeing it as a threat. Students now learn alongside AI, focusing on uniquely human skills while leveraging AI capabilities."
  }
};

// Define the mock response sets structure type
type ResponseSet = {
  policies: string;
  detection: string;
  evolution?: string;
  skills?: string;
  fallback: string;
};

/**
 * Function to interact with Gemini model API or provide sensible mock responses
 */
export async function askGemini(prompt: string): Promise<string> {
  // During build or without API key, return a relevant mock response
  if (!process.env.GEMINI_API_KEY) {
    console.log("No GEMINI_API_KEY found, using mock response");
    
    // Determine which mock response set to use
    const isFuture = prompt.toLowerCase().includes("2045") || prompt.toLowerCase().includes("looking back");
    const responseSet: ResponseSet = isFuture ? MOCK_RESPONSES.future : MOCK_RESPONSES.now;
    
    // Try to match the prompt with relevant mock responses
    if (prompt.toLowerCase().includes("policy") || prompt.toLowerCase().includes("integrity") || prompt.toLowerCase().includes("cheating")) {
      return responseSet.policies;
    } else if (prompt.toLowerCase().includes("detect") || prompt.toLowerCase().includes("identify")) {
      return responseSet.detection;
    } else if (isFuture && responseSet.evolution && (prompt.toLowerCase().includes("evolve") || prompt.toLowerCase().includes("change") || prompt.toLowerCase().includes("transform"))) {
      return responseSet.evolution;
    } else if (isFuture && responseSet.skills && (prompt.toLowerCase().includes("skill") || prompt.toLowerCase().includes("learn"))) {
      return responseSet.skills;
    } else {
      return responseSet.fallback;
    }
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