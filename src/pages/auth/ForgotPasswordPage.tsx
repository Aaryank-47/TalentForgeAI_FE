/**
 * TalentForge — Forgot & Reset Password Flow
 *
 * Steps:
 *  1. Request OTP: POST /auth/forgot/password (email)
 *  2. Verify OTP: POST /auth/verify/otp (email + 6-digit otp) -> returns resetPasswordToken
 *  3. Set New Password: POST /auth/reset/password (token + newPassword)
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Lock, ArrowLeft, Loader2, CheckCircle2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { authApi } from '../../services/api/auth.api';
import { ApiError } from '../../services/api/apiClient';
import jobportal from '../../assets/jobportal_logo2.jpg';

type Step = 'email' | 'otp' | 'new_password' | 'success';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Send OTP to email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setStep('otp');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to send reset code. Please check your email.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify 6-digit OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const token = await authApi.verifyOtp({ email, otp });
      setResetToken(token);
      setStep('new_password');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Invalid or expired OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Set new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    setIsLoading(true);
    try {
      await authApi.resetPassword({ token: resetToken, newPassword });
      setStep('success');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4FA] font-sans flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.45]" style={{ background: 'radial-gradient(circle, #E0E7FF 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.45]" style={{ background: 'radial-gradient(circle, #DBEAFE 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-[440px] bg-white rounded-[24px] shadow-2xl shadow-slate-300/80 border border-slate-200/50 p-10">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-[#0175b2] shadow-md shadow-blue-200/50 flex-shrink-0">
            <img src={jobportal} className="h-full w-full object-cover" alt="TalentForge" />
          </div>
          <span className="font-bold text-[19px] tracking-tight text-[#0F172A]">TalentForge<span className="text-[#0175b2]"> AI</span></span>
        </Link>

        {/* STEP 1: Email Form */}
        {step === 'email' && (
          <>
            <h1 className="text-[28px] font-extrabold text-[#0F172A] mb-2">Forgot password?</h1>
            <p className="text-[14px] text-slate-500 mb-8">
              Enter your registered email address and we'll send a 6-digit OTP verification code.
            </p>

            <form onSubmit={handleSendEmail} className="space-y-4">
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
                {isLoading ? 'Sending OTP…' : 'Send Verification OTP'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-[#2563EB]">
                <ArrowLeft className="w-4 h-4" /> Back to Sign in
              </Link>
            </div>
          </>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 'otp' && (
          <>
            <h1 className="text-[28px] font-extrabold text-[#0F172A] mb-2">Enter verification code</h1>
            <p className="text-[14px] text-slate-500 mb-6">
              We sent a 6-digit OTP to <strong className="text-slate-700">{email}</strong>.
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">6-Digit OTP</label>
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

              {error && (
                <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-3 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[14px] px-6 py-3 rounded-[10px] transition-all shadow-md shadow-blue-200/60 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isLoading ? 'Verifying OTP…' : 'Verify Code'}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-[13px]">
              <button
                onClick={() => { setStep('email'); setOtp(''); setError(null); }}
                className="text-slate-500 hover:text-slate-700 inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Change email
              </button>
              <button
                onClick={handleSendEmail}
                disabled={isLoading}
                className="text-[#2563EB] font-semibold hover:underline"
              >
                Resend OTP
              </button>
            </div>
          </>
        )}

        {/* STEP 3: Set New Password */}
        {step === 'new_password' && (
          <>
            <h1 className="text-[28px] font-extrabold text-[#0F172A] mb-2">Create new password</h1>
            <p className="text-[14px] text-slate-500 mb-6">
              Enter your new secure password below.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    disabled={isLoading}
                    className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-[10px] text-[14px] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all disabled:opacity-60"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    disabled={isLoading}
                    className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-[10px] text-[14px] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all disabled:opacity-60"
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
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                {isLoading ? 'Resetting password…' : 'Reset Password'}
              </button>
            </form>
          </>
        )}

        {/* STEP 4: Success */}
        {step === 'success' && (
          <div className="text-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <h1 className="text-[24px] font-extrabold text-[#0F172A] mb-2">Password reset successful!</h1>
            <p className="text-[14px] text-slate-500 mb-6">
              Your password has been securely updated. You can now sign in with your new credentials.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[14px] px-6 py-3 rounded-[10px] transition-all shadow-md shadow-blue-200/60"
            >
              Sign in now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
