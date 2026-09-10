import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Bookmark, ArrowUpRight, TrendingUp, TrendingDown, Star, Zap,
  Activity, MapPin, Globe, FileText, Video, Gift, XCircle, Calendar, Sparkles,
  BookmarkCheck, Loader2, AlertCircle, CheckCircle2, Clock
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { candidateApi } from '../../services/api/candidate.api';
import { interviewApi } from '../../services/api/interview.api';
import { assessmentApi } from '../../services/api/assessment.api';
import { jobApi } from '../../services/api/job.api';
import { candidateKeys } from '../../constants/queryKeys';
import { useAuth } from '../../context/AuthContext';

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

const CandidateHomePage = () => {
  const { user } = useAuth();

  // 1. Candidate Profile & Completion
  const { data: candidate } = useQuery({
    queryKey: candidateKeys.me,
    queryFn: () => candidateApi.getCandidateProfile(),
  });

  const { data: completionData } = useQuery({
    queryKey: candidateKeys.completion,
    queryFn: () => candidateApi.getProfileCompletion(),
  });

  // 2. Real Candidate Applications
  const { data: applicationsResponse, isLoading: isLoadingApps } = useQuery({
    queryKey: candidateKeys.applications({ limit: 100 }),
    queryFn: () => candidateApi.getMyApplications({ limit: 100 }),
  });

  const applications: any[] = Array.isArray(applicationsResponse)
    ? applicationsResponse
    : Array.isArray(applicationsResponse?.data)
      ? applicationsResponse.data
      : Array.isArray((applicationsResponse as any)?.applications)
        ? (applicationsResponse as any).applications
        : [];

  // 3. Real Candidate Interviews
  const {
    data: interviewsResponse,
    isLoading: isLoadingInterviews,
    isError: isErrorInterviews,
  } = useQuery({
    queryKey: ['candidateInterviews'],
    queryFn: () => interviewApi.getCandidateInterviews(),
  });

  const rawInterviewsData: any = (interviewsResponse as any)?.data || interviewsResponse || {};
  const pendingInterviews: any[] = Array.isArray(rawInterviewsData?.pending)
    ? rawInterviewsData.pending
    : [];
  const completedInterviews: any[] = Array.isArray(rawInterviewsData?.completed)
    ? rawInterviewsData.completed
    : [];

  // 4. Real Candidate Assessment Invitations
  const {
    data: invitations = [],
    isLoading: isLoadingInvites,
    isError: isErrorInvites,
  } = useQuery({
    queryKey: ['candidate', 'assessment-invitations'],
    queryFn: async () => {
      const res = await assessmentApi.getMyAssessmentInvitations();
      return Array.isArray(res) ? res : [];
    },
  });

  const pendingAssessments = invitations.filter(
    (inv: any) => inv.status === 'PENDING' || inv.status === 'IN_PROGRESS'
  );
  const completedAssessments = invitations.filter(
    (inv: any) => inv.status === 'COMPLETED' || inv.status === 'SUBMITTED'
  );

  // 5. Real Saved Jobs
  const { data: savedJobsResponse } = useQuery({
    queryKey: ['savedJobs'],
    queryFn: () => jobApi.getSavedJobs(),
  });

  const savedJobsList: any[] = Array.isArray(savedJobsResponse)
    ? savedJobsResponse
    : Array.isArray((savedJobsResponse as any)?.data)
      ? (savedJobsResponse as any).data
      : [];

  const [localSavedJobs, setLocalSavedJobs] = useState<string[]>(['job_1', 'job_5']);

  const queryClient = useQueryClient();

  // 6. Real AI Matched Jobs
  const { data: matchedJobsResponse, isLoading: isLoadingMatches, isRefetching: isRefetchingMatches } = useQuery({
    queryKey: ['matchedJobs'],
    queryFn: () => jobApi.getMatchedJobs({ limit: 6 }),
  });

  const recalculateMatchesMutation = useMutation({
    mutationFn: () => jobApi.recalculateCandidateMatches(),
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['matchedJobs'] });
      }, 1500);
    },
  });

  const formatSalary = (min?: number | null, max?: number | null) => {
    if (!min && !max) return 'Competitive';
    if (min && max) {
      if (min >= 100000) {
        const minLpa = +(min / 100000).toFixed(1);
        const maxLpa = +(max / 100000).toFixed(1);
        return `₹${minLpa} - ₹${maxLpa} LPA`;
      }
      if (min >= 1000) {
        return `$${Math.round(min / 1000)}k - $${Math.round(max / 1000)}k`;
      }
      return `₹${min} - ₹${max} LPA`;
    }
    const val = min || max || 0;
    return val >= 100000 ? `₹${+(val / 100000).toFixed(1)} LPA` : `₹${val}`;
  };

  const formatRelativeDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Recently';
    const diffDays = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const rawMatches = Array.isArray((matchedJobsResponse as any)?.data)
    ? (matchedJobsResponse as any).data
    : Array.isArray(matchedJobsResponse)
      ? matchedJobsResponse
      : [];

  const aiJobs = rawMatches.map((m: any, idx: number) => {
    const companyColors = ['bg-blue-600', 'bg-purple-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600', 'bg-indigo-600'];
    const companyName = m.job?.company?.companyName || 'Company';
    return {
      id: m.job?.id || m.id,
      title: m.job?.title || 'Software Engineer',
      company: companyName,
      logo: m.job?.company?.logo,
      location: m.job?.location || (m.job?.workplaceType === 'REMOTE' ? 'Remote' : 'Various'),
      type: m.job?.employmentType ? m.job.employmentType.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase()) : 'Full Time',
      workplaceType: m.job?.workplaceType ? m.job.workplaceType.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase()) : 'Remote',
      salary: formatSalary(m.job?.minimumSalary, m.job?.maximumSalary),
      match: Math.round(m.matchScore || 85),
      skills: m.job?.skills?.map((s: any) => s.name) || [],
      posted: formatRelativeDate(m.job?.publishedAt || m.calculatedAt),
      companyLogo: companyName.slice(0, 2).toUpperCase(),
      companyColor: companyColors[idx % companyColors.length],
    };
  });

  const toggleSave = (id: string) =>
    setLocalSavedJobs(prev => prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]);

  const candidateName = candidate?.fullName || user?.fullName || 'Candidate';
  const profileCompletion = completionData?.completion ?? candidate?.profileCompletion ?? 60;

  // ─── Compute Real Analytics & Pipeline Counters ─────────────
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const totalAppsCount = applications.length;
  const appsThisWeek = applications.filter((a: any) => a.appliedAt && new Date(a.appliedAt) >= sevenDaysAgo).length;

  const inReviewApps = applications.filter((a: any) => {
    const st = a.status?.toUpperCase();
    return st === 'INREVIEW' || st === 'IN_REVIEW' || st === 'SHORTLISTED' || (st === 'APPLIED' && a.applicationWorkflow);
  });
  const inReviewCount = inReviewApps.length;

  const interviewStageApps = applications.filter((a: any) => {
    const st = a.status?.toUpperCase();
    return st === 'INTERVIEW' || (a.interviewAssignments && a.interviewAssignments.length > 0);
  });
  const totalInterviewsCount = Math.max(pendingInterviews.length + completedInterviews.length, interviewStageApps.length);

  const offerApps = applications.filter((a: any) => {
    const st = a.status?.toUpperCase();
    return st === 'OFFER' || st === 'HIRED';
  });
  const offerCount = offerApps.length;

  const rejectedApps = applications.filter((a: any) => {
    const st = a.status?.toUpperCase();
    return st === 'REJECTED' || st === 'WITHDRAWN';
  });
  const rejectedCount = rejectedApps.length;

  const stats = [
    {
      label: 'Applications',
      value: totalAppsCount,
      change: appsThisWeek > 0 ? `+${appsThisWeek} this week` : 'Total submitted',
      trend: appsThisWeek > 0 ? 'up' : 'neutral',
    },
    {
      label: 'Under Review',
      value: inReviewCount,
      change: inReviewCount > 0 ? `${inReviewCount} in review` : 'In pipeline',
      trend: inReviewCount > 0 ? 'up' : 'neutral',
    },
    {
      label: 'Interviews',
      value: pendingInterviews.length,
      change: pendingInterviews.length > 0 ? `${pendingInterviews.length} upcoming` : '0 scheduled',
      trend: pendingInterviews.length > 0 ? 'up' : 'neutral',
    },
    {
      label: 'Offers',
      value: offerCount,
      change: offerCount > 0 ? 'Congratulations!' : 'Pending decision',
      trend: offerCount > 0 ? 'up' : 'neutral',
    },
    {
      label: 'Rejections',
      value: rejectedCount,
      change: rejectedCount > 0 ? `${rejectedCount} closed` : '0 rejections',
      trend: rejectedCount > 0 ? 'down' : 'neutral',
    },
    {
      label: 'Saved Jobs',
      value: savedJobsList.length,
      change: `${savedJobsList.length} bookmarked`,
      trend: 'neutral',
    },
  ];

  const trackerStats = [
    { label: 'Applied', value: totalAppsCount },
    { label: 'Under Review', value: inReviewCount },
    { label: 'Interview', value: totalInterviewsCount },
    { label: 'Offer', value: offerCount },
    { label: 'Rejected', value: rejectedCount },
  ];

  // Career Insights real bindings
  const topSkillLabel = candidate?.skills?.[0]?.name || 'TypeScript';
  const topRoleLabel = candidate?.headline || candidate?.currentDesignation || (candidate?.skills?.[0]?.name ? `${candidate.skills[0].name} Developer` : 'Software Developer');
  const profileStrengthLabel = profileCompletion >= 85 ? 'All-Star' : profileCompletion >= 70 ? 'Strong Profile' : profileCompletion >= 40 ? 'Intermediate' : 'Getting Started';
  const profileStrengthSubtext = profileCompletion >= 80 ? 'Optimal visibility' : 'Add skills & experience';

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* ── Hero Banner ─────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA] p-6 flex flex-col lg:flex-row items-stretch gap-6 overflow-hidden relative">
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-32 bottom-0 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

        {/* Welcome text */}
        <div className="flex-1 min-w-0 z-10">
          <p className="text-blue-100 text-sm font-medium mb-1">Welcome back,</p>
          <h1 className="text-3xl font-display font-bold text-white mb-1 flex items-center gap-2">
            <span>{candidateName}</span>
            <Sparkles className="w-6 h-6 text-yellow-300 inline-block" />
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
            <ProfileRing pct={profileCompletion} />
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                {candidate?.headline ? (
                  <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="7" fill="#22C55E" />
                    <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200 flex-shrink-0" />
                )}
                <span className={candidate?.headline ? 'text-slate-700' : 'text-slate-400'}>Headline & Title</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {candidate?.skills && candidate.skills.length > 0 ? (
                  <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="7" fill="#22C55E" />
                    <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200 flex-shrink-0" />
                )}
                <span className={candidate?.skills && candidate.skills.length > 0 ? 'text-slate-700' : 'text-slate-400'}>Key Skills</span>
              </div>
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
        {stats.map((s) => {
          const renderHomeStatIcon = () => {
            switch (s.label) {
              case 'Applications': return <FileText className="w-4 h-4 text-primary-600" />;
              case 'Under Review': return <Search className="w-4 h-4 text-primary-600" />;
              case 'Interviews': return <Video className="w-4 h-4 text-primary-600" />;
              case 'Offers': return <Gift className="w-4 h-4 text-primary-600" />;
              case 'Rejections': return <XCircle className="w-4 h-4 text-primary-600" />;
              case 'Saved Jobs': return <BookmarkCheck className="w-4 h-4 text-primary-600" />;
              default: return <Activity className="w-4 h-4 text-primary-600" />;
            }
          };
          return (
            <div key={s.label} className="card p-4 bg-white border border-[#E5E7EB] hover:border-primary-200 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                  {renderHomeStatIcon()}
                </div>
                {s.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
                {s.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
              </div>
              <p className="text-2xl font-display font-bold text-slate-900">{s.value}</p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-tight">{s.label}</p>
              <p className={`text-[10px] mt-1 leading-tight font-medium ${
                s.trend === 'up' ? 'text-emerald-600' : s.trend === 'down' ? 'text-red-500' : 'text-slate-400'
              }`}>
                {s.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Main grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2/3 */}
        <div className="xl:col-span-2 space-y-6">
          {/* AI Matched Jobs For You */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-display font-bold text-[#0F172A] text-base flex items-center gap-2">
                  <span className="w-6 h-6 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </span>
                  AI Matched Jobs For You
                  {(isLoadingMatches || isRefetchingMatches || recalculateMatchesMutation.isPending) && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-500 ml-1" />
                  )}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Real-time jobs tailored to your skills, experience & preferences.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => recalculateMatchesMutation.mutate()}
                  disabled={recalculateMatchesMutation.isPending || isRefetchingMatches}
                  title="Recalculate AI Matches"
                  className="text-xs text-slate-500 hover:text-primary-600 font-medium flex items-center gap-1 bg-slate-100 hover:bg-primary-50 px-2.5 py-1 rounded-md transition-colors disabled:opacity-50"
                >
                  <Sparkles className={`w-3 h-3 text-primary-500 ${recalculateMatchesMutation.isPending ? 'animate-spin' : ''}`} />
                  <span>{recalculateMatchesMutation.isPending ? 'Calculating...' : 'Refresh AI'}</span>
                </button>
                <Link to="/candidate/jobs" className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
                  View All Jobs <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            {isLoadingMatches ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="card p-4 animate-pulse space-y-3 bg-white border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-200" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                        <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-slate-200 rounded w-16" />
                      <div className="h-3 bg-slate-200 rounded w-20" />
                    </div>
                    <div className="flex gap-1">
                      <div className="h-4 bg-slate-100 rounded w-12" />
                      <div className="h-4 bg-slate-100 rounded w-14" />
                    </div>
                    <div className="h-8 bg-slate-100 rounded w-full mt-2" />
                  </div>
                ))}
              </div>
            ) : aiJobs.length === 0 ? (
              <div className="card p-8 text-center bg-slate-50/70 border border-dashed border-slate-200 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 mb-3 shadow-xs">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No Matched Jobs Found Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
                  Add more skills and experience to your profile, or trigger an instant AI matching scan.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => recalculateMatchesMutation.mutate()}
                    disabled={recalculateMatchesMutation.isPending}
                    className="btn btn-primary text-xs flex items-center gap-1.5 px-4 py-2"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${recalculateMatchesMutation.isPending ? 'animate-spin' : ''}`} />
                    {recalculateMatchesMutation.isPending ? 'Scanning Jobs...' : 'Run AI Match Scan'}
                  </button>
                  <Link
                    to="/candidate/jobs"
                    className="btn btn-secondary text-xs px-4 py-2"
                  >
                    Browse All Jobs
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiJobs.map((job: any) => (
                  <div key={job.id} className="card p-4 hover:border-primary-200 hover:shadow-md transition-all group relative flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          {job.logo ? (
                            <img
                              src={job.logo}
                              alt={job.company}
                              className="w-9 h-9 rounded-xl object-contain border border-slate-100 p-1 flex-shrink-0 bg-white"
                            />
                          ) : (
                            <div className={`w-9 h-9 rounded-xl ${job.companyColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}>
                              {job.companyLogo}
                            </div>
                          )}
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 leading-tight group-hover:text-primary-600 transition-colors line-clamp-1">{job.title}</h3>
                            <p className="text-[11px] text-slate-500 font-medium">{job.company}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleSave(job.id)}
                          className="p-1 rounded-lg text-slate-300 hover:text-primary-500 transition-colors"
                        >
                          <Bookmark className={`w-4 h-4 ${localSavedJobs.includes(job.id) ? 'fill-primary-500 text-primary-500' : ''}`} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
                        <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-slate-400" />{job.location}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5"><Globe className="w-3 h-3 text-slate-400" />{job.workplaceType || job.type}</span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          job.match >= 90
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : job.match >= 75
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-50 text-slate-700 border border-slate-200'
                        }`}>
                          {job.match}% Match
                        </span>
                        <span className="text-xs font-bold text-slate-900">{job.salary}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.skills.slice(0, 3).map((s: string) => (
                          <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 mb-2.5">Posted {job.posted}</p>
                      <Link
                        to={`/candidate/jobs`}
                        className="w-full text-center block py-2 text-xs font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                      >
                        View Job
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              {trackerStats.map((s, i) => {
                const renderTrackerIcon = () => {
                  switch (s.label) {
                    case 'Applied': return <FileText className="w-5 h-5 text-primary-600" />;
                    case 'Under Review': return <Search className="w-5 h-5 text-primary-600" />;
                    case 'Interview': return <Video className="w-5 h-5 text-primary-600" />;
                    case 'Offer': return <Gift className="w-5 h-5 text-primary-600" />;
                    default: return <XCircle className="w-5 h-5 text-primary-600" />;
                  }
                };
                return (
                  <React.Fragment key={s.label}>
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-100/60 flex items-center justify-center">
                        {renderTrackerIcon()}
                      </div>
                      <p className="text-xl font-display font-bold text-slate-900">{s.value}</p>
                      <p className="text-[10px] text-slate-500 font-medium text-center leading-tight">{s.label}</p>
                    </div>
                    {i < trackerStats.length - 1 && (
                      <div className="flex-1 h-0.5 bg-slate-200 rounded-full min-w-[24px] flex-shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Career Insights */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-[#0F172A] text-base">Career Insights</h2>
              <span className="text-xs text-slate-400">Based on your profile and job market trends.</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* In-demand Skill */}
              <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] hover:border-primary-200 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-primary-600" />
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">In Demand Skill</p>
                </div>
                <p className="text-sm font-bold text-slate-900 truncate">{topSkillLabel}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">High market demand</p>
              </div>
              {/* Top Role */}
              <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] hover:border-primary-200 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-primary-600" />
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Top Role For You</p>
                </div>
                <p className="text-sm font-bold text-slate-900 truncate">{topRoleLabel}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Based on your experience</p>
              </div>
              {/* Profile Strength */}
              <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] hover:border-primary-200 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary-600" />
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Profile Strength</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{profileStrengthLabel}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{profileStrengthSubtext}</p>
                  </div>
                  <ProfileRing pct={profileCompletion} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1/3 */}
        <div className="space-y-5">
          {/* Upcoming Interviews Card */}
          <div className="card p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-[#0F172A] text-sm">Upcoming Interviews</h3>
                <Link to="/candidate/interviews" className="text-xs text-primary-600 font-semibold flex items-center gap-0.5">
                  View All <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              {isLoadingInterviews ? (
                <div className="py-8 text-center flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
                  <p className="text-xs text-slate-400">Loading interviews...</p>
                </div>
              ) : isErrorInterviews ? (
                <div className="py-6 px-3 text-center rounded-xl bg-red-50/60 border border-red-100">
                  <AlertCircle className="w-5 h-5 text-red-500 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-800">Unable to load interviews</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Please refresh or try again later</p>
                </div>
              ) : pendingInterviews.length > 0 ? (
                <div className="space-y-3">
                  {pendingInterviews.slice(0, 3).map((iv) => {
                    const formatInterviewTime = (dStr: string) => {
                      const d = new Date(dStr);
                      if (isNaN(d.getTime())) return 'Scheduled';
                      const isToday = d.toDateString() === new Date().toDateString();
                      const isTomorrow = d.toDateString() === new Date(Date.now() + 86400000).toDateString();
                      const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      if (isToday) return `Today · ${time}`;
                      if (isTomorrow) return `Tomorrow · ${time}`;
                      return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} · ${time}`;
                    };

                    return (
                      <Link
                        key={iv.id || iv.sessionId}
                        to="/candidate/interviews"
                        className="block p-3 rounded-xl border border-[#E5E7EB] hover:border-primary-200 hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-1.5">
                          <div className={`w-8 h-8 ${iv.companyColor || 'bg-primary-600'} rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                            {iv.companyLogo || (iv.company ? iv.company.slice(0, 2).toUpperCase() : 'TF')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 leading-tight truncate">{iv.role || iv.interviewTitle}</p>
                            <p className="text-[10px] text-slate-500 truncate">{iv.company}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{formatInterviewTime(iv.scheduledAt)}</span>
                          </p>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            iv.interviewType?.includes('AI') ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {iv.interviewType || 'Interview'}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : completedInterviews.length > 0 ? (
                <div className="py-6 px-4 text-center flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">No interviews scheduled right now</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-[220px] leading-relaxed">
                    You have completed {completedInterviews.length} previous interview{completedInterviews.length === 1 ? '' : 's'}. We'll notify you when your next session is booked.
                  </p>
                  {completedInterviews[0] && (
                    <div className="mt-3 w-full p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-left flex items-center justify-between">
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Latest Completed</p>
                        <p className="text-xs font-semibold text-slate-900 truncate mt-0.5">{completedInterviews[0].role || completedInterviews[0].interviewTitle}</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap">Completed</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-7 px-4 text-center flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mb-2.5">
                    <Video className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Your next interview will appear here</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-[210px] leading-relaxed">
                    Keep applying to find your next opportunity.
                  </p>
                  <Link
                    to="/candidate/jobs"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors mt-3"
                  >
                    <Search className="w-3.5 h-3.5" /> Find Jobs
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/candidate/interviews"
              className="mt-3 w-full block text-center text-xs text-primary-600 hover:text-primary-700 font-semibold py-1.5 border-t border-slate-100 pt-2.5"
            >
              View All Interviews →
            </Link>
          </div>

          {/* Pending Assessments Card */}
          <div className="card p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-[#0F172A] text-sm">Pending Assessments</h3>
                <Link to="/candidate/assessments" className="text-xs text-primary-600 font-semibold flex items-center gap-0.5">
                  View All <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              {isLoadingInvites ? (
                <div className="py-8 text-center flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
                  <p className="text-xs text-slate-400">Loading assessments...</p>
                </div>
              ) : isErrorInvites ? (
                <div className="py-6 px-3 text-center rounded-xl bg-red-50/60 border border-red-100">
                  <AlertCircle className="w-5 h-5 text-red-500 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-800">Unable to load assessments</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Please refresh or try again later</p>
                </div>
              ) : pendingAssessments.length > 0 ? (
                <div className="space-y-3">
                  {pendingAssessments.slice(0, 3).map((a: any) => {
                    const getDueDays = (expiresAtStr?: string) => {
                      if (!expiresAtStr) return { text: 'Active', urgency: 'normal', days: 0 };
                      const diff = new Date(expiresAtStr).getTime() - Date.now();
                      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                      if (days < 0) return { text: 'Expired', urgency: 'expired', days: 0 };
                      if (days <= 2) return { text: `Due in ${days} day${days === 1 ? '' : 's'}`, urgency: 'urgent', days };
                      return { text: `Due in ${days} days`, urgency: 'normal', days };
                    };

                    const dueInfo = getDueDays(a.expiresAt);
                    const companyName = a.assessment?.company?.companyName || a.companyName || 'TalentForge Partner';
                    const assessmentTitle = a.assessment?.title || a.title || 'Technical Assessment';
                    const companyInitials = companyName.slice(0, 2).toUpperCase();

                    const assessmentTargetUrl = a.token && (a.assessmentId || a.assessment?.id)
                      ? `/candidate/assessments/${a.assessmentId || a.assessment?.id}/preparation?token=${a.token}&applicationId=${a.applicationId}`
                      : `/candidate/assessments`;

                    return (
                      <Link
                        key={a.id || a.invitationId}
                        to={assessmentTargetUrl}
                        className="block p-3 rounded-xl border border-[#E5E7EB] hover:border-primary-200 hover:bg-slate-50 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start gap-2.5 mb-2">
                          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {companyInitials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 leading-tight truncate group-hover:text-primary-600 transition-colors">{assessmentTitle}</p>
                            <p className="text-[10px] text-slate-500 truncate">{companyName}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="w-full bg-slate-200 rounded-full h-1.5 mr-3">
                            <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: a.status === 'IN_PROGRESS' ? '50%' : '0%' }} />
                          </div>
                          <span className={`text-[10px] font-bold whitespace-nowrap ${dueInfo.urgency === 'urgent' ? 'text-red-600' : 'text-slate-500'}`}>
                            {dueInfo.text}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : completedAssessments.length > 0 ? (
                <div className="py-7 px-4 text-center flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">You're all caught up!</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-[220px] leading-relaxed">
                    No assessments currently need your attention. You have completed {completedAssessments.length} assessment{completedAssessments.length === 1 ? '' : 's'}.
                  </p>
                  <Link
                    to="/candidate/assessments"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors mt-3"
                  >
                    View Assessments <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              ) : (
                <div className="py-7 px-4 text-center flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mb-2.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">No assessments yet</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-[220px] leading-relaxed">
                    Assessments from your applications will appear here when required.
                  </p>
                  <Link
                    to="/candidate/jobs"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors mt-3"
                  >
                    <Search className="w-3.5 h-3.5" /> Find Jobs
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateHomePage;
