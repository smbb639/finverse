import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import ExcelJS from "exceljs";
import Expense from "../models/Expense";
import { Investment } from "../models/Investment";
import { InvestmentHistory } from "../models/InvestmentHistory";
import { format } from "date-fns";

export const exportUserData = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = "Finverse";
        workbook.lastModifiedBy = "Finverse";
        workbook.created = new Date();
//expenses section
        const expensesSheet = workbook.addWorksheet("Expenses");
        expensesSheet.columns = [
            { header: "Date", key: "date", width: 15 },
            { header: "Category", key: "category", width: 15 },
            { header: "Amount", key: "amount", width: 12 },
            { header: "Description", key: "description", width: 30 },
        ];

        const expenses = await Expense.find({ user: userId }).sort({ date: -1 });
        expenses.forEach((exp) => {
            expensesSheet.addRow({
                date: format(exp.date, "dd-MM-yyyy"),
                category: exp.category,
                amount: exp.amount,
                description: exp.description,
            });
        });

//investments section
        const investmentsSheet = workbook.addWorksheet("Active Investments");
        investmentsSheet.columns = [
            { header: "Script", key: "script", width: 12 },
            { header: "Name", key: "name", width: 25 },
            { header: "Type", key: "type", width: 10 },
            { header: "Quantity", key: "quantity", width: 12 },
            { header: "Avg Buy Price", key: "buyPrice", width: 15 },
            { header: "Total Value", key: "totalValue", width: 15 },
            { header: "Buy Date", key: "buyDate", width: 15 },
        ];

        const investments = await Investment.find({ user: userId });
        investments.forEach((inv) => {
            investmentsSheet.addRow({
                script: inv.symbol,
                name: inv.name,
                type: inv.type,
                quantity: inv.quantity,
                buyPrice: inv.buyPrice,
                totalValue: (inv.quantity * inv.buyPrice).toFixed(2),
                buyDate: format(inv.buyDate, "yyyy-MM-dd"),
            });
        });

//investment History (Sold)

        const historySheet = workbook.addWorksheet("Investment History");
        historySheet.columns = [
            { header: "Symbol", key: "symbol", width: 12 },
            { header: "Name", key: "name", width: 25 },
            { header: "Quantity", key: "quantity", width: 12 },
            { header: "Buy Price", key: "buyPrice", width: 15 },
            { header: "Sell Price", key: "sellPrice", width: 15 },
            { header: "Buy Date", key: "buyDate", width: 15 },
            { header: "Sell Date", key: "sellDate", width: 15 },
            { header: "PnL", key: "pnl", width: 12 },
            { header: "PnL %", key: "pnlPercent", width: 12 },
        ];

        const history = await InvestmentHistory.find({ user: userId }).sort({ sellDate: -1 });
        history.forEach((h: any) => {
            historySheet.addRow({
                symbol: h.symbol,
                name: h.name,
                quantity: h.quantity,
                buyPrice: h.buyPrice,
                sellPrice: h.sellPrice,
                buyDate: format(h.buyDate, "yyyy-MM-dd"),
                sellDate: format(h.sellDate, "yyyy-MM-dd"),
                pnl: h.pnl?.toFixed(2),
                pnlPercent: h.pnlPercent?.toFixed(2) + "%",
            });
        });

        // Styling headers
        [expensesSheet, investmentsSheet, historySheet].forEach(sheet => {
            sheet.getRow(1).font = { bold: true };
            sheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' }
            };
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + `Finverse_Export_${format(new Date(), "yyyyMMdd")}.xlsx`
        );

        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (error: any) {
        console.error("Export Error:", error);
        res.status(500).json({ message: "Failed to generate export file" });
    }
};
