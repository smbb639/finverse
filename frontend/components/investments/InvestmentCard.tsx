'use client';

import { useState } from 'react';
import { InvestmentWithMetrics } from '@/lib/investment';
import { TrendingUp, TrendingDown, Edit2, Trash2, MoreVertical, Calendar, Package } from 'lucide-react';
import SellModal from './SellModal';

interface InvestmentCardProps {
  investment: InvestmentWithMetrics;
  onEdit: (investment: InvestmentWithMetrics) => void;
  onSell: (id: string, sellPrice: number, sellDate: string) => Promise<void>;
}

export default function InvestmentCard({ investment, onEdit, onSell }: InvestmentCardProps) {
  const [isSelling, setIsSelling] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const pnl = investment.pnl || 0;
  const pnlPercent = investment.pnlPercent || 0;
  const isPositive = pnl >= 0;
  const investedAmount = investment.quantity * investment.buyPrice;
  const currentValue = investment.currentPrice 
    ? investment.quantity * investment.currentPrice 
    : investedAmount;

  const getTypeColor = (type: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      STOCK: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      MF: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      ETF: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      CRYPTO: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
      OTHER: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
    };
    return colors[type] || colors.OTHER;
  };

  const typeColors = getTypeColor(investment.type);

  return (
    <>
      <div className="group relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-100/0 group-hover:from-blue-50/50 group-hover:to-blue-100/30 transition-all duration-300 pointer-events-none" />
        
        {/* Content */}
        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold text-gray-900 truncate">
                  {investment.symbol}
                </span>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${typeColors.bg} ${typeColors.text} ${typeColors.border}`}>
                  {investment.type}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate" title={investment.name}>
                {investment.name}
              </p>
            </div>
            
            {/* Action Menu */}
            <div className="relative ml-2">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
              
              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-10 z-20 w-40 bg-white rounded-xl shadow-xl border border-gray-200 py-1 animate-fadeIn">
                    <button
                      onClick={() => {
                        onEdit(investment);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setIsSelling(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Sell
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Price Information Grid */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Package className="w-3.5 h-3.5" />
                <span>Quantity</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {investment.quantity.toLocaleString('en-IN')}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Avg Buy Price</p>
              <p className="text-lg font-bold text-gray-900">
                ₹{investment.buyPrice.toLocaleString('en-IN', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Current Price</p>
              <p className="text-lg font-bold text-gray-900">
                {investment.priceError ? (
                  <span className="text-sm text-yellow-600 font-normal">Updating...</span>
                ) : (
                  `₹${(investment.currentPrice || 0).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`
                )}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Invested</p>
              <p className="text-lg font-bold text-gray-900">
                ₹{investedAmount.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
          </div>

          {/* P&L Section */}
          <div className={`p-4 rounded-xl ${
            isPositive 
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200' 
              : 'bg-gradient-to-br from-red-50 to-rose-50 border border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-xs font-medium text-gray-600">Total P&L</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold ${
                    isPositive ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {isPositive ? '+' : ''}₹{Math.abs(pnl).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                  <span className={`text-sm font-semibold ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ({isPositive ? '+' : ''}{pnlPercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end text-xs text-gray-500 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Buy Date</span>
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  {new Date(investment.buyDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Current Value */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Current Value</span>
              <span className="text-lg font-bold text-gray-900">
                ₹{currentValue.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sell Modal */}
      {isSelling && (
        <SellModal
          investment={investment}
          onClose={() => setIsSelling(false)}
          onSell={onSell}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}