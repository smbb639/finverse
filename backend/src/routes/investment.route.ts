import { Router } from "express";
import {
  addInvestment,
  getInvestments,
  updateInvestment,
  sellInvestment,
  deleteInvestment,
  searchInvestmentSymbols
} from "../controller/investment.controller";
import { protect } from "../middleware/auth.middleware";

const investmentRouter = Router();


investmentRouter.use(protect)
investmentRouter.post("/", addInvestment);
investmentRouter.get("/search-symbols", searchInvestmentSymbols);
investmentRouter.get("/", getInvestments);
investmentRouter.put("/:id", updateInvestment);
investmentRouter.post("/:id/sell", sellInvestment);
investmentRouter.delete("/:id", deleteInvestment);

export default investmentRouter;
