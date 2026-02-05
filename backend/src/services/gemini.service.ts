import { GoogleGenerativeAI } from "@google/generative-ai";

type ChatMessage = {
  role: "user" | "bot";
  text?: string;
};

export async function generateGeminiReply(
  message: string,
  history: ChatMessage[] = []
) {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('hello', apiKey);
  const genAI = new GoogleGenerativeAI(apiKey!);
  // 1️⃣ sanitize history (remove empty texts)
  const safeHistory = history.filter(
    m => typeof m.text === "string" && m.text.trim().length > 0
  );

  // 2️⃣ remove leading bot messages (CRITICAL FIX)
  while (safeHistory.length && safeHistory[0].role !== "user") {
    safeHistory.shift();
  }

  // 3️⃣ map to Gemini SDK format
  const formattedHistory = safeHistory.map(m => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.text as string }]
  }));

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const chat = model.startChat({
    history: formattedHistory
  });

  const result = await chat.sendMessage(message);
  
  const response = result.response.text();

  return response || "No response from Gemini";
}
