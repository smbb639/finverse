import { Investment } from "../models/Investment";
import { getLivePrice } from "./marketPrice.services";
import { Types } from "mongoose";


const yearsBetween = (start: Date, end: Date): number => {
    const msInYear = 365.25 * 24 * 60 * 60 * 1000;
    return (end.getTime() - start.getTime()) / msInYear;
};


export const getPortfolioMetrics = async (userId: string) => {

    const investments = await Investment.find({ user: new Types.ObjectId(userId) });
    if (!investments.length) {
        return { message: "No investments found for this user." };
    }

    const pricePromises = investments.map((inv) => getLivePrice(inv.symbol));
    const livePrices = await Promise.all(pricePromises);

    let totalCost = 0;
    let totalCurrent = 0;
    let weightedYears = 0; 
    const now = new Date();

    investments.forEach((inv, idx) => {
        const qty = inv.quantity;
        const cost = inv.buyPrice * qty;
        const current = livePrices[idx] * qty;
        totalCost += cost;
        totalCurrent += current;
        const heldYears = yearsBetween(inv.buyDate, now);
        weightedYears += heldYears * (cost / totalCost);
    });

    const roi = (totalCurrent - totalCost) / totalCost;
    const years = weightedYears || yearsBetween(investments[0].buyDate, now);
    const cagr = Math.pow(totalCurrent / totalCost, 1 / years) - 1;

    const riskFreeRate = 0.05; 
    const annualReturn = roi / years;
    const stdDev = 0.12; 
    const sharpe = (annualReturn - riskFreeRate) / stdDev;

    const benchmarkSymbol = "SPY";
    const benchmarkPrice = await getLivePrice(benchmarkSymbol);
    const benchmark = {
        symbol: benchmarkSymbol,
        currentPrice: benchmarkPrice,
        note: "Benchmark comparison uses current price only; historic data needed for proper return calculation.",
    };

    return {
        totalCost,
        totalCurrent,
        roi,
        cagr,
        sharpe,
        benchmark,
    };
};
