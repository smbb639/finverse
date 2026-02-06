import { Router } from "express";
import { positionSizingCalculator } from "../controller/calculators.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/position-sizing", positionSizingCalculator);

export default router;
