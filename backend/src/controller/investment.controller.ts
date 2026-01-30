import { Response } from "express";
import { Investment } from "../models/Investment";
import { InvestmentHistory } from "../models/InvestmentHistory";
import { getLivePrice } from "../services/marketPrice.services";
import { AuthRequest } from "../middleware/auth.middleware";

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
    })
  );

  res.json({ success: true, data: enriched });
        } catch (err: any) {
            res.status(500).json({ success: false, message: err.message });
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
export const deleteInvestment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { sellPrice, sellDate } = req.body;
  const userId = req.user?.id;
try {
  const investment = await Investment.findOne({
    _id: id,
    user: userId
  });

  if (!investment) {
    return res.status(404).json({ message: "Not found" });
  }

  const pnl =
    (sellPrice - investment.buyPrice) * investment.quantity;

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

  res.json({ success: true, message: "Investment exited" });
        } catch (err: any) {
            res.status(500).json({ success: false, message: err.message });
        }
};
