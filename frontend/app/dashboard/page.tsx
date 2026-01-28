'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { dashboardService, type DashboardStats, type QuickStats } from '@/lib/dashboard';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Calendar, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Plus,
  Download
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import Link from 'next/link';

// Feature Cards Data
const featureCards = [
  {
    title: 'Expense Tracker',
    description: 'Track and categorize your daily expenses',
    icon: CreditCard,
    color: 'from-blue-500 to-cyan-500',
    href: '/dashboard/expenses'
  },
  {
    title: 'Budget Planner',
    description: 'Set and monitor your monthly budget',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500',
    href: '/dashboard/budget'
  },
  {
    title: 'Investment Portfolio',
    description: 'Track your stocks and investments',
    icon: TrendingUp,
    color: 'from-purple-500 to-violet-500',
    href: '/dashboard/investments'
  },
  {
    title: 'Financial Reports',
    description: 'Generate detailed financial reports',
    icon: PieChart,
    color: 'from-orange-500 to-amber-500',
    href: '/dashboard/reports'
  },
  {
    title: 'Bill Reminders',
    description: 'Never miss a payment deadline',
    icon: Calendar,
    color: 'from-rose-500 to-pink-500',
    href: '/dashboard/reminders'
  },
  {
    title: 'Savings Goals',
    description: 'Plan and achieve your savings targets',
    icon: DollarSign,
    color: 'from-indigo-500 to-blue-500',
    href: '/dashboard/savings'
  }
];

// Category colors for charts
const CATEGORY_COLORS = {
  Food: '#3B82F6',
  Transportation: '#10B981',
  Shopping: '#8B5CF6',
  Bills: '#EF4444',
  Entertainment: '#F59E0B',
  Healthcare: '#EC4899',
  Education: '#6366F1',
  Travel: '#14B8A6',
  Investments: '#84CC16',
  Other: '#64748B'
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboard, stats] = await Promise.all([
        dashboardService.getDashboardData(),
        dashboardService.getQuickStats()
      ]);
      setDashboardData(dashboard);
      setQuickStats(stats);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[120px] mb-2" />
                <Skeleton className="h-4 w-[80px]" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px] w-full" />
          </div>
          <div>
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    );
  }
  const userName = dashboardData?.user?.name ?? 'User';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userName}!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Stats & Charts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(dashboardData?.stats?.totalExpenses || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +2.5% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(dashboardData?.currentMonth?.total || 0)}
                </div>
                <div className="flex items-center text-xs">
                  {dashboardData?.currentMonth?.comparedToLastMonth || 0 >= 0 ? (
                    <>
                      <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-green-500">
                        {Math.abs(dashboardData?.currentMonth?.comparedToLastMonth || 0).toFixed(1)}%
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                      <span className="text-red-500">
                        {Math.abs(dashboardData?.currentMonth?.comparedToLastMonth || 0).toFixed(1)}%
                      </span>
                    </>
                  )}
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.stats?.totalTransactions || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData?.stats?.averageDailyExpense ? `${formatCurrency(dashboardData.stats?.averageDailyExpense)}/day` : 'No data'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Category</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.stats?.favoriteCategory || 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Most spent category
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Spending Trend</CardTitle>
              <CardDescription>Monthly expense overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dashboardData?.monthlySummary?.map(item => ({
                      name: item.month,
                      amount: item.total,
                      transactions: item.transactions
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Amount']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Total Amount"
                    />
                    <Line
                      type="monotone"
                      dataKey="transactions"
                      stroke="#10B981"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Transactions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.recentTransactions?.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="h-10 w-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${CATEGORY_COLORS[transaction.category as keyof typeof CATEGORY_COLORS]}20` }}
                      >
                        <CreditCard 
                          className="h-5 w-5" 
                          style={{ color: CATEGORY_COLORS[transaction.category as keyof typeof CATEGORY_COLORS] }}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.category}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(transaction.amount)}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4">
                View all transactions
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Feature Cards */}
        <div className="space-y-8">
          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Spending by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={dashboardData?.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {dashboardData?.categoryBreakdown?.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CATEGORY_COLORS[entry.category as keyof typeof CATEGORY_COLORS] || '#64748B'} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Feature Cards */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Access</h3>
            <div className="grid gap-4">
              {featureCards.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Link key={feature.title} href={feature.href}>
                    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold group-hover:text-blue-600 transition-colors">
                              {feature.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                          <ArrowUpRight className="h-5 w-5 ml-auto text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Today&apos;s Expenses</span>
                  <span className="font-bold">{formatCurrency(quickStats?.today || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">This Week</span>
                  <span className="font-bold">{formatCurrency(quickStats?.thisWeek || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">This Month</span>
                  <span className="font-bold">{formatCurrency(quickStats?.thisMonth || 0)}</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2">
                    {quickStats?.isIncreasing ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${quickStats?.isIncreasing ? 'text-green-600' : 'text-red-600'}`}>
                      {quickStats?.dailyChange?.toFixed(1)}% from yesterday
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}