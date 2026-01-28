import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { 
  getDashboardData, 
  getSpendingTrends, 
  getCategoryInsights 
} from "../services/dashboard.services";
import mongoose from "mongoose";
import Expense from "../models/Expense";
export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { startDate, endDate, category, limit } = req.query;

    const filters = {
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      category: category as string,
      limit: limit ? parseInt(limit as string) : undefined
    };

    const dashboardData = await getDashboardData(userId, filters);

    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getTrends = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { months } = req.query;
    const monthsCount = months ? parseInt(months as string) : 12;

    const trends = await getSpendingTrends(userId, monthsCount);

    res.status(200).json({
      success: true,
      data: trends
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getCategoryAnalysis = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { category } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const insights = await getCategoryInsights(userId, category as any);

    res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getQuickStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [todayExpenses, weekExpenses, monthExpenses, yesterdayExpenses] = await Promise.all([
      // Today's expenses
      Expense.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            date: { $gte: startOfToday, $lte: endOfToday }
          }
        },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      // This week's expenses
      Expense.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            date: { $gte: startOfWeek, $lte: endOfWeek }
          }
        },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      // This month's expenses
      Expense.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            date: { $gte: startOfMonth, $lte: endOfMonth }
          }
        },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      // Yesterday's expenses
      Expense.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            date: { 
              $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
              $lt: startOfToday 
            }
          }
        },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    const todayTotal = todayExpenses[0]?.total || 0;
    const weekTotal = weekExpenses[0]?.total || 0;
    const monthTotal = monthExpenses[0]?.total || 0;
    const yesterdayTotal = yesterdayExpenses[0]?.total || 0;

    const dailyChange = yesterdayTotal > 0 
      ? ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100 
      : todayTotal > 0 ? 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        today: todayTotal,
        thisWeek: weekTotal,
        thisMonth: monthTotal,
        dailyChange: parseFloat(dailyChange.toFixed(2)),
        isIncreasing: dailyChange > 0
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};