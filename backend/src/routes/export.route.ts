import { Router } from "express";
import { exportUserData } from "../controller/export.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/all", protect, exportUserData);

export default router;
