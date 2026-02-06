import api from './api';

export interface PositionSizingData {
    capital: number;
    riskPercent: number;
    entryPrice: number;
    stopLoss: number;
}

export interface PositionSizingResult {
    riskAmount: number;
    riskPerShare: number;
    quantity: number;
    positionValue: number;
}

export interface LoanData {
    principal: number;
    interestRate: number;
    tenure: number;
    tenureType?: 'years' | 'months';
}

export interface LoanResult {
    monthlyEmi: number;
    totalInterest: number;
    totalPayment: number;
    tenureMonths: number;
}

export const calculatorService = {
    calculatePositionSize: async (data: PositionSizingData): Promise<PositionSizingResult> => {
        const response = await api.post('/calculators/position-sizing', data);
        return response.data.data;
    },
    calculateLoan: async (data: LoanData): Promise<LoanResult> => {
        const response = await api.post('/calculators/loan', data);
        return response.data.data;
    }
};
