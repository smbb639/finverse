import api from './api';

export interface Investment {
  _id: string;
  user: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice?: number;
  buyDate: string;
  type: 'STOCK' | 'MF' | 'ETF' | 'CRYPTO' | 'OTHER';
  createdAt?: string;
  updatedAt?: string;
}

export interface InvestmentWithMetrics extends Investment {
  pnl?: number;
  pnlPercent?: number;
  dailyPnL?: number | null;
  dailyPnLPercent?: number | null;
  priceError?: boolean;
}

export interface InvestmentFormData {
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  buyDate: string;
  type: 'STOCK' | 'MF' | 'ETF' | 'CRYPTO' | 'OTHER';
}

export const investmentService = {
  // Get all investments for the current user
  async getInvestments(): Promise<InvestmentWithMetrics[]> {
    const response = await api.get('/investment');
    return response.data.data;
  },

  // Add a new investment
  async addInvestment(data: InvestmentFormData): Promise<Investment> {
    const response = await api.post('/investment', data);
    return response.data.data;
  },

  // Update an investment
  async updateInvestment(id: string, data: Partial<InvestmentFormData>): Promise<Investment> {
    const response = await api.put(`/investment/${id}`, data);
    return response.data.data;
  },

  // Sell an investment (moves to history)
  async sellInvestment(id: string, sellPrice: number, sellDate: string): Promise<void> {
    await api.post(`/investment/${id}/sell`, { sellPrice, sellDate });
  },

  // Delete an investment (removes permanently)
  async deleteInvestment(id: string): Promise<void> {
    await api.delete(`/investment/${id}`);
  },
};