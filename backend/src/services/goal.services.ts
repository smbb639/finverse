import mongoose from "mongoose"; 
import Expense from "../models/Expense";
import Goal, {IGoal} from "../models/Goal";

export const createGoal = async (userId: string, data:Partial<IGoal>)=>{
    return await Goal.create({...data, user: userId}
    )
}

export const getUserGoal = async (userId: string) => {
    const goals = await Goal.find({user: userId}).lean();
    const goalsWithProgress = await Promise.all(
        goals.map(async (goal)=>{
           const aggregation = await Expense.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            goal: goal._id,
          },
        },
        {
          $group: {
            _id: null,
            totalSaved: { $sum: "$amount" },
            firstContribution: { $min: "$date" },
            lastContribution: { $max: "$date" },
          },
        },
      ]);
    const stats = aggregation[0] || {totalSaved:0, firstContribution: new Date()}
    const currAmount = stats.totalSaved;
    const progressPercentage = Math.min(currAmount/goal.targetAmount)
    const remainingAmount = Math.max(goal.targetAmount-currAmount,0)
    const insight = generateGoalInsight(goal, currAmount, remainingAmount, stats.firstContribution)
    return {
        ...goal,
        progressPercentage,
        currAmount,
        insight
            };

        })
    );
    return goalsWithProgress;
};

const generateGoalInsight = (
  goal: any, 
  current: number, 
  remaining: number, 
  firstDate: Date
): string => {
  if (current === 0) return "Start saving today to hit your target!";
  if (remaining === 0) return "Goal Achieved!";

  const today = new Date();
  const deadline = new Date(goal.deadline);
  
  const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const daysSinceStart = Math.max(1, Math.ceil((today.getTime() - new Date(firstDate).getTime()) / (1000 * 60 * 60 * 24)));
  const avgDailySaving = current / daysSinceStart; 

  const daysToFinishAtCurrentSpeed = avgDailySaving > 0 ? Math.ceil(remaining / avgDailySaving) : 9999;
  
  if (daysUntilDeadline <= 0) {
      return `Deadline passed. You are ₹${remaining.toLocaleString()} short.`;
  }

  if (daysToFinishAtCurrentSpeed < daysUntilDeadline) {
      const earlyDays = daysUntilDeadline - daysToFinishAtCurrentSpeed;
      return `Great pace! At this rate, you'll finish ${earlyDays} days early.`;
  }

  const requiredDaily = remaining / daysUntilDeadline;
  const weeklyTopUp = Math.ceil((requiredDaily - avgDailySaving) * 7);
  
  if (weeklyTopUp > 0) {
     return `Increase savings by ₹${weeklyTopUp.toLocaleString()} / week to finish on time.`;
  }
  
  return `You are on track to meet your deadline.`;
};

// 3. Delete Goal
export const deleteGoalService = async (goalId: string, userId: string) => {

    await Expense.updateMany({ goal: goalId, user: userId }, { $set: { goal: null } });
    return await Goal.findOneAndDelete({ _id: goalId, user: userId });
};