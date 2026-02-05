import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route";
import expenseRouter from "./routes/expense.route";
import dashboardRouter from "./routes/dashboard.route";
import investmentRouter from "./routes/investment.route";
import { connectDB } from "./config/db";
import newsRouter from "./routes/news.routes";

dotenv.config();
connectDB();
const app: Application = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRouter);
app.use("/api/investment", investmentRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/news", newsRouter)

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});


app.use((err: any, req: any, res: any, next: any) => {
  console.error("GLOBAL ERROR:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

