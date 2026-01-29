import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary
} from "../services/expense.services";
import User from "../models/User";

export const addExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, category, description, date } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!amount || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const expense = await createExpense(
      userId,
      amount,
      category,
      description || "No description",
      date
    );

    res.status(201).json({
      message: "Expense added successfully",
      expense
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { category, startDate, endDate, limit, skip, q } = req.query;

    const filters: any = {};
    if (category) filters.category = category as string;
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);
    if (limit) filters.limit = parseInt(limit as string);
    if (skip) filters.skip = parseInt(skip as string);
    if (q) filters.search = q as string;

    const { expenses, total } = await getExpenses(userId, filters);

    res.status(200).json({
      count: total,
      expenses
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpense = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const expense = await getExpenseById(id as any, userId);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ expense });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExpenseController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { amount, category, description, date } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updates: any = {};
    if (amount !== undefined) updates.amount = amount;
    if (category) updates.category = category;
    if (description) updates.description = description;
    if (date) updates.date = new Date(date);

    const expense = await updateExpense(id as any, userId, updates);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({
      message: "Expense updated successfully",
      expense
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const removeExpense = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(402).json({ message: "Unauthorized" });
    }

    const expense = await deleteExpense(id as any, userId);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({
      message: "Expense deleted successfully"
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSummary = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    if (!userId) {
      return res.status(402).json({ message: "Unauthorized" });
    }

    const summary = await getExpenseSummary(
      userId,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );

    res.status(200).json({ summary });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBudget = async (req: AuthRequest, res: Response) => {
  try {
    const { monthlyBudget } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(402).json({ message: "Unauthorized" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { monthlyBudget },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Budget updated successfully",
      monthlyBudget: user.monthlyBudget
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
