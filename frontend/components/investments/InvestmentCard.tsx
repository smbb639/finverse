'use client';

import { useState } from 'react';
import { InvestmentWithMetrics } from '@/lib/investment';
import { TrendingUp, TrendingDown, Edit2, Trash2 } from 'lucide-react';
import SellModal from './SellModal';

interface InvestmentCardProps {
  investment: InvestmentWithMetrics;
  onEdit: (investment: InvestmentWithMetrics) => void;
  onSell: (id: string, sellPrice: number, sellDate: string) => Promise<void>;
}

export default function InvestmentCard({ investment, onEdit, onSell }: InvestmentCardProps) {
  const [isSelling, setIsSelling] = useState(false);

  const pnl = investment.pnl || 0;
  const pnlPercent = investment.pnlPercent || 0;
  const isPositive = pnl >= 0;

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">{investment.symbol}</span>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {investment.type}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{investment.name}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(investment)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsSelling(true)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Quantity</p>
            <p className="text-sm font-medium">{investment.quantity}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Avg Buy Price</p>
            <p className="text-sm font-medium">₹{investment.buyPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Current Price</p>
            <p className="text-sm font-medium">
              {investment.priceError ? (
                <span className="text-yellow-600">Loading...</span>
              ) : (
                `₹${investment.currentPrice?.toFixed(2) || 'N/A'}`
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Invested Amount</p>
            <p className="text-sm font-medium">
              ₹{(investment.quantity * investment.buyPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* P&L Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total P&L</p>
              <div className="flex items-center gap-2 mt-1">
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '+' : ''}₹{Math.abs(pnl).toFixed(2)}
                </span>
                <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  ({isPositive ? '+' : ''}{pnlPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Buy Date</p>
              <p className="text-sm font-medium">
                {new Date(investment.buyDate).toLocaleDateString()}
              </p>
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
    </>
  );
}