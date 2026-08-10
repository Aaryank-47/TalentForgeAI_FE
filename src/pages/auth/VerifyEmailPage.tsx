/**
 * TalentForge — Email Verification Page
 *
 * Handles the email verification flow:
 *  1. If ?token= is in the URL: auto-verify and show success/error.
 *  2. If no token: show "resend verification" form.
 *
 * Called when user clicks the verification link from their email.
 * Calls POST /auth/verify-email (with token) or POST /auth/resend-verification.
 */

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react';
import { authApi } from '../../services/api/auth.api';
import { ApiError } from '../../services/api/apiClient';
import jobportal from '../../assets/jobportal_logo2.jpg';

type PageState = 'idle' | 'verifying' | 'success' | 'error' | 'resend_form' | 'resent';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [state, setState] = useState<PageState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  // Auto-verify if token is present in URL
  useEffect(() => {
    if (!token) {
      setState('resend_form');
      return;
    }

    const verify = async () => {
      setState('verifying');
      try {
        await authApi.verifyEmail({ token });
        setState('success');
      } catch (err) {
        const message = err instanceof ApiError
          ? err.message
          : 'Verification failed. The link may have expired.';
        setErrorMessage(message);
        setState('error');
      }
    };

    verify();
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResending(true);
    try {
      await authApi.resendVerification(email);
      setState('resent');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to resend. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (state) {
      case 'idle':
      case 'verifying':
        return (
          <div className="text-center">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-[24px] font-extrabold text-[#0F172A] mb-2">Verifying your email…</h1>
            <p className="text-[14px] text-slate-500">Please wait a moment.</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <h1 className="text-[24px] font-extrabold text-[#0F172A] mb-2">Email verified!</h1>
            <p className="text-[14px] text-slate-500 mb-6">Your email has been successfully verified. You can now sign in.</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[14px] px-6 py-3 rounded-[10px] transition-all shadow-md shadow-blue-200/60"
            >
              Sign in <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-7 h-7 text-red-600" />
            </div>
            <h1 className="text-[24px] font-extrabold text-[#0F172A] mb-2">Verification failed</h1>
            <p className="text-[14px] text-slate-500 mb-2">{errorMessage}</p>
            <p className="text-[13px] text-slate-400 mb-6">The link may have expired. Request a new one below.</p>
            <button
              onClick={() => setState('resend_form')}
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#2563EB] hover:underline"
            >
              Resend verification email
            </button>
          </div>
        );

      case 'resend_form':
        return (
          <>
            <div className="mb-6">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-7 h-7 text-blue-600" />
              </div>
              <h1 className="text-[28px] font-extrabold text-[#0F172A] mb-2">Verify your email</h1>
              <p className="text-[14px] text-slate-500">
                Enter your email address and we'll resend the verification link.
              </p>
            </div>

            <form onSubmit={handleResend} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    disabled={isResending}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-[10px] text-[14px] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all disabled:opacity-60"
                  />
                </div>
              </div>
              {errorMessage && (
                <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-3 py-2">{errorMessage}</p>
              )}
              <button
                type="submit"
                disabled={isResending}
                className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[14px] px-6 py-3 rounded-[10px] transition-all shadow-md shadow-blue-200/60 disabled:opacity-70"
              >
                {isResending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isResending ? 'Sending…' : 'Resend verification'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-[13px] font-medium text-slate-500 hover:text-[#2563EB]">
                Back to Sign in
              </Link>
            </div>
          </>
        );

      case 'resent':
        return (
          <div className="text-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <h1 className="text-[24px] font-extrabold text-[#0F172A] mb-2">Email sent!</h1>
            <p className="text-[14px] text-slate-500 mb-6">
              We've sent a new verification link to <strong className="text-slate-700">{email}</strong>.
            </p>
            <Link to="/login" className="text-[13px] font-medium text-[#2563EB] hover:underline">
              Back to Sign in
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4FA] font-sans flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.45]" style={{ background: 'radial-gradient(circle, #E0E7FF 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-[440px] bg-white rounded-[24px] shadow-2xl shadow-slate-300/80 border border-slate-200/50 p-10">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
          <div className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] p-2 rounded-[10px] shadow-md shadow-blue-200/50">
            <img src={jobportal} className="h-5 w-5" alt="TalentForge" />
          </div>
          <span className="font-bold text-[19px] tracking-tight text-[#0F172A]">TalentForge<span className="text-[#2563EB]"> AI</span></span>
        </Link>

        {renderContent()}
      </div>
    </div>
  );
}
