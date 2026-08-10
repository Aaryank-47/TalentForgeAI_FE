/**
 * TalentForge — Forgot Password Page
 *
 * Calls POST /auth/forgot/password.
 * Backend sends a reset link to the user's email.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../services/api/auth.api';
import { ApiError } from '../../services/api/apiClient';
import jobportal from '../../assets/jobportal_logo2.jpg';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4FA] font-sans flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.45]" style={{ background: 'radial-gradient(circle, #E0E7FF 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.45]" style={{ background: 'radial-gradient(circle, #DBEAFE 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-[440px] bg-white rounded-[24px] shadow-2xl shadow-slate-300/80 border border-slate-200/50 p-10">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
          <div className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] p-2 rounded-[10px] shadow-md shadow-blue-200/50">
            <img src={jobportal} className="h-5 w-5" alt="TalentForge" />
          </div>
          <span className="font-bold text-[19px] tracking-tight text-[#0F172A]">TalentForge<span className="text-[#2563EB]"> AI</span></span>
        </Link>

        {success ? (
          /* Success state */
          <div className="text-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <h1 className="text-[24px] font-extrabold text-[#0F172A] mb-2">Check your inbox</h1>
            <p className="text-[14px] text-slate-500 mb-6">
              We've sent a password reset link to <strong className="text-slate-700">{email}</strong>.
              The link will expire in 1 hour.
            </p>
            <p className="text-[13px] text-slate-400 mb-6">
              Didn't receive it?{' '}
              <button
                onClick={() => { setSuccess(false); setEmail(''); }}
                className="text-[#2563EB] font-semibold hover:underline"
              >
                Try again
              </button>
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-600 hover:text-[#2563EB]"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Sign in
            </Link>
          </div>
        ) : (
          /* Form */
          <>
            <h1 className="text-[28px] font-extrabold text-[#0F172A] mb-2">Forgot password?</h1>
            <p className="text-[14px] text-slate-500 mb-8">
              Enter your email and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              {error && (
                <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-3 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[14px] px-6 py-3 rounded-[10px] transition-all shadow-md shadow-blue-200/60 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isLoading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-[#2563EB]"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
