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
          <div className="px-4 py-3 bg-white/10 rounded-xl">
            <h3 className="font-medium mb-2">Monthly Budget</h3>
            <p className="text-2xl font-bold">₹50,000</p>
            <div className="h-2 bg-white/20 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-green-400 w-2/3"></div>
            </div>
            <p className="text-blue-200 text-sm mt-2">₹18,550 remaining</p>
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