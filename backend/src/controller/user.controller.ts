import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import User from "../models/User";

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?.id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, data: user });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { name, monthlyBudget, startingBalance } = req.body;
        const user = await User.findById(req.user?.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (name) user.name = name;
        if (monthlyBudget !== undefined) user.monthlyBudget = monthlyBudget;
        if (startingBalance !== undefined) user.startingBalance = startingBalance;

        await user.save();

        res.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                monthlyBudget: user.monthlyBudget,
                startingBalance: user.startingBalance
            }
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};
