import { Response, NextFunction } from "express";
import { getPortfolioMetrics } from "../services/metrics.service";
import { AuthRequest } from "../middleware/auth.middleware";


export const getMetrics = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let userId = req.params.userId as string;

        if (userId === "me" && req.user) {
            userId = req.user.id;
        }

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const metrics = await getPortfolioMetrics(userId);
        return res.json({ success: true, data: metrics });
    } catch (err) {
        next(err);
    }
};
