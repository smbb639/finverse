'use client';

import { useState } from 'react';
import { InvestmentWithMetrics } from '@/lib/investment';
import { TrendingUp, TrendingDown, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import SellModal from './SellModal';

interface InvestmentListProps {
  investments: InvestmentWithMetrics[];
  onEdit: (investment: InvestmentWithMetrics) => void;
  onSell: (id: string, sellPrice: number, sellDate: string) => Promise<void>;
}

type SortField = 'symbol' | 'type' | 'quantity' | 'buyPrice' | 'currentPrice' | 'pnl' | 'pnlPercent';
type SortOrder = 'asc' | 'desc';

export default function InvestmentList({ investments, onEdit, onSell }: InvestmentListProps) {
  const [sellingInvestment, setSellingInvestment] = useState<InvestmentWithMetrics | null>(null);
  const [sortField, setSortField] = useState<SortField>('symbol');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedInvestments = [...investments].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'symbol':
        aValue = a.symbol;
        bValue = b.symbol;
        break;
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
      case 'quantity':
        aValue = a.quantity;
        bValue = b.quantity;
        break;
      case 'buyPrice':
        aValue = a.buyPrice;
        bValue = b.buyPrice;
        break;
      case 'currentPrice':
        aValue = a.currentPrice || 0;
        bValue = b.currentPrice || 0;
        break;
      case 'pnl':
        aValue = a.pnl || 0;
        bValue = b.pnl || 0;
        break;
      case 'pnlPercent':
        aValue = a.pnlPercent || 0;
        bValue = b.pnlPercent || 0;
        break;
      default:
        return 0;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronDown className="w-4 h-4 text-gray-400" />;
    }
    return sortOrder === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-600" />
      : <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  return (
    <>
      <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('symbol')}
                    className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Symbol/Name
                    <SortIcon field="symbol" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('type')}
                    className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Type
                    <SortIcon field="type" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('quantity')}
                    className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Quantity
                    <SortIcon field="quantity" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('buyPrice')}
                    className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Avg Price
                    <SortIcon field="buyPrice" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('currentPrice')}
                    className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Current
                    <SortIcon field="currentPrice" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('pnl')}
                    className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    P&L
                    <SortIcon field="pnl" />
                  </button>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="text-sm font-bold text-gray-700">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedInvestments.map((investment) => {
                const typeColors = getTypeColor(investment.type);
                const isPositive = (investment.pnl || 0) >= 0;
                
                return (
                  <tr 
                    key={investment._id} 
                    className="hover:bg-blue-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-gray-900 text-base mb-0.5">
                          {investment.symbol}
                        </div>
                        <div className="text-sm text-gray-600 truncate max-w-xs" title={investment.name}>
                          {investment.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold border ${typeColors.bg} ${typeColors.text} ${typeColors.border}`}>
                        {investment.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        {investment.quantity.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        ₹{investment.buyPrice.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {investment.priceError ? (
                        <span className="text-sm text-yellow-600 font-medium">Updating...</span>
                      ) : (
                        <span className="font-semibold text-gray-900">
                          ₹{(investment.currentPrice || 0).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {isPositive ? (
                          <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500 flex-shrink-0" />
                        )}
                        <div>
                          <div className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : ''}₹{Math.abs(investment.pnl || 0).toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </div>
                          <div className={`text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            ({isPositive ? '+' : ''}{(investment.pnlPercent || 0).toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(investment)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          aria-label={`Edit ${investment.symbol}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSellingInvestment(investment)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label={`Sell ${investment.symbol}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sell Modal */}
      {sellingInvestment && (
        <SellModal
          investment={sellingInvestment}
          onClose={() => setSellingInvestment(null)}
          onSell={async (id, price, date) => {
            await onSell(id, price, date);
            setSellingInvestment(null);
          }}
        />
      )}
    </>
  );
}