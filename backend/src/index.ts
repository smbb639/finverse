import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route";
import expenseRouter from "./routes/expense.route";
import dashboardRouter from "./routes/dashboard.route";
import investmentRouter from "./routes/investment.route";
import marketRouter from "./routes/market.route";
import { connectDB } from "./config/db";
import newsRouter from "./routes/news.routes";
import chatRoutes from "./routes/chat.routes";
import calculatorsRouter from "./routes/calculators.route";
import { globalLimiter, authLimiter, apiLimiter } from "./middleware/rateLimiter";

dotenv.config();
connectDB();
const allowedOrigins = ['http://localhost:3000']
const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: allowedOrigins,
  credentials: true, // if you're using cookies or authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  // allowedHeaders: ['Content-Type', 'Authorization'],
  allowedHeaders: '*'
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(globalLimiter); 

app.use("/api", chatRoutes);
app.use("/api/auth", authLimiter, authRouter); 
app.use("/api/investment", apiLimiter, investmentRouter);
app.use("/api/dashboard", apiLimiter, dashboardRouter);
app.use("/api/expenses", apiLimiter, expenseRouter);
app.use("/api/news", apiLimiter, newsRouter);
app.use("/api/market", apiLimiter, marketRouter);
app.use("/api/calculators", apiLimiter, calculatorsRouter);

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
  console.log(` Server running on port ${PORT}`);
});

