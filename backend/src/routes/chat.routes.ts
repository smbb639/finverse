import { Router } from "express";
import { chatController } from "../controller/chat.controller";
import { protect } from "../middleware/auth.middleware";
import { apiLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/chat", protect, apiLimiter, chatController);

export default router;
