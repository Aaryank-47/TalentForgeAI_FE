import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Star,
  Calendar,
  TrendingUp,
  Check,
  Layers,
  Zap,
  Building,
  Users,
  Briefcase,
  Globe,
  Target,
  Cpu,
  Search,
  Eye,
  Brain,
  UserCheck,
  Filter,
  Plus,
  Bell,
  CheckCircle2,
  Bot,
  Clock,
  Video,
  Activity,
  Mic,
  Sparkles,
  BarChart2,
  Award,
  MessageSquare,
  HelpCircle,
  Mail,
  Phone,
  Minus
} from 'lucide-react';

import { useParallax, useInView, useCountUp } from '../../hooks/useLandingHooks';
import {
  heroContent,
  companiesContent,
  recruiterFeaturesContent,
  candidateFeaturesContent,
  atsShowcaseContent,
  aiInterviewContent,
  analyticsContent,
  howItWorksContent,
  testimonialsContent,
  faqContent
} from '../../constants/landing/landingContent';

// Assets
import landingIMG from '../../assets/landingIMG.png';
import resume_matching from '../../assets/resume_matching1.png';
import ats_pipeline from '../../assets/ats_pipeline4.png';
import hiring_automation from '../../assets/hiring_automate.png';
import ai_proctoring from '../../assets/AI_Proctoring.png';
import workspace from '../../assets/setupWorkspace.png';
import jobPost from '../../assets/postJob.png';
import ai_interview_img from '../../assets/aiInterview.png';

// ============================================================================
// 1. HeroSection
// ============================================================================

export const HeroSection = () => {
  const { ref: parallaxRef, offset } = useParallax(0.06);

  return (
    <section className="relative pt-[100px] lg:pt-[120px] pb-0 overflow-hidden min-h-screen flex items-center" style={{ background: 'linear-gradient(180deg, #F0F6FF 0%, #F7FAFF 40%, #FFFFFF 100%)' }}>
      {/* Background Mesh */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-8%] left-[-8%] w-[700px] h-[700px] rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, #93C5FD 0%, transparent 70%)' }} />
        <div className="absolute top-[15%] right-[-6%] w-[550px] h-[550px] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #818CF8 0%, transparent 70%)' }} />
        <div className="absolute bottom-[5%] left-[30%] w-[400px] h-[300px] rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, #BFDBFE 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle, #0F172A 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left Column ── */}
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100/80 shadow-sm w-fit">
              <span className="flex h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[13px] font-semibold text-slate-700">{heroContent.badge}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
            </div>

            <div>
              <h1 className="text-[44px] md:text-[58px] font-display font-extrabold text-[#0F172A] leading-[1.08] tracking-tight mb-5">
                {heroContent.headline1}<br />
                <span className="relative">
                  <span className="relative z-10 text-[#2563EB]">{heroContent.headline2}</span>
                  <span className="absolute bottom-1 left-0 right-0 h-3 bg-blue-200/50 -z-0 rounded-sm" />
                </span>{' '}
                {heroContent.headline3}
              </h1>
              <p className="text-[17px] text-slate-500 leading-relaxed max-w-[500px]">
                {heroContent.subheadline}
              </p>
            </div>

            {/* ── CTAs: Recruiter / Job Seeker ── */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={heroContent.primaryCTA.href}
                className="group inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white hover:bg-[#1D4ED8] font-bold text-[15px] px-7 py-4 rounded-[12px] transition-all duration-300 shadow-lg shadow-blue-200/60 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-300/50"
              >
                {heroContent.primaryCTA.label}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to={heroContent.secondaryCTA.href}
                className="group inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm text-[#0F172A] hover:bg-white border border-slate-200/80 font-semibold text-[15px] px-7 py-4 rounded-[12px] transition-all shadow-sm"
              >
                {heroContent.secondaryCTA.label}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 text-[#2563EB]" />
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-2">
              {heroContent.metrics.map((m) => (
                <div key={m.label}>
                  <div className="text-[24px] font-display font-black text-[#0F172A]">{m.value}</div>
                  <div className="text-[12px] text-slate-500 font-medium leading-tight mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {heroContent.avatarColors.map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-sm" style={{ backgroundColor: c }}>
                    {heroContent.avatarInitials[i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />)}
                </div>
                <span className="text-[12px] text-slate-500">{heroContent.trustText}</span>
              </div>
            </div>
          </div>

          {/* ── Right Column with parallax ── */}
          <div ref={parallaxRef} className="relative flex items-center justify-center lg:justify-end" style={{ transform: `translateY(${offset}px)` }}>
            <div className="absolute inset-0 rounded-[40px] scale-110 opacity-[0.15]" style={{ background: 'radial-gradient(ellipse at center, #93C5FD 0%, transparent 70%)' }} />

            <div className="relative w-full max-w-[580px]" style={{ background: 'linear-gradient(180deg, #F0F6FF 0%, #F7FAFF 40%, #FFFFFF 100%)' }}>
              <img
                src={landingIMG}
                alt="Recruiter using TalentForge AI dashboard"
                className="relative z-10 w-full object-contain hero-image-glow"
                style={{ maxHeight: '560px', filter: 'drop-shadow(0 20px 40px rgba(37,99,235,0.12))' }}
              />

              {/* Floating Card: candidate match */}
              <div className="absolute top-[8%] left-[-5%] z-20 bg-white/95 backdrop-blur-md rounded-[16px] shadow-xl shadow-slate-200/60 border border-slate-100/80 p-3.5 w-[200px] animate-float">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[11px] font-bold shadow-sm">JD</div>
                  <div>
                    <div className="text-[11px] font-bold text-[#0F172A]">Jane Doe</div>
                    <div className="text-[10px] text-slate-400">Sr. Product Designer</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">AI Match Score</span>
                  <span className="text-[11px] font-bold text-[#22C55E]">96%</span>
                </div>
                <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[96%] bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-full animate-score-fill" />
                </div>
              </div>

              {/* Floating Card: interview scheduled */}
              <div className="absolute bottom-[18%] left-[-8%] z-20 bg-white/95 backdrop-blur-md rounded-[16px] shadow-xl shadow-slate-200/60 border border-slate-100/80 p-3.5 w-[195px] animate-float-delay">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                  </div>
                  <div className="text-[11px] font-bold text-[#0F172A]">Interview Scheduled</div>
                </div>
                <div className="text-[10px] text-slate-500">Today, 3:00 PM</div>
                <div className="mt-2 flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-green-600" />
                  </div>
                  <span className="text-[10px] text-green-600 font-medium">Auto-scheduled by AI</span>
                </div>
              </div>

              {/* Floating Card: pipeline stat */}
              <div className="absolute top-[42%] right-[-6%] z-20 bg-white/95 backdrop-blur-md rounded-[16px] shadow-xl shadow-slate-200/60 border border-slate-100/80 p-3.5 w-[170px] animate-float-slow">
                <div className="text-[10px] text-slate-400 mb-1.5 font-medium uppercase tracking-wide">This Week</div>
                <div className="flex items-end gap-1">
                  <span className="text-[26px] font-black text-[#0F172A] leading-none">48</span>
                  <span className="text-[11px] text-slate-500 mb-1">applicants</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-[#22C55E]" />
                  <span className="text-[10px] text-[#22C55E] font-semibold">+24% vs last week</span>
                </div>
                <div className="mt-2.5 flex gap-1">
                  {[60, 80, 45, 90, 70, 100, 55].map((h, i) => (
                    <div key={i} className="flex-1 bg-blue-50 rounded-sm" style={{ height: `${h * 0.32}px` }}>
                      <div className="w-full rounded-sm bg-[#2563EB] opacity-70" style={{ height: `${h}%`, maxHeight: '100%' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient transition to white */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
};

// ============================================================================
// 2. TrustedCompanies
// ============================================================================

const trustedCompaniesIconMap: Record<string, React.ReactNode> = {
  layers: <Layers className="w-5 h-5" />,
  zap: <Zap className="w-5 h-5" />,
  building: <Building className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  briefcase: <Briefcase className="w-5 h-5" />,
  globe: <Globe className="w-5 h-5" />,
  target: <Target className="w-5 h-5" />,
  cpu: <Cpu className="w-5 h-5" />,
};

export const TrustedCompanies = () => {
  return (
    <section className="py-14 bg-white border-y border-slate-100/80">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[12px] font-bold text-slate-400 mb-8 uppercase tracking-[0.15em]">{companiesContent.label}</p>
        <div className="flex gap-12 md:gap-16 items-center justify-center flex-wrap">
          {companiesContent.companies.map((c) => (
            <div key={c.name} className="flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-all duration-300 cursor-default group">
              <div className="opacity-40 group-hover:opacity-70 transition-opacity">{trustedCompaniesIconMap[c.iconKey]}</div>
              <span className="font-display font-bold text-[16px] tracking-tight opacity-50 group-hover:opacity-80 transition-opacity">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// 3. RecruiterFeatures
// ============================================================================

const recruiterFeaturesImageMap: Record<string, string> = {
  resume_matching,
  ats_pipeline,
  hiring_automation,
  ai_proctoring,
};

const recruiterFeaturesImageClassMap: Record<string, string> = {
  resume_matching: 'w-15 h-10',
  ats_pipeline: 'w-10 h-10',
  hiring_automation: 'w-15 h-10',
  ai_proctoring: 'w-10 h-10',
};

export const RecruiterFeatures = () => {
  const { features, colorMap } = recruiterFeaturesContent;

  return (
    <section id="recruiter-features" className="py-28 relative" style={{ background: 'linear-gradient(180deg, #F5F9FF 0%, #F0F6FF 50%, #F5F9FF 100%)' }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200/40 to-transparent" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 text-[#2563EB] text-[12px] font-bold uppercase tracking-wider mb-5">
            <Briefcase className="w-3.5 h-3.5" /> {recruiterFeaturesContent.badge}
          </div>
          <h2 className="text-[36px] md:text-[44px] font-display font-extrabold text-[#0F172A] leading-tight mb-4">
            {recruiterFeaturesContent.headline1}<br />
            <span className="text-[#2563EB]">{recruiterFeaturesContent.headline2}</span>
          </h2>
          <p className="text-[16px] text-slate-500 leading-relaxed">
            {recruiterFeaturesContent.subheadline}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => {
            const c = colorMap[f.color];
            return (
              <div key={i} className={`group bg-white/80 backdrop-blur-sm border ${c.border} rounded-[24px] p-8 shadow-sm hover:shadow-xl ${c.glow} transition-all duration-500 hover:-translate-y-1 cursor-default`}>
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-10 h-10 rounded-[10px] ${c.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                    <img src={recruiterFeaturesImageMap[f.imageKey]} alt={f.imageAlt} className={recruiterFeaturesImageClassMap[f.imageKey]} />
                  </div>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${c.badge}`}>{f.label}</span>
                </div>
                <h3 className="text-[22px] font-display font-bold text-[#0F172A] mb-3 leading-tight">{f.title}</h3>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-6">{f.desc}</p>
                <div className="flex items-center gap-6 pt-5 border-t border-slate-100/60">
                  {f.stats.map((s, j) => (
                    <div key={j}>
                      <div className={`text-[20px] font-display font-black ${c.stat}`}>{s.value}</div>
                      <div className="text-[11px] text-slate-400">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// 4. CandidateFeatures
// ============================================================================

const candidateFeaturesIconMap: Record<string, React.ReactNode> = {
  search: <Search className="w-5 h-5 text-emerald-600" />,
  eye: <Eye className="w-5 h-5 text-emerald-600" />,
  brain: <Brain className="w-5 h-5 text-emerald-600" />,
  'user-check': <UserCheck className="w-5 h-5 text-emerald-600" />,
  'trending-up': <TrendingUp className="w-5 h-5 text-emerald-600" />,
};

export const CandidateFeatures = () => {
  const { timelineSteps, features } = candidateFeaturesContent;

  return (
    <section id="candidate-features" className="py-28 bg-white relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/60 to-transparent" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-start">

          {/* Left: candidate experience visual */}
          <div className="relative">
            <div className="absolute -inset-8 rounded-[40px] opacity-[0.06]" style={{ background: 'radial-gradient(ellipse, #34D399, transparent 70%)' }} />

            {/* Application Status Card */}
            <div className="relative bg-white rounded-[24px] border border-slate-100 shadow-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-[12px] font-bold shadow-md">JC</div>
                  <div>
                    <div className="text-[14px] font-bold text-[#0F172A]">Jordan Clark</div>
                    <div className="text-[11px] text-slate-400">Applied for Sr. Product Designer</div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Active</span>
              </div>

              {/* Timeline */}
              <div className="relative">
                {timelineSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-4 mb-0 last:mb-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-emerald-500 text-white' : step.active ? 'bg-emerald-100 border-2 border-emerald-500' : 'bg-slate-100 border-2 border-slate-200'}`}>
                        {step.done && <Check className="w-3 h-3" />}
                        {step.active && !step.done && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                      </div>
                      {i < timelineSteps.length - 1 && (
                        <div className={`w-0.5 h-8 ${step.done ? 'bg-emerald-300' : 'bg-slate-200'}`} />
                      )}
                    </div>
                    <div className="pb-6">
                      <div className={`text-[13px] font-semibold ${step.active ? 'text-[#0F172A]' : 'text-slate-400'}`}>{step.label}</div>
                      <div className="text-[11px] text-slate-400">{step.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Strength Card */}
            <div className="relative bg-white rounded-[20px] border border-slate-100 shadow-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-bold text-[#0F172A]">Profile Strength</span>
                <span className="text-[14px] font-black text-emerald-600">87%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                <div className="h-full w-[87%] bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-score-fill" />
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Skills ✓</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Experience ✓</span>
                <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">Portfolio ↗</span>
              </div>
            </div>
          </div>

          {/* Right: messaging + feature list */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-[12px] font-bold uppercase tracking-wider mb-5">
              <Users className="w-3.5 h-3.5" /> {candidateFeaturesContent.badge}
            </div>
            <h2 className="text-[36px] md:text-[44px] font-display font-extrabold text-[#0F172A] leading-tight mb-5">
              {candidateFeaturesContent.headline1}<br />
              <span className="text-emerald-500">{candidateFeaturesContent.headline2}</span>
            </h2>
            <p className="text-[16px] text-slate-500 leading-relaxed mb-10">
              {candidateFeaturesContent.subheadline}
            </p>

            <div className="space-y-5 mb-10">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-4 group cursor-default">
                  <div className="w-10 h-10 rounded-[10px] bg-emerald-50 border border-emerald-100/60 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                    {candidateFeaturesIconMap[f.iconKey]}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#0F172A] mb-0.5">{f.title}</h4>
                    <p className="text-[13px] text-slate-500 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to={candidateFeaturesContent.ctaPath} className="group inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[14px] px-6 py-3.5 rounded-[12px] transition-all shadow-lg shadow-emerald-200/50 hover:-translate-y-0.5">
              {candidateFeaturesContent.ctaLabel}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// 5. ATSShowcase
// ============================================================================

export const ATSShowcase = () => {
  const { stages, candidates, animCandidateName, animStageLabels, checklist } = atsShowcaseContent;

  const [animStage, setAnimStage] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimStage(prev => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="ats-showcase" className="py-28 relative" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F9FF 40%, #EFF5FF 100%)' }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200/30 to-transparent" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: ATS UI Mockup */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[32px] opacity-[0.08]" style={{ background: 'radial-gradient(ellipse, #3B82F6, transparent 70%)' }} />

            <div className="relative bg-white rounded-[20px] border border-slate-200/80 shadow-2xl shadow-slate-200/50 overflow-hidden">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 h-11 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-50/60">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 ml-2 h-6 bg-white border border-slate-200 rounded-md flex items-center px-3 max-w-xs">
                  <span className="text-[10px] text-slate-400">app.talentforge.ai/pipeline</span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-[14px] font-bold text-[#0F172A]">Senior Software Engineer</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">42 applicants · 5 stages</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#2563EB] text-[11px] font-semibold">
                      <Filter className="w-3 h-3" /> Filter
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-[11px] font-bold flex items-center gap-1 shadow-sm shadow-blue-200/60">
                      <Plus className="w-3 h-3" /> Add Candidate
                    </button>
                  </div>
                </div>

                {/* Kanban Columns */}
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {stages.map((stage, si) => (
                    <div key={si} className="flex-shrink-0 w-[150px]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{stage.label}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: stage.color, color: stage.textColor }}>{stage.count}</span>
                      </div>
                      <div className="space-y-2">
                        {candidates.filter(c => c.stage === si).map((c, ci) => (
                          <div key={ci} className="bg-white border border-slate-100 rounded-[10px] p-3 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 shadow-sm" style={{ backgroundColor: c.avatar }}>
                                {c.name[0]}
                              </div>
                              <div>
                                <div className="text-[10px] font-bold text-[#0F172A] leading-tight">{c.name}</div>
                                <div className="text-[9px] text-slate-400">{c.role}</div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] text-slate-400">AI Score</span>
                              <span className="text-[10px] font-black text-[#2563EB]">{c.score}%</span>
                            </div>
                          </div>
                        ))}
                        {[...Array(Math.max(0, 1 - candidates.filter(c => c.stage === si).length))].map((_, pi) => (
                          <div key={`p${pi}`} className="h-[60px] border border-dashed border-slate-200 rounded-[10px] flex items-center justify-center">
                            <Plus className="w-3 h-3 text-slate-300" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Animated candidate movement indicator */}
            <div className="absolute -bottom-6 left-4 bg-white/95 backdrop-blur-md rounded-[14px] border border-slate-100 shadow-xl shadow-slate-200/50 p-3.5 flex items-center gap-3 w-[220px] animate-float-delay">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                <ArrowRight className="w-4 h-4 text-rose-500" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#0F172A]">{animCandidateName} → {animStageLabels[animStage]}</div>
                <div className="text-[10px] text-slate-400">Auto-moved by AI · just now</div>
              </div>
            </div>

            {/* Notification card */}
            <div className="absolute -bottom-6 -right-4 bg-white/95 backdrop-blur-md rounded-[14px] border border-slate-100 shadow-xl shadow-slate-200/50 p-3.5 flex items-center gap-3 w-[200px]">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bell className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#0F172A]">Priya moved to Final</div>
                <div className="text-[10px] text-slate-400">by AI trigger · just now</div>
              </div>
            </div>
          </div>

          {/* Right: Messaging */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 text-[#2563EB] text-[12px] font-bold uppercase tracking-wider mb-5">
              <Layers className="w-3.5 h-3.5" /> {atsShowcaseContent.badge}
            </div>
            <h2 className="text-[36px] md:text-[44px] font-display font-extrabold text-[#0F172A] leading-tight mb-5">
              {atsShowcaseContent.headline1}<br />
              <span className="text-[#2563EB]">{atsShowcaseContent.headline2}</span>
            </h2>
            <p className="text-[16px] text-slate-500 leading-relaxed mb-8">
              {atsShowcaseContent.subheadline}
            </p>
            <div className="space-y-4">
              {checklist.map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0"><CheckCircle2 className="w-4 h-4 text-[#2563EB]" /></div>
                  <span className="text-[14px] text-slate-700">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// 6. AIInterviewShowcase
// ============================================================================

const aiInterviewFeatureIconMap: Record<string, React.ReactNode> = {
  zap: <Zap className="w-4 h-4 text-violet-600" />,
  brain: <Brain className="w-4 h-4 text-violet-600" />,
  clock: <Clock className="w-4 h-4 text-violet-600" />,
};

const TypingDots = () => (
  <div className="flex gap-1 items-center">
    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-typing-dot" style={{ animationDelay: '0ms' }} />
    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-typing-dot" style={{ animationDelay: '200ms' }} />
    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-typing-dot" style={{ animationDelay: '400ms' }} />
  </div>
);

export const AIInterviewShowcase = () => {
  const { questions, assessmentScores, featureBullets } = aiInterviewContent;

  return (
    <section className="py-28 relative" style={{ background: '#FAF8FF' }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-200/30 to-transparent" />
      <div className="absolute top-[10%] right-[-4%] w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #7C3AED, transparent 70%)' }} />
      <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #A78BFA, transparent 70%)' }} />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100/80 text-violet-700 text-[12px] font-bold uppercase tracking-wider mb-5">
            <Video className="w-3.5 h-3.5" /> {aiInterviewContent.badge}
          </div>
          <h2 className="text-[36px] md:text-[44px] font-display font-extrabold text-[#0F172A] leading-tight mb-4">
            {aiInterviewContent.headline1}<br />
            <span className="text-violet-600">{aiInterviewContent.headline2}</span>
          </h2>
          <p className="text-[16px] text-slate-500 leading-relaxed">
            {aiInterviewContent.subheadline}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Interview UI */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[32px] opacity-[0.06]" style={{ background: 'radial-gradient(ellipse, #7C3AED, transparent 70%)' }} />

            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-[24px] p-6 shadow-2xl shadow-slate-900/20">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-white">TalentForge AI</div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-[11px] text-slate-400">Live Interview</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/30 rounded-full px-3 py-1">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-recording-pulse" />
                    <span className="text-[10px] font-bold text-red-400">REC</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-700/80 px-3 py-1.5 rounded-full font-mono">0:24:13</span>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-3 mb-5">
                {questions.map((item, i) => (
                  <div key={i} className={`rounded-[14px] p-4 transition-all duration-300 ${i === 1 ? 'bg-violet-600/20 border border-violet-500/30 shadow-lg shadow-violet-500/10' : 'bg-slate-700/50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${i === 1 ? 'bg-violet-500/30 text-violet-300' : 'bg-slate-600 text-slate-300'}`}>{item.type}</span>
                      {i === 1 && <span className="text-[10px] text-violet-400 font-medium flex items-center gap-1"><Activity className="w-3 h-3 animate-pulse" /> Listening...</span>}
                      {i === 0 && <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Answered</span>}
                    </div>
                    <p className="text-[13px] text-slate-200 leading-relaxed">{item.q}</p>
                  </div>
                ))}
              </div>

              {/* Response area with waveform */}
              <div className="bg-slate-700/40 rounded-[14px] p-4 border border-slate-600/30">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
                    <span className="text-[9px] font-bold text-white">SC</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300">Sarah Chen — Candidate</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <Mic className="w-3 h-3 text-violet-400" />
                    <span className="text-[10px] text-violet-400 font-medium">Speaking</span>
                  </div>
                </div>

                {/* Voice waveform */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex gap-[2px] items-center h-6 flex-1">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-violet-400/60 rounded-full animate-waveform"
                        style={{
                          animationDelay: `${i * 50}ms`,
                          animationDuration: `${600 + (i * 13) % 400}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 italic">"In my previous role at..."</span>
                  <TypingDots />
                </div>
              </div>

              {/* AI processing bar */}
              <div className="mt-4 flex items-center gap-2 bg-slate-700/30 rounded-lg px-3 py-2">
                <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                <span className="text-[10px] text-slate-400">AI is analyzing response patterns in real-time...</span>
                <div className="ml-auto w-16 h-1 bg-slate-600 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-400 rounded-full animate-progress-bar" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Report preview */}
          <div>
            <h3 className="text-[20px] font-display font-bold text-[#0F172A] mb-5">{aiInterviewContent.reportTitle}</h3>
            <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-lg shadow-slate-100/50 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-[#2563EB] text-[13px]">SC</div>
                  <div>
                    <div className="text-[13px] font-bold text-[#0F172A]">{aiInterviewContent.candidateName}</div>
                    <div className="text-[11px] text-slate-400">{aiInterviewContent.candidateRole}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[24px] font-black text-[#2563EB]">{aiInterviewContent.overallScore}</div>
                  <div className="text-[10px] text-slate-400">Overall Score</div>
                </div>
              </div>

              <div className="space-y-3">
                {assessmentScores.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[12px] text-slate-600">{item.label}</span>
                      <span className="text-[12px] font-bold text-[#0F172A]">{item.score}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] rounded-full" style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {featureBullets.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-violet-50/60 rounded-[12px] border border-violet-100/60 hover:bg-violet-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-violet-100/80 flex items-center justify-center flex-shrink-0">{aiInterviewFeatureIconMap[item.iconKey]}</div>
                  <span className="text-[13px] text-slate-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// 7. AnalyticsShowcase
// ============================================================================

const analyticsMiniIconMap: Record<string, React.ReactNode> = {
  users: <Users className="w-4 h-4 text-blue-500" />,
  video: <Video className="w-4 h-4 text-violet-500" />,
  award: <Award className="w-4 h-4 text-emerald-500" />,
};

export const AnalyticsShowcase = () => {
  const { ref: sectionRef, inView } = useInView(0.2);
  const { months, hired, screened, countUpTargets, miniStats } = analyticsContent;
  const maxBar = 100;

  const countDays = useCountUp(countUpTargets.days.value, countUpTargets.days.duration, inView);
  const countPercent = useCountUp(countUpTargets.percent.value, countUpTargets.percent.duration, inView);
  const countROI = useCountUp(countUpTargets.roi.value, countUpTargets.roi.duration, inView);
  const countHour = useCountUp(countUpTargets.hour.value, countUpTargets.hour.duration, inView);

  const animatedStats = [
    { value: `${countDays}${countUpTargets.days.suffix}`, label: countUpTargets.days.label, trend: countUpTargets.days.trend },
    { value: `${countPercent}${countUpTargets.percent.suffix}`, label: countUpTargets.percent.label, trend: countUpTargets.percent.trend },
    { value: `${(countROI / (countUpTargets.roi.divisor ?? 1)).toFixed(1)}${countUpTargets.roi.suffix}`, label: countUpTargets.roi.label, trend: countUpTargets.roi.trend },
    { value: `${countUpTargets.hour.prefix ?? ''}${countHour}${countUpTargets.hour.suffix}`, label: countUpTargets.hour.label, trend: countUpTargets.hour.trend },
  ];

  return (
    <section ref={sectionRef} className="py-28 bg-white relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/40 to-transparent" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Messaging */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/80 text-orange-700 text-[12px] font-bold uppercase tracking-wider mb-5">
              <BarChart2 className="w-3.5 h-3.5" /> {analyticsContent.badge}
            </div>
            <h2 className="text-[36px] md:text-[44px] font-display font-extrabold text-[#0F172A] leading-tight mb-5">
              {analyticsContent.headline1}<br />
              <span className="text-orange-500">{analyticsContent.headline2}</span>
            </h2>
            <p className="text-[16px] text-slate-500 leading-relaxed mb-8">
              {analyticsContent.subheadline}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {animatedStats.map((s, i) => (
                <div key={i} className="bg-white rounded-[16px] border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-[22px] font-display font-black text-[#0F172A] tabular-nums">{s.value}</div>
                  <div className="text-[11px] text-slate-400 mb-1">{s.label}</div>
                  <div className="text-[11px] font-semibold text-emerald-600">{s.trend}</div>
                </div>
              ))}
            </div>
            <Link to={analyticsContent.ctaPath} className="group inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[14px] px-6 py-3.5 rounded-[12px] transition-all shadow-lg shadow-orange-200/50 hover:-translate-y-0.5">
              {analyticsContent.ctaLabel}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Right: Analytics UI */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[32px] opacity-[0.05]" style={{ background: 'radial-gradient(ellipse, #F59E0B, transparent 70%)' }} />

            <div className="relative bg-white rounded-[24px] border border-slate-100 shadow-xl shadow-slate-100/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-[15px] font-bold text-[#0F172A]">Hiring Overview</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Jan – Jun 2026</p>
                </div>
                <select className="text-[11px] border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 bg-white">
                  <option>Last 6 months</option>
                </select>
              </div>

              <div className="flex items-end gap-3 h-[160px] mb-4">
                {months.map((m, i) => (
                  <div key={m} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end gap-0.5" style={{ height: '140px' }}>
                      <div
                        className="flex-1 bg-[#2563EB]/15 rounded-t-sm hover:bg-[#2563EB]/30 transition-all duration-300 cursor-pointer relative group"
                        style={{ height: inView ? `${(screened[i] / maxBar) * 140}px` : '0px', transition: `height 1s ease ${i * 100}ms` }}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">{screened[i]}</div>
                      </div>
                      <div
                        className="flex-1 bg-[#2563EB] rounded-t-sm hover:bg-[#1D4ED8] transition-all duration-300 cursor-pointer relative group"
                        style={{ height: inView ? `${(hired[i] / maxBar) * 140}px` : '0px', transition: `height 1.2s ease ${i * 100 + 200}ms` }}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity">{hired[i]}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">{m}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-5 mb-6 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-[#2563EB]/15" />
                  <span className="text-[11px] text-slate-500">Screened</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-[#2563EB]" />
                  <span className="text-[11px] text-slate-500">Hired</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {miniStats.map((s, i) => (
                  <div key={i} className={`${s.bg} rounded-[12px] p-3`}>
                    <div className="mb-2">{analyticsMiniIconMap[s.iconKey]}</div>
                    <div className="text-[16px] font-black text-[#0F172A]">{s.value}</div>
                    <div className="text-[10px] text-slate-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// 8. HowItWorks
// ============================================================================

const howItWorksImageMap: Record<string, string> = {
  workspace,
  jobPost,
  ai_interview: ai_interview_img,
  hiring_automation,
};

export const HowItWorks = () => {
  const { steps } = howItWorksContent;

  return (
    <section id="how-it-works" className="py-28 relative" style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)' }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/40 to-transparent" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 text-[#2563EB] text-[12px] font-bold uppercase tracking-wider mb-5">
            <Zap className="w-3.5 h-3.5" /> {howItWorksContent.badge}
          </div>
          <h2 className="text-[36px] md:text-[44px] font-display font-extrabold text-[#0F172A] leading-tight mb-4">
            {howItWorksContent.headline1}<br /><span className="text-[#2563EB]">{howItWorksContent.headline2}</span>
          </h2>
          <p className="text-[16px] text-slate-500 leading-relaxed">
            {howItWorksContent.subheadline}
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200/60 via-violet-200/60 to-amber-200/60 z-0" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center group cursor-default">
                <div className="w-20 h-20 rounded-[20px] bg-white border border-slate-100 shadow-lg flex flex-col items-center justify-center mb-5 relative transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                  <img src={howItWorksImageMap[s.imageKey]} alt={s.title} className={s.imageClass} />
                  <span className="text-[10px] font-black text-slate-300 mt-1">{s.step}</span>
                </div>
                <h3 className="text-[16px] font-display font-bold text-[#0F172A] mb-2">{s.title}</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed mb-3">{s.desc}</p>
                <div className="text-[11px] text-[#2563EB] font-medium bg-blue-50/80 px-3 py-1.5 rounded-full">{s.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// 9. Testimonials
// ============================================================================

type Review = typeof testimonialsContent.reviews[0];

const TestimonialCard = ({ r }: { r: Review }) => (
  <div className="group bg-white border border-slate-200/80 rounded-[20px] shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 cursor-default flex flex-col h-[300px] p-6 hover:border-blue-400/60 hover:bg-gradient-to-b hover:from-blue-50/30 hover:to-white relative overflow-hidden">
    {/* Animated gradient border effect */}
    <div className="absolute inset-0 rounded-[20px] p-[1px] bg-gradient-to-r from-blue-400/0 via-blue-400/0 to-blue-400/0 group-hover:from-blue-400/30 group-hover:via-blue-400/20 group-hover:to-blue-400/30 transition-all duration-500 -z-10" />
    {/* Glow effect on hover */}
    <div className="absolute -inset-1 bg-blue-500/0 group-hover:bg-blue-500/5 blur-2xl transition-all duration-500 -z-20" />

    {/* Stars */}
    <div className="flex items-center gap-0.5 mb-3">
      {[...Array(r.stars)].map((_, si) => (
        <Star key={si} className="fill-[#F59E0B] text-[#F59E0B] w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-5deg]" style={{ transitionDelay: `${si * 50}ms` }} />
      ))}
    </div>

    {/* Testimonial text */}
    <p className="text-slate-600 leading-relaxed mb-3 flex-1 text-[14px] group-hover:text-slate-700 transition-colors duration-300 line-clamp-4 min-h-[80px]">
      "{r.text}"
    </p>

    {/* Metric badge */}
    <div className="mb-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-[10px] px-3 py-2 border border-blue-100/50 group-hover:border-blue-200/70 group-hover:from-blue-50/90 group-hover:to-indigo-50/90 transition-all duration-300 min-h-[40px] flex items-center">
      <span className="font-bold text-[#2563EB] text-[12px] flex items-center gap-1">
        <span className="inline-block group-hover:scale-110 transition-transform duration-300">📈</span>
        {r.metric}
      </span>
    </div>

    {/* User info */}
    <div className="flex items-center gap-3 pt-3 border-t border-slate-100/60 group-hover:border-blue-100/60 transition-colors duration-300 min-h-[60px]">
      <div className="rounded-full flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0 w-10 h-10 text-[13px] transition-all duration-300 group-hover:scale-105 group-hover:shadow-md" style={{ backgroundColor: r.avatar }}>
        {r.name[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[#0F172A] text-[14px] group-hover:text-[#2563EB] transition-colors duration-300 truncate">{r.name}</div>
        <div className="text-slate-400 text-[11px] group-hover:text-slate-500 transition-colors duration-300 truncate">{r.role} · {r.company}</div>
      </div>
    </div>
  </div>
);

export const Testimonials = () => {
  const { reviews } = testimonialsContent;

  return (
    <section className="py-28 relative" style={{ background: 'linear-gradient(180deg, #F1F5F9 0%, #F4F6F8 50%, #F1F5F9 100%)' }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300/40 to-transparent" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 text-[#2563EB] text-[12px] font-bold uppercase tracking-wider mb-5">
            <MessageSquare className="w-3.5 h-3.5" /> {testimonialsContent.badge}
          </div>
          <h2 className="text-[36px] md:text-[44px] font-display font-extrabold text-[#0F172A] leading-tight mb-4">
            {testimonialsContent.headline1}<br /><span className="text-[#2563EB]">{testimonialsContent.headline2}</span>
          </h2>
          <p className="text-[16px] text-slate-500">{testimonialsContent.subheadline}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <TestimonialCard key={i} r={r} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// 10. FAQ
// ============================================================================

export const FAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { faqs } = faqContent;

  return (
    <section className="py-28 relative" style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #F5F7FA 100%)' }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/40 to-transparent" />

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 text-[#2563EB] text-[12px] font-bold uppercase tracking-wider mb-5">
            <HelpCircle className="w-3.5 h-3.5" /> {faqContent.badge}
          </div>
          <h2 className="text-[36px] md:text-[44px] font-display font-extrabold text-[#0F172A] leading-tight mb-4">
            {faqContent.headline1}<br /><span className="text-[#2563EB]">{faqContent.headline2}</span>
          </h2>
          <p className="text-[16px] text-slate-500">{faqContent.subheadline}</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`bg-white border rounded-[16px] overflow-hidden transition-all duration-300 ${openIdx === i ? 'border-[#2563EB]/20 shadow-lg shadow-blue-100/30' : 'border-slate-100/80 shadow-sm'}`}
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                <span className={`text-[14px] font-semibold transition-colors ${openIdx === i ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>{faq.q}</span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-all duration-300 ${openIdx === i ? 'bg-[#2563EB] text-white rotate-0' : 'bg-slate-100 text-slate-400'}`}>
                  {openIdx === i ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </div>
              </button>
              <div className={`transition-all duration-300 ${openIdx === i ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="px-5 pb-5">
                  <p className="text-[14px] text-slate-500 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white border border-slate-100/80 rounded-[20px] p-6 text-center shadow-sm">
          <p className="text-[14px] text-slate-600 mb-3">Still have questions?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`mailto:${faqContent.supportEmail}`} className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#2563EB] hover:underline">
              <Mail className="w-4 h-4" /> {faqContent.supportEmail}
            </a>
            <span className="hidden sm:block text-slate-300">·</span>
            <a href={`tel:${faqContent.supportPhone}`} className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#2563EB] hover:underline">
              <Phone className="w-4 h-4" /> Book a live demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
