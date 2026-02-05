'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { marketService, type IndexData } from '@/lib/market';
import { TrendingUp, TrendingDown, BarChart3, RefreshCw, AlertCircle } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

export default function MarketSnapshot() {
    const [isOpen, setIsOpen] = useState(false);

    const { data, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ['market-snapshot'],
        queryFn: () => marketService.getSnapshot(),
        refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
        staleTime: 4 * 60 * 1000, // Consider data stale after 4 minutes
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }).format(price);
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Trigger Button */}
            <button
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
                    "bg-slate-100 hover:bg-slate-200 text-slate-700",
                    "border border-slate-200 hover:border-slate-300",
                    isOpen && "bg-slate-200 border-slate-300"
                )}
            >
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Market Snapshot</span>
                {isFetching && (
                    <RefreshCw className="h-3 w-3 animate-spin text-blue-500" />
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="w-72 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                        {/* Header */}
                        <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Indian Indices</h3>
                                <button
                                    onClick={() => refetch()}
                                    disabled={isFetching}
                                    className="p-1 rounded hover:bg-slate-200 transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw className={cn("h-3 w-3 text-slate-500", isFetching && "animate-spin")} />
                                </button>
                            </div>
                            {data?.lastUpdated && (
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                    Updated: {new Date(data.lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-2">
                            {isLoading ? (
                                <div className="space-y-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse" />
                                    ))}
                                </div>
                            ) : isError ? (
                                <div className="flex flex-col items-center justify-center py-6 text-slate-400">
                                    <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
                                    <span className="text-xs font-medium">Unable to load market data</span>
                                    <button
                                        onClick={() => refetch()}
                                        className="mt-2 text-xs text-blue-500 hover:text-blue-600 font-semibold"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-1.5">
                                    {data?.indices?.map((index: IndexData) => (
                                        <div
                                            key={index.symbol}
                                            className={cn(
                                                "p-3 rounded-lg transition-colors",
                                                index.isPositive ? "bg-green-50/70 hover:bg-green-50" : "bg-red-50/70 hover:bg-red-50"
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-800">{index.name}</h4>
                                                    <p className="text-xs text-slate-500 font-medium">
                                                        {formatPrice(index.currentPrice)}
                                                    </p>
                                                </div>
                                                <div className={cn(
                                                    "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
                                                    index.isPositive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                )}>
                                                    {index.isPositive ? (
                                                        <TrendingUp className="h-3 w-3" />
                                                    ) : (
                                                        <TrendingDown className="h-3 w-3" />
                                                    )}
                                                    <span>
                                                        {index.isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-1.5 flex items-center gap-2">
                                                <span className={cn(
                                                    "text-[10px] font-semibold",
                                                    index.isPositive ? "text-green-600" : "text-red-600"
                                                )}>
                                                    {index.isPositive ? '▲' : '▼'} {Math.abs(index.change).toFixed(2)} pts
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
                            <p className="text-[9px] text-slate-400 text-center">
                                Data refreshes every 5 minutes • Market hours: 9:15 AM - 3:30 PM IST
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
