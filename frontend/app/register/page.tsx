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

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  startingBalance: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      startingBalance: '',
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');
    try {
      await authService.register(data.name, data.email, data.password, Number(data.startingBalance));
      await authService.login(data.email, data.password);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col space-y-3 mb-8">
        <h1 className="text-4xl font-black tracking-tight text-white">
          Create Account
        </h1>
        <p className="text-slate-400 text-sm font-medium">
          Start your journey to financial freedom today.
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            {error && (
              <div className="bg-red-500/10 text-red-400 text-xs p-4 rounded-xl border border-red-500/20 backdrop-blur-sm animate-in fade-in slide-in-from-top-1">
                <span className="font-bold mr-2 truncate">Error:</span> {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name" className="text-slate-300 ml-1 text-xs font-bold uppercase tracking-wider">Full Name</Label>
              <Input
                id="name"
                placeholder="Your good name!"
                disabled={isLoading}
                {...register('name')}
                className={cn(
                  "h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-indigo-500/20 rounded-xl transition-all",
                  errors.name && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                )}
              />
              {errors.name && (
                <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase tracking-tighter">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-slate-300 ml-1 text-xs font-bold uppercase tracking-wider">Email Address</Label>
              <Input
                id="email"
                placeholder="email@example.com"
                type="email"
                disabled={isLoading}
                {...register('email')}
                className={cn(
                  "h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-indigo-500/20 rounded-xl transition-all",
                  errors.email && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                )}
              />
              {errors.email && (
                <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase tracking-tighter">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-slate-300 ml-1 text-xs font-bold uppercase tracking-wider">Password</Label>
              <div className="relative group">
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
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

            <div className="grid gap-2">
              <Label htmlFor="startingBalance" className="text-slate-300 ml-1 text-xs font-bold uppercase tracking-wider">Starting Balance (Initial Cash)</Label>
              <Input
                id="startingBalance"
                placeholder="Ex: 50000"
                type="number"
                disabled={isLoading}
                {...register('startingBalance')}
                className={cn(
                  "h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-indigo-500/20 rounded-xl transition-all",
                  errors.startingBalance && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                )}
              />
              <p className="text-[9px] text-slate-500 ml-1 italic font-medium">
                Used to calculate your lifetime Net Worth accurately.
              </p>
              {errors.startingBalance && (
                <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase tracking-tighter">{errors.startingBalance.message as string}</p>
              )}
            </div>

            <Button
              disabled={isLoading}
              className="
                group 
                relative 
                w-full 
                h-12
                mt-4
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
                    <span className="uppercase tracking-widest text-[11px]">Deploying...</span>
                  </>
                ) : (
                  <>
                    <span className="uppercase tracking-widest text-[11px]">Initialize Portfolio</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </div>
            </Button>
          </div>
        </form>

        <p className="text-center text-[10px] text-slate-600 font-medium px-4">
          By clicking continue, you agree to our{' '}
          <Link href="/terms" className="text-slate-400 hover:text-white underline underline-offset-4 transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-slate-400 hover:text-white underline underline-offset-4 transition-colors">
            Privacy Policy
          </Link>
          .
        </p>

        <p className="text-center text-xs text-slate-500 font-medium pb-4">
          Already part of the network?{' '}
          <Link
            href="/login"
            className="font-bold text-white hover:text-indigo-400 underline underline-offset-4 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}