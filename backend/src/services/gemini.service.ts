import { GoogleGenerativeAI } from "@google/generative-ai";

type ChatMessage = {
  role: "user" | "bot";
  text?: string;
};

export async function generateGeminiReply(
  message: string,
  history: ChatMessage[] = [],
  userData: any = {}
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

  const systemPrompt = `
You are Finverse AI, a premium financial assistant specializing in the Indian market.
Your tone is professional, encouraging, and highly data-driven.

RULES:
1. CURRENCY: Always use ₹ (Indian Rupee).
2. CONTEXT: You have access to the user's financial data below. Use it to answer specific queries about their spending and portfolio.
3. INDIAN MARKET: Refer to Indian indices (Nifty 50, Sensex), Indian tax laws (LTCG 12.5%, STCG 20% for equity), and local terms like FD, PPF, GST where relevant.
4. PRIVACY: Do not share raw JSON data; instead, summarize it elegantly.
5. LIMITATIONS: If data is missing (e.g., specific dates or categories), ask the user for clarification.

USER FINANCIAL SNAPSHOT:
- NET WORTH: ₹${userData.metrics?.totalValue || 0}
- STARTING BALANCE: ₹${userData.user?.startingBalance || 0}
- TOTAL INVESTMENTS: ${userData.investments?.length || 0} holdings
- TOTAL EXPENSES: ${userData.expenses?.length || 0} transactions
- RECENT INVESTMENTS: ${JSON.stringify(userData.investments?.slice(0, 5) || [])}
- RECENT EXPENSES: ${JSON.stringify(userData.expenses?.slice(0, 5) || [])}
- PORTFOLIO PERFORMANCE: CAGR: ${((userData.metrics?.cagr || 0) * 100).toFixed(2)}%, ROI: ${((userData.metrics?.roi || 0) * 100).toFixed(2)}%

When the user asks about their spending, summarize by category. When they ask about investments, discuss their top holdings and portfolio health.
  `.trim();

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt
  });

  const chat = model.startChat({
    history: formattedHistory
  });

  const result = await chat.sendMessage(message);
  
  const response = result.response.text();

  return response || "No response from Gemini";
}
