'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authService } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import AuthLayout from '@/components/auth-layout';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');
    try {
      await authService.login(data.email, data.password);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col space-y-3 mb-8">
        <h1 className="text-4xl font-black tracking-tight text-white">
          Sign In
        </h1>
        <p className="text-slate-400 text-sm font-medium">
          Access your professional wealth dashboard.
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-5">
            {error && (
              <div className="bg-red-500/10 text-red-400 text-xs p-4 rounded-xl border border-red-500/20 backdrop-blur-sm animate-in fade-in slide-in-from-top-1">
                <span className="font-bold mr-2 truncate">Error:</span> {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-slate-300 ml-1 text-xs font-bold uppercase tracking-wider">Email Address</Label>
              <div className="relative group">
                <Input
                  id="email"
                  placeholder="email@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  disabled={isLoading}
                  {...register('email')}
                  className={cn(
                    "h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-indigo-500/20 rounded-xl transition-all",
                    errors.email && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase tracking-tighter">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-slate-300 text-xs font-bold uppercase tracking-wider">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider transition-colors"
                >
                  Forgot access?
                </Link>
              </div>
              <div className="relative group">
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  autoCapitalize="none"
                  autoComplete="current-password"
                  disabled={isLoading}
                  {...register('password')}
                  className={cn(
                    "h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-indigo-500/20 rounded-xl pr-12 transition-all",
                    errors.password && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                  )}
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase tracking-tighter">{errors.password.message}</p>
              )}
            </div>

            <Button
              disabled={isLoading}
              className="
                group 
                relative 
                w-full 
                h-12
                mt-2
                bg-indigo-600 
                hover:bg-indigo-500
                text-white 
                font-bold
                rounded-xl
                shadow-lg 
                shadow-indigo-500/20 
                transition-all 
                duration-300 
                active:scale-[0.98]
                border-0
              "
              type="submit"
            >
              <div className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="uppercase tracking-widest text-[11px]">Verifying...</span>
                  </>
                ) : (
                  <>
                    <span className="uppercase tracking-widest text-[11px]">Authorize Access</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </div>
            </Button>
          </div>
        </form>

        <p className="text-center text-xs text-slate-500 font-medium">
          New to the frontier?{' '}
          <Link
            href="/register"
            className="font-bold text-white hover:text-indigo-400 underline underline-offset-4 transition-colors"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}