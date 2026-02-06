import { Router } from "express";
import { positionSizingCalculator, loanCalculator } from "../controller/calculators.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/position-sizing", positionSizingCalculator);
router.post("/loan", loanCalculator);

export default router;
