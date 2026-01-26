import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import {
  addExpense,
  getAllExpenses,
  getExpense,
  updateExpenseController,
  removeExpense,
  getSummary
} from "../controller/expense.controller";

const expenseRouter = Router();

expenseRouter.use(protect);

expenseRouter.post("/", addExpense);
expenseRouter.get("/", getAllExpenses);
expenseRouter.get("/summary", getSummary);
expenseRouter.get("/:id", getExpense);
expenseRouter.put("/:id", updateExpenseController);
expenseRouter.delete("/:id", removeExpense);

export default expenseRouter;