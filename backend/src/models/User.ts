import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  monthlyBudget: number;
  startingBalance: number;
  totalLifetimeSpent: number;
  categoryExpenses: Record<string, number>;
  recentExpenses: Array<{ description: string; amount: number; category: string; date: Date }>;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    monthlyBudget: {
      type: Number,
      default: 0
    },
    startingBalance: {
      type: Number,
      default: 0
    },
    totalLifetimeSpent: {
      type: Number,
      default: 0
    },
    categoryExpenses: {
      type: Map,
      of: Number,
      default: {}
    },
    recentExpenses: [
      {
        description: String,
        amount: Number,
        category: String,
        date: { type: Date, default: Date.now }
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
