import express from "express";
import { addGoal, getGoals, deleteGoal } from "../controller/goal.controller";
import { protect } from "../middleware/auth.middleware"; // Your auth middleware

const router = express.Router();

router.post("/", protect, addGoal);
router.get("/", protect, getGoals);
router.delete("/:id", protect, deleteGoal);

export default router;