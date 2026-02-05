import express from "express";
import axios from "axios";
import { protect } from "../middleware/auth.middleware";
import { getNews } from "../controller/news.controller";

const router = express.Router();

router.get("/", getNews);
export default router;
