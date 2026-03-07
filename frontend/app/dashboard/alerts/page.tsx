'use client';

import { Bell } from 'lucide-react';

export default function AlertsPage() {
    return (
        <div className="p-6 lg:p-10 min-h-screen bg-gray-50/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                        <Bell className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Alerts</h1>
                        <p className="text-gray-500 font-medium">Manage your financial notifications and triggers.</p>
                    </div>
                </div>

                {/* Empty State / Placeholder */}
                <div className="bg-white rounded-[32px] border-2 border-dashed border-gray-200 p-20 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                        <Bell className="w-10 h-10 text-blue-300" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No active alerts</h2>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        You don't have any alerts set up yet. Soon you'll be able to create custom notifications for budget limits and market movements.
                    </p>
                </div>
            </div>
        </div>
    );
}
