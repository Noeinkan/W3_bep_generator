import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { loginSchema } from '../../../schemas/authSchemas';
import apiService from '../../../services/apiService';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resendStatus, setResendStatus] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');

      const result = await login(data);

      if (result.success) {
        // Redirect to the page they tried to visit or home
        const from = location.state?.from?.pathname || '/home';
        navigate(from, { replace: true });
      } else if (result.emailNotVerified) {
        setShowVerificationNotice(true);
        setUnverifiedEmail(result.email || data.email);
        setError('');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setResendStatus('sending');
      await apiService.resendVerification(unverifiedEmail);
      setResendStatus('sent');
    } catch (err) {
      setResendStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {showVerificationNotice && (
            <div className="rounded-md bg-yellow-50 border border-yellow-200 p-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-yellow-800 font-medium">Email not verified</p>
                <p className="text-sm text-yellow-700">
                  Please check your inbox for a verification email before logging in.
                </p>
                {resendStatus === 'sent' ? (
                  <p className="text-sm text-green-700">Verification email resent!</p>
                ) : resendStatus === 'error' ? (
                  <p className="text-sm text-red-700">Failed to resend. Please try again later.</p>
                ) : (
                  <button
                    type="button"
                    disabled={resendStatus === 'sending'}
                    onClick={handleResendVerification}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 underline text-left"
                  >
                    {resendStatus === 'sending' ? 'Sending…' : 'Resend verification email'}
                  </button>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
