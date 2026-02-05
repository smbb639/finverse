import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import {
  getDashboard,
  getTrends,
  getCategoryAnalysis,
  getQuickStats,
  getCategoryBreakdown
} from "../controller/dashboard.controller";

const dashboardRouter = Router();

// All dashboard routes are protected
dashboardRouter.use(protect);

// Main dashboard endpoint
dashboardRouter.get("/", getDashboard);

// Spending trends over time
dashboardRouter.get("/trends", getTrends);

// Quick stats (today, week, month)
dashboardRouter.get("/quick-stats", getQuickStats);

// Category breakdown by period (daily, weekly, monthly, currentMonth)
dashboardRouter.get("/category-breakdown", getCategoryBreakdown);

// Detailed category analysis
dashboardRouter.get("/category/:category", getCategoryAnalysis);

export default dashboardRouter;