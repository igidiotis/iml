import { GoogleGenerativeAI } from "@google/generative-ai";
const model = new GoogleGenerativeAI(process.env.API_KEY!).getGenerativeModel({ model:"gemini-2.0-flash" });

export async function summariseChat(chat: string): Promise<{summary:string; theme:string}>{
  const prompt = `Summarise the following academic integrity chat in <=80 words and label the dominant ethical theme in one or two words.
Return JSON {summary:string, theme:string}.
Chat:
"""${chat}"""`;
  const res = await model.generateContent(prompt);
  return JSON.parse(res.response.text());
} 