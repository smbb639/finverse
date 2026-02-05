import { Request, Response } from "express";
import { generateGeminiReply } from "../services/gemini.service";

export async function chatController(req: Request, res: Response) {
  try {
    console.log("CHAT BODY:", req.body);

    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await generateGeminiReply(message, history);

    return res.json({ reply });
  } catch (error: any) {
    console.error("CHAT ERROR:", error.message);
    return res.status(500).json({
      error: "Chatbot failed",
      details: error.message
    });
  }
}
