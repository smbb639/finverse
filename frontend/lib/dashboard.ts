import api from './api';

export interface DashboardStats {
  user: {
    id: string;
    name: string;
    email: string;
    joinedDate: string;
  };
  stats: {
    totalExpenses: number;
    totalTransactions: number;
    averageDailyExpense: number;
    largestExpense: number;
    favoriteCategory: string;
    monthlyBudget: number;
  };
  monthlySummary: Array<{
    month: string;
    year: number;
    total: number;
    transactions: number;
  }>;
  dailySummary?: Array<{
    date: string;
    total: number;
    count: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
    count: number;
  }>;
  recentTransactions: Array<{
    id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
  }>;
  currentMonth: {
    total: number;
    count: number;
    comparedToLastMonth: number;
  };
}

export interface QuickStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  dailyChange: number;
  isIncreasing: boolean;
}

export interface SpendingTrend {
  period: string;
  total: number;
  count: number;
  topCategory: string;
}

export const dashboardService = {
  async getDashboardData(filters?: {
    startDate?: string;
    endDate?: string;
    category?: string;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<{ success: boolean; data: DashboardStats }>(
      `/dashboard${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data.data;
  },

  async getQuickStats() {
    const response = await api.get<{ success: boolean; data: QuickStats }>('/dashboard/quick-stats');
    return response.data.data;
  },

  async getSpendingTrends(months: number = 12) {
    const response = await api.get<{ success: boolean; data: SpendingTrend[] }>(
      `/dashboard/trends?months=${months}`
    );
    return response.data.data;
  },

  async getCategoryInsights(category: string) {
    const response = await api.get<{ success: boolean; data: any }>(`/dashboard/category/${category}`);
    return response.data.data;
  },
};