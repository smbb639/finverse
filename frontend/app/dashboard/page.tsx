'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { dashboardService, type DashboardStats, type QuickStats } from '@/lib/dashboard';
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  CreditCard,
  Calendar,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Plus,
  Download,
  BarChart3
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
  ResponsiveContainer,
  AreaChart,
  Area,
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
    icon: IndianRupee,
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
    icon: IndianRupee,
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

import { useQuery } from '@tanstack/react-query';
import { formatCurrency, cn } from '@/lib/utils';

export default function DashboardPage() {
  const { data: dashboardData, isLoading: loadingDashboard } = useQuery({
    queryKey: ['dashboard', 'summary-v9'],
    queryFn: () => dashboardService.getDashboardData(),
    refetchOnMount: true,
  });

  const { data: quickStats, isLoading: loadingStats } = useQuery({
    queryKey: ['quick-stats'],
    queryFn: () => dashboardService.getQuickStats(),
  });

  const loading = loadingDashboard || loadingStats;

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
                <CardTitle className="text-sm font-medium">Remaining Balance</CardTitle>
                <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
                  <IndianRupee className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency((dashboardData?.stats?.monthlyBudget || 0) - (dashboardData?.currentMonth?.total || 0))}
                </div>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  Budget: {formatCurrency(dashboardData?.stats?.monthlyBudget || 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Spent this Month</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(dashboardData?.currentMonth?.total || 0)}
                </div>
                <div className="flex items-center text-xs">
                  {dashboardData?.currentMonth?.comparedToLastMonth !== undefined ? (
                    <>
                      {dashboardData.currentMonth.comparedToLastMonth >= 0 ? (
                        <ArrowUpRight className="h-3 w-3 text-red-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-green-500 mr-1" />
                      )}
                      <span className={dashboardData.currentMonth.comparedToLastMonth >= 0 ? "text-red-500" : "text-green-500"}>
                        {Math.abs(dashboardData.currentMonth.comparedToLastMonth).toFixed(1)}%
                      </span>
                      <span className="text-muted-foreground ml-1">vs last month</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">No data</span>
                  )}
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

          {/* Trend Chart with View Toggle */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Spending Trend</CardTitle>
                <CardDescription>
                  Monthly historical overview
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full pt-4 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={(dashboardData?.monthlySummary ?? [])
                      .slice()
                      .reverse()
                      .map(item => ({
                        date: `${item.month} ${item.year}`,
                        amount: item.total,
                        transactions: item.transactions,
                      }))
                    }
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >

                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="date"
                    />

                    <YAxis
                      yAxisId="left"
                      tickFormatter={(v) => `₹${v}`}
                    />

                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      allowDecimals={false}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="amount"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      fill="url(#colorAmount)"
                      name="Spending"
                    />

                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="transactions"
                      stroke="#10B981"
                      strokeWidth={2}
                      fill="url(#colorTransactions)"
                      name="Transactions"
                    />

                  </AreaChart>
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
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:bg-muted transition-all duration-200"
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
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart margin={{ top: 20, bottom: 20 }}>
                    <Pie
                      data={dashboardData?.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      nameKey="category"
                      labelLine={false}
                      label={({ cx, cy, midAngle = 0, innerRadius = 0, outerRadius = 80, percent }) => {
                        if (percent < 0.05) return null; // Don't show labels for tiny slices
                        const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.6;
                        const x = Number(cx) + radius * Math.cos(-midAngle * (Math.PI / 180));
                        const y = Number(cy) + radius * Math.sin(-midAngle * (Math.PI / 180));
                        return (
                          <text
                            x={x}
                            y={y}
                            fill="white"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="text-[12px] font-bold"
                          >
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        );
                      }}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      stroke="none"
                    >
                      {dashboardData?.categoryBreakdown?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CATEGORY_COLORS[entry.category as keyof typeof CATEGORY_COLORS] || '#64748B'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      layout="horizontal"
                      wrapperStyle={{ paddingTop: '20px' }}
                    />
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
                            <h4 className="font-semibold group-hover:text-primary transition-colors">
                              {feature.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                          <ArrowUpRight className="h-5 w-5 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
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