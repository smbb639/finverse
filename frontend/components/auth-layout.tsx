import Link from 'next/link';
import { DollarSign, CheckCircle2, TrendingUp, Shield, PieChart } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full min-h-screen lg:grid lg:grid-cols-2 relative overflow-hidden bg-slate-950">
            {/* Animated Background for Mobile */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 lg:hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            {/* Left Side - Brand & Marketing (Hidden on Mobile) */}
            <div className="hidden lg:flex relative bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900 p-10 text-white flex-col justify-between overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg">
                            <DollarSign className="h-7 w-7" />
                        </div>
                        Finverse
                    </Link>
                </div>

                <div className="space-y-6 max-w-lg relative z-10">
                    <h2 className="text-5xl font-bold tracking-tight leading-tight">
                        Master your money with
                        <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                            precision and ease
                        </span>
                    </h2>
                    <p className="text-white/80 text-lg leading-relaxed">
                        Join thousands of users tracking expenses, managing budgets, and
                        securing their financial future with Finverse.
                    </p>

                    <div className="space-y-4 pt-4">
                        {[
                            { icon: TrendingUp, text: 'Smart expense tracking' },
                            { icon: PieChart, text: 'Real-time budget analytics' },
                            { icon: Shield, text: 'Bank-grade security' }
                        ].map((feature) => (
                            <div key={feature.text} className="flex items-center gap-3 group">
                                <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                    <feature.icon className="h-5 w-5 text-green-400" />
                                </div>
                                <span className="font-medium text-white/90">{feature.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-sm text-white/50 relative z-10">
                    © 2026 Finverse. All rights reserved.
                </div>
            </div>

            {/* Right Side - Form Container */}
            <div className="relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
                {/* Mobile Logo */}
                <Link href="/" className="absolute top-6 left-6 lg:hidden flex items-center gap-2 text-white z-20">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-600">
                        <DollarSign className="h-6 w-6" />
                    </div>
                    <span className="text-xl font-bold">Finverse</span>
                </Link>

                <div className="mx-auto w-full max-w-[420px] relative z-10">
                    {/* Glassmorphism card for mobile */}
                    <div className="lg:bg-transparent bg-white/10 lg:backdrop-blur-none backdrop-blur-md lg:border-0 border border-white/20 rounded-2xl lg:rounded-none p-8 lg:p-0 shadow-2xl lg:shadow-none">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
