import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.services";
import User from "../models/User";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, startingBalance } = req.body;

    const user = await registerUser(name, email, password, startingBalance);

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const token = await loginUser(email, password);

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      }
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};
