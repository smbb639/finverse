'use client';

import { InvestmentWithMetrics } from '@/lib/investment';
import { TrendingUp, TrendingDown, IndianRupee, PieChart, BarChart3, Award } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PortfolioStatsProps {
  investments: InvestmentWithMetrics[];
}

export default function PortfolioStats({ investments }: PortfolioStatsProps) {
  const calculateStats = () => {
    let totalInvested = 0;
    let currentValue = 0;
    const typeBreakdown: Record<string, number> = {};
    let winners = 0;
    let losers = 0;

    investments.forEach(inv => {
      const invested = inv.quantity * inv.buyPrice;
      const current = inv.currentPrice ? inv.quantity * inv.currentPrice : invested;

      totalInvested += invested;
      currentValue += current;

      typeBreakdown[inv.type] = (typeBreakdown[inv.type] || 0) + current;

      if (inv.pnl && inv.pnl > 0) winners++;
      if (inv.pnl && inv.pnl < 0) losers++;
    });

    const totalPnl = currentValue - totalInvested;
    const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;
    const winRate = investments.length > 0 ? (winners / investments.length) * 100 : 0;

    return {
      totalInvested,
      currentValue,
      totalPnl,
      totalPnlPercent,
      typeBreakdown,
      winners,
      losers,
      winRate,
    };
  };

  const stats = calculateStats();
  const isPositive = stats.totalPnl >= 0;

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      STOCK: '#3b82f6',
      MF: '#8b5cf6',
      ETF: '#10b981',
      CRYPTO: '#f59e0b',
      OTHER: '#6b7280',
    };
    return colors[type] || colors.OTHER;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      STOCK: 'Stocks',
      MF: 'Mutual Funds',
      ETF: 'ETFs',
      CRYPTO: 'Crypto',
      OTHER: 'Other',
    };
    return labels[type] || type;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Portfolio Value Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <IndianRupee className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-semibold text-gray-600">Portfolio Value</p>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              {formatCurrency(stats.currentValue)}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Invested</span>
                <span className="text-sm font-semibold text-gray-700">
                  {formatCurrency(stats.totalInvested)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Holdings</span>
                <span className="text-sm font-semibold text-gray-700">
                  {investments.length}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((stats.currentValue / stats.totalInvested) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Total P&L Card */}
      <div className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all group ${isPositive
          ? 'border-green-200 hover:shadow-green-100'
          : 'border-red-200 hover:shadow-red-100'
        } hover:shadow-xl`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${isPositive
                  ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-green-200'
                  : 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-200'
                }`}>
                {isPositive ? (
                  <TrendingUp className="w-5 h-5 text-white" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-white" />
                )}
              </div>
              <p className="text-sm font-semibold text-gray-600">Total P&L</p>
            </div>
            <h3 className={`text-3xl font-bold mb-2 ${isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
              {isPositive ? '+' : '-'}{formatCurrency(Math.abs(stats.totalPnl))}
            </h3>
            <div className="space-y-2">
              <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-semibold ${isPositive
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
                }`}>
                {isPositive ? '↑' : '↓'} {stats.totalPnlPercent.toFixed(2)}%
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500">PnL Percentage</span>
                <span className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '+' : '-'}{stats.totalPnlPercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Allocation Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all group">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
            <PieChart className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-600">Asset Allocation</p>
            <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.typeBreakdown).length} Types</p>
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(stats.typeBreakdown)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([type, value]) => {
              const percentage = ((value / stats.currentValue) * 100).toFixed(1);
              return (
                <div key={type}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700">{getTypeLabel(type)}</span>
                    <span className="font-bold text-gray-900">{percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getTypeColor(type)
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Performance Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-pink-200 hover:shadow-xl transition-all group">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-200">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-600">Win Rate</p>
            <p className="text-2xl font-bold text-gray-900">{stats.winRate.toFixed(0)}%</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="font-medium text-gray-700">Winners</span>
              </div>
              <span className="font-bold text-green-600">{stats.winners} / {investments.length}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.winRate}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="font-medium text-gray-700">Losers</span>
              </div>
              <span className="font-bold text-red-600">{stats.losers} / {investments.length}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${(stats.losers / investments.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Avg Return</span>
              <span className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{stats.totalPnlPercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}