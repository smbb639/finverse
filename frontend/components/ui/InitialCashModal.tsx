'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Wallet, IndianRupee, Save, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface InitialCashModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentBalance: number;
}

export default function InitialCashModal({ isOpen, onClose, currentBalance }: InitialCashModalProps) {
    const [balance, setBalance] = useState<string>(currentBalance.toString());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setBalance(currentBalance.toString());
            setError(null);
        }
    }, [isOpen, currentBalance]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const num = parseFloat(balance);

        if (isNaN(num)) {
            setError('Please enter a valid amount');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await api.patch('/user/profile', { startingBalance: num });
            onClose();
            window.location.reload();
        } catch (err: any) {
            console.error('Error updating initial cash:', err);
            setError(err.response?.data?.message || 'Failed to update balance. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-100 mx-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-amber-600">
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Initial Cash</h2>
                                    <p className="text-[10px] text-amber-600 font-bold uppercase tracking-[0.1em]">Wealth Starting Point</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all shadow-sm active:scale-95"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-3">
                                <label htmlFor="cash" className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                    Liquid Balance (Cash)
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2">
                                        <IndianRupee className="w-6 h-6 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                                    </div>
                                    <input
                                        type="number"
                                        id="cash"
                                        value={balance}
                                        onChange={(e) => setBalance(e.target.value)}
                                        placeholder="0.00"
                                        step="0.01"
                                        autoFocus
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[24px] focus:ring-8 focus:ring-amber-50 focus:border-amber-500 focus:bg-white transition-all text-2xl font-black text-slate-900"
                                    />
                                </div>
                                <div className="flex items-start gap-2 pl-1">
                                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                        Setting this will recalibrate your Net Worth based on this starting cash.
                                    </p>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <p className="text-sm font-bold text-red-700 leading-tight">{error}</p>
                                </motion.div>
                            )}

                            <div className="flex items-center gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-[20px] text-sm font-black transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] py-4 px-8 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-[20px] text-sm font-black transition-all active:scale-95 shadow-xl shadow-amber-200 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Update Balance
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
        , document.body);
}
