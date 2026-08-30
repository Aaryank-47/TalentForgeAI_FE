import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Users, Clock, CheckCircle2, TrendingUp, Plus, UserPlus,
  Video, ClipboardList, ArrowUpRight, MoreHorizontal, Calendar,
  ChevronRight, Activity, User, Sparkles, Loader2, AlertCircle, RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { analyticsApi, type RecruiterDashboardResponse } from '../../services/api/analytics.api';

const RecruiterDashboard = () => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d'>('7d');
  const [data, setData] = useState<RecruiterDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, currentWorkspace } = useAuth();
  const companyId = currentWorkspace?.type === 'COMPANY' ? currentWorkspace.id : undefined;

  const recruiterFirstName = user?.fullName ? user.fullName.split(' ')[0] : 'Recruiter';
  const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await analyticsApi.getDashboard(companyId, timeframe);
      setData(res.data);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError(err?.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [companyId, timeframe]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4">
        <Loader2 className="w-9 h-9 text-primary-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading recruiter dashboard...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="card p-8 text-center space-y-4 max-w-md mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Failed to Load Dashboard</h3>
          <p className="text-xs text-slate-500 mt-1">{error}</p>
        </div>
        <button
          onClick={fetchDashboard}
          className="btn-primary text-sm inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  const kpis = data?.kpis;
  const applicationVolume = data?.applicationVolume || [];
  const pipelineStages = data?.pipelineStages || [];
  const upcomingInterviews = data?.upcomingInterviews || [];
  const interviewSummary = data?.interviewSummary;
  const recentActivity = data?.recentActivity || [];
  const activeJobPipelines = data?.activeJobPipelines || [];
  const statsFooter = data?.statsFooter || { offerAcceptRate: '0%', avgTimeToHire: '0d' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Dashboard</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Welcome back, {recruiterFirstName}. Here's your hiring overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {currentMonthYear}
          </button>
          <Link to="/recruiter/jobs/create" className="btn-primary text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Job
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Open Jobs"
          value={kpis?.openJobs.value || '0'}
          change={kpis?.openJobs.change || 'Active positions'}
          trend={kpis?.openJobs.trend || 'up'}
          icon={<Briefcase className="w-5 h-5 text-primary-600" />}
          bgColor="bg-primary-50"
        />
        <KpiCard
          title="Applicants This Week"
          value={kpis?.applicantsThisWeek.value || '0'}
          change={kpis?.applicantsThisWeek.change || '+0 vs last week'}
          trend={kpis?.applicantsThisWeek.trend || 'up'}
          icon={<Users className="w-5 h-5 text-primary-600" />}
          bgColor="bg-primary-50"
        />
        <KpiCard
          title="Pending Reviews"
          value={kpis?.pendingReviews.value || '0'}
          change={kpis?.pendingReviews.change || '0 in pipeline'}
          trend={kpis?.pendingReviews.trend || 'warn'}
          icon={<Clock className="w-5 h-5 text-primary-600" />}
          bgColor="bg-primary-50"
        />
        <KpiCard
          title="Today's Interviews"
          value={kpis?.todaysInterviews.value || '0'}
          change={kpis?.todaysInterviews.change || 'No sessions today'}
          trend={kpis?.todaysInterviews.trend || 'up'}
          icon={<Video className="w-5 h-5 text-primary-600" />}
          bgColor="bg-primary-50"
        />
      </div>

      {/* Main Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Application Volume Area Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-base font-bold text-[#0F172A] font-display">Application Volume</h2>
              <p className="text-xs text-slate-500 mt-0.5">Applicants and interviews over time</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-slate-600 mr-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-600 inline-block" /> Applicants
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-600 mr-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Interviews
              </span>
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
                <button
                  onClick={() => setTimeframe('7d')}
                  className={`px-3 py-1 rounded-md transition-all ${timeframe === '7d' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'}`}
                >
                  7D
                </button>
                <button
                  onClick={() => setTimeframe('30d')}
                  className={`px-3 py-1 rounded-md transition-all ${timeframe === '30d' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'}`}
                >
                  30D
                </button>
              </div>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={applicationVolume} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="applicantsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="interviewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="applicants" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#applicantsGradient)" />
                <Area type="monotone" dataKey="interviews" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#interviewsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Pipeline Health */}
        <div className="card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-[#0F172A] font-display">Pipeline Health</h2>
                <p className="text-xs text-slate-500 mt-0.5">Conversion funnel</p>
              </div>
              <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                {kpis?.openJobs.value || '0'} Active
              </span>
            </div>
            <div className="space-y-3.5">
              {pipelineStages.map((s) => (
                <div key={s.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700">{s.stage}</span>
                    <span className="text-xs font-bold text-slate-900">{s.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(s.count > 0 ? 5 : 0, s.pct)}%`, backgroundColor: s.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
              <Link to="/recruiter/pipeline" className="text-xs text-primary-600 font-semibold flex items-center gap-1 hover:text-primary-700">
                View Full Pipeline <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interview Overview / Summary */}
        <div className="card overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#0F172A] font-display">Interview Overview</h2>
              {upcomingInterviews.length > 0 && (
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                  {upcomingInterviews.length} upcoming
                </span>
              )}
            </div>
            <Link to="/recruiter/interviews" className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-0.5">
              {upcomingInterviews.length > 0 ? 'See all' : 'View all'} <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1">
            {upcomingInterviews.length > 0 ? (
              <div className="divide-y divide-[#E5E7EB]">
                {upcomingInterviews.map((iv) => (
                  <div key={iv.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${iv.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {iv.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{iv.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-slate-500 truncate">{iv.role}</span>
                        <span className="text-[10px] text-slate-300">•</span>
                        <span className="text-[10px] font-medium text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded">
                          {iv.type}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-medium text-slate-700">{iv.time.split(',')[0]}</p>
                      <p className="text-[10px] text-slate-400">{iv.time.split(', ')[1] || ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : interviewSummary?.hasAnyData && interviewSummary.totalInterviews > 0 ? (
              <div className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between border border-slate-100 gap-2">
                  <div className="flex items-center gap-2 text-slate-600 text-xs min-w-0">
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">No upcoming sessions</span>
                  </div>
                  <Link
                    to="/recruiter/interviews"
                    className="text-xs font-semibold text-primary-600 hover:text-primary-700 whitespace-nowrap flex-shrink-0 inline-flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Schedule
                  </Link>
                </div>

                {/* Real Historical Database Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-[#E5E7EB] hover:border-primary-200 transition-colors rounded-xl p-3 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-medium text-slate-500 truncate">Total Sessions</span>
                      <Video className="w-3.5 h-3.5 text-primary-600 flex-shrink-0" />
                    </div>
                    <p className="text-xl font-display font-bold text-[#0F172A] mt-1.5">
                      {interviewSummary.totalInterviews}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {interviewSummary.inProgressCount > 0
                        ? `${interviewSummary.inProgressCount} in progress`
                        : 'All-time conducted'}
                    </p>
                  </div>

                  <div className="bg-white border border-[#E5E7EB] hover:border-primary-200 transition-colors rounded-xl p-3 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-medium text-slate-500 truncate">Completed</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary-600 flex-shrink-0" />
                    </div>
                    <p className="text-xl font-display font-bold text-[#0F172A] mt-1.5">
                      {interviewSummary.completedCount}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-medium mt-0.5 truncate">
                      {interviewSummary.completionRate}% completion rate
                    </p>
                  </div>

                  <div className="bg-white border border-[#E5E7EB] hover:border-primary-200 transition-colors rounded-xl p-3 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-medium text-slate-500 truncate">
                        {interviewSummary.avgDurationMinutes !== null ? 'Avg Duration' : 'Scheduled'}
                      </span>
                      <Clock className="w-3.5 h-3.5 text-primary-600 flex-shrink-0" />
                    </div>
                    <p className="text-xl font-display font-bold text-[#0F172A] mt-1.5">
                      {interviewSummary.avgDurationMinutes !== null
                        ? `${interviewSummary.avgDurationMinutes}m`
                        : `${interviewSummary.scheduledCount}`}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {interviewSummary.avgDurationMinutes !== null
                        ? 'Per completed session'
                        : 'Total scheduled'}
                    </p>
                  </div>

                  <div className="bg-white border border-[#E5E7EB] hover:border-primary-200 transition-colors rounded-xl p-3 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-medium text-slate-500 truncate">
                        {interviewSummary.avgScore !== null ? 'Avg Score' : 'Cancelled / Exp'}
                      </span>
                      {interviewSummary.avgScore !== null ? (
                        <TrendingUp className="w-3.5 h-3.5 text-primary-600 flex-shrink-0" />
                      ) : (
                        <Activity className="w-3.5 h-3.5 text-primary-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xl font-display font-bold text-[#0F172A] mt-1.5">
                      {interviewSummary.avgScore !== null
                        ? `${interviewSummary.avgScore}%`
                        : `${interviewSummary.cancelledCount}`}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {interviewSummary.avgScore !== null
                        ? 'From evaluations'
                        : 'Unfulfilled sessions'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <Video className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-slate-800">No interview activity yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-[230px] leading-relaxed">
                  Schedule live interviews or setup AI interviews to track real-time hiring progress.
                </p>
                <Link
                  to="/recruiter/interviews"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Schedule Interview
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0F172A] font-display">Recent Activity</h2>
            <span className="text-[10px] font-semibold bg-primary-50 text-primary-700 px-2 py-1 rounded-full">Live</span>
          </div>
          <div className="divide-y divide-[#E5E7EB] max-h-[280px] overflow-y-auto">
            {recentActivity.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No recruitment activity recorded yet
              </div>
            ) : (
              recentActivity.map((a) => {
                const renderActivityIcon = () => {
                  switch (a.type) {
                    case 'applied': return <User className="w-4 h-4" />;
                    case 'assessment': return <CheckCircle2 className="w-4 h-4" />;
                    case 'interview': return <Video className="w-4 h-4" />;
                    case 'offer': return <ClipboardList className="w-4 h-4" />;
                    case 'hired': return <Sparkles className="w-4 h-4" />;
                    default: return <Activity className="w-4 h-4" />;
                  }
                };
                return (
                  <div key={a.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm ${a.color}`}>
                      {renderActivityIcon()}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 leading-relaxed">{a.text}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{a.time}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-5">
          <h2 className="text-sm font-bold text-[#0F172A] font-display mb-4">Quick Actions</h2>
          <div className="space-y-2.5">
            <QuickAction
              icon={<Plus className="w-4 h-4" />}
              label="Create Job"
              desc="Post a new position"
              href="/recruiter/jobs/create"
              color="bg-primary-600 hover:bg-primary-700 text-white"
            />
            <QuickAction
              icon={<UserPlus className="w-4 h-4" />}
              label="Invite Recruiter"
              desc="Add team member"
              href="/recruiter/team"
              color="bg-violet-600 hover:bg-violet-700 text-white"
            />
            <QuickAction
              icon={<Video className="w-4 h-4" />}
              label="Schedule Interview"
              desc="Book a session"
              href="/recruiter/interviews"
              color="bg-emerald-600 hover:bg-emerald-700 text-white"
            />
            <QuickAction
              icon={<ClipboardList className="w-4 h-4" />}
              label="Create Assessment"
              desc="Build a test"
              href="/recruiter/assessments"
              color="bg-amber-500 hover:bg-amber-600 text-white"
            />
          </div>

          {/* Stats Footer */}
          <div className="mt-5 pt-4 border-t border-[#E5E7EB] grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-xl font-display font-bold text-[#0F172A]">{statsFooter.offerAcceptRate}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Offer Accept Rate</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-display font-bold text-[#0F172A]">{statsFooter.avgTimeToHire}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Avg. Time to Hire</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Jobs Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A] font-display">Active Job Pipelines</h2>
            <p className="text-xs text-slate-500 mt-0.5">Monitor your top active positions</p>
          </div>
          <Link to="/recruiter/jobs" className="text-xs text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1">
            View All Jobs <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          {activeJobPipelines.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No active job positions found. Click "Create Job" to get started.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  {['Job Role', 'Department', 'Applied', 'Screening', 'Interview', 'Offer', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {activeJobPipelines.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">{job.role}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-slate-500">{job.dept}</span>
                    </td>
                    {job.stats.map((s, si) => (
                      <td key={si} className="px-5 py-3.5">
                        <span className="text-sm font-medium text-slate-700">{s}</span>
                      </td>
                    ))}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        job.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, change, trend, icon, bgColor }: any) => (
  <div className="card px-5 py-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className={`${bgColor} rounded-xl p-2.5`}>{icon}</div>
      <button className="text-slate-300 hover:text-slate-500 transition-colors">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
    <div>
      <p className="text-[13px] font-medium text-[#64748B]">{title}</p>
      <p className="text-3xl font-display font-bold text-[#0F172A] mt-1">{value}</p>
      <p className={`text-xs mt-1.5 font-medium flex items-center gap-1 ${trend === 'up' ? 'text-emerald-600' : trend === 'warn' ? 'text-amber-600' : 'text-slate-500'}`}>
        {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
        {change}
      </p>
    </div>
  </div>
);

const QuickAction = ({ icon, label, desc, href, color }: any) => (
  <Link to={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${color} transition-colors group`}>
    <div className="flex-shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold leading-none">{label}</p>
      <p className="text-[11px] opacity-80 mt-0.5">{desc}</p>
    </div>
    <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
  </Link>
);

export default RecruiterDashboard;
