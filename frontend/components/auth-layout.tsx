import Link from 'next/link';
import { IndianRupee, CheckCircle2, TrendingUp, Shield, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full min-h-screen lg:grid lg:grid-cols-2 relative overflow-hidden bg-[#020617]">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
            </div>

            {/* Left Side - Brand & Marketing */}
            <div className="hidden lg:flex relative bg-slate-950 p-12 text-white flex-col justify-between border-r border-white/5 overflow-hidden">
                {/* Decorative mesh gradient */}
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.15),transparent_50%)]" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 text-2xl font-bold hover:opacity-90 transition-all active:scale-95">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                            <IndianRupee className="h-7 w-7 text-white" />
                        </div>
                        <span className="tracking-tight">Finverse</span>
                    </Link>
                </div>

                <div className="space-y-8 max-w-lg relative z-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Next-Gen Finance
                        </div>
                        <h2 className="text-6xl font-black tracking-tight leading-[1.1]">
                            Manage Wealth <br />
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Without Limits.
                            </span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                            The all-in-one platform to track expenses, investments, and net worth with AI-powered insights.
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {[
                            { icon: TrendingUp, title: 'Smart Growth', desc: 'Track your investments in real-time.' },
                            { icon: PieChart, title: 'Deep Analysis', desc: 'Detailed category breakdowns and trends.' },
                            { icon: Shield, title: 'Encrypted Security', desc: 'Your data is protected!' }
                        ].map((feature) => (
                            <div key={feature.title} className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-colors">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                    <feature.icon className="h-6 w-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-0.5">{feature.title}</h4>
                                    <p className="text-sm text-slate-500">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                
            </div>

            {/* Right Side - Form Container */}
            <div className="relative flex items-center justify-center min-h-screen py-12 px-6 lg:px-12 bg-[#020617]">
                {/* Mobile Header */}
                <div className="absolute top-8 left-8 right-8 flex lg:hidden items-center justify-between z-20">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:scale-105 transition-transform">
                            <IndianRupee className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">Finverse</span>
                    </Link>
                </div>

                <div className="w-full max-w-[440px] relative z-10">
                    {/* Form Wrap */}
                    <div className="space-y-2">
                        {children}
                    </div>
                </div>

                {/* Subtle Footer for Mobile */}
                <div className="absolute bottom-8 text-center lg:hidden">
                    <p className="text-slate-600 text-[10px] uppercase tracking-widest font-bold">
                        Securely powered by Finverse Cloud
                    </p>
                </div>
            </div>
        </div>
    );
}
