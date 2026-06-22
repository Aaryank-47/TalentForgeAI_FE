import { Link } from 'react-router-dom';
import { Building, User, ArrowRight, Bot } from 'lucide-react';
import { signupRoleContent } from '../constants/landing/landingContent';
import jobportal from '../assets/jobportal_logo2.jpg';

const iconMap: Record<string, React.ReactNode> = {
  building: <Building className="w-8 h-8" />,
  user: <User className="w-8 h-8" />,
};

const colorMap: Record<string, { gradient: string; icon: string; ring: string; hover: string }> = {
  recruiter: {
    gradient: 'from-blue-500 to-blue-700',
    icon: 'text-blue-600',
    ring: 'ring-blue-200',
    hover: 'hover:border-blue-300 hover:shadow-blue-100/60',
  },
  candidate: {
    gradient: 'from-emerald-500 to-emerald-700',
    icon: 'text-emerald-600',
    ring: 'ring-emerald-200',
    hover: 'hover:border-emerald-300 hover:shadow-emerald-100/60',
  },
};

const SignupRolePage = () => {
  const { heading, subheading, roles } = signupRoleContent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white flex flex-col font-sans">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, #3B82F6, transparent 70%)' }} />
        <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #10B981, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, #0F172A 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      </div>

      {/* Header */}
      <header className="w-full px-6 py-5">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="bg-gradient-to-br from-[#0175b2] to-[#0175b2] p-2 rounded-[10px] shadow-md shadow-blue-200/50 group-hover:shadow-blue-300/60 transition-shadow">
            <img src={jobportal} className="h-5 w-5" alt="TalentForge" />
          </div>
          <span className="font-display font-bold text-[19px] tracking-tight text-[#0F172A]">TalentForge<span className="text-[#2563EB]"> AI</span></span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          {/* Heading */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/70 text-[#2563EB] text-[12px] font-bold uppercase tracking-wider mb-6">
              <Bot className="w-3.5 h-3.5" /> Getting Started
            </div>
            <h1 className="text-[36px] md:text-[44px] font-display font-extrabold text-[#0F172A] leading-tight mb-4">
              {heading}
            </h1>
            <p className="text-[16px] text-slate-500 leading-relaxed max-w-md mx-auto">
              {subheading}
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid sm:grid-cols-2 gap-5">
            {roles.map((role) => {
              const colors = colorMap[role.key];
              return (
                <Link
                  key={role.key}
                  to={role.href}
                  className={`group relative bg-white border border-slate-200/80 rounded-[24px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center ${colors.hover}`}
                >
                  {/* Icon circle */}
                  <div className={`w-20 h-20 rounded-[20px] bg-gradient-to-br ${colors.gradient} flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-105 transition-transform duration-300 shadow-black/10`}>
                    {iconMap[role.iconKey]}
                  </div>

                  {/* Title */}
                  <h2 className="text-[20px] font-display font-bold text-[#0F172A] mb-3 leading-tight">
                    {role.title}
                  </h2>

                  {/* Description */}
                  <p className="text-[14px] text-slate-500 leading-relaxed mb-8 flex-1">
                    {role.description}
                  </p>

                  {/* CTA */}
                  <div className={`inline-flex items-center gap-2 font-bold text-[14px] px-6 py-3 rounded-[12px] transition-all duration-200 bg-gradient-to-br ${colors.gradient} text-white shadow-md group-hover:shadow-lg`}>
                    {role.cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>

                  {/* Hover glow */}
                  <div className={`absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-2xl bg-gradient-to-br ${colors.gradient}`} style={{ opacity: 0.04 }} />
                </Link>
              );
            })}
          </div>

          {/* Login link */}
          <p className="text-center text-[14px] text-slate-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignupRolePage;
