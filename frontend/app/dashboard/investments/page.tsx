'use client';

import { useState, useEffect } from 'react';
import { InvestmentWithMetrics } from '@/lib/investment';
import { investmentService } from '@/lib/investment';
import PortfolioStats from '@/components/investments/PortfolioStats';
import InvestmentCard from '@/components/investments/InvestmentCard';
import InvestmentForm from '@/components/investments/InvestmentForm';
import InvestmentList from '@/components/investments/InvestmentList';
import { Plus, RefreshCw, TrendingUp, LayoutGrid, List, Search } from 'lucide-react';

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<InvestmentWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<InvestmentWithMetrics | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    } else setRefreshing(true);
    setError(null);
    try {
      const data = await investmentService.getInvestments();
      setInvestments(data);
    } catch (error) {
      console.error('Error fetching investments:', error);
      setError('Failed to load investments. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAddInvestment = async (data: any) => {
    try{
    await investmentService.addInvestment(data);
    await fetchInvestments(false);
    setShowForm(false);
    setEditingInvestment(null);
  } catch (error) {
    console.error('Error adding investment:', error);
    throw error;
  }
  };

  const handleEditInvestment = async (id: string, updates: any) => {
    try{
    await investmentService.updateInvestment(id, updates);
    await fetchInvestments(false);
    setShowForm(false);
    setEditingInvestment(null);
  } catch (error) {
    console.error('Error updating investment:', error);
    throw error;
  }
  };

  const handleSellInvestment = async (id: string, sellPrice: number, sellDate: string) => {
    try{
    await investmentService.sellInvestment(id, sellPrice, sellDate);
    await fetchInvestments(false);
    } catch (error) {
    console.error('Error selling investment:', error);
    setError('Failed to sell investment. Please try again.');
  }
  };

  const  filteredInvestments = investments
    .filter(inv => filter === 'all' || inv.type === filter)
    .filter(inv => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        inv.symbol.toLowerCase().includes(query) ||
        inv.name.toLowerCase().includes(query)
      );
    });

  const assetTypes = ['STOCK', 'MF', 'ETF', 'CRYPTO', 'OTHER'];

  return (
   <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                Portfolio Tracker
              </h1>
              <p className="text-gray-600">Track your investments in real-time</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchInvestments(false)}
                disabled={refreshing}
                className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all disabled:opacity-50"
                title="Refresh prices"
                aria-label="Refresh investment prices"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 font-semibold"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Investment</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by symbol or name..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                aria-label="Search investments"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                All Assets
              </button>
              {assetTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                    filter === type
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-800 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Portfolio Stats */}
        {!loading && investments.length > 0 && (
          <div className="mb-8">
            <PortfolioStats investments={investments} />
          </div>
        )}

        {/* View Controls */}
        {!loading && filteredInvestments.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700">
                {filteredInvestments.length} {filteredInvestments.length === 1 ? 'Investment' : 'Investments'}
              </div>
              {(filter !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl transition-all ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600 font-medium">Loading your portfolio...</p>
            </div>
          </div>
        ) : filteredInvestments.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-200">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {searchQuery || filter !== 'all' ? 'No investments found' : 'Start Your Investment Journey'}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchQuery || filter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Add your first investment to start tracking your portfolio performance'}
            </p>
            {(!searchQuery && filter === 'all') && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg shadow-blue-200 hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add Your First Investment
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvestments.map(investment => (
              <InvestmentCard
                key={investment._id}
                investment={investment}
                onEdit={(inv) => {
                  setEditingInvestment(inv);
                  setShowForm(true);
                }}
                onSell={handleSellInvestment}
              />
            ))}
          </div>
        ) : (
          /* List View */
          <InvestmentList
            investments={filteredInvestments}
            onEdit={(inv) => {
              setEditingInvestment(inv);
              setShowForm(true);
            }}
            onSell={handleSellInvestment}
          />
        )}
      </div>

      {/* Investment Form Modal */}
      {showForm && (
        <InvestmentForm
          investment={editingInvestment || undefined}
          onSubmit={async (data) => {
            if (editingInvestment) {
              await handleEditInvestment(editingInvestment._id, data);
            } else {
              await handleAddInvestment(data);
            }
          }}
          onClose={() => {
            setShowForm(false);
            setEditingInvestment(null);
          }}
        />
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}