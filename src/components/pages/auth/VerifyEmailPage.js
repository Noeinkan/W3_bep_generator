import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import apiService from '../../../services/apiService';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying | success | error

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    let cancelled = false;
    const verify = async () => {
      try {
        await apiService.verifyEmail(token);
        if (!cancelled) setStatus('success');
      } catch (err) {
        if (!cancelled) setStatus('error');
      }
    };
    verify();
    return () => { cancelled = true; };
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-lg text-center">
        {status === 'verifying' && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 animate-pulse">
              <svg className="h-8 w-8 text-indigo-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verifying your email…</h2>
            <p className="text-gray-600">Please wait while we confirm your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Email verified!</h2>
            <p className="text-gray-600">Your email has been verified successfully. You can now log in to your account.</p>
            <Link
              to="/login"
              className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
            >
              Go to login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verification failed</h2>
            <p className="text-gray-600">
              {!token
                ? 'No verification token was provided.'
                : 'This link may be invalid or expired.'}
            </p>
            <div className="mt-4 space-y-2">
              <Link
                to="/login"
                className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
              >
                Go to login
              </Link>
              <p className="text-sm text-gray-500">
                You can request a new verification email from the login page.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
