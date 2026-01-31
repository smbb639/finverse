'use client';

import { InvestmentWithMetrics } from '@/lib/investment';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3 } from 'lucide-react';

interface PortfolioStatsProps {
  investments: InvestmentWithMetrics[];
}

export default function PortfolioStats({ investments }: PortfolioStatsProps) {
  const calculateStats = () => {
    let totalInvested = 0;
    let currentValue = 0;
    const typeBreakdown: Record<string, number> = {};

    investments.forEach(inv => {
      const invested = inv.quantity * inv.buyPrice;
      const current = inv.currentPrice ? inv.quantity * inv.currentPrice : invested;
      
      totalInvested += invested;
      currentValue += current;
      
      typeBreakdown[inv.type] = (typeBreakdown[inv.type] || 0) + current;
    });

    const totalPnl = currentValue - totalInvested;
    const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

    return {
      totalInvested,
      currentValue,
      totalPnl,
      totalPnlPercent,
      typeBreakdown,
    };
  };

  const stats = calculateStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Current Value Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Current Value</p>
            <h3 className="text-3xl font-bold mt-2">₹{stats.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
          <DollarSign className="w-10 h-10 opacity-80" />
        </div>
        <div className="mt-4 text-sm text-blue-100">
          Invested: ₹{stats.totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* Total P&L Card */}
      <div className={`rounded-2xl p-6 shadow-lg ${stats.totalPnl >= 0 ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'} text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/90 text-sm font-medium">Total P&L</p>
            <h3 className="text-3xl font-bold mt-2">
              {stats.totalPnl >= 0 ? '+' : ''}₹{Math.abs(stats.totalPnl).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-white/90 mt-1 text-sm">
              {stats.totalPnl >= 0 ? '+' : ''}{stats.totalPnlPercent.toFixed(2)}%
            </p>
          </div>
          {stats.totalPnl >= 0 ? (
            <TrendingUp className="w-10 h-10 opacity-80" />
          ) : (
            <TrendingDown className="w-10 h-10 opacity-80" />
          )}
        </div>
      </div>

      {/* Asset Allocation Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-600 text-sm font-medium">Asset Allocation</p>
          </div>
          <PieChart className="w-6 h-6 text-blue-500" />
        </div>
        <div className="space-y-2">
          {Object.entries(stats.typeBreakdown).map(([type, value]) => (
            <div key={type} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{type}</span>
              <span className="text-sm font-medium">
                {((value / stats.currentValue) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-600 text-sm font-medium">Portfolio Health</p>
          </div>
          <BarChart3 className="w-6 h-6 text-blue-500" />
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Winning Stocks</span>
              <span className="font-medium">
                {investments.filter(i => i.pnl && i.pnl > 0).length} / {investments.length}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full"
                style={{ 
                  width: `${(investments.filter(i => i.pnl && i.pnl > 0).length / investments.length) * 100}%` 
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Avg Return</span>
              <span className={`font-medium ${stats.totalPnlPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.totalPnlPercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}