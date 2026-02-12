'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { investmentService } from '@/lib/investment';
import { TrendingUp, TrendingDown, Wallet, RefreshCw, AlertCircle } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

export default function PortfolioPerformance() {
    const [isOpen, setIsOpen] = useState(false);

    const { data: investments, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ['portfolio-performance'],
        queryFn: () => investmentService.getInvestments(),
        refetchInterval: 5 * 60 * 1000,
    });

    const totalValue = investments?.reduce((acc, inv) => acc + (inv.currentPrice || 0) * inv.quantity, 0) || 0;
    const totalDailyPnL = investments?.reduce((acc, inv) => acc + (inv.dailyPnL || 0), 0) || 0;
    const avgDailyPnLPercent = totalValue > 0 ? (totalDailyPnL / (totalValue - totalDailyPnL)) * 100 : 0;
    const isPositive = totalDailyPnL >= 0;

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
                    "bg-blue-50 hover:bg-blue-100 text-blue-700",
                    "border border-blue-100 hover:border-blue-200",
                    isOpen && "bg-blue-100 border-blue-200"
                )}
            >
                <Wallet className="h-3.5 w-3.5" />
                <div className="flex items-center gap-1.5">
                    <span className="hidden sm:inline">Portfolio:</span>
                    {isLoading ? (
                        <div className="h-3 w-16 bg-blue-200 animate-pulse rounded" />
                    ) : (
                        <span className="font-bold">{formatCurrency(totalValue).split('.')[0]}</span>
                    )}
                    {!isLoading && !isError && (
                        <span className={cn(
                            "flex items-center text-[10px] font-bold px-1 rounded",
                            isPositive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                        )}>
                            {isPositive ? '+' : ''}{avgDailyPnLPercent.toFixed(2)}%
                        </span>
                    )}
                </div>
                {isFetching && (
                    <RefreshCw className="h-3 w-3 animate-spin text-blue-400" />
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="w-64 bg-white rounded-xl shadow-xl border border-blue-100 overflow-hidden">
                        {/* Header */}
                        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider">Portfolio Performance</h3>
                                <button
                                    onClick={() => refetch()}
                                    disabled={isFetching}
                                    className="p-1 rounded hover:bg-blue-100 transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw className={cn("h-3 w-3 text-blue-500", isFetching && "animate-spin")} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-3">
                            {isLoading ? (
                                <div className="space-y-2">
                                    <div className="h-10 bg-blue-50 rounded-lg animate-pulse" />
                                    <div className="h-10 bg-blue-50 rounded-lg animate-pulse" />
                                </div>
                            ) : isError ? (
                                <div className="flex flex-col items-center justify-center py-4 text-slate-400">
                                    <AlertCircle className="h-6 w-6 mb-2 opacity-50" />
                                    <span className="text-xs font-medium">Error loading data</span>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">Total Value</p>
                                        <p className="text-lg font-black text-slate-900">{formatCurrency(totalValue)}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
                                        <div>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase">Today's P&L</p>
                                            <p className={cn(
                                                "text-sm font-bold",
                                                isPositive ? "text-green-600" : "text-red-600"
                                            )}>
                                                {isPositive ? '+' : ''}{formatCurrency(totalDailyPnL)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase">Day Change</p>
                                            <p className={cn(
                                                "text-sm font-bold flex items-center gap-1",
                                                isPositive ? "text-green-600" : "text-red-600"
                                            )}>
                                                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                                {avgDailyPnLPercent.toFixed(2)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
                            <p className="text-[9px] text-slate-400 text-center">
                                Refreshes along with market data
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
