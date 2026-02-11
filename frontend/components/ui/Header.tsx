'use client';

import { Menu, Search, Bell, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import MarketSnapshot from './MarketSnapshot';

interface User {
  name: string;
  email: string;
}

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    // Get user from localStorage
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }

    // Client-side only date
    setFormattedDate(
      new Date().toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    );
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Left Section - Market Snapshot */}
          <div className="flex items-center">
            <MarketSnapshot />
          </div>

          {/* Right Section - User Actions */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Date */}
            <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-600">
                {formattedDate}
              </span>
            </div>

            {/* Notifications */}
            <button className="relative p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* User Profile */}
            {user && (
              <div className="flex items-center gap-3 pl-2 pr-4 py-1.5 hover:bg-gray-50 rounded-2xl cursor-pointer border border-transparent hover:border-gray-100 transition-all">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm shadow-blue-200">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-bold text-gray-900 leading-tight">{user.name}</p>
                  <p className="text-[10px] font-medium text-gray-500">{user.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}