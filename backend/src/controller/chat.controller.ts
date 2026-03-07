import { Response } from "express";
import { generateGeminiReply } from "../services/gemini.service";
import { AuthRequest } from "../middleware/auth.middleware";
import Expense from "../models/Expense";
import { Investment } from "../models/Investment";
import { getPortfolioMetrics } from "../services/metrics.service";
import User from "../models/User";

export async function chatController(req: AuthRequest, res: Response) {
  try {
    const { message, history } = req.body;
    const userId = req.user?.id;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!userId) {
      return res.status(401).json({ error: "User unauthorized" });
    }

    // Fetch user data for context
    const [expenses, investments, metrics, user] = await Promise.all([
      Expense.find({ user: userId }).sort({ date: -1 }).limit(20),
      Investment.find({ user: userId }),
      getPortfolioMetrics(userId).catch(() => ({})),
      User.findById(userId).select("name email startingBalance monthlyBudget")
    ]);

    const userData = {
      expenses,
      investments,
      metrics,
      user
    };

    const reply = await generateGeminiReply(message, history, userData);

    return res.json({ reply });
  } catch (error: any) {
    console.error("CHAT ERROR:", error.message);
    return res.status(500).json({
      error: "Chatbot failed",
      details: error.message
    });
  }
}
