import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import axios from "axios";

interface MarketCache {
    data: any;
    timestamp: number;
}

let marketCache: MarketCache | null = null;
const CACHE_DURATION = 5 * 60 * 1000;

interface IndexData {
    symbol: string;
    name: string;
    currentPrice: number;
    change: number;
    changePercent: number;
    isPositive: boolean;
}

const fetchMarketData = async (): Promise<IndexData[]> => {
    try {
        const symbols = [
            { symbol: "^NSEI", name: "NIFTY 50" },
            { symbol: "^BSESN", name: "SENSEX" },
            { symbol: "^NSEBANK", name: "Bank NIFTY" }
        ];

        const results: IndexData[] = [];

        for (const index of symbols) {
            try {
                const response = await axios.get(
                    `https://query1.finance.yahoo.com/v8/finance/chart/${index.symbol}?interval=1d&range=1d`,
                    {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        },
                        timeout: 5000
                    }
                );

                const result = response.data?.chart?.result?.[0];
                if (result) {
                    const meta = result.meta;
                    const currentPrice = meta.regularMarketPrice || 0;
                    const previousClose = meta.chartPreviousClose || meta.previousClose || currentPrice;
                    const change = currentPrice - previousClose;
                    const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

                    results.push({
                        symbol: index.symbol,
                        name: index.name,
                        currentPrice: parseFloat(currentPrice.toFixed(2)),
                        change: parseFloat(change.toFixed(2)),
                        changePercent: parseFloat(changePercent.toFixed(2)),
                        isPositive: change >= 0
                    });
                }
            } catch (err) {
                console.error(`Failed to fetch ${index.name}:`, err);
                results.push({
                    symbol: index.symbol,
                    name: index.name,
                    currentPrice: 0,
                    change: 0,
                    changePercent: 0,
                    isPositive: true
                });
            }
        }

        return results;
    } catch (error) {
        console.error("Error fetching market data:", error);
        throw error;
    }
};

export const getMarketSnapshot = async (req: AuthRequest, res: Response) => {
    try {
        const now = Date.now();

        if (marketCache && (now - marketCache.timestamp) < CACHE_DURATION) {
            console.log("Returning cached market data");
            return res.status(200).json({
                success: true,
                data: marketCache.data,
                cached: true,
                cacheAge: Math.round((now - marketCache.timestamp) / 1000)
            });
        }

        console.log("Fetching fresh market data");
        const marketData = await fetchMarketData();

        marketCache = {
            data: {
                indices: marketData,
                lastUpdated: new Date().toISOString()
            },
            timestamp: now
        };

        res.status(200).json({
            success: true,
            data: marketCache.data,
            cached: false
        });
    } catch (error: any) {
        if (marketCache) {
            return res.status(200).json({
                success: true,
                data: marketCache.data,
                cached: true,
                stale: true,
                error: "Failed to fetch fresh data, returning cached data"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch market data"
        });
    }
};
