'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/src/lib/utils';
import { loginSchema, type LoginFormValues } from '@/src/lib/validation/loginSchema';
import { useAuth } from '@/src/contexts/AuthContext';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Invalid email or password';
      toast.error(message);
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 w-full max-w-140 flex flex-col gap-8">
      <h1 className="text-preset-1 font-bold text-grey-900 leading-[1.2]">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-xs font-bold text-grey-500">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="e.g. yourname@email.com"
            {...register('email')}
            className={cn(
              'w-full px-5 py-3 rounded-lg border text-sm text-grey-900 bg-white',
              'placeholder:text-grey-300 outline-none transition-colors',
              'focus:border-grey-900',
              errors.email ? 'border-red' : 'border-beige-500',
            )}
          />
          {errors.email && (
            <p className="text-xs text-red">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-xs font-bold text-grey-500">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              {...register('password')}
              className={cn(
                'w-full px-5 py-3 pr-12 rounded-lg border text-sm text-grey-900 bg-white',
                'placeholder:text-grey-300 outline-none transition-colors',
                'focus:border-grey-900',
                errors.password ? 'border-red' : 'border-beige-500',
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-500 hover:text-grey-900 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'w-full py-4 rounded-lg bg-grey-900 text-white font-bold text-sm',
            'hover:opacity-80 transition-opacity',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {isSubmitting ? 'Logging in…' : 'Login'}
        </button>
      </form>

      <p className="text-center text-sm text-grey-500">
        Need to create an account?{' '}
        <Link href="/signup" className="font-bold text-grey-900 underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
