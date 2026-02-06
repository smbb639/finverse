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
  const genAI = new GoogleGenerativeAI(apiKey!);
  const safeHistory = history.filter(
    m => typeof m.text === "string" && m.text.trim().length > 0
  );

  while (safeHistory.length && safeHistory[0].role !== "user") {
    safeHistory.shift();
  }

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
