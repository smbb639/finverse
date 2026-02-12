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
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col space-y-3 text-center">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Create an account
        </h1>
        <p className="text-muted-foreground">
          Enter your information to get started with Finverse
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            {error && (
              <div className="bg-red-500/10 text-red-300 text-sm p-4 rounded-xl border-2 border-red-500/30 backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Your good name!"
                disabled={isLoading}
                {...register('name')}
                className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                disabled={isLoading}
                {...register('email')}
                className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...register('password')}
                  className={errors.password ? 'border-destructive focus-visible:ring-destructive pr-10' : 'pr-10'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="startingBalance">Starting Balance (Initial Cash)</Label>
              <Input
                id="startingBalance"
                placeholder="Ex: 50000"
                type="number"
                disabled={isLoading}
                {...register('startingBalance')}
                className={errors.startingBalance ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              <p className="text-[10px] text-muted-foreground italic">
                This helps calculate your Net Worth accurately from day one.
              </p>
              {errors.startingBalance && (
                <p className="text-xs text-red-400 mt-1">{errors.startingBalance.message as string}</p>
              )}
            </div>

            {/* Premium Create Account Button */}
            <Button
              disabled={isLoading}
              className="
                group 
                relative 
                w-full 
                h-12
                bg-gradient-to-r from-purple-600 via-purple-600 to-blue-600 
                hover:from-purple-500 hover:via-purple-500 hover:to-blue-500
                text-white 
                font-semibold
                shadow-lg 
                shadow-purple-500/30 
                transition-all 
                duration-300 
                ease-out 
                hover:scale-[1.02] 
                hover:shadow-xl
                hover:shadow-purple-500/50 
                active:scale-[0.98]
                mt-2
                border-0
              "
              type="submit"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-white/60">
          By clicking continue, you agree to our{' '}
          <Link href="/terms" className="text-purple-400 hover:text-purple-300 underline underline-offset-4 transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline underline-offset-4 transition-colors">
            Privacy Policy
          </Link>
          .
        </p>

        <p className="text-center text-sm text-white/70">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-purple-400 hover:text-purple-300 underline underline-offset-4 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}