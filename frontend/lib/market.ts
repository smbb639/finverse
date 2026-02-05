import api from './api';

export interface IndexData {
    symbol: string;
    name: string;
    currentPrice: number;
    change: number;
    changePercent: number;
    isPositive: boolean;
}

export interface MarketSnapshot {
    indices: IndexData[];
    lastUpdated: string;
}

export const marketService = {
    async getSnapshot() {
        const response = await api.get<{
            success: boolean;
            data: MarketSnapshot;
            cached: boolean;
            cacheAge?: number;
        }>('/market/snapshot');
        return response.data.data;
    }
};
