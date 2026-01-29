'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { ArrowRight, TrendingUp, Shield, Zap, DollarSign, PieChart, Wallet } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user is already logged in
    const user = authService.getUser();
    if (user) {
      router.push('/dashboard');
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Finverse</span>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Sign In
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white/90">Smart Financial Management</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
              Take Control of Your
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Financial Future
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              Track expenses, manage budgets, and gain insights into your spending habits with our powerful financial management platform.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => router.push('/register')}
              className="group relative inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 animate-fade-in-up animation-delay-400"
            >
              <span>Let's Authorize and Try This Product</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-20 animate-fade-in-up animation-delay-600">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Track Expenses</h3>
                <p className="text-white/70">Monitor your spending in real-time and categorize transactions effortlessly.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Budget Management</h3>
                <p className="text-white/70">Set budgets and get alerts when you're approaching your limits.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
                <p className="text-white/70">Your financial data is encrypted and protected with industry-standard security.</p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 mt-20">
          <div className="text-center text-white/50 text-sm">
            <p>&copy; 2026 Finverse. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}