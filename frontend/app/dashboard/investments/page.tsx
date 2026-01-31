'use client';

import { useState, useEffect } from 'react';
import { InvestmentWithMetrics } from '@/lib/investment';
import { investmentService } from '@/lib/investment';
import PortfolioStats from '@/components/investments/PortfolioStats';
import InvestmentCard from '@/components/investments/InvestmentCard';
import InvestmentForm from '@/components/investments/InvestmentForm';
import InvestmentList from '@/components/investments/InvestmentList';
import { Plus, RefreshCw, TrendingUp, Filter } from 'lucide-react';

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<InvestmentWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<InvestmentWithMetrics | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const data = await investmentService.getInvestments();
      setInvestments(data);
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInvestment = async (data: any) => {
    await investmentService.addInvestment(data);
    fetchInvestments();
  };

  const handleEditInvestment = async (id: string, updates: any) => {
    await investmentService.updateInvestment(id, updates);
    fetchInvestments();
  };

  const handleSellInvestment = async (id: string, sellPrice: number, sellDate: string) => {
    await investmentService.sellInvestment(id, sellPrice, sellDate);
    fetchInvestments();
  };

  const filteredInvestments = filter === 'all' 
    ? investments 
    : investments.filter(inv => inv.type === filter);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Portfolio Tracker</h1>
              <p className="text-gray-600 mt-1">Track your investments in real-time</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchInvestments}
                className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                title="Refresh prices"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Investment
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              All Assets
            </button>
            {['STOCK', 'MF', 'ETF', 'CRYPTO', 'OTHER'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === type ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {/* Portfolio Stats */}
        {!loading && investments.length > 0 && (
          <PortfolioStats investments={investments} />
        )}

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {filteredInvestments.length} Investments
            </div>
            {filter !== 'all' && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(filter)}`}>
                {filter}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading your portfolio...</p>
            </div>
          </div>
        ) : filteredInvestments.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No investments yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start building your portfolio by adding your first investment
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium"
            >
              Add Your First Investment
            </button>
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
            setEditingInvestment(null);
          }}
          onClose={() => {
            setShowForm(false);
            setEditingInvestment(null);
          }}
        />
      )}
    </div>
  );
}