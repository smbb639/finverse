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

export const calculatorService = {
    calculatePositionSize: async (data: PositionSizingData): Promise<PositionSizingResult> => {
        const response = await api.post('/calculators/position-sizing', data);
        return response.data.data;
    }
};
