import { Request, Response } from "express";
import { calculatePositionSize, calculateLoan } from "../services/calculators.services";

export const positionSizingCalculator = (req: Request, res: Response) => {
    try {
        const result = calculatePositionSize(req.body);

        res.status(200).json({
            success: true,
            calculator: "position-sizing",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const loanCalculator = (req: Request, res: Response) => {
    try {
        const result = calculateLoan(req.body);

        res.status(200).json({
            success: true,
            calculator: "loan",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
