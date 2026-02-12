import Expense, { IExpense } from "../models/Expense";
import User from "../models/User";
import mongoose from "mongoose";


export const createExpense = async (
  userId: string,
  amount: number,
  category: string,
  description?: string,
  date?: Date,
  goalId?: string
) => {
  const expenseData: any = {
    user: userId,
    amount,
    category,
    date: date || new Date()
  };

  if (description) {
    expenseData.description = description;
  }

  if (goalId) {
    expenseData.goal = goalId;
  }

  const expense = await Expense.create(expenseData);

  // Synchronize with User document for Compass visibility
  await User.findByIdAndUpdate(userId, {
    $inc: {
      totalLifetimeSpent: amount,
      [`categoryExpenses.${category}`]: amount
    },
    $push: {
      recentExpenses: {
        $each: [{
          description: description || "No description",
          amount,
          category,
          date: expense.date
        }],
        $slice: -5 // Keep only the last 5
      }
    }
  });

  return expense;
};

export const getExpenses = async (
  userId: string,
  filters?: {
    category?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    skip?: number;
    search?: string;
  }
) => {
  const query: any = { user: userId };

  if (filters?.category) {
    query.category = filters.category;
  }

  if (filters?.search) {
    query.$or = [
      { description: { $regex: filters.search, $options: 'i' } },
      { category: { $regex: filters.search, $options: 'i' } }
    ];
  }

  if (filters?.startDate || filters?.endDate) {
    query.date = {};
    if (filters.startDate) {
      query.date.$gte = filters.startDate;
    }
    if (filters.endDate) {
      query.date.$lte = filters.endDate;
    }
  }

  const [expenses, total] = await Promise.all([
    Expense.find(query)
      .sort({ date: -1 })
      .limit(filters?.limit || 100)
      .skip(filters?.skip || 0),
    Expense.countDocuments(query)
  ]);

  return { expenses, total };
};

export const getExpenseById = async (expenseId: string, userId: string) => {
  const expense = await Expense.findOne({ _id: expenseId, user: userId });
  return expense;
};

export const updateExpense = async (
  expenseId: string,
  userId: string,
  updates: {
    amount?: number;
    category?: string;
    description?: string;
    date?: Date;
  }
) => {
  const oldExpense = await Expense.findOne({ _id: expenseId, user: userId });
  if (!oldExpense) return null;

  const expense = await Expense.findOneAndUpdate(
    { _id: expenseId, user: userId },
    updates,
    { new: true, runValidators: true }
  );

  if (expense) {
    const amountDiff = (updates.amount !== undefined) ? (updates.amount - oldExpense.amount) : 0;

    const updateQuery: any = { $inc: { totalLifetimeSpent: amountDiff } };

    if (updates.category && updates.category !== oldExpense.category) {
      // Category changed
      updateQuery.$inc[`categoryExpenses.${oldExpense.category}`] = -oldExpense.amount;
      updateQuery.$inc[`categoryExpenses.${updates.category}`] = expense.amount;
    } else if (amountDiff !== 0) {
      // Same category, different amount
      updateQuery.$inc[`categoryExpenses.${oldExpense.category}`] = amountDiff;
    }

    await User.findByIdAndUpdate(userId, updateQuery);
  }

  return expense;
};

export const deleteExpense = async (expenseId: string, userId: string) => {
  const expense = await Expense.findOneAndDelete({ _id: expenseId, user: userId });

  if (expense) {
    // Reverse the synchronization
    await User.findByIdAndUpdate(userId, {
      $inc: {
        totalLifetimeSpent: -expense.amount,
        [`categoryExpenses.${expense.category}`]: -expense.amount
      }
    });
  }

  return expense;
};

export const getExpenseSummary = async (
  userId: string,
  startDate?: Date,
  endDate?: Date
) => {
  const query: any = { user: new mongoose.Types.ObjectId(userId) };

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate;
    if (endDate) query.date.$lte = endDate;
  }

  const summary = await Expense.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    },
    { $sort: { total: -1 } }
  ]);

  const totalExpenses = await Expense.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    }
  ]);

  return {
    byCategory: summary,
    total: totalExpenses[0]?.total || 0,
    count: totalExpenses[0]?.count || 0
  };
};