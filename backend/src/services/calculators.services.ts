export const calculatePositionSize = ({
    capital,
    riskPercent,
    entryPrice,
    stopLoss
}: {
    capital: number;
    riskPercent: number;
    entryPrice: number;
    stopLoss: number;
}) => {
    const riskAmount = (capital * riskPercent) / 100;
    const riskPerShare = Math.abs(entryPrice - stopLoss);

    if (riskPerShare === 0) {
        throw new Error("Entry price and stop loss cannot be same");
    }

    const quantity = Math.floor(riskAmount / riskPerShare);
    const positionValue = quantity * entryPrice;

    return {
        riskAmount,
        riskPerShare,
        quantity,
        positionValue
    };
};

export const calculateLoan = ({
    principal,
    interestRate,
    tenure,
    tenureType ,
}: {
    principal: number;
    interestRate: number;
    tenure: number;
    tenureType?: 'years' | 'months';
}) => {
    const months = tenureType === 'years' ? tenure * 12 : tenure;
    const monthlyRate = interestRate / (12 * 100);

    if (monthlyRate === 0) {
        const emi = principal / months;
        return {
            monthlyEmi: emi,
            totalInterest: 0,
            totalPayment: principal
        };
    }

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    return {
        monthlyEmi: Math.round(emi * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        totalPayment: Math.round(totalPayment * 100) / 100,
        tenureMonths: months
    };
};
