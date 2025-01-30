'use client';

import React, { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

// Separate component for the login form with search params
function LoginFormContent() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { login, isLoading } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get('invite');

  const onSubmit = async (data) => {
    try {
      const result = await login(data.email, data.password);
      if (result?.token) {
        // If there's an invite code, accept the invitation
        if (inviteCode) {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/team/invite/accept/${inviteCode}`,
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${result.token}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            if (!response.ok) throw new Error('Failed to accept invitation');

            toast.success('Successfully joined the team!');
          } catch (error) {
            toast.error('Failed to accept invitation');
          }
        }
        window.location.href = '/workspace';
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Welcome back</h2>
        <p className="mt-2 text-sm text-gray-200">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-blue-400 hover:text-blue-300">
            Sign up
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-200">
            Email address
          </label>
          <input
            {...register('email', { required: 'Email is required' })}
            type="email"
            id="email"
            className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-200">
            Password
          </label>
          <div className="relative">
            <input
              {...register('password', { required: 'Password is required' })}
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

// Main component with Suspense boundary
export default function LoginForm() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}