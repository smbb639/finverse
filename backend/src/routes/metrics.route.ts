import { Router } from "express";
import { getMetrics } from "../controller/metrics.controller";
import { protect } from "../middleware/auth.middleware";
import { apiLimiter } from "../middleware/rateLimiter";

const metricsRouter = Router();

metricsRouter.use(protect);

metricsRouter.get("/:userId", getMetrics);

export default metricsRouter;
