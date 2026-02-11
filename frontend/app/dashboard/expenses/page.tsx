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
  ChevronRight,
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Film,
  Heart,
  GraduationCap,
  Plane,
  Wallet,
  MoreHorizontal,
  Calendar,
  X
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

const CATEGORY_ICONS: Record<string, any> = {
  Food: Utensils,
  Transportation: Car,
  Shopping: ShoppingBag,
  Bills: Receipt,
  Entertainment: Film,
  Healthcare: Heart,
  Education: GraduationCap,
  Travel: Plane,
  Investments: Wallet,
  Other: MoreHorizontal,
};

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
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);

  // Sync selectedCategory when editing
  useEffect(() => {
    if (editingExpense) {
      setSelectedCategory(editingExpense.category);
    } else {
      setSelectedCategory(CATEGORIES[0]);
    }
  }, [editingExpense, isModalOpen]);

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
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['expenses'] }),
        queryClient.invalidateQueries({ queryKey: ['expenses-summary'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      ]);
      setFilters({});
      setSearchQuery('');
      setCurrentPage(1);
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => expenseService.updateExpense(id, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['expenses'] }),
        queryClient.invalidateQueries({ queryKey: ['expenses-summary'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      ]);
      setIsModalOpen(false);
      setEditingExpense(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: expenseService.deleteExpense,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['expenses'] }),
        queryClient.invalidateQueries({ queryKey: ['expenses-summary'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      ]);
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

    const dateVal = formData.get('date') as string;
    const [year, month, day] = dateVal.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);

    // Fetch the current time from the PC locally
    const now = new Date();
    dateObj.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

    const data = {
      amount: Number(formData.get('amount')),
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      date: dateObj.toISOString(),
    };

    if (editingExpense) {
      updateMutation.mutate({ id: editingExpense._id, data });
    } else {
      addMutation.mutate(data);
    }
  };

  const totalSpent = dashboardData?.currentMonth?.total || 0;
  const currentMonthCount = dashboardData?.currentMonth?.count || 0;
  const budget = dashboardData?.stats?.monthlyBudget || 0;
  const totalTransactions = dashboardData?.stats?.totalTransactions || 0;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              Across {currentMonthCount} items
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
              {totalTransactions}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <Card className="border-0 shadow-lg overflow-hidden bg-white/80 backdrop-blur-sm ring-1 ring-slate-100">
        <CardHeader className="border-b border-slate-100/50 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4 p-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-sm group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              </div>
              <Input
                placeholder="Search by description or category..."
                className="pl-11 h-11 bg-white border-slate-200 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-2xl text-[15px] placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-[1px] bg-slate-200 hidden sm:block mx-1" />
              <select
                className="h-11 text-[15px] font-semibold border border-slate-200 rounded-2xl px-5 py-2 bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer text-slate-600 appearance-none min-w-[160px] shadow-sm hover:border-slate-300"
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value === 'all' ? undefined : e.target.value }))}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1rem'
                }}
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-slate-600 border-slate-200 hover:bg-slate-50 h-11 rounded-xl px-4 font-semibold shadow-sm"
              onClick={() => {
                alert('Exporting data as CSV...');
              }}
            >
              <Download className="h-4 w-4 mr-2 text-slate-400" />
              Export CSV
            </Button>
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
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300" onClick={() => setIsModalOpen(false)} />
          <Card className="relative w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 border-0 bg-white/95 overflow-hidden ring-1 ring-black/5">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

            <CardHeader className="flex flex-row items-center justify-between pb-2 border-none">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  {editingExpense ? 'Modify Expense' : 'Add Expense'}
                </CardTitle>
                <CardDescription className="text-slate-500">
                  {editingExpense ? 'Update your transaction details' : 'Quickly record your spending'}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 pt-2">
                {/* Amount Section - Prominent */}
                <div className="flex flex-col items-center justify-center py-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                  <Label htmlFor="amount" className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Transaction Amount</Label>
                  <div className="relative flex items-center justify-center group w-full max-w-[240px]">
                    <span className="text-4xl font-bold text-blue-600 mr-2 drop-shadow-sm">₹</span>
                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      className="w-full bg-transparent text-center text-5xl font-black text-slate-900 placeholder:text-slate-200 focus:outline-none focus:ring-0 selection:bg-blue-100"
                      defaultValue={editingExpense?.amount}
                      autoFocus
                    />
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-100 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full" />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Category Selection - Visual Grid */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-indigo-500" />
                      Select Category
                    </Label>
                    <input type="hidden" name="category" value={selectedCategory} />
                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2">
                      {CATEGORIES.map(cat => {
                        const Icon = CATEGORY_ICONS[cat] || MoreHorizontal;
                        const isSelected = selectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-all duration-200 border-2 ${isSelected
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm scale-105'
                              : 'bg-white border-slate-50 text-slate-400 hover:border-slate-200 hover:bg-slate-50'
                              }`}
                          >
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-tighter truncate w-full text-center">
                              {cat}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Date Picker */}
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-emerald-500" />
                        Date
                      </Label>
                      <div className="relative">
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          required
                          className="bg-slate-50 border-slate-100 focus:bg-white focus:ring-emerald-500 transition-all text-slate-900"
                          defaultValue={editingExpense ? format(new Date(editingExpense.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')}
                        />
                      </div>
                    </div>

                    {/* Quick Suggestions / Placeholder for extra field */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        Quick Add
                      </Label>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {['100', '500', '1000'].map(amt => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => {
                              const input = document.getElementById('amount') as HTMLInputElement;
                              if (input) {
                                const current = parseFloat(input.value) || 0;
                                input.value = (current + parseFloat(amt)).toString();
                              }
                            }}
                            className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-blue-100 hover:text-blue-600 text-slate-600 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                          >
                            +₹{amt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold text-slate-700">Memo / Description</Label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      placeholder="What was this for?"
                      className="w-full min-h-[80px] rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                      defaultValue={editingExpense?.description}
                    />
                  </div>
                </div>
              </CardContent>
              <div className="flex items-center gap-3 p-6 pt-2">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-12 rounded-xl font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addMutation.isPending || updateMutation.isPending}
                  className="flex-[2] h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-200 transition-all hover:shadow-xl active:scale-[0.98]"
                >
                  {addMutation.isPending || updateMutation.isPending
                    ? <div className="flex items-center gap-2"><div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />Saving...</div>
                    : (editingExpense ? 'Update Expense' : 'Save Transaction')}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
      {/* Budget Modal */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300" onClick={() => setIsBudgetModalOpen(false)} />
          <Card className="relative w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 border-0 bg-white/95 overflow-hidden ring-1 ring-black/5">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" />

            <CardHeader className="flex flex-row items-center justify-between pb-2 border-none">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Monthly Budget</CardTitle>
                <CardDescription className="text-slate-500">Set your total spending limit for this month.</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsBudgetModalOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <form onSubmit={(e) => {
              e.preventDefault();
              const amount = Number(new FormData(e.currentTarget).get('budget'));
              budgetMutation.mutate(amount);
            }}>
              <CardContent className="space-y-6 pt-2">
                {/* Budget Amount Section */}
                <div className="flex flex-col items-center justify-center py-8 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                  <Label htmlFor="budget" className="text-xs uppercase tracking-widest text-emerald-600/70 font-bold mb-2">Target Budget</Label>
                  <div className="relative flex items-center justify-center group w-full max-w-[280px]">
                    <span className="text-4xl font-bold text-emerald-600 mr-2 drop-shadow-sm">₹</span>
                    <input
                      id="budget"
                      name="budget"
                      type="number"
                      required
                      placeholder="0"
                      className="w-full bg-transparent text-center text-5xl font-black text-slate-900 placeholder:text-slate-200 focus:outline-none focus:ring-0 selection:bg-emerald-100"
                      defaultValue={budget > 0 ? budget : ''}
                      autoFocus
                    />
                  </div>
                </div>

                {/* Quick Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    Recommended Limits
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['5000', '10000', '25000', '50000', '75000', '100000'].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('budget') as HTMLInputElement;
                          if (input) input.value = amt;
                        }}
                        className="px-3 py-2 text-sm font-bold bg-white hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 rounded-xl transition-all border border-slate-100 hover:border-emerald-200 shadow-sm"
                      >
                        ₹{(parseInt(amt) / 1000)}k
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                  <p className="text-xs text-blue-600 leading-relaxed font-medium">
                    Setting a budget helps you track your financial health. You'll see alerts when you approach your limit.
                  </p>
                </div>
              </CardContent>

              <div className="flex items-center gap-3 p-6 pt-2">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setIsBudgetModalOpen(false)}
                  className="flex-1 h-12 rounded-xl font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={budgetMutation.isPending}
                  className="flex-[2] h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg shadow-emerald-200 transition-all hover:shadow-xl active:scale-[0.98]"
                >
                  {budgetMutation.isPending ? 'Updating...' : 'Set Budget Limit'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}