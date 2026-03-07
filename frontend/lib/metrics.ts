import api from './api';

export interface PortfolioMetrics {
    totalCost: number;
    totalCurrent: number;
    roi: number;
    cagr: number;
    sharpe: number;
    benchmark: {
        symbol: string;
        currentPrice: number;
        note: string;
    };
}

export const metricsService = {
    getPortfolioMetrics: async (): Promise<PortfolioMetrics> => {
        const res = await api.get('/metrics/me');
        return res.data.data;
    },
};
