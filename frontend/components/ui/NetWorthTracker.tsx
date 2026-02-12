'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/lib/dashboard';
import { Coins, ChevronDown, Info, Calculator, Plus, Minus } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

export default function NetWorthTracker() {
    const [isOpen, setIsOpen] = useState(false);

    const { data: dashboardData, isLoading, isError } = useQuery({
        queryKey: ['dashboard', 'summary-v9'], // Reusing the main dashboard query
        queryFn: () => dashboardService.getDashboardData(),
    });

    const stats = dashboardData?.stats;
    const netWorth = stats?.netWorth || 0;
    const startingBalance = stats?.startingBalance || 0;

    // We don't have totalExpenses (lifetime) directly in stats on frontend yet, 
    // but we can calculate the "Cash" portion if we had it.
    // For the breakdown, we'll just show the high-level components.

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
                    "bg-amber-50 hover:bg-amber-100 text-amber-700",
                    "border border-amber-100 hover:border-amber-200",
                    isOpen && "bg-amber-100 border-amber-200"
                )}
            >
                <Coins className="h-3.5 w-3.5" />
                <div className="flex items-center gap-1.5">
                    <span className="hidden lg:inline">Net Worth:</span>
                    {isLoading ? (
                        <div className="h-3 w-16 bg-amber-200 animate-pulse rounded" />
                    ) : (
                        <span className="font-bold">{formatCurrency(netWorth).split('.')[0]}</span>
                    )}
                </div>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="w-64 bg-white rounded-xl shadow-xl border border-amber-100 overflow-hidden">
                        {/* Header */}
                        <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                            <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2">
                                <Calculator className="h-3 w-3" />
                                Wealth Equation
                            </h3>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-3">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-slate-500 flex items-center gap-1.5">
                                        <Plus className="h-2.5 w-2.5 text-green-500" /> Starting Balance
                                    </span>
                                    <span className="font-semibold text-slate-700">{formatCurrency(startingBalance)}</span>
                                </div>

                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-slate-500 flex items-center gap-1.5">
                                        <Minus className="h-2.5 w-2.5 text-red-500" /> Lifetime Expenses
                                    </span>
                                    <span className="font-semibold text-slate-700">
                                        {formatCurrency(stats?.lifetimeExpenses || 0)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-slate-500 flex items-center gap-1.5">
                                        <Plus className="h-2.5 w-2.5 text-blue-500" /> Investments Value
                                    </span>
                                    <span className="font-semibold text-slate-700">
                                        {formatCurrency(netWorth - (startingBalance - (stats?.lifetimeExpenses || 0)))}
                                    </span>
                                </div>

                                <div className="pt-2 mt-1 border-t border-slate-50 flex items-center justify-between text-xs font-bold">
                                    <span className="text-slate-700">Net Wealth</span>
                                    <span className="text-amber-600">{formatCurrency(netWorth)}</span>
                                </div>
                            </div>

                            <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-100/50">
                                <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                                   Dummy Calculation!: Starting Balance - Overall Expenses + Current Investment Portfolio.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
