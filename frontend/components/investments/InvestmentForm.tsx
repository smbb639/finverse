'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Investment, InvestmentFormData } from '@/lib/investment';
import { X, Search, TrendingUp, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { searchSymbols } from '@/lib/api';

interface SearchResult {
  symbol: string;
  name: string;
  exchange?: string;
}

interface InvestmentFormProps {
  investment?: Investment;
  onSubmit: (data: InvestmentFormData) => Promise<void>;
  onClose: () => void;
}

export default function InvestmentForm({ investment, onSubmit, onClose }: InvestmentFormProps) {
  const [formData, setFormData] = useState({
    symbol: investment?.symbol || '',
    name: investment?.name || '',
    quantity: investment?.quantity?.toString() || '1',
    buyPrice: investment?.buyPrice?.toString() || '',
    buyDate: investment?.buyDate
      ? new Date(investment.buyDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    type: investment?.type || 'STOCK',
  });

  const [searchQuery, setSearchQuery] = useState(
    investment ? `${investment.symbol} - ${investment.name}` : ''
  );
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSymbolValid, setIsSymbolValid] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualBuyPrice, setManualBuyPrice] = useState('');


  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const results = await searchSymbols(query);

      // Sort results: exact matches first, then by relevance
      const sortedResults = results.sort((a: SearchResult, b: SearchResult) => {
        const aSymbolMatch = a.symbol.toLowerCase() === query.toLowerCase();
        const bSymbolMatch = b.symbol.toLowerCase() === query.toLowerCase();
        const aNameMatch = a.name.toLowerCase().includes(query.toLowerCase());
        const bNameMatch = b.name.toLowerCase().includes(query.toLowerCase());

        if (aSymbolMatch && !bSymbolMatch) return -1;
        if (!aSymbolMatch && bSymbolMatch) return 1;
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        return 0;
      });

      setSuggestions(sortedResults.slice(0, 8)); // Limit to 8 results
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to search symbols. Please try again.');
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  // Validate symbol selection
  useEffect(() => {
    if (manualMode) {
      setIsSymbolValid(formData.name.length > 0 && manualBuyPrice.length > 0);
    } else {
      setIsSymbolValid(formData.symbol.length > 0 && formData.name.length > 0);
    }
  }, [formData.symbol, formData.name, manualMode, manualBuyPrice]);

  // Keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          selectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Select a suggestion
  const selectSuggestion = (suggestion: SearchResult) => {
    setFormData(prev => ({
      ...prev,
      symbol: suggestion.symbol,
      name: suggestion.name,
    }));
    setSearchQuery(`${suggestion.symbol} - ${suggestion.name}`);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setSuggestions([]); // Clear suggestions after selection
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear selection if user clears the input or types something very different
    if (value.length === 0) {
      setFormData(prev => ({
        ...prev,
        symbol: '',
        name: '',
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSymbolValid) {
      setError('Please select a valid symbol from the search results');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        ...formData,
        symbol: manualMode ? 'MANUAL' : formData.symbol,
        buyPrice: manualMode
          ? parseFloat(manualBuyPrice)
          : parseFloat(formData.buyPrice),
        quantity: parseInt(formData.quantity, 10),
      });
      onClose();
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to save investment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {investment ? 'Edit Investment' : 'Add Investment'}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {investment ? 'Update your investment details' : 'Search and add stocks to your portfolio'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-xl transition-colors group"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-8 py-6"
        >

          <div className="space-y-6">
            {/* Search Field with Autocomplete */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Stock *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {isSearching ? (
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 placeholder-gray-400 ${isSymbolValid
                    ? 'border-green-300 focus:border-green-500'
                    : 'border-gray-200 focus:border-blue-500'
                    }`}
                  placeholder="Search by symbol or company name (e.g., RELIANCE or Reliance Industries)"
                  autoComplete="off"
                  aria-label="Search for stock symbol or name"
                  aria-autocomplete="list"
                  aria-controls="search-suggestions"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setFormData(prev => ({
                        ...prev,
                        symbol: '',
                        name: '',
                      }));
                      setSuggestions([]);
                      setShowSuggestions(false);
                      searchInputRef.current?.focus();
                    }}
                    className="absolute inset-y-0 right-12 flex items-center pr-2"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
                {isSymbolValid && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={manualMode}
                  onChange={() => {
                    setManualMode(prev => !prev);
                    setFormData(prev => ({ ...prev, symbol: '', name: '' }));
                    setSearchQuery('');
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-600">
                  Enter asset manually
                </span>
              </div>
              {manualMode && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Asset Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g. Gold Investment, Private Equity"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              )}


              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  id="search-suggestions"
                  role="listbox"
                  className="absolute z-50 mt-2 w-full bg-white border-2 border-gray-200 rounded-2xl shadow-2xl max-h-80 overflow-auto animate-fadeIn"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.symbol}-${index}`}
                      type="button"
                      role="option"
                      aria-selected={index === selectedIndex}
                      className={`w-full px-5 py-4 text-left transition-all border-b border-gray-100 last:border-b-0 ${index === selectedIndex
                        ? 'bg-blue-50 border-blue-100'
                        : 'hover:bg-gray-50'
                        }`}
                      onClick={() => selectSuggestion(suggestion)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-lg">
                              {suggestion.symbol}
                            </span>
                            {suggestion.exchange && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-md">
                                {suggestion.exchange}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-0.5 truncate">
                            {suggestion.name}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No results message */}
              {showSuggestions && !isSearching && searchQuery.length >= 2 && suggestions.length === 0 && !isSymbolValid && (
                <div className="absolute z-50 mt-2 w-full bg-white border-2 border-gray-200 rounded-2xl shadow-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No stocks found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try searching with a different keyword
                  </p>
                </div>
              )}

            </div>

            {/* Selected stock display */}
            {isSymbolValid && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
                  <span className="font-semibold text-green-900">{formData.symbol}</span>
                  <span className="text-green-700">•</span>
                  <span className="text-green-700 truncate">{formData.name}</span>
                </div>
              </div>
            )}

            {/* Quantity and Buy Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  min="1"
                  step="1"
                  required
                  aria-label="Investment quantity"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Buy Price (₹) *
                </label>
                <input
                  type="number"
                  name="buyPrice"
                  value={formData.buyPrice}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, buyPrice: e.target.value }))
                  }
                  disabled={manualMode}
                  required={!manualMode}
                  className={`w-full px-4 py-3.5 border-2 rounded-xl transition-all
    ${manualMode
                      ? 'bg-gray-100 cursor-not-allowed border-gray-200'
                      : 'border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500'
                    }`}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                />

              </div>
            </div>
            {manualMode && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Manual Buy Price (₹) *
                </label>
                <input
                  type="number"
                  value={manualBuyPrice}
                  onChange={(e) => setManualBuyPrice(e.target.value)}
                  placeholder="Enter purchase price"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            )}

            {/* Buy Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Buy Date *
              </label>
              <input
                type="date"
                name="buyDate"
                value={formData.buyDate}
                onChange={(e) => setFormData(prev => ({ ...prev, buyDate: e.target.value }))}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                required
                aria-label="Buy date"
              />
            </div>

            {/* Asset Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Asset Type
              </label>
              <div className="grid grid-cols-5 gap-2">
                {['STOCK', 'MF', 'ETF', 'CRYPTO', 'OTHER'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type as Investment['type'] }))}
                    className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${formData.type === type
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-white pt-6 pb-4 border-t border-gray-100 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isSymbolValid}
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                investment ? 'Update Investment' : 'Add Investment'
              )}
            </button>
          </div>

        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}