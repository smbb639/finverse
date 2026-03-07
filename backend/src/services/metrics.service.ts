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

    const pricePromises = investments.map(async (inv) => {
        try {
            return await getLivePrice(inv.symbol);
        } catch (error) {
            console.error(`Failed to fetch price for ${inv.symbol}:`, error);
            return inv.buyPrice; // Fallback to buy price if live price fails
        }
    });
    const livePrices = await Promise.all(pricePromises);

    let totalCost = 0;
    let totalCurrent = 0;
    const now = new Date();

    // 1. Calculate total cost first for proper weighting
    investments.forEach((inv) => {
        totalCost += inv.buyPrice * inv.quantity;
    });

    if (totalCost === 0) {
        return {
            totalCost: 0,
            totalCurrent: 0,
            roi: 0,
            cagr: 0,
            sharpe: 0,
            benchmark: { symbol: "SPY", currentPrice: 0, note: "No investment data" }
        };
    }

    let weightedYears = 0;
    investments.forEach((inv, idx) => {
        const qty = inv.quantity;
        const cost = inv.buyPrice * qty;
        const current = livePrices[idx] * qty;
        totalCurrent += current;

        const heldYears = yearsBetween(inv.buyDate, now);
        // Ensure heldYears is at least a small fraction to avoid CAGR issues with same-day buys
        const effectiveHeldYears = Math.max(heldYears, 0.001);
        weightedYears += effectiveHeldYears * (cost / totalCost);
    });

    const roi = (totalCurrent - totalCost) / totalCost;
    const years = Math.max(weightedYears, 0.01); // Avoid division by zero

    // CAGR calculation with safety check
    const ratio = totalCurrent / totalCost;
    const cagr = ratio > 0 ? Math.pow(ratio, 1 / years) - 1 : -1;

    const riskFreeRate = 0.05;
    const annualReturn = years > 0 ? roi / years : 0;
    const stdDev = 0.12;
    const sharpe = (annualReturn - riskFreeRate) / stdDev;

    const benchmarkSymbol = "^NSEI"; // NIFTY 50
    let benchmarkPrice = 0;
    try {
        benchmarkPrice = await getLivePrice(benchmarkSymbol);
    } catch (e) {
        console.error("Failed to fetch benchmark price");
    }

    const benchmark = {
        symbol: "NIFTY 50",
        currentPrice: benchmarkPrice,
        note: "Benchmark comparison uses current price of NIFTY 50 index.",
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
