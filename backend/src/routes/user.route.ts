import express from "express";
import { protect } from "../middleware/auth.middleware";
import {updateProfile, getProfile} from "../controller/user.controller";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.patch("/profile", protect, updateProfile);

export default router;
