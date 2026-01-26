import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  category: string;
  description: string;
  date: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Food",
        "Transportation",
        "Shopping",
        "Bills",
        "Entertainment",
        "Healthcare",
        "Education",
        "Travel",
        "Investments",
        "Other"
      ]
    },
    description: {
      type: String,
      trim: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
ExpenseSchema.index({ user: 1, date: -1 });

export default mongoose.model<IExpense>("Expense", ExpenseSchema);