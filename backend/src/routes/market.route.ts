import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { getMarketSnapshot } from "../controller/market.controller";

const marketRouter = Router();

marketRouter.use(protect);
marketRouter.get("/snapshot", getMarketSnapshot);

export default marketRouter;
