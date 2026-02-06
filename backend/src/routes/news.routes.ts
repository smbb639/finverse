import express from "express";
import { protect } from "../middleware/auth.middleware";
import { getNews } from "../controller/news.controller";

const router = express.Router();

router.get("/", protect, getNews);
export default router;
