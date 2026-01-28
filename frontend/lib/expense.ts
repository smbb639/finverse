import api from './api';

export interface Expense {
    _id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
    createdAt: string;
    updatedAt: string;
}

export interface ExpenseSummary {
    byCategory: {
        _id: string;
        total: number;
        count: number;
    }[];
    total: number;
    count: number;
}

export interface ExpenseFilters {
    category?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    skip?: number;
    search?: string;
}

export const expenseService = {
    getExpenses: async (filters: ExpenseFilters = {}) => {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.skip !== undefined) params.append('skip', filters.skip.toString());
        if (filters.search) params.append('q', filters.search);

        const response = await api.get<{ count: number, expenses: Expense[] }>(`/expenses?${params.toString()}`);
        return response.data;
    },

    getSummary: async (startDate?: string, endDate?: string) => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await api.get<{ summary: ExpenseSummary }>(`/expenses/summary?${params.toString()}`);
        return response.data.summary;
    },

    getExpense: async (id: string) => {
        const response = await api.get<{ expense: Expense }>(`/expenses/${id}`);
        return response.data.expense;
    },

    addExpense: async (data: Omit<Expense, '_id' | 'createdAt' | 'updatedAt'>) => {
        const response = await api.post<{ message: string, expense: Expense }>('/expenses', data);
        return response.data.expense;
    },

    updateExpense: async (id: string, data: Partial<Omit<Expense, '_id' | 'createdAt' | 'updatedAt'>>) => {
        const response = await api.put<{ message: string, expense: Expense }>(`/expenses/${id}`, data);
        return response.data.expense;
    },

    deleteExpense: async (id: string) => {
        const response = await api.delete<{ message: string }>(`/expenses/${id}`);
        return response.data;
    },

    updateBudget: async (monthlyBudget: number) => {
        const response = await api.put<{ message: string, monthlyBudget: number }>('/expenses/budget', { monthlyBudget });
        return response.data;
    }
};
