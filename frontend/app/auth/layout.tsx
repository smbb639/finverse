import Link from 'next/link';
import { Wallet, CheckCircle2 } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* Left Side - Brand & Marketing (Hidden on Mobile) */}
      <div className="hidden bg-primary p-10 text-primary-foreground lg:flex flex-col justify-between dark:border-r">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 backdrop-blur-sm">
            <Wallet className="h-6 w-6" />
          </div>
          Finverse
        </div>

        <div className="space-y-6 max-w-lg">
          <h2 className="text-4xl font-bold tracking-tight">
            Master your money with precision and ease.
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Join thousands of users tracking expenses, managing investments, and
            securing their financial future with Finverse.
          </p>
          
          <div className="space-y-4 pt-4">
            {['Smart expense tracking', 'Real-time portfolio analytics', 'Bank-grade security'].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-primary-foreground/60">
          © 2024 Finverse Inc. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto grid w-full max-w-[400px] gap-6">
          {children}
        </div>
      </div>
    </div>
  );
}