import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bookmark, ArrowUpRight, TrendingUp, TrendingDown, ChevronRight, Star, Zap, Activity } from 'lucide-react';
import { candidateHomeData, jobsData, interviewsData, assessmentsData, applicationsData, profileData } from '../../constants/candidate_mockData';

// ─── Profile Completion Ring ──────────────────────────────
const ProfileRing = ({ pct }: { pct: number }) => {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const filled = (pct / 100) * circ;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#E5E7EB" strokeWidth="6" />
      <circle
        cx="50" cy="50" r={r} fill="none"
        stroke="#22C55E" strokeWidth="6" strokeLinecap="round"
        strokeDasharray={`${filled} ${circ}`}
        transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dasharray 0.7s ease' }}
      />
      <text x="50" y="54" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0F172A" fontFamily="system-ui">
        {pct}%
      </text>
    </svg>
  );
};

// ─── Match Score Badge ────────────────────────────────────
const MatchBadge = ({ pct }: { pct: number }) => {
  const color = pct >= 90 ? 'bg-emerald-500' : pct >= 80 ? 'bg-blue-500' : 'bg-amber-500';
  return (
    <span className={`${color} text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full`}>{pct}% Match</span>
  );
};

const CandidateHomePage = () => {
  const [savedJobs, setSavedJobs] = useState<string[]>(['job_1', 'job_5']);
  const aiJobs = jobsData.slice(0, 3);
  const upcomingInterviews = interviewsData.upcoming;
  const pendingAssessments = assessmentsData.pending;
  const trackerStats = [
    { label: 'Applied', value: 18 },
    { label: 'Under Review', value: 6 },
    { label: 'Interview', value: 3 },
    { label: 'Offer', value: 1 },
    { label: 'Rejected', value: 2 },
  ];

  const toggleSave = (id: string) =>
    setSavedJobs(prev => prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]);

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* ── Hero Banner ─────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA] p-6 flex flex-col lg:flex-row items-stretch gap-6 overflow-hidden relative">
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-32 bottom-0 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

        {/* Welcome text */}
        <div className="flex-1 min-w-0 z-10">
          <p className="text-blue-100 text-sm font-medium mb-1">Welcome back,</p>
          <h1 className="text-3xl font-display font-bold text-white mb-1">
            {profileData.name} <span className="text-yellow-300">👋</span>
          </h1>
          <p className="text-blue-200 text-sm mb-5">Let's find the right opportunity for you.</p>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/candidate/jobs"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary-700 font-semibold text-sm rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
            >
              <Search className="w-4 h-4" />
              Find Jobs
            </Link>
            <Link
              to="/candidate/profile"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/15 text-white font-semibold text-sm rounded-xl hover:bg-white/25 transition-colors border border-white/20"
            >
              <Activity className="w-4 h-4" />
              Improve Profile
            </Link>
          </div>
        </div>

        {/* Profile Completion Card */}
        <div className="bg-white rounded-xl p-4 w-full lg:w-72 flex-shrink-0 z-10">
          <p className="text-xs font-bold text-slate-700 mb-0.5">Complete Your Profile</p>
          <p className="text-[10px] text-slate-400 mb-3">A complete profile gets 3x more job opportunities.</p>
          <div className="flex items-center gap-4">
            <ProfileRing pct={profileData.profileCompletion} />
            <div className="flex-1 space-y-1.5">
              {profileData.completionChecklist.map(item => (
                <div key={item.label} className="flex items-center gap-2 text-xs">
                  {item.done ? (
                    <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="7" fill="#22C55E" />
                      <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200 flex-shrink-0" />
                  )}
                  <span className={item.done ? 'text-slate-700' : 'text-slate-400'}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <Link
            to="/candidate/profile"
            className="mt-3 w-full flex items-center justify-center gap-1 bg-primary-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Continue Profile →
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {candidateHomeData.stats.map((s) => (
          <div key={s.label} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center text-base`}>
                {s.icon}
              </div>
              {s.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
              {s.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
            </div>
            <p className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-tight">{s.label}</p>
            <p className={`text-[10px] mt-1 leading-tight ${s.trend === 'up' ? 'text-emerald-600' : s.trend === 'down' ? 'text-red-500' : 'text-amber-600'}`}>
              {s.change}
            </p>
          </div>
        ))}
      </div>

      {/* ── Main grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2/3 */}
        <div className="xl:col-span-2 space-y-6">
          {/* AI Matched Jobs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-display font-bold text-[#0F172A] text-base flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">AI</span>
                  AI Matched Jobs For You
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Jobs that match your skills, experience and preferences.</p>
              </div>
              <Link to="/candidate/jobs" className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
                View All Jobs <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiJobs.map((job) => (
                <div key={job.id} className="card p-4 hover:border-primary-200 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl ${job.companyColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {job.companyLogo}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">{job.title}</h3>
                        <p className="text-[11px] text-slate-500">{job.company}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSave(job.id)}
                      className="p-1 rounded-lg text-slate-300 hover:text-primary-500 transition-colors"
                    >
                      <Bookmark className={`w-4 h-4 ${savedJobs.includes(job.id) ? 'fill-primary-500 text-primary-500' : ''}`} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
                    <span>📍 {job.location}</span>
                    <span>·</span>
                    <span>🌐 {job.type}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-emerald-600">{job.match}% Match</span>
                    <span className="text-xs font-bold text-slate-900">{job.salary}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {job.skills.slice(0, 3).map(s => (
                      <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{s}</span>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 mb-3">Posted {job.posted}</p>
                  <Link
                    to={`/candidate/jobs`}
                    className="w-full text-center block py-2 text-xs font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    View Job
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Application Tracker */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-[#0F172A] text-base">Application Tracker</h2>
                <p className="text-xs text-slate-400 mt-0.5">Track the status of your job applications.</p>
              </div>
              <Link to="/candidate/applications" className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
                View All Applications <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {/* Pipeline */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {trackerStats.map((s, i) => (
                <React.Fragment key={s.label}>
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${
                      s.label === 'Applied' ? 'bg-blue-100' :
                      s.label === 'Under Review' ? 'bg-amber-100' :
                      s.label === 'Interview' ? 'bg-violet-100' :
                      s.label === 'Offer' ? 'bg-emerald-100' :
                      'bg-red-100'
                    }`}>
                      {s.label === 'Applied' ? '📋' : s.label === 'Under Review' ? '🔍' : s.label === 'Interview' ? '🎤' : s.label === 'Offer' ? '🎁' : '✕'}
                    </div>
                    <p className={`text-xl font-display font-bold ${
                      s.label === 'Applied' ? 'text-blue-600' :
                      s.label === 'Under Review' ? 'text-amber-600' :
                      s.label === 'Interview' ? 'text-violet-600' :
                      s.label === 'Offer' ? 'text-emerald-600' :
                      'text-red-500'
                    }`}>{s.value}</p>
                    <p className="text-[10px] text-slate-500 font-medium text-center leading-tight">{s.label}</p>
                  </div>
                  {i < trackerStats.length - 1 && (
                    <div className="flex-1 h-0.5 bg-slate-200 rounded-full min-w-[24px] flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Career Insights */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-[#0F172A] text-base">Career Insights</h2>
              <span className="text-xs text-slate-400">Based on your profile and job market trends.</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {/* In-demand Skill */}
              <div className="bg-slate-50 rounded-xl p-4 border border-[#E5E7EB]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">In Demand Skill</p>
                </div>
                <p className="text-sm font-bold text-slate-900">{candidateHomeData.careerInsights.inDemandSkill.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{candidateHomeData.careerInsights.inDemandSkill.change}</p>
              </div>
              {/* Top Role */}
              <div className="bg-slate-50 rounded-xl p-4 border border-[#E5E7EB]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-violet-600" />
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Top Role For You</p>
                </div>
                <p className="text-sm font-bold text-slate-900">{candidateHomeData.careerInsights.topRole.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{candidateHomeData.careerInsights.topRole.change}</p>
              </div>
              {/* Profile Strength */}
              <div className="bg-slate-50 rounded-xl p-4 border border-[#E5E7EB]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Profile Strength</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{candidateHomeData.careerInsights.profileStrength.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{candidateHomeData.careerInsights.profileStrength.change}</p>
                  </div>
                  <ProfileRing pct={candidateHomeData.careerInsights.profileStrength.pct} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1/3 */}
        <div className="space-y-5">
          {/* Upcoming Interviews */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-[#0F172A] text-sm">Upcoming Interviews</h3>
              <Link to="/candidate/interviews" className="text-xs text-primary-600 font-semibold flex items-center gap-0.5">
                View All <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingInterviews.map((iv) => (
                <div key={iv.id} className="p-3 rounded-xl border border-[#E5E7EB] hover:border-primary-200 hover:bg-slate-50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className={`w-8 h-8 ${iv.companyColor} rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                      {iv.companyLogo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-tight truncate">{iv.jobTitle.split(' – ')[0]}</p>
                      <p className="text-[10px] text-slate-500">{iv.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                      📅 {iv.dateLabel} · {iv.timeStart}
                    </p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${iv.typeColor}`}>{iv.type}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/candidate/interviews" className="mt-3 w-full block text-center text-xs text-primary-600 hover:text-primary-700 font-semibold py-2">
              View All Interviews →
            </Link>
          </div>

          {/* Pending Assessments */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-[#0F172A] text-sm">Pending Assessments</h3>
              <Link to="/candidate/assessments" className="text-xs text-primary-600 font-semibold flex items-center gap-0.5">
                View All <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {pendingAssessments.map((a) => (
                <div key={a.id} className="p-3 rounded-xl border border-[#E5E7EB] hover:border-primary-200 hover:bg-slate-50 transition-all">
                  <div className="flex items-start gap-2.5 mb-2">
                    <div className={`w-8 h-8 ${a.companyColor} rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                      {a.companyLogo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-tight">{a.name}</p>
                      <p className="text-[10px] text-slate-500">{a.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mr-3">
                      <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: '0%' }} />
                    </div>
                    <span className={`text-[10px] font-bold whitespace-nowrap ${a.dueUrgency === 'urgent' ? 'text-red-600' : a.dueUrgency === 'moderate' ? 'text-amber-600' : 'text-slate-500'}`}>
                      Due in {a.dueDays} days
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateHomePage;
