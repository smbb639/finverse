'use client';

import { useState, useEffect} from 'react';
import { Investment } from '@/lib/investment';
import { X } from 'lucide-react';
import { searchSymbols } from '@/lib/api';
interface InvestmentFormProps {
  investment?: Investment;
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
}

export default function InvestmentForm({ investment, onSubmit, onClose }: InvestmentFormProps) {
  const [formData, setFormData] = useState({
    symbol: investment?.symbol || '',
    name: investment?.name || '',
    quantity: investment?.quantity || '1',
    buyPrice: investment?.buyPrice || '',
    buyDate: investment?.buyDate ? new Date(investment.buyDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    type: investment?.type || 'STOCK',
  });

  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchMode, setSearchMode] = useState<'symbol' | 'name'>('symbol');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit({
        ...formData,
        buyPrice: parseFloat(formData.buyPrice as string),
        quantity: parseInt(formData.quantity as string),
      });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
useEffect(() => {
  const query =
    searchMode === 'symbol'|| searchMode === 'name'
      ? formData.symbol.trim()
      : formData.name.trim();

  if (query.length < 3) {
    setSuggestions([]);
    setShowSuggestions(false);
    return;
  }

  const timer = setTimeout(async () => {
    try {
      const data = await searchSymbols(query);
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Search failed", err);
      setSuggestions([]);
    }
  }, 300);

  return () => clearTimeout(timer);
}, [formData.symbol, formData.name, searchMode]);




  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {investment ? 'Edit Investment' : 'Add New Investment'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
           <div className="space-y-4">
         <div className="relative">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Symbol *
  </label>

  <input
    type="text"
    value={formData.symbol}
    onChange={(e) =>
      setFormData({
        ...formData,
        symbol: e.target.value.toUpperCase(),
      })
    }
    onFocus={() => setShowSuggestions(true)}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    placeholder="e.g., AAPL"
    required
  />

  {showSuggestions && suggestions.length > 0 && (
    <div className="absolute z-[1000] mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-56 overflow-auto">
      {suggestions.map((s) => (
        <button
          key={s.symbol}
          type="button"
          className="w-full px-4 py-3 text-left hover:bg-blue-50 flex justify-between"
          onMouseDown={(e) => {
            e.preventDefault();
            setFormData({
              ...formData,
              symbol: s.symbol,
              name: s.name,
            });
            setShowSuggestions(false);
          }}
        >
          <span className="font-semibold text-gray-900">{s.symbol}</span>
          <span className="text-sm text-gray-500">{s.name}</span>
        </button>
      ))}
    </div>
  )}
</div>   {/* ✅ THIS WAS MISSING */}



            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Apple Inc."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buy Price *
                </label>
                <input
                  type="number"
                  name="buyPrice"
                  value={formData.buyPrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buy Date *
              </label>
              <input
                type="date"
                name="buyDate"
                value={formData.buyDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium disabled:opacity-50"
            >
              {loading ? 'Saving...' : (investment ? 'Update' : 'Add Investment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}