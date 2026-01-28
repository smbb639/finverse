'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Download,
  IndianRupee,
  TrendingUp,
  CreditCard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { expenseService, type Expense, type ExpenseFilters } from '@/lib/expense';
import { dashboardService } from '@/lib/dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

const CATEGORIES = [
  "Food",
  "Transportation",
  "Shopping",
  "Bills",
  "Entertainment",
  "Healthcare",
  "Education",
  "Travel",
  "Investments",
  "Other"
];

const CATEGORY_COLORS: Record<string, string> = {
  Food: 'bg-blue-100 text-blue-600',
  Transportation: 'bg-emerald-100 text-emerald-600',
  Shopping: 'bg-purple-100 text-purple-600',
  Bills: 'bg-rose-100 text-rose-600',
  Entertainment: 'bg-amber-100 text-amber-600',
  Healthcare: 'bg-pink-100 text-pink-600',
  Education: 'bg-indigo-100 text-indigo-600',
  Travel: 'bg-teal-100 text-teal-600',
  Investments: 'bg-lime-100 text-lime-600',
  Other: 'bg-slate-100 text-slate-600',
};

import { authService } from '@/lib/auth';

const ITEMS_PER_PAGE = 5;

export default function ExpensesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  // Queries
  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.getDashboardData(),
  });

  const { data: expenseData, isLoading } = useQuery({
    queryKey: ['expenses', filters, searchQuery, currentPage],
    queryFn: () => expenseService.getExpenses({
      ...filters,
      search: searchQuery,
      limit: ITEMS_PER_PAGE,
      skip: (currentPage - 1) * ITEMS_PER_PAGE
    }),
  });

  const { data: summary } = useQuery({
    queryKey: ['expenses-summary', filters],
    queryFn: () => expenseService.getSummary(filters.startDate, filters.endDate),
  });

  const expenses = expenseData?.expenses || [];
  const totalCount = expenseData?.count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const filteredExpenses = expenses; // Now purely server-side filtered

  // Mutations
  const addMutation = useMutation({
    mutationFn: expenseService.addExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenses-summary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => expenseService.updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenses-summary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsModalOpen(false);
      setEditingExpense(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: expenseService.deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenses-summary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const budgetMutation = useMutation({
    mutationFn: (amount: number) => expenseService.updateBudget(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses-summary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['quick-stats'] });
      setIsBudgetModalOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      amount: Number(formData.get('amount')),
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      date: formData.get('date') as string,
    };

    if (editingExpense) {
      updateMutation.mutate({ id: editingExpense._id, data });
    } else {
      addMutation.mutate(data);
    }
  };

  const totalSpent = dashboardData?.currentMonth?.total || 0;
  const budget = dashboardData?.stats?.monthlyBudget || 0;
  const remainingBalance = budget - totalSpent;
  const avgExpense = summary?.count ? (summary.total / summary.count) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Expense Tracker
          </h1>
          <p className="text-slate-500 mt-1">Manage and track your daily spending with precision.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsBudgetModalOpen(true)}
            className="gap-2 border-slate-200 hover:bg-slate-50"
          >
            <IndianRupee className="h-4 w-4" />
            <span>Set Budget</span>
          </Button>
          <Button
            onClick={() => {
              setEditingExpense(null);
              setIsModalOpen(true);
            }}
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Expense</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm bg-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                <IndianRupee className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-blue-100 bg-white/10 px-2 py-1 rounded-full">
                Balance
              </span>
            </div>
            <p className="text-sm font-medium text-blue-100">Remaining Budget</p>
            <h3 className="text-3xl font-bold mt-1">
              {formatCurrency(remainingBalance)}
            </h3>
            <p className="text-xs text-blue-200 mt-2 font-medium">
              Budget: {formatCurrency(budget)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                This Month
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">Spent this Month</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">
              {formatCurrency(totalSpent)}
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Across {summary?.count || 0} items
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-purple-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                Count
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">Total Transactions</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">
              {summary?.count || 0}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <Card className="border-0 shadow-md">
        <CardHeader className="border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search description..."
                className="pl-10 bg-slate-50 border-slate-100 focus:bg-white transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <select
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none"
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value === 'all' ? undefined : e.target.value }))}
              >
                <option value="all">Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredExpenses?.length === 0 ? (
            <div className="p-20 text-center">
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No expenses found</h3>
              <p className="text-slate-500">Try adjusting your filters or add a new expense.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredExpenses?.map((expense) => (
                    <tr key={expense._id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">
                          {format(new Date(expense.date), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-slate-500">
                          {format(new Date(expense.date), 'hh:mm a')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[expense.category] || 'bg-slate-100 text-slate-600'}`}>
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-slate-900">
                          {formatCurrency(expense.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingExpense(expense);
                              setIsModalOpen(true);
                            }}
                            className="h-8 w-8 p-0 hover:bg-white hover:text-blue-600 shadow-sm"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this expense?')) {
                                deleteMutation.mutate(expense._id);
                              }
                            }}
                            className="h-8 w-8 p-0 hover:bg-white hover:text-rose-600 shadow-sm text-slate-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination controls */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
                <p className="text-sm text-slate-500">
                  Showing <span className="font-medium">{totalCount === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}</span> of <span className="font-medium">{totalCount}</span> results
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-slate-200"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "ghost"}
                            size="sm"
                            className={`h-8 w-8 p-0 ${currentPage === pageNum ? "bg-blue-600 hover:bg-blue-700 font-bold" : ""}`}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      } else if (
                        (pageNum === 2 && currentPage > 3) ||
                        (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return <span key={pageNum} className="text-slate-400 px-1">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-slate-200"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal / Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <Card className="relative w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-2xl font-bold">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </CardTitle>
              <CardDescription>
                Fill in the details below to record your transaction.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        required
                        placeholder="0.00"
                        className="pl-10"
                        defaultValue={editingExpense?.amount}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      required
                      defaultValue={editingExpense ? format(new Date(editingExpense.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="w-full flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={editingExpense?.category || CATEGORIES[0]}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    placeholder="What did you spend on?"
                    className="w-full min-h-[100px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={editingExpense?.description}
                  />
                </div>
              </CardContent>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
                <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addMutation.isPending || updateMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 w-32"
                >
                  {addMutation.isPending || updateMutation.isPending ? 'Saving...' : (editingExpense ? 'Update' : 'Save')}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
      {/* Budget Modal */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsBudgetModalOpen(false)} />
          <Card className="relative w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-xl font-bold">Set Monthly Budget</CardTitle>
              <CardDescription>Enter your total budget for this month.</CardDescription>
            </CardHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const amount = Number(new FormData(e.currentTarget).get('budget'));
              budgetMutation.mutate(amount);
            }}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Label htmlFor="budget">Monthly Budget</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="budget"
                      name="budget"
                      type="number"
                      required
                      placeholder="Enter amount"
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
                <Button variant="ghost" type="button" onClick={() => setIsBudgetModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={budgetMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {budgetMutation.isPending ? 'Updating...' : 'Update Budget'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}