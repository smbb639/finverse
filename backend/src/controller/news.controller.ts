import { AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";
import axios from "axios";

let cachedNews: any = null;
let lastFetched = 0;
const CACHE_DURATION = 10 * 60 * 1000;


export const getNews = async (req: AuthRequest, res: Response) => {
    try {
        const now = Date.now();
        const forceRefresh = req.query.force === 'true';

        console.log(`[NewsAPI] Fetch request received. forceRefresh: ${forceRefresh}`);

        if (!forceRefresh && cachedNews && now - lastFetched < CACHE_DURATION) {
            console.log(`[NewsAPI] Returning cached news (age: ${Math.round((now - lastFetched) / 1000)}s)`);
            return res.status(200).json(cachedNews);
        }

        console.log(`[NewsAPI] Fetching fresh news from NewsAPI.org...`);

        const response = await axios.get(
            "https://newsapi.org/v2/everything",
            {
                params: {
                    q: "stock market OR finance OR economy",
                    language: "en",
                    sortBy: "publishedAt",
                    pageSize: 20,
                    apiKey: process.env.NEWS_API_KEY
                }
            }
        );

        cachedNews = response.data;
        lastFetched = now;

        return res.status(200).json(cachedNews);

    } catch (error: any) {
        console.error(error?.response?.data || error.message);

        return res.status(500).json({
            message: "Failed to fetch news"
        });
    }
};

