export interface DashboardStats {
  totalExpenses: number;
  totalTransactions: number;
  averageDailyExpense: number;
  largestExpense: number;
  favoriteCategory: string;
}

export interface MonthlySummary {
  month: string;
  year: number;
  total: number;
  transactions: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface RecentTransaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
}

export interface DashboardResponse {
  user: {
    id: string;
    name: string;
    email: string;
    joinedDate: Date;
  };
  stats: DashboardStats;
  monthlySummary: MonthlySummary[];
  categoryBreakdown: CategoryBreakdown[];
  recentTransactions: RecentTransaction[];
  currentMonth: {
    total: number;
    comparedToLastMonth: number; // percentage
  };
}