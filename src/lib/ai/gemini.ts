import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Mock responses for development/testing with variations
const MOCK_RESPONSES = {
  now: {
    policies: [
      "Current academic integrity policies strongly discourage using AI for completing assignments without proper citation. Students must acknowledge all AI assistance in their work, similar to citing research sources. Using AI to generate entire assignments or exams is considered cheating.",
      "Today's academic integrity policies require students to disclose AI use in their work. Teachers often design AI-resistant assignments and use detection tools to identify unauthorized AI-generated content.",
      "In 2025, most universities have adopted nuanced policies that allow AI as a research tool but prohibit its use for generating complete assignments. Students are required to submit an 'AI disclosure statement' with each assignment."
    ],
    detection: [
      "Universities use specialized AI detection tools to identify AI-generated content in student submissions. These tools analyze writing patterns, vocabulary usage, and structural elements that are characteristic of AI models.",
      "Current detection methods compare a student's work against their previous writing style and can identify sudden changes in sophistication or tone that might indicate AI use.",
      "Modern AI detectors look for patterns in sentence structure, transition markers, and complexity levels that distinguish human writing from AI-generated content."
    ],
    teaching: [
      "As educators, we now design assignments that leverage AI as critical thinking tools while ensuring students demonstrate their own understanding and analysis.",
      "My teaching approach incorporates AI literacy as a core competency, teaching students when and how to use AI tools appropriately in their academic work.",
      "In today's classroom, I focus on creating 'AI-resistant' assignments that require personal experiences, in-class observations, or hands-on work that can't be easily generated by AI."
    ],
    assessment: [
      "Assessment strategies now include more in-person evaluations, oral defenses of written work, and process-based grading that looks at how students develop their ideas over time.",
      "I evaluate students not just on final products but on their ability to use AI tools effectively and ethically as part of their research and writing process.",
      "Modern assessment techniques include having students explain their thought process and defend their work, making it difficult to submit AI-generated content without understanding."
    ],
    fallback: [
      "As a teacher in 2025, I need to balance embracing new technologies while maintaining academic standards. AI tools are useful for research and learning but should supplement rather than replace student work.",
      "The educational landscape in 2025 requires teaching students to be both critical consumers and ethical users of AI technologies.",
      "Today's educational environment is rapidly adapting to AI integration, with a focus on maintaining rigor and integrity while acknowledging AI's role as a learning tool."
    ]
  },
  future: {
    policies: [
      "Academic integrity has evolved over the past 20 years. Instead of restricting AI use, we now focus on proper attribution and collaboration. Students must document how they used AI in their work processes.",
      "Today in 2045, our academic policies embrace AI as an essential educational partner. Students are evaluated on how effectively they direct and critique AI contributions rather than trying to work without it.",
      "Academic integrity in 2045 centers on 'collaborative intelligence' - students must demonstrate their unique human contributions while leveraging AI capabilities effectively."
    ],
    detection: [
      "We no longer focus on 'detecting' AI usage since it's an expected part of the educational process. Instead, we assess how effectively students direct, critique, and build upon AI-generated content.",
      "The concept of AI detection is obsolete in 2045. We now use 'contribution analysis' to identify and evaluate the unique human insights in student work compared to AI contributions.",
      "Instead of detecting AI use, we now evaluate the quality of human-AI collaboration, looking for evidence of critical direction, thoughtful prompting, and insightful evaluation of AI outputs."
    ],
    evolution: [
      "Over the past 20 years, AI has transformed from a controversial tool to an integral part of education. Initially restricted, we now teach students to collaborate with AI as co-creators and thinking partners.",
      "The educational paradigm shifted dramatically between 2025-2045. We moved from viewing AI as a potential cheating tool to recognizing it as an essential cognitive partner that amplifies human creativity.",
      "Looking back at how education evolved, the turning point came around 2030 when we stopped fighting against AI and instead focused on teaching students to become expert AI directors and evaluators."
    ],
    skills: [
      "The most valued skills now are those AI can't replicate: creative problem-solving, ethical reasoning, interpersonal intelligence, and the ability to direct and evaluate AI output.",
      "Today's most essential skills include 'AI orchestration' - the ability to coordinate multiple AI systems toward complex goals while providing the human judgment and ethical framework AI lacks.",
      "In 2045, education focuses on developing uniquely human capabilities: empathetic reasoning, moral judgment, creative insight, and the ability to synthesize diverse perspectives that AI struggles to replicate."
    ],
    teaching: [
      "As an educator in 2045, my role has transformed from knowledge provider to 'learning architect.' I design complex challenges that require both human creativity and AI capabilities to solve.",
      "Teaching now involves helping students become effective 'AI conductors' who can direct AI systems toward meaningful goals while maintaining human values and creative vision.",
      "My teaching methods now focus on human-AI collaborative processes, helping students leverage AI capabilities while developing their uniquely human perspectives and insights."
    ],
    fallback: [
      "Looking back from 2045, it's remarkable how much education changed once we embraced AI as a collaborative tool rather than seeing it as a threat.",
      "The educational revolution of the past two decades centered on redefining human intelligence in relation to artificial intelligence, focusing on complementary rather than competitive capabilities.",
      "From my perspective in 2045, the integration of AI into education has enhanced rather than diminished the value of human creativity, ethical reasoning, and interpersonal connection."
    ]
  }
};

// Define the mock response sets structure type
type ResponseSet = {
  policies: string[],
  detection: string[],
  evolution?: string[],
  skills?: string[],
  teaching?: string[],
  assessment?: string[],
  fallback: string[]
};

// Helper function to get a random item from an array
function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

// Helper function to ensure responses are conversational and under 100 words
function truncateToConversationalLength(text: string): string {
  // Count words
  const words = text.split(/\s+/);
  if (words.length <= 100) return text;
  
  // Truncate to 95 words to leave room for conclusion
  const truncated = words.slice(0, 95).join(' ');
  
  // Add a natural conclusion
  return truncated + '... That covers the main points!';
}

/**
 * Function to interact with Gemini model API or provide sensible mock responses
 */
export async function askGemini(prompt: string): Promise<string> {
  // Debug API key presence (masked for security)
  if (process.env.GEMINI_API_KEY) {
    const maskedKey = process.env.GEMINI_API_KEY.slice(0, 4) + "..." + 
                     process.env.GEMINI_API_KEY.slice(-4);
    console.log(`Found API key starting with ${maskedKey.slice(0, 4)} and ending with ${maskedKey.slice(-4)}`);
  } else {
    console.log("No GEMINI_API_KEY found in environment variables");
  }
  
  // During build or without API key, return a relevant mock response
  if (!process.env.GEMINI_API_KEY) {
    console.log("Using mock response system");
    
    // Extract just the user's question from the prompt (remove the persona prefix)
    const userQuestion = prompt.includes("\n") ? prompt.split("\n")[1] : prompt;
    
    // Determine which mock response set to use
    const isFuture = prompt.toLowerCase().includes("2045") || prompt.toLowerCase().includes("looking back");
    const responseSet: ResponseSet = isFuture ? MOCK_RESPONSES.future : MOCK_RESPONSES.now;
    
    // Return a mock response from the selected category, but ensure it's conversational and concise
    let response: string;
    
    if (userQuestion.toLowerCase().includes("policy") || 
        userQuestion.toLowerCase().includes("integrity") || 
        userQuestion.toLowerCase().includes("cheating") ||
        userQuestion.toLowerCase().includes("plagiarism")) {
      response = getRandomResponse(responseSet.policies);
    } else if (userQuestion.toLowerCase().includes("detect") || 
               userQuestion.toLowerCase().includes("identify") ||
               userQuestion.toLowerCase().includes("catch")) {
      response = getRandomResponse(responseSet.detection);
    } else if (isFuture && responseSet.evolution && 
              (userQuestion.toLowerCase().includes("evolve") || 
               userQuestion.toLowerCase().includes("change") || 
               userQuestion.toLowerCase().includes("transform") ||
               userQuestion.toLowerCase().includes("history"))) {
      response = getRandomResponse(responseSet.evolution);
    } else if (isFuture && responseSet.skills && 
              (userQuestion.toLowerCase().includes("skill") || 
               userQuestion.toLowerCase().includes("learn") ||
               userQuestion.toLowerCase().includes("ability") ||
               userQuestion.toLowerCase().includes("competency"))) {
      response = getRandomResponse(responseSet.skills);
    } else if (userQuestion.toLowerCase().includes("teach") || 
               userQuestion.toLowerCase().includes("educator") ||
               userQuestion.toLowerCase().includes("class") || 
               userQuestion.toLowerCase().includes("course")) {
      response = responseSet.teaching ? getRandomResponse(responseSet.teaching) : getRandomResponse(responseSet.fallback);
    } else if (!isFuture && responseSet.assessment &&
              (userQuestion.toLowerCase().includes("assess") || 
               userQuestion.toLowerCase().includes("grade") ||
               userQuestion.toLowerCase().includes("evaluate"))) {
      response = getRandomResponse(responseSet.assessment);
    } else {
      // Pick a more contextual fallback based on keywords
      if (userQuestion.toLowerCase().includes("hello") || 
          userQuestion.toLowerCase().includes("hi") ||
          userQuestion.toLowerCase().includes("introduction")) {
        response = isFuture 
          ? "Hello! I'm a university educator from the year 2045, looking back at how education and academic integrity have evolved with AI over the past 20 years. How can I help you understand this perspective?"
          : "Hello! I'm a university educator in 2025, navigating the integration of AI tools in education while maintaining academic integrity. What would you like to know about our current approaches?";
      } else {
        // General fallback
        response = getRandomResponse(responseSet.fallback);
      }
    }
    
    // Ensure the response is concise and conversational
    return truncateToConversationalLength(response);
  }
  
  try {
    console.log("Attempting to call Gemini API with prompt:", prompt.substring(0, 50) + "...");
    
    // Initialize the Generative AI API with the API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    
    // Use the latest Gemini 2.0 Flash model
    const modelName = "gemini-2.0-flash";
    console.log(`Using Gemini model: ${modelName}`);
    
    // Set up the model with safety settings appropriate for educational content
    const model = genAI.getGenerativeModel({
      model: modelName,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 250, // Reduced for shorter responses
      },
    });
    
    // Prepare the chat history format
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 250, // Reduced for shorter responses
      },
    });
    
    // Send the message and get response
    const result = await chat.sendMessage(prompt);
    
    // Log successful API call
    console.log("Gemini API response received successfully");
    
    const response = result.response.text();
    // Ensure the response is concise and conversational even when coming from the API
    return truncateToConversationalLength(response);
  } catch (error) {
    // Enhanced error logging
    console.error("Error calling Gemini API:", JSON.stringify(error, null, 2));
    
    if (error instanceof Error) {
      console.error(`Error name: ${error.name}, Message: ${error.message}`);
      console.error(`Stack trace: ${error.stack}`);
      
      // Check for common API errors
      if (error.message.includes("API key")) {
        console.error("API key error - please check your API key format and validity");
      } else if (error.message.includes("quota")) {
        console.error("Quota exceeded - you may have reached your API usage limit");
      } else if (error.message.includes("permission")) {
        console.error("Permission error - your API key may not have access to this model");
      } else if (error.message.includes("model")) {
        console.error("Model error - the specified model may not be available for your API key");
      } else if (error.message.includes("network")) {
        console.error("Network error - there might be connectivity issues");
      }
    }
    
    // Add fallback for API errors
    return "Sorry, I couldn't process that request. Please try again later.";
  }
} 