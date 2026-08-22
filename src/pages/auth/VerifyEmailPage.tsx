/**
 * TalentForge — Email Verification Page
 *
 * Supports OTP-based email verification matching backend /auth/verify-email and /auth/resend-verification:
 *  - If ?email= is passed or entered: user inputs 6-digit OTP to verify.
 *  - "Resend OTP" sends a new code via POST /auth/resend-verification.
 */

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Mail, KeyRound, ArrowRight } from 'lucide-react';
import { authApi } from '../../services/api/auth.api';
import { ApiError } from '../../services/api/apiClient';
import jobportal from '../../assets/jobportal_logo2.jpg';

type PageState = 'enter_otp' | 'verifying' | 'success' | 'error' | 'resend_form' | 'resent';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [state, setState] = useState<PageState>('enter_otp');
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    setState('verifying');
    try {
      await authApi.verifyEmail({ email, otp });
      setState('success');
    } catch (err) {
      const message = err instanceof ApiError
        ? err.message
        : 'Verification failed. The code may be invalid or expired.';
      setErrorMessage(message);
      setState('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      await authApi.resendVerification({ email });
      setState('resent');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to resend code. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (state) {
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
              className="inline-flex items-center justify-center w-full gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[14px] px-6 py-3 rounded-[10px] transition-all shadow-md shadow-blue-200/60"
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
            <p className="text-[13px] text-slate-400 mb-6">The OTP code may have expired or is incorrect.</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setState('enter_otp')}
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[14px] px-6 py-3 rounded-[10px] transition-all shadow-md"
              >
                Try Again
              </button>
              <button
                onClick={() => setState('resend_form')}
                className="text-[14px] font-semibold text-[#2563EB] hover:underline"
              >
                Resend verification OTP
              </button>
            </div>
          </div>
        );

      case 'resend_form':
        return (
          <>
            <div className="mb-6">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-7 h-7 text-blue-600" />
              </div>
              <h1 className="text-[28px] font-extrabold text-[#0F172A] mb-2">Resend verification</h1>
              <p className="text-[14px] text-slate-500">
                Enter your email address and we'll send a fresh verification OTP.
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
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-[10px] text-[14px] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all disabled:opacity-60"
                  />
                </div>
              </div>
              {errorMessage && (
                <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-3 py-2">{errorMessage}</p>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[14px] px-6 py-3 rounded-[10px] transition-all shadow-md shadow-blue-200/60 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isLoading ? 'Sending…' : 'Send verification code'}
              </button>
            </form>

            <div className="mt-6 flex justify-between text-[13px]">
              <button onClick={() => setState('enter_otp')} className="text-slate-500 hover:text-slate-700">
                Back to OTP
              </button>
              <Link to="/login" className="font-medium text-[#2563EB] hover:underline">
                Sign in
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
            <h1 className="text-[24px] font-extrabold text-[#0F172A] mb-2">OTP Sent!</h1>
            <p className="text-[14px] text-slate-500 mb-6">
              We've sent a new 6-digit verification code to <strong className="text-slate-700">{email}</strong>.
            </p>
            <button
              onClick={() => { setState('enter_otp'); setOtp(''); }}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[14px] px-6 py-3 rounded-[10px] transition-all shadow-md shadow-blue-200/60"
            >
              Enter Code
            </button>
          </div>
        );

      case 'enter_otp':
      default:
        return (
          <>
            <div className="mb-6">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-7 h-7 text-blue-600" />
              </div>
              <h1 className="text-[28px] font-extrabold text-[#0F172A] mb-2">Verify your email</h1>
              <p className="text-[14px] text-slate-500">
                Enter your email and the 6-digit OTP sent to your inbox.
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
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
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-[10px] text-[14px] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">6-Digit Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-[10px] text-[18px] tracking-widest text-center font-bold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              {errorMessage && (
                <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-3 py-2">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6 || !email}
                className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[14px] px-6 py-3 rounded-[10px] transition-all shadow-md shadow-blue-200/60 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isLoading ? 'Verifying…' : 'Verify Email'}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-[13px]">
              <button
                onClick={() => setState('resend_form')}
                className="text-[#2563EB] font-semibold hover:underline"
              >
                Didn't get code? Resend
              </button>
              <Link to="/login" className="text-slate-500 hover:text-[#2563EB]">
                Back to Sign in
              </Link>
            </div>
          </>
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
