import { Schema, model, Types } from "mongoose";

const investmentHistorySchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    symbol: String,
    name: String,

    quantity: Number,

    buyPrice: Number,
    sellPrice: Number,

    buyDate: Date,
    sellDate: Date,

    pnl: Number,
    pnlPercent: Number,

    type: {
      type: String,
      enum: ["BUY", "SELL", "STOCK", "MF", "ETF", "CRYPTO", "OTHER"],
      default: "SELL",
    }
  },
  { timestamps: true }
);

export const InvestmentHistory = model(
  "InvestmentHistory",
  investmentHistorySchema
);
