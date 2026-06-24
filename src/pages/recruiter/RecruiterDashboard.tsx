import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Users, Clock, CheckCircle2, TrendingUp, Plus, UserPlus,
  Video, ClipboardList, ArrowUpRight, MoreHorizontal, Calendar,
  ChevronRight, Star, Zap, Activity,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  FunnelChart, Funnel, LabelList, Cell,
} from 'recharts';
import {
  applicationData,
  pipelineStagesDashboard as pipelineStages,
  recentActivity,
  upcomingInterviewsDashboard as upcomingInterviews,
  activeJobPipelines,
} from '../../constants/recruiter_mockData';

const RecruiterDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Dashboard</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Welcome back, Lamine. Here's your hiring overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            June 2026
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
          value="18"
          change="+3 from last month"
          trend="up"
          icon={<Briefcase className="w-5 h-5 text-primary-600" />}
          bgColor="bg-primary-50"
        />
        <KpiCard
          title="Applicants This Week"
          value="247"
          change="+20.2% vs last week"
          trend="up"
          icon={<Users className="w-5 h-5 text-violet-600" />}
          bgColor="bg-violet-50"
        />
        <KpiCard
          title="Pending Reviews"
          value="64"
          change="12 need action today"
          trend="warn"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          bgColor="bg-amber-50"
        />
        <KpiCard
          title="Today's Interviews"
          value="8"
          change="+32.4% vs last week"
          trend="up"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          bgColor="bg-emerald-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Volume Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-base font-bold text-[#0F172A] font-display">Application Volume</h2>
              <p className="text-xs text-[#64748B] mt-0.5">Daily applications and interviews</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-primary-600 rounded inline-block" />
                <span className="text-xs text-slate-500">Applicants</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-500 rounded inline-block" />
                <span className="text-xs text-slate-500">Interviews</span>
              </div>
              <select className="text-xs border border-[#E5E7EB] rounded-lg px-2 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={applicationData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApplicants" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '12px' }} />
                <Area type="monotone" dataKey="applicants" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorApplicants)" dot={false} activeDot={{ r: 5, fill: '#2563eb' }} />
                <Area type="monotone" dataKey="interviews" stroke="#22c55e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorInterviews)" dot={false} activeDot={{ r: 5, fill: '#22c55e' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Health / Funnel */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-[#0F172A] font-display">Pipeline Health</h2>
              <p className="text-xs text-[#64748B] mt-0.5">Current stage distribution</p>
            </div>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-3">
            {pipelineStages.map((s) => (
              <div key={s.stage}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-700">{s.stage}</span>
                  <span className="text-xs font-bold text-slate-900">{s.count}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${s.pct}%`, backgroundColor: s.color }}
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

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Interviews */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0F172A] font-display">Upcoming Interviews</h2>
            <Link to="/recruiter/interviews" className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-0.5">
              See all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-[#E5E7EB]">
            {upcomingInterviews.map((iv, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${iv.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {iv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{iv.name}</p>
                  <p className="text-xs text-slate-500 truncate">{iv.role}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-medium text-slate-700">{iv.time.split(',')[0]}</p>
                  <p className="text-[10px] text-slate-400">{iv.time.split(', ')[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0F172A] font-display">Recent Activity</h2>
            <span className="text-[10px] font-semibold bg-primary-50 text-primary-700 px-2 py-1 rounded-full">Live</span>
          </div>
          <div className="divide-y divide-[#E5E7EB] max-h-[280px] overflow-y-auto">
            {recentActivity.map((a, i) => (
              <div key={i} className="px-5 py-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm ${a.color}`}>
                  {a.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700 leading-relaxed">{a.text}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
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
              <p className="text-xl font-display font-bold text-[#0F172A]">89%</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Offer Accept Rate</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-display font-bold text-[#0F172A]">18d</p>
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
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                {['Job Role', 'Department', 'Applied', 'Screening', 'Interview', 'Offer', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {activeJobPipelines.map((job, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors cursor-pointer group">
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
