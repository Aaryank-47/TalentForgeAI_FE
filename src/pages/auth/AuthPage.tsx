import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Building, Eye, EyeOff, ArrowRight, Bot, Sparkles, Users, BarChart2, Check } from 'lucide-react';
import jobportal from '../../assets/jobportal_logo2.jpg';

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthMode = 'login' | 'register';
type UserRole = 'recruiter' | 'candidate';

// ─── Illustration Panel ───────────────────────────────────────────────────────

const IllustrationPanel = ({ mode }: { mode: AuthMode }) => (
  <div className="relative flex flex-col justify-between h-full px-12 py-14 overflow-hidden">
    {/* Background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6]" />
    <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-white/[0.06] rounded-full blur-3xl" />
    <div className="absolute bottom-[-15%] left-[-10%] w-[350px] h-[350px] bg-black/[0.06] rounded-full blur-3xl" />
    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

    {/* Logo */}
    <div className="relative z-10">
      <Link to="/" className="inline-flex items-center gap-2.5">
        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-[10px] border border-white/20">
          <img src={jobportal} className="h-5 w-5" alt="TalentForge" />
        </div>
        <span className="font-display font-bold text-[19px] tracking-tight text-white">TalentForge <span className="text-blue-200">AI</span></span>
      </Link>
    </div>

    {/* Central content */}
    <div className="relative z-10 flex flex-col items-start">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-[11px] font-semibold mb-8 border border-white/20 backdrop-blur-sm">
        <Sparkles className="w-3.5 h-3.5" /> AI-Powered Hiring Platform
      </div>

      <h2 className="text-[36px] font-display font-extrabold text-white leading-tight mb-4">
        {mode === 'login' ? (
          <>Welcome<br />back. 👋</>
        ) : (
          <>Hire smarter.<br />Grow faster. 🚀</>
        )}
      </h2>
      <p className="text-blue-100/80 text-[15px] leading-relaxed mb-10 max-w-xs">
        {mode === 'login'
          ? 'Sign in to your account and continue building your dream team.'
          : 'Join 10,000+ hiring teams and candidates who trust TalentForge AI.'}
      </p>

      {/* Feature highlights */}
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

    {/* Social proof */}
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
          <div className="text-[12px] font-bold text-white">10,000+ teams onboard</div>
          <div className="text-[11px] text-blue-200">Avg. 3.5× faster time-to-hire</div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Login Form ───────────────────────────────────────────────────────────────

const LoginForm = ({ onSwitchToRegister }: { onSwitchToRegister: () => void }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/recruiter/dashboard');
  };

  return (
    <div className="flex flex-col justify-center h-full px-10 py-14 max-w-[420px] w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-[28px] font-display font-extrabold text-[#0F172A] mb-2">Sign in</h1>
        <p className="text-[14px] text-slate-500">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
            Create one free
          </button>
        </p>
      </div>

      {/* Google + Microsoft */}
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

      <form onSubmit={handleLogin} className="space-y-4">
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
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-[10px] text-[14px] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[13px] font-medium text-slate-700">Password</label>
            <a href="#" className="text-[12px] font-medium text-[#2563EB] hover:text-[#1D4ED8]">Forgot password?</a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-[10px] text-[14px] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all"
            />
            <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input id="remember" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]/30" />
          <label htmlFor="remember" className="text-[13px] text-slate-600">Remember me for 30 days</label>
        </div>

        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[14px] px-6 py-3 rounded-[10px] transition-all shadow-md shadow-blue-200/60 hover:-translate-y-0.5 hover:shadow-lg mt-2">
          Sign in <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

// ─── Register Form ────────────────────────────────────────────────────────────

const RegisterForm = ({ defaultRole, onSwitchToLogin }: { defaultRole: UserRole; onSwitchToLogin: () => void }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'recruiter') navigate('/recruiter/dashboard');
    else navigate('/candidate/dashboard');
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="flex flex-col justify-center h-full px-10 py-14 max-w-[440px] w-full mx-auto">
      <div className="mb-6">
        <h1 className="text-[28px] font-display font-extrabold text-[#0F172A] mb-2">Create account</h1>
        <p className="text-[14px] text-slate-500">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
            Sign in
          </button>
        </p>
      </div>

      {/* Role selector */}
      <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-slate-100 rounded-[12px]">
        {(['recruiter', 'candidate'] as UserRole[]).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`py-2.5 rounded-[10px] text-[13px] font-semibold transition-all capitalize flex items-center justify-center gap-1.5 ${role === r ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {r === 'recruiter' ? <Building className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            {r === 'recruiter' ? 'Recruiter' : 'Job Seeker'}
          </button>
        ))}
      </div>

      <form onSubmit={handleRegister} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" required value={form.name} onChange={set('name')} placeholder="Jordan Clark"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-[10px] text-[14px] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all" />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
            {role === 'recruiter' ? 'Work Email' : 'Email'}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="email" required value={form.email} onChange={set('email')} placeholder={role === 'recruiter' ? 'you@company.com' : 'you@email.com'}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-[10px] text-[14px] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all" />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={set('password')} placeholder="Min. 8 characters"
              className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-[10px] text-[14px] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all" />
            <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type={showConfirm ? 'text' : 'password'} required value={form.confirm} onChange={set('confirm')} placeholder="Re-enter password"
              className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-[10px] text-[14px] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all" />
            <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[14px] px-6 py-3 rounded-[10px] transition-all shadow-md shadow-blue-200/60 hover:-translate-y-0.5 hover:shadow-lg mt-1">
          Create Account <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Trust indicators */}
      <div className="flex items-center justify-center gap-4 mt-5">
        {[
          { icon: <Check className="w-3 h-3" />, text: 'Free 14-day trial' },
          { icon: <Check className="w-3 h-3" />, text: 'No credit card' },
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
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) ?? 'recruiter';
  const isRegisterUrl = window.location.pathname === '/register';

  const [mode, setMode] = useState<AuthMode>(isRegisterUrl ? 'register' : 'login');
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isRegisterUrl && mode === 'login') setMode('register');
  }, []);

  const switchMode = (next: AuthMode) => {
    if (animating || mode === next) return;
    setAnimating(true);
    setTimeout(() => {
      setMode(next);
      setAnimating(false);
    }, 500);
  };

  // Login: left = illustration, right = form
  // Register: left = form, right = illustration
  const isLogin = mode === 'login';

  return (
    <div className="min-h-screen bg-[#F0F4FA] font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.45]" style={{ background: 'radial-gradient(circle, #E0E7FF 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.45]" style={{ background: 'radial-gradient(circle, #DBEAFE 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #0F172A 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      </div>

      <div className="relative max-w-[1020px] w-full min-h-[620px] bg-white rounded-[24px] shadow-2xl shadow-slate-300/80 border border-slate-200/50 flex overflow-hidden">
        {/* Left Panel */}
        <div
          className={`
            transition-all duration-500 ease-in-out
            ${isLogin ? 'w-[45%] lg:w-[42%]' : 'w-[55%] lg:w-[58%]' }
            ${animating ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}
            hidden lg:block flex-shrink-0
          `}
        >
          {isLogin ? (
            <IllustrationPanel mode={mode} />
          ) : (
            <div className="h-full bg-white flex items-center justify-center">
              <RegisterForm defaultRole={initialRole} onSwitchToLogin={() => switchMode('login')} />
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div
          className={`
            transition-all duration-500 ease-in-out flex-1
            ${animating ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}
            hidden lg:block
          `}
        >
          {isLogin ? (
            <div className="h-full bg-white flex items-center justify-center">
              <LoginForm onSwitchToRegister={() => switchMode('register')} />
            </div>
          ) : (
            <IllustrationPanel mode={mode} />
          )}
        </div>

        {/* Mobile: Single column layout */}
        <div className="lg:hidden w-full flex items-center justify-center p-6 sm:p-8 bg-white">
          {isLogin ? (
            <div className="w-full max-w-md">
              {/* Mobile logo */}
              <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
                <div className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] p-2 rounded-[10px] shadow-md shadow-blue-200/50">
                  <img src={jobportal} className="h-5 w-5" alt="TalentForge" />
                </div>
                <span className="font-display font-bold text-[19px] tracking-tight text-[#0F172A]">TalentForge<span className="text-[#2563EB]"> AI</span></span>
              </Link>
              <LoginForm onSwitchToRegister={() => switchMode('register')} />
            </div>
          ) : (
            <div className="w-full max-w-md">
              <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
                <div className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] p-2 rounded-[10px] shadow-md shadow-blue-200/50">
                  <img src={jobportal} className="h-5 w-5" alt="TalentForge" />
                </div>
                <span className="font-display font-bold text-[19px] tracking-tight text-[#0F172A]">TalentForge<span className="text-[#2563EB]"> AI</span></span>
              </Link>
              <RegisterForm defaultRole={initialRole} onSwitchToLogin={() => switchMode('login')} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
