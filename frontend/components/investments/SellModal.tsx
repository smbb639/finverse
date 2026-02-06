'use client';

import { useState, useEffect } from 'react';
import { InvestmentWithMetrics } from '@/lib/investment';
import {
  X,
  TrendingDown,
  AlertCircle,
  IndianRupee,
  Calendar,
  Loader2
} from 'lucide-react';

interface SellModalProps {
  investment: InvestmentWithMetrics;
  onClose: () => void;
  onSell: (id: string, sellPrice: number, sellDate: string) => Promise<void>;
}

export default function SellModal({ investment, onClose, onSell }: SellModalProps) {
  const [sellPrice, setSellPrice] = useState(
    investment.currentPrice?.toString() || investment.buyPrice.toString()
  );
  const [sellDate, setSellDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- Calculations ---------------- */

  const price = parseFloat(sellPrice) || 0;
  const totalSellValue = price * investment.quantity;
  const totalBuyValue = investment.buyPrice * investment.quantity;
  const pnl = totalSellValue - totalBuyValue;
  const pnlPercent =
    totalBuyValue > 0 ? (pnl / totalBuyValue) * 100 : 0;
  const isProfit = pnl >= 0;

  /* ---------------- Auto-scroll to P&L ---------------- */

  useEffect(() => {
    if (price > 0) {
      document
        .getElementById('pnl-preview')
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [price]);

  /* ---------------- Submit ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (price <= 0) {
      setError('Please enter a valid sell price');
      return;
    }

    if (new Date(sellDate) < new Date(investment.buyDate)) {
      setError('Sell date cannot be before buy date');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSell(investment._id, price, sellDate);
      onClose();
    } catch {
      setError('Failed to sell investment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-3xl shadow-2xl flex flex-col animate-slideUp">

        {/* Header */}
        <div className="relative px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Sell Investment</h3>
              <p className="text-sm text-gray-500">
                {investment.symbol} - {investment.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-8 py-6 space-y-6"
        >

          {/* Summary */}
          <div className="p-5 bg-gray-50 rounded-2xl border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Quantity</p>
                <p className="font-bold">{investment.quantity}</p>
              </div>
              <div>
                <p className="text-gray-500">Avg Buy Price</p>
                <p className="font-bold">₹{investment.buyPrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500">Total Invested</p>
                <p className="font-bold">
                  ₹{totalBuyValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Current Price</p>
                <p className="font-bold">
                  ₹{(investment.currentPrice || investment.buyPrice).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Sell Price */}
          <div>
            <label className="flex items-center gap-2 font-semibold text-sm mb-2">
              <IndianRupee className="w-4 h-4" /> Sell Price (₹)
            </label>
            <input
              type="number"
              value={sellPrice}
              onChange={(e) => {
                setSellPrice(e.target.value);
                setError(null);
              }}
              min="0.01"
              step="0.01"
              required
              className="w-full px-4 py-3.5 border-2 rounded-xl text-lg font-semibold focus:ring-4 focus:ring-red-100 focus:border-red-500"
            />
          </div>

          {/* Sell Date */}
          <div>
            <label className="flex items-center gap-2 font-semibold text-sm mb-2">
              <Calendar className="w-4 h-4" /> Sell Date
            </label>
            <input
              type="date"
              value={sellDate}
              onChange={(e) => {
                setSellDate(e.target.value);
                setError(null);
              }}
              min={new Date(investment.buyDate).toISOString().split('T')[0]}
              max={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-4 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500"
            />
          </div>

          {/* P&L Preview */}
          {price > 0 && (
            <div
              id="pnl-preview"
              className={`p-5 rounded-2xl border-2 ${isProfit
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
                }`}
            >
              <p className="text-sm font-medium text-gray-600 mb-3">
                Expected Outcome
              </p>

              <div className="flex justify-between mb-2">
                <span>Total Sale Value</span>
                <strong>₹{totalSellValue.toLocaleString('en-IN')}</strong>
              </div>

              <div className="flex justify-between pt-2 border-t">
                <span>P&amp;L</span>
                <strong className={isProfit ? 'text-green-700' : 'text-red-700'}>
                  {isProfit ? '+' : '-'}₹{Math.abs(pnl).toLocaleString('en-IN')} (
                  {pnlPercent.toFixed(2)}%)
                </strong>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Warning */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-800">
              This action cannot be undone. The investment will be removed.
            </p>
          </div>
        </form>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white px-8 py-4 border-t flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || price <= 0}
            className="flex-1 py-3.5 rounded-xl bg-red-600 text-white hover:bg-red-700 font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Sale'}
          </button>
        </div>
      </div>
    </div>
  );
}
