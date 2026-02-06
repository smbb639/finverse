'use client';

import { useState } from 'react';
import { calculatorService, LoanResult } from '@/lib/calculators';
import { formatCurrency } from '@/lib/utils';
import {
    IndianRupee,
    Calendar,
    Percent,
    TrendingUp,
    Info,
    AlertCircle,
    CheckCircle2,
    Clock
} from 'lucide-react';
import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    Legend
} from 'recharts';

export default function LoanCalculator() {
    const [formData, setFormData] = useState({
        principal: '500000',
        interestRate: '8.5',
        tenure: '5',
        tenureType: 'years' as 'years' | 'months',
    });

    const [result, setResult] = useState<LoanResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                principal: parseFloat(formData.principal) || 0,
                interestRate: parseFloat(formData.interestRate) || 0,
                tenure: parseFloat(formData.tenure) || 0,
                tenureType: formData.tenureType,
            };
            const res = await calculatorService.calculateLoan(parsedData);
            setResult(res);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error calculating loan EMI');
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    const chartData = result ? [
        { name: 'Principal', value: parseFloat(formData.principal) || 0 },
        { name: 'Interest', value: result.totalInterest }
    ] : [];

    const COLORS = ['#3B82F6', '#F43F5E'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-2xl p-6 sm:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Inputs Section */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-600" />
                                Loan Parameters
                            </h2>
                            <div className="space-y-5">
                                {/* Principal Amount */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Loan Amount (Principal)
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                            <IndianRupee className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="number"
                                            name="principal"
                                            value={formData.principal}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-gray-900"
                                            placeholder="e.g. 500000"
                                        />
                                    </div>
                                </div>

                                {/* Interest Rate */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Annual Interest Rate (%)
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                            <Percent className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="interestRate"
                                            value={formData.interestRate}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-gray-900"
                                            placeholder="e.g. 8.5"
                                        />
                                    </div>
                                </div>

                                {/* Tenure */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Loan Tenure
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="number"
                                                name="tenure"
                                                value={formData.tenure}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-gray-900"
                                                placeholder="e.g. 5"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Tenure Type
                                        </label>
                                        <div className="relative group">
                                            <select
                                                name="tenureType"
                                                value={formData.tenureType}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-gray-900 appearance-none"
                                            >
                                                <option value="years">Years</option>
                                                <option value="months">Months</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCalculate}
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                                >
                                    {loading ? 'Calculating...' : 'Calculate EMI'}
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
                        <div className="space-y-6 h-full">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                Repayment Breakdown
                            </h2>

                            {!result ? (
                                <div className="h-[450px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-gray-50/50">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                                        <Clock className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-medium">Input your loan details and click calculate to see the full breakdown</p>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in zoom-in-95 duration-500">
                                    {/* Major Result - EMI */}
                                    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
                                        <div className="relative z-10 text-center">
                                            <p className="text-emerald-100 font-semibold mb-2 uppercase tracking-wider text-xs">Monthly EMI</p>
                                            <h3 className="text-5xl font-black mb-1">{formatCurrency(result.monthlyEmi)}</h3>
                                            <p className="text-emerald-100/80 text-sm font-medium">For {result.tenureMonths} months</p>
                                        </div>
                                        <div className="absolute right-[-10%] bottom-[-10%] z-0 h-40 w-40 bg-white/10 rounded-full blur-3xl"></div>
                                    </div>

                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm">
                                            <p className="text-gray-500 text-xs font-bold uppercase mb-2">Total Interest</p>
                                            <p className="text-xl font-bold text-rose-500">{formatCurrency(result.totalInterest)}</p>
                                        </div>
                                        <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm">
                                            <p className="text-gray-500 text-xs font-bold uppercase mb-2">Total Payment</p>
                                            <p className="text-xl font-bold text-emerald-600">{formatCurrency(result.totalPayment)}</p>
                                        </div>
                                    </div>

                                    {/* Visual Breakdown Chart */}
                                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-sm h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RechartsPieChart>
                                                <Pie
                                                    data={chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip
                                                    formatter={(value: any) => formatCurrency(Number(value))}
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                />
                                                <Legend />
                                            </RechartsPieChart>
                                        </ResponsiveContainer>
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
