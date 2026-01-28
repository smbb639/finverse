import Expense from "../models/Expense";
import User from "../models/User";
import { startOfMonth, endOfMonth, subMonths, format, parseISO } from "date-fns";
import mongoose from "mongoose";

export interface DashboardFilters {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  limit?: number;
}

export const getDashboardData = async (userId: string, filters?: DashboardFilters) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const endDate = filters?.endDate || new Date();
  const startDate = filters?.startDate || subMonths(endDate, 6);

  const baseQuery: any = {
    user: new mongoose.Types.ObjectId(userId),
    date: { $gte: startDate, $lte: endDate }
  };

  if (filters?.category) {
    baseQuery.category = filters.category;
  }

  // Execute multiple queries in parallel for performance
  const [
    totalExpensesResult,
    monthlyData,
    categoryData,
    recentTransactions,
    lastMonthData,
    largestExpense
  ] = await Promise.all([
    // Total expenses in period
    Expense.aggregate([
      { $match: baseQuery },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]),

    // Monthly breakdown
    Expense.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: filters?.limit || 6 }
    ]),

    // Category breakdown
    Expense.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]),

    // Recent transactions
    Expense.find(baseQuery)
      .sort({ date: -1, createdAt: -1 })
      .limit(5)
      .select("amount category description date"),

    // Last month comparison (previous period)
    Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: {
            $gte: subMonths(startDate, 1),
            $lt: startDate
          }
        }
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]),

    // Largest single expense
    Expense.findOne(baseQuery)
      .sort({ amount: -1 })
      .select("amount category description date")
  ]);

  const totalExpenses = totalExpensesResult[0]?.total || 0;
  const totalTransactions = totalExpensesResult[0]?.count || 0;
  const lastMonthTotal = lastMonthData[0]?.total || 0;

  // Calculate average daily expense
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const averageDailyExpense = daysDiff > 0 ? totalExpenses / daysDiff : 0;

  // Find favorite category
  const favoriteCategory = categoryData[0]?._id || "None";

  // Calculate percentage change
  const percentageChange = lastMonthTotal > 0
    ? ((totalExpenses - lastMonthTotal) / lastMonthTotal) * 100
    : 0;

  // Format monthly data
  const formattedMonthlyData = monthlyData.map(item => ({
    month: format(new Date(item._id.year, item._id.month - 1), 'MMM'),
    year: item._id.year,
    total: item.total,
    transactions: item.count
  }));

  // Format category data with percentages
  const formattedCategoryData = categoryData.map(item => ({
    category: item._id,
    amount: item.total,
    percentage: totalExpenses > 0 ? (item.total / totalExpenses) * 100 : 0,
    count: item.count
  }));

  // Format recent transactions
  const formattedRecentTransactions = recentTransactions.map(expense => ({
    id: expense._id.toString(),
    amount: expense.amount,
    category: expense.category,
    description: expense.description || "No description",
    date: expense.date
  }));

  // Get current month data
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());

  const currentMonthData = await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        date: { $gte: currentMonthStart, $lte: currentMonthEnd }
      }
    },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  const currentMonthTotal = currentMonthData[0]?.total || 0;

  // Previous month for comparison
  const previousMonthStart = startOfMonth(subMonths(new Date(), 1));
  const previousMonthEnd = endOfMonth(subMonths(new Date(), 1));

  const previousMonthData = await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        date: { $gte: previousMonthStart, $lte: previousMonthEnd }
      }
    },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  const previousMonthTotal = previousMonthData[0]?.total || 0;
  const monthComparison = previousMonthTotal > 0
    ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100
    : 100;

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      joinedDate: user.createdAt
    },
    stats: {
      totalExpenses,
      totalTransactions,
      averageDailyExpense: parseFloat(averageDailyExpense.toFixed(2)),
      largestExpense: largestExpense?.amount || 0,
      favoriteCategory,
      monthlyBudget: user.monthlyBudget || 0
    },
    monthlySummary: formattedMonthlyData,
    categoryBreakdown: formattedCategoryData,
    recentTransactions: formattedRecentTransactions,
    currentMonth: {
      total: currentMonthTotal,
      comparedToLastMonth: parseFloat(monthComparison.toFixed(2))
    },
    period: {
      startDate,
      endDate
    }
  };
};

export const getSpendingTrends = async (userId: string, months: number = 12) => {
  const endDate = new Date();
  const startDate = subMonths(endDate, months);

  const trends = await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" }
        },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
        categories: { $push: "$category" }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $project: {
        period: {
          $concat: [
            { $toString: "$_id.year" },
            "-",
            { $toString: { $cond: { if: { $lt: ["$_id.month", 10] }, then: { $concat: ["0", { $toString: "$_id.month" }] }, else: { $toString: "$_id.month" } } } }
          ]
        },
        total: 1,
        count: 1,
        topCategory: { $arrayElemAt: ["$categories", 0] }
      }
    }
  ]);

  return trends;
};

export const getCategoryInsights = async (userId: string, category: string) => {
  const sixMonthsAgo = subMonths(new Date(), 6);

  const categoryData = await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        category: category,
        date: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" }
        },
        total: { $sum: "$amount" },
        average: { $avg: "$amount" },
        count: { $sum: 1 },
        maxAmount: { $max: "$amount" },
        minAmount: { $min: "$amount" }
      }
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } }
  ]);

  const totalSpent = await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        category: category
      }
    },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  return {
    category,
    totalSpent: totalSpent[0]?.total || 0,
    monthlyTrend: categoryData,
    overallStats: {
      average: categoryData.reduce((acc, curr) => acc + curr.average, 0) / (categoryData.length || 1),
      maxAmount: Math.max(...categoryData.map(d => d.maxAmount || 0)),
      transactionCount: categoryData.reduce((acc, curr) => acc + curr.count, 0)
    }
  };
};