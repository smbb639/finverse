'use client';

import { PortfolioMetrics } from '@/lib/metrics';
import { TrendingUp, Percent, Gauge, ExternalLink, Info } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface AdvancedMetricsProps {
    metrics: PortfolioMetrics | null;
    loading: boolean;
}

export default function AdvancedMetrics({ metrics, loading }: AdvancedMetricsProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 animate-pulse">
                        <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
                        <div className="h-8 w-32 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 w-48 bg-gray-100 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!metrics) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {/* CAGR Card */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <TrendingUp className="w-16 h-16 text-blue-600" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Percent className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">CAGR</h3>
                        <div className="group/info relative">
                            <Info className="w-4 h-4 text-gray-400 cursor-help" />
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-20">
                                Compound Annual Growth Rate over the weighted holding period.
                            </div>
                        </div>
                    </div>
                    <p className={`text-2xl font-black mb-1 ${(metrics.cagr ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {((metrics.cagr ?? 0) * 100).toFixed(2)}%
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Annualized Return</p>
                </div>
            </div>

            {/* Sharpe Ratio Card */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Gauge className="w-16 h-16 text-purple-600" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Gauge className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Sharpe</h3>
                    </div>
                    <p className="text-2xl font-black text-gray-900 mb-1">
                        {(metrics.sharpe ?? 0).toFixed(2)}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Risk Efficiency</p>
                </div>
            </div>

            {/* ROI Card */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <TrendingUp className="w-16 h-16 text-emerald-600" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Abs. ROI</h3>
                    </div>
                    <p className={`text-2xl font-black mb-1 ${(metrics.roi ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {((metrics.roi ?? 0) * 100).toFixed(2)}%
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Total Portfolio ROI</p>
                </div>
            </div>

            {/* Benchmark Card */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100 hover:border-amber-200 hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ExternalLink className="w-16 h-16 text-amber-600" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <ExternalLink className="w-5 h-5 text-amber-600" />
                        </div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest line-clamp-1">{metrics.benchmark?.symbol ?? 'NIFTY 50'}</h3>
                    </div>
                    <p className="text-2xl font-black text-gray-900 mb-1">
                        {formatCurrency(metrics.benchmark?.currentPrice ?? 0)}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Live Index Price</p>
                </div>
            </div>
        </div>
    );
}
