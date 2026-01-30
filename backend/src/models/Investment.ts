import { Schema, model, Types } from "mongoose";

const investmentSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    symbol: {
      type: String,
      required: true,
      uppercase: true,
      index: true
    },

    name: {
      type: String,
      required: true
    },

   quantity: {
  type: Number,
  required: true,
  min: 1,
  validate: {
    validator: Number.isInteger,
    message: "Quantity must be an integer"
  }
}
,

    buyPrice: {
      type: Number,
      required: true
    },

    currentPrice: {
      type: Number,
    },

    buyDate: {
      type: Date,
      required: true
    },

    type: {
      type: String,
      enum: ["STOCK", "MF", "ETF", "CRYPTO", "OTHER"],
      default: "STOCK"
    }
  },
  { timestamps: true }
);

export const Investment = model("Investment", investmentSchema);
