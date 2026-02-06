import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { getMarketSnapshot } from "../controller/market.controller";

const marketRouter = Router();

marketRouter.get("/snapshot", protect, getMarketSnapshot);

export default marketRouter;
