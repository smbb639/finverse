'use client';

import { useState } from 'react';
import { calculatorService, PositionSizingResult } from '@/lib/calculators';
import { formatCurrency } from '@/lib/utils';
import { IndianRupee, ShieldAlert, TrendingUp, Info, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function PositionSizingCalculator() {
    const [formData, setFormData] = useState({
        capital: '100000',
        riskPercent: '1',
        entryPrice: '500',
        stopLoss: '480',
    });

    const [result, setResult] = useState<PositionSizingResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCalculate = async () => {
        setLoading(true);
        setError(null);
        try {
            const parsedData = {
                capital: parseFloat(formData.capital) || 0,
                riskPercent: parseFloat(formData.riskPercent) || 0,
                entryPrice: parseFloat(formData.entryPrice) || 0,
                stopLoss: parseFloat(formData.stopLoss) || 0,
            };
            const res = await calculatorService.calculatePositionSize(parsedData);
            setResult(res);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error calculating position size');
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-2xl p-6 sm:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Inputs Section */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-600" />
                                Input Parameters
                            </h2>
                            <div className="space-y-5">
                                {/* Total Capital */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Total Account Capital
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                            <IndianRupee className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="number"
                                            name="capital"
                                            value={formData.capital}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-gray-900"
                                            placeholder="e.g. 100000"
                                        />
                                    </div>
                                </div>

                                {/* Risk Percentage */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Risk per Trade (%)
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                                            <ShieldAlert className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="riskPercent"
                                            value={formData.riskPercent}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50 outline-none transition-all font-medium text-gray-900"
                                            placeholder="e.g. 1"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">%</div>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500 italic">Recommended: 1-2% for sustainable growth</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Entry Price */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Entry Price
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                name="entryPrice"
                                                value={formData.entryPrice}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-gray-900"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    {/* Stop Loss */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Stop Loss
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                name="stopLoss"
                                                value={formData.stopLoss}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50 outline-none transition-all font-medium text-gray-900"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCalculate}
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                                >
                                    {loading ? 'Calculating...' : 'Calculate Position'}
                                    {!loading && <TrendingUp className="w-5 h-5" />}
                                </button>

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm font-medium animate-in slide-in-from-top-2 duration-300">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        {error}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="relative">
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                Trade Results
                            </h2>

                            {!result ? (
                                <div className="h-full min-h-[400px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-gray-50/50">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                                        <TrendingUp className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-medium">Click calculate to see your position sizing recommendations</p>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in zoom-in-95 duration-500">
                                    {/* Major Result - Quantity */}
                                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
                                        <div className="relative z-10">
                                            <p className="text-blue-100 font-semibold mb-2 uppercase tracking-wider text-xs">Buy Quantity</p>
                                            <h3 className="text-5xl font-black mb-1">{result.quantity}</h3>
                                            <p className="text-blue-100/80 text-sm font-medium">Shares recommended</p>
                                        </div>
                                        <div className="absolute right-[-10%] bottom-[-10%] z-0 h-40 w-40 bg-white/10 rounded-full blur-3xl"></div>
                                    </div>

                                    {/* Secondary Stats */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm">
                                            <p className="text-gray-500 text-xs font-bold uppercase mb-2">Risk Amount</p>
                                            <p className="text-xl font-bold text-red-600">{formatCurrency(result.riskAmount)}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">Total loss if SL hit</p>
                                        </div>
                                        <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm">
                                            <p className="text-gray-500 text-xs font-bold uppercase mb-2">Position Value</p>
                                            <p className="text-xl font-bold text-blue-600">{formatCurrency(result.positionValue)}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">Cash required</p>
                                        </div>
                                    </div>

                                    {/* Risk per share */}
                                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                                        <div>
                                            <p className="text-gray-500 text-sm font-bold uppercase">Risk Per Share</p>
                                            <p className="text-gray-400 text-xs">Distance to stop loss</p>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(result.riskPerShare)}</p>
                                    </div>

                                    {/* Important Disclaimer Card */}
                                    <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                                        <div className="flex gap-3">
                                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-amber-900 text-sm font-bold mb-1">Risk Management Note</p>
                                                <p className="text-amber-800/80 text-xs leading-relaxed">
                                                    Always ensure your broker has the liquidity to execute your stop loss. Calculated quantity does not include brokerage and taxes.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
