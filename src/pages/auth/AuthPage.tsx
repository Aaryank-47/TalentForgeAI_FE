import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Bot, Sparkles, Users, BarChart2, Check, Loader2, KeyRound } from 'lucide-react';
import jobportal from '../../assets/jobportal_logo2.jpg';
import { useAuth } from '../../context/AuthContext';
import { resolvePortalRoute } from '../../lib/permissions';
import { authApi } from '../../services/api/auth.api';

// ─── Illustration Panel ───────────────────────────────────────────────────────

const IllustrationPanel = () => (
  <div className="relative flex flex-col justify-between h-full px-12 py-14 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6]" />
    <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-white/[0.06] rounded-full blur-3xl" />
    <div className="absolute bottom-[-15%] left-[-10%] w-[350px] h-[350px] bg-black/[0.06] rounded-full blur-3xl" />
    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

    <div className="relative z-10">
      <Link to="/" className="inline-flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/20 shadow-sm flex-shrink-0">
          <img src={jobportal} className="h-full w-full object-cover" alt="TalentForge" />
        </div>
        <span className="font-display font-bold text-[19px] tracking-tight text-white">TalentForge <span className="text-blue-200">AI</span></span>
      </Link>
    </div>

    <div className="relative z-10 flex flex-col items-start">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-[11px] font-semibold mb-8 border border-white/20 backdrop-blur-sm">
        <Sparkles className="w-3.5 h-3.5" /> AI-Powered Hiring Platform
      </div>

      <h2 className="text-[36px] font-display font-extrabold text-white leading-tight mb-4">
        Welcome<br />back.
      </h2>
      <p className="text-blue-100/80 text-[15px] leading-relaxed mb-10 max-w-xs">
        Sign in to your account or create a new one to access the platform.
      </p>

      <div className="space-y-4 w-full">
        {[
          { icon: <Bot className="w-4 h-4" />, text: 'AI resume screening & matching' },
          { icon: <Users className="w-4 h-4" />, text: 'End-to-end ATS pipeline' },
          { icon: <BarChart2 className="w-4 h-4" />, text: 'Real-time hiring analytics' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-blue-100 border border-white/20 flex-shrink-0">
              {item.icon}
            </div>
            <span className="text-[13px] text-blue-100/90">{item.text}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="relative z-10">
      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-[16px] p-4 border border-white/15">
        <div className="flex -space-x-2">
          {['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'].map((c, i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: c }}>
              {['S', 'M', 'P', 'J'][i]}
            </div>
          ))}
        </div>
        <div>
          <div className="text-[12px] font-bold text-white">
            10,000+ teams onboard
          </div>
          <div className="text-[11px] text-blue-200">
            Avg. 3.5× faster time-to-hire
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── OTP Form ─────────────────────────────────────────────────────────────────

const OTPAuthForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsLoading(true);
    try {
      await authApi.sendOtpLogin({ email });
      setStep('otp');
    } catch (err: any) {
      setLocalError(err?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsLoading(true);
    try {
      const { user: authUser, availableWorkspaces } = await login({ email, otp });
      
      // 1. Brand new user (no candidate profile, no companies) -> Onboarding
      if (!authUser.hasCandidateProfile && (!authUser.companies || authUser.companies.length === 0)) {
        navigate('/onboarding', { replace: true });
        return;
      }

      // 2. Only Candidate (has profile, no companies) -> Candidate Dashboard
      if (authUser.hasCandidateProfile && (!authUser.companies || authUser.companies.length === 0)) {
        navigate('/candidate/home', { replace: true });
        return;
      }

      // 3. Has multiple roles OR is only Employer (1 or more companies) -> Workspace Selection
      navigate('/select-workspace', { replace: true });
    } catch (err: any) {
      setLocalError(err?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center h-full px-10 py-14 max-w-[420px] w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-[28px] font-display font-extrabold text-[#0F172A] mb-2">Welcome</h1>
        <p className="text-[14px] text-slate-500">
          Sign in or create an account to continue.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button className="flex items-center justify-center gap-2 border border-slate-200 rounded-[10px] px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" /><path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" /><path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" /><path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" /></svg>
          Google
        </button>
        <button className="flex items-center justify-center gap-2 border border-slate-200 rounded-[10px] px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          <svg className="h-4 w-4 text-[#00a4ef]" fill="currentColor" viewBox="0 0 24 24"><path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" /></svg>
          Microsoft
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
        <div className="relative flex justify-center text-[12px]"><span className="bg-white px-3 text-slate-400">or continue with email</span></div>
      </div>

      {step === 'email' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
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

          {localError && (
            <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-3 py-2">{localError}</p>
          )}

          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[14px] px-6 py-3 rounded-[10px] transition-all shadow-md shadow-blue-200/60 hover:-translate-y-0.5 hover:shadow-lg mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            {isLoading ? 'Sending code…' : 'Continue with Email'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[13px] font-medium text-slate-700">Enter Code</label>
              <button type="button" onClick={() => setStep('email')} className="text-[12px] font-medium text-[#2563EB] hover:text-[#1D4ED8]">
                Change email
              </button>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="6-digit code"
                maxLength={6}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-[10px] text-[14px] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all disabled:opacity-60"
              />
            </div>
            <p className="text-[12px] text-slate-500 mt-2">
              We sent a verification code to <strong>{email}</strong>
            </p>
          </div>

          {localError && (
            <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-3 py-2">{localError}</p>
          )}

          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[14px] px-6 py-3 rounded-[10px] transition-all shadow-md shadow-blue-200/60 hover:-translate-y-0.5 hover:shadow-lg mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            {isLoading ? 'Verifying…' : 'Sign In'}
          </button>
        </form>
      )}

      <div className="flex items-center justify-center gap-4 mt-8">
        {[
          { icon: <Check className="w-3 h-3" />, text: 'Instant access' },
          { icon: <Check className="w-3 h-3" />, text: 'Unified multi-role account' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-1 text-[11px] text-slate-400">
            <span className="text-emerald-500">{item.icon}</span>
            {item.text}
          </div>
        ))}
      </div>

      <p className="text-center text-[11px] text-slate-400 mt-3">
        By continuing, you agree to our{' '}
        <a href="#" className="underline hover:text-[#2563EB]">Terms</a>{' '}and{' '}
        <a href="#" className="underline hover:text-[#2563EB]">Privacy Policy</a>.
      </p>
    </div>
  );
};

// ─── Main AuthPage ────────────────────────────────────────────────────────────

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-[#F0F4FA] font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.45]" style={{ background: 'radial-gradient(circle, #E0E7FF 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.45]" style={{ background: 'radial-gradient(circle, #DBEAFE 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #0F172A 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      </div>

      <div className="relative max-w-[1020px] w-full min-h-[620px] bg-white rounded-[24px] shadow-2xl shadow-slate-300/80 border border-slate-200/50 flex overflow-hidden">
        <div className="w-[45%] lg:w-[42%] hidden lg:block flex-shrink-0 transition-all duration-500">
          <IllustrationPanel />
        </div>

        <div className="flex-1 hidden lg:block transition-all duration-500">
          <div className="h-full bg-white flex items-center justify-center">
            <OTPAuthForm />
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden w-full flex items-center justify-center p-6 sm:p-8 bg-white">
          <div className="w-full max-w-md">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-[#0175b2] shadow-md shadow-blue-200/50 flex-shrink-0">
                <img src={jobportal} className="h-full w-full object-cover" alt="TalentForge" />
              </div>
              <span className="font-display font-bold text-[19px] tracking-tight text-[#0F172A]">TalentForge<span className="text-[#0175b2]"> AI</span></span>
            </Link>
            <OTPAuthForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
