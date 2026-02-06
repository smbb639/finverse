'use client';

import { useState } from 'react';
import { Calculator, Target } from 'lucide-react';
import PositionSizingCalculator from '@/components/calculators/PositionSizingCalculator';

type CalculatorTab = 'position-sizing' | 'loan' | 'returns';

export default function CalculatorsPage() {
    const [activeTab, setActiveTab] = useState<CalculatorTab>('position-sizing');

    const tabs = [
        { id: 'position-sizing', label: 'Position Sizing', icon: Target },
        // Future placeholders
        { id: 'loan', label: 'Loan Calculator', icon: Calculator, disabled: true },
        { id: 'returns', label: 'Returns Calculator', icon: Calculator, disabled: true },
    ];

    return (
        <div className="min-h-full bg-gradient-to-br from-gray-50 to-blue-50/30">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200">
                <div className="px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-6">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                            Financial Calculators
                        </h1>
                        <p className="text-gray-600 font-medium">Professional tools to plan your trades and investments</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => !tab.disabled && setActiveTab(tab.id as CalculatorTab)}
                                    disabled={tab.disabled}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap border-2 ${isActive
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200'
                                        : tab.disabled
                                            ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed opacity-60'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                    {tab.disabled && <span className="ml-1 text-[10px] uppercase tracking-wider opacity-60 font-bold">(Coming Soon)</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    {activeTab === 'position-sizing' && <PositionSizingCalculator />}
                </div>
            </div>

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
