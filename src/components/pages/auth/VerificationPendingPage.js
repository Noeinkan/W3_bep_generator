import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import apiService from '../../../services/apiService';

const VerificationPendingPage = () => {
  const location = useLocation();
  const email = location.state?.email || '';
  const [resendStatus, setResendStatus] = useState('');

  const handleResend = async () => {
    if (!email) return;
    try {
      setResendStatus('sending');
      await apiService.resendVerification(email);
      setResendStatus('sent');
    } catch (err) {
      setResendStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-lg text-center">
        {/* Email icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
          <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
        <p className="text-gray-600">
          We've sent a verification link to{' '}
          {email ? <span className="font-semibold">{email}</span> : 'your email address'}.
        </p>
        <p className="text-sm text-gray-500">
          Click the link in the email to verify your account. You won't be able to log in until your email is verified.
        </p>

        <div className="pt-4 space-y-3">
          {resendStatus === 'sent' ? (
            <p className="text-sm text-green-600 font-medium">Verification email resent!</p>
          ) : resendStatus === 'error' ? (
            <p className="text-sm text-red-600">Failed to resend. Please try again later.</p>
          ) : (
            <button
              onClick={handleResend}
              disabled={!email || resendStatus === 'sending'}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 underline disabled:opacity-50"
            >
              {resendStatus === 'sending' ? 'Sending…' : "Didn't receive it? Resend verification email"}
            </button>
          )}

          <div>
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-800">
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPendingPage;
