'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  PieChart,
  TrendingUp,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Newspaper
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/lib/dashboard';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from './skeleton';

const navItems = [
  { href: '/dashboard/expenses', icon: PieChart, label: 'Expenses' },
  { href: '/dashboard/investments', icon: TrendingUp, label: 'Investments' },
  { href: '/dashboard/news', icon: Newspaper, label: 'News' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard', 'summary-v9'],
    queryFn: () => dashboardService.getDashboardData(),
  });

  const budget = dashboardData?.stats?.monthlyBudget || 0;
  const spent = dashboardData?.currentMonth?.total || 0;
  const remaining = budget - spent;
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const isOverBudget = spent > budget && budget > 0;

  return (
    <div className="flex flex-col w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-blue-800">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Finverse</h1>
            <p className="text-blue-200 text-xs">Finance Manager</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-blue-800">
        <div className="mb-4">
          <div className="px-4 py-3 bg-white/10 rounded-xl relative overflow-hidden group">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-white/20" />
                <Skeleton className="h-8 w-32 bg-white/20" />
                <Skeleton className="h-2 w-full bg-white/20" />
                <Skeleton className="h-4 w-28 bg-white/20" />
              </div>
            ) : (
              <>
                <h3 className="font-medium mb-1 text-sm text-blue-200">Monthly Budget</h3>
                <p className="text-2xl font-bold truncate">
                  {formatCurrency(budget).split('.')[0]}
                </p>
                <div className="h-2.5 bg-white/10 rounded-full mt-3 overflow-hidden border border-white/5">
                  <div
                    className={`h-full transition-all duration-1000 ease-out rounded-full ${isOverBudget ? 'bg-red-400' : 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]'
                      }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <p className="text-blue-100 text-xs font-semibold">
                    {formatCurrency(remaining).split('.')[0]} left
                  </p>
                  <p className="text-[10px] text-blue-300 font-medium">
                    {Math.round(percentage)}% used
                  </p>
                </div>
                {isOverBudget && (
                  <div className="mt-2 text-[10px] text-red-300 font-bold flex items-center gap-1 animate-pulse">
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                    BUDGET EXCEEDED
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-blue-200 hover:bg-white/10 hover:text-white rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}