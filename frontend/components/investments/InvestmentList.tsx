'use client';

import { InvestmentWithMetrics } from '@/lib/investment';

interface InvestmentListProps {
  investments: InvestmentWithMetrics[];
  onEdit: (investment: InvestmentWithMetrics) => void;
  onSell: (id: string, sellPrice: number, sellDate: string) => Promise<void>;
}

export default function InvestmentList({ investments, onEdit, onSell }: InvestmentListProps) {
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      STOCK: 'bg-blue-100 text-blue-800',
      MF: 'bg-purple-100 text-purple-800',
      ETF: 'bg-green-100 text-green-800',
      CRYPTO: 'bg-yellow-100 text-yellow-800',
      OTHER: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || colors.OTHER;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Symbol/Name</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Type</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Quantity</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Avg Price</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Current</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">P&L</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {investments.map((investment) => (
            <tr key={investment._id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div>
                  <div className="font-medium text-gray-900">{investment.symbol}</div>
                  <div className="text-sm text-gray-600">{investment.name}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(investment.type)}`}>
                  {investment.type}
                </span>
              </td>
              <td className="px-6 py-4 font-medium">{investment.quantity}</td>
              <td className="px-6 py-4">₹{investment.buyPrice.toFixed(2)}</td>
              <td className="px-6 py-4">
                {investment.priceError ? (
                  <span className="text-yellow-600">Loading...</span>
                ) : (
                  `₹${investment.currentPrice?.toFixed(2) || 'N/A'}`
                )}
              </td>
              <td className="px-6 py-4">
                <div className={`font-medium ${investment.pnl && investment.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {investment.pnl && investment.pnl >= 0 ? '+' : ''}₹{Math.abs(investment.pnl || 0).toFixed(2)}
                  <span className="text-sm ml-1">
                    ({investment.pnlPercent && investment.pnlPercent >= 0 ? '+' : ''}{investment.pnlPercent?.toFixed(2) || '0.00'}%)
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(investment)}
                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onSell(investment._id, investment.currentPrice || investment.buyPrice, new Date().toISOString())}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                  >
                    Sell
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}