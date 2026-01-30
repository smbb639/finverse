import { Router } from "express";
import {
  addInvestment,
  getInvestments,
  updateInvestment,
  deleteInvestment
} from "../controller/investment.controller";
import { protect } from "../middleware/auth.middleware";

const investmentRouter = Router();    


investmentRouter.use(protect)
investmentRouter.post("/", addInvestment);
investmentRouter.get("/", getInvestments);
investmentRouter.put("/:id", updateInvestment);
investmentRouter.delete("/:id", deleteInvestment);

export default investmentRouter;
