import express from "express";
import { addGoal, getGoals, deleteGoal } from "../controller/goal.controller";
import { protect } from "../middleware/auth.middleware"; // Your auth middleware

const router = express.Router();

router.use(protect)

router.post("/", addGoal);
router.get("/", getGoals);
router.delete("/:id", deleteGoal);

export default router;