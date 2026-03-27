'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/src/lib/utils';
import { signupSchema, type SignupFormValues } from '@/src/lib/validation/signupSchema';
import { useAuth } from '@/src/contexts/AuthContext';

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { signup } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await signup(data.name, data.email, data.password);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 w-full max-w-140 flex flex-col gap-8">
      <h1 className="text-preset-1 font-bold text-grey-900 leading-[1.2]">
        Sign Up
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-xs font-bold text-grey-500">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="e.g. John Smith"
            {...register('name')}
            className={cn(
              'w-full px-5 py-3 rounded-lg border text-sm text-grey-900 bg-white',
              'placeholder:text-grey-300 outline-none transition-colors',
              'focus:border-grey-900',
              errors.name ? 'border-red' : 'border-beige-500',
            )}
          />
          {errors.name && (
            <p className="text-xs text-red">{errors.name.message}</p>
          )}
        </div>

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
              autoComplete="new-password"
              placeholder="Min. 8 characters"
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

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="confirmPassword"
            className="text-xs font-bold text-grey-500"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Confirm your password"
              {...register('confirmPassword')}
              className={cn(
                'w-full px-5 py-3 pr-12 rounded-lg border text-sm text-grey-900 bg-white',
                'placeholder:text-grey-300 outline-none transition-colors',
                'focus:border-grey-900',
                errors.confirmPassword ? 'border-red' : 'border-beige-500',
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-500 hover:text-grey-900 transition-colors"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red">{errors.confirmPassword.message}</p>
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
          {isSubmitting ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-grey-500">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-grey-900 underline">
          Login
        </Link>
      </p>
    </div>
  );
}
