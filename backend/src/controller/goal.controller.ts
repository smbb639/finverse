import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware"; // Assuming you have this
import { createGoal, getUserGoal, deleteGoalService } from "../services/goal.services";

export const addGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { title, targetAmount, deadline, description } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!title || !targetAmount || !deadline) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const goal = await createGoal(userId, {
      title,
      targetAmount: Number(targetAmount),
      deadline: new Date(deadline),
      description,
    });

    res.status(201).json({ message: "Goal set successfully", goal });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const goals = await getUserGoal(userId);

    res.status(200).json(goals);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const id = req.params.id as string;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const result = await deleteGoalService(id, userId);
        if(!result) return res.status(404).json({ message: "Goal not found" });

        res.status(200).json({ message: "Goal deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}