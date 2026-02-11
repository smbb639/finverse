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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      {/* Portfolio Value Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all group overflow-hidden">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200 flex-shrink-0">
                <IndianRupee className="w-4 h-4 text-white" />
              </div>
              <p className="text-[9px] sm:text-xs font-semibold text-gray-500 truncate uppercase tracking-widest">Portfolio Value</p>
            </div>
            <h3 className="text-lg sm:text-xl xl:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2 truncate tracking-tight" title={formatCurrency(stats.currentValue)}>
              {formatCurrency(stats.currentValue)}
            </h3>
            <div className="space-y-1 sm:space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[9px] sm:text-xs text-gray-400 flex-shrink-0 uppercase font-bold">Invested</span>
                <span className="text-xs sm:text-[13px] font-semibold text-gray-600 truncate">
                  {formatCurrency(stats.totalInvested)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[9px] sm:text-xs text-gray-400 flex-shrink-0 uppercase font-bold">Holdings</span>
                <span className="text-xs sm:text-[13px] font-semibold text-gray-600">
                  {investments.length}
                </span>
              </div>
              <div className="h-1 bg-gray-50 rounded-full overflow-hidden mt-1 sm:mt-2">
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
      <div className={`bg-white rounded-2xl p-4 sm:p-5 shadow-lg border-2 transition-all group overflow-hidden ${isPositive
        ? 'border-green-100 hover:shadow-green-50'
        : 'border-red-100 hover:shadow-red-50'
        } hover:shadow-xl`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0 ${isPositive
                ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-green-100'
                : 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-100'
                }`}>
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-white" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-white" />
                )}
              </div>
              <p className="text-[9px] sm:text-xs font-semibold text-gray-500 truncate uppercase tracking-widest">Total P&L</p>
            </div>
            <h3 className={`text-lg sm:text-xl xl:text-2xl font-bold mb-1.5 sm:mb-2 truncate tracking-tight ${isPositive ? 'text-green-600' : 'text-red-600'
              }`} title={`${isPositive ? '+' : '-'}${formatCurrency(Math.abs(stats.totalPnl))}`}>
              {isPositive ? '+' : '-'}{formatCurrency(Math.abs(stats.totalPnl))}
            </h3>
            <div className="space-y-1 sm:space-y-1.5">
              <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[9px] sm:text-xs font-bold ${isPositive
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
                }`}>
                {isPositive ? '↑' : '↓'} {stats.totalPnlPercent.toFixed(2)}%
              </div>
              <div className="flex items-center justify-between pt-1 sm:pt-1.5 gap-2">
                <span className="text-[9px] sm:text-xs text-gray-400 flex-shrink-0 uppercase font-bold">PnL %</span>
                <span className={`text-xs sm:text-[13px] font-extrabold truncate ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '+' : '-'}{stats.totalPnlPercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Allocation Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border-2 border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all group overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-200 flex-shrink-0">
            <PieChart className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest">Allocation</p>
            <p className="text-base sm:text-lg font-bold text-gray-900 truncate">{Object.keys(stats.typeBreakdown).length} Types</p>
          </div>
        </div>

        <div className="space-y-2">
          {Object.entries(stats.typeBreakdown)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 2)
            .map(([type, value]) => {
              const percentage = ((value / stats.currentValue) * 100).toFixed(1);
              return (
                <div key={type}>
                  <div className="flex items-center justify-between text-[11px] sm:text-xs mb-1">
                    <span className="font-medium text-gray-600">{getTypeLabel(type)}</span>
                    <span className="font-bold text-gray-900">{percentage}%</span>
                  </div>
                  <div className="h-1 bg-gray-50 rounded-full overflow-hidden">
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
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border-2 border-gray-100 hover:border-pink-200 hover:shadow-xl transition-all group overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg shadow-pink-200 flex-shrink-0">
            <Award className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest">Win Rate</p>
            <p className="text-base sm:text-lg font-bold text-gray-900 truncate">{stats.winRate.toFixed(0)}%</p>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <div className="flex items-center justify-between text-[11px] sm:text-xs mb-1">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="font-medium text-gray-600">Winners</span>
              </div>
              <span className="font-bold text-green-600">{stats.winners}/{investments.length}</span>
            </div>
            <div className="h-1 bg-gray-50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.winRate}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] sm:text-xs mb-1">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="font-medium text-gray-600">Losers</span>
              </div>
              <span className="font-bold text-red-600">{stats.losers}/{investments.length}</span>
            </div>
            <div className="h-1 bg-gray-50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${(stats.losers / investments.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-medium text-gray-500">Avg Return</span>
              <span className={`text-sm sm:text-base font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{stats.totalPnlPercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}