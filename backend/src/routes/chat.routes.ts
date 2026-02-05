import { Router } from "express";
import { chatController } from "../controller/chat.controller";

const router = Router();

router.post("/chat", chatController);

export default router;
