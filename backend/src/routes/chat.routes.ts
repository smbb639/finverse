import { Router } from "express";
import { chatController } from "../controller/chat.controller";

const router = Router();

import { apiLimiter } from "../middleware/rateLimiter";

router.post("/chat", apiLimiter, chatController);

export default router;
