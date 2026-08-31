/**
 * TalentForge — Email Verification Page
 *
 * Supports OTP-based email verification matching backend /auth/verify-email and /auth/resend-verification:
 *  - If ?email= is passed or entered: user inputs 6-digit OTP to verify.
 *  - "Resend OTP" sends a new code via POST /auth/resend-verification.
 */

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react';
import { authApi } from '../../services/api/auth.api';
import { ApiError } from '../../services/api/apiClient';
import jobportal from '../../assets/jobportal_logo2.jpg';

import { useQueryClient } from '@tanstack/react-query';
import { authKeys } from '../../constants/queryKeys';

type PageState = 'enter_otp' | 'verifying' | 'success' | 'error' | 'resend_form' | 'resent';

export default function VerifyEmailPage() {
  const queryClient = useQueryClient();
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
      // Invalidate auth.me cache so the app immediately knows isEmailVerified is true
      await queryClient.invalidateQueries({ queryKey: authKeys.me });
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
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <h1 className="text-[24px] font-display font-extrabold text-[#0F172A] mb-2">Email verified!</h1>
            <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">
              Your email has been successfully verified. Let's get your profile or company set up.
            </p>
            <Link
              to="/onboarding"
              className="inline-flex items-center justify-center w-full gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[14px] px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-200/60 hover:-translate-y-0.5"
            >
              Continue to Onboarding <ArrowRight className="w-4 h-4" />
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
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 border border-blue-100 shadow-sm">
                <Mail className="w-7 h-7 text-blue-600" />
              </div>
              <h1 className="text-[26px] font-display font-extrabold text-[#0F172A] mb-1.5">Verify your email</h1>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                We sent a 6-digit verification code to <span className="font-semibold text-slate-800">{email || 'your email'}</span>.
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-5">
              {!emailParam && (
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-[14px] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all disabled:opacity-60"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-2">Enter 6-Digit Code</label>
                <div className="flex justify-between gap-2 sm:gap-2.5">
                  {[0, 1, 2, 3, 4, 5].map((index) => {
                    const digit = otp[index] || '';
                    return (
                      <input
                        key={index}
                        id={`otp-input-${index}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        disabled={isLoading}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          const newOtpArr = (otp + '      ').slice(0, 6).split('');
                          newOtpArr[index] = val ? val[val.length - 1] : '';
                          const newOtp = newOtpArr.join('').trimEnd();
                          setOtp(newOtp);

                          if (val && index < 5) {
                            const nextInput = document.getElementById(`otp-input-${index + 1}`);
                            nextInput?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !digit && index > 0) {
                            const prevInput = document.getElementById(`otp-input-${index - 1}`);
                            prevInput?.focus();
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                          if (pasted) {
                            setOtp(pasted);
                            const targetIdx = Math.min(pasted.length, 5);
                            document.getElementById(`otp-input-${targetIdx}`)?.focus();
                          }
                        }}
                        className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-[22px] font-bold font-mono rounded-xl border transition-all ${
                          digit
                            ? 'border-blue-600 bg-blue-50/30 text-blue-900 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
                        } focus:outline-none`}
                      />
                    );
                  })}
                </div>
              </div>

              {errorMessage && (
                <div className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6 || !email}
                className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[14px] px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-200/60 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {isLoading ? 'Verifying OTP…' : 'Verify Email & Continue'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-[13px]">
              <button
                type="button"
                onClick={() => setState('resend_form')}
                className="text-[#2563EB] font-semibold hover:underline"
              >
                Didn't get the code? Resend
              </button>
              <Link to="/login" className="text-slate-500 hover:text-[#2563EB] font-medium">
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
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-[#0175b2] shadow-md shadow-blue-200/50 flex-shrink-0">
            <img src={jobportal} className="h-full w-full object-cover" alt="TalentForge" />
          </div>
          <span className="font-bold text-[19px] tracking-tight text-[#0F172A]">TalentForge<span className="text-[#0175b2]"> AI</span></span>
        </Link>

        {renderContent()}
      </div>
    </div>
  );
}
