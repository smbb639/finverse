import { Response } from "express";
import { Investment } from "../models/Investment";
import { InvestmentHistory } from "../models/InvestmentHistory";
import { getLivePrice } from "../services/marketPrice.services";
import { AuthRequest } from "../middleware/auth.middleware";
import { searchSymbols } from "../services/marketPrice.services";

export const addInvestment = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  try {

    const {
      symbol,
      name,
      quantity,
      buyPrice,
      buyDate,
      type
    } = req.body;
    const livePrice = await getLivePrice(symbol);

  if(!livePrice || livePrice <=0) {
      return res.status(400).json({
        success: false,
        message: "invalid symbol"
      })
    }

    const existing = await Investment.findOne({
      user: userId,
      symbol
    });
    if (existing) {
      const totalQuantity = existing.quantity + quantity;

      const avgBuyPrice =
        (existing.quantity * existing.buyPrice +
          quantity * buyPrice) /
        totalQuantity;

      existing.buyPrice = Number(avgBuyPrice.toFixed(2));
      existing.quantity = totalQuantity;
      existing.updatedAt = new Date();

      await existing.save();
      return res.json({
        success: true,
        message: "Investment updated",
        data: existing
      });
    }
    const investment = await Investment.create({
      user: userId,
      symbol,
      name,
      quantity,
      buyPrice,
      buyDate,
      type
    });

    res.status(201).json({ success: true, data: investment });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const getInvestments = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const investments = await Investment.find({ user: userId });

    const enriched = await Promise.all(
      investments.map(async (inv) => {
        try {
          const livePrice = await getLivePrice(inv.symbol);

          const pnl =
            (livePrice - inv.buyPrice) * inv.quantity;

          const pnlPercent =
            ((livePrice - inv.buyPrice) / inv.buyPrice) * 100;

          return {
            ...inv.toObject(),
            currentPrice: livePrice,
            pnl,
            pnlPercent
          };
        } catch {
          // 🔥 If price fails, don’t crash portfolio
          return {
            ...inv.toObject(),
            currentPrice: null,
            pnl: null,
            pnlPercent: null,
            priceError: true
          };
        }
      })
    );

    res.json({ success: true, data: enriched });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch investments"
    });
  }
};

export const updateInvestment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  try {
    const investment = await Investment.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { new: true }
    );

    if (!investment) {
      return res.status(404).json({ message: "Investment not found" });
    }

    res.json({ success: true, data: investment });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const sellInvestment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { sellPrice, sellDate } = req.body;
  const userId = req.user?.id;

  if (!sellPrice || !sellDate) {
    return res.status(400).json({ message: 'Sell price and date required' });
  }

  try {
    const investment = await Investment.findOne({ _id: id, user: userId });

    if (!investment) {
      return res.status(404).json({ message: 'Not found' });
    }

    const pnl = (sellPrice - investment.buyPrice) * investment.quantity;
    const pnlPercent =
      ((sellPrice - investment.buyPrice) / investment.buyPrice) * 100;

    await InvestmentHistory.create({
      user: userId,
      symbol: investment.symbol,
      name: investment.name,
      quantity: investment.quantity,
      buyPrice: investment.buyPrice,
      sellPrice,
      buyDate: investment.buyDate,
      sellDate,
      pnl,
      pnlPercent,
      type: investment.type
    });

    await investment.deleteOne();

    res.json({ success: true, message: 'Investment exited' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const deleteInvestment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const investment = await Investment.findOneAndDelete({ _id: id, user: userId });

    if (!investment) {
      return res.status(404).json({ success: false, message: "Investment not found" });
    }

    res.json({ success: true, message: "Investment deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const searchInvestmentSymbols = async (req: AuthRequest, res: Response) => {
  try {
    let q = String(req.query.q || "")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");

    if (q.length < 2) {
      return res.json({ success: true, data: [] });
    }

    const results = await searchSymbols(q);

    res.json({ success: true, data: results });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ success: false, message: "Search failed" });
  }
};

