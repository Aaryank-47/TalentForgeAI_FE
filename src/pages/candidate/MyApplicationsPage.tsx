import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Download, X, Bell, ChevronRight, CheckCircle, Circle, AlertCircle, ExternalLink } from 'lucide-react';
import { applicationsData } from '../../constants/candidate_mockData';

type Application = typeof applicationsData[0];

const stageSteps = ['Applied', 'Assessment', 'AI Interview', 'Technical', 'HR', 'Offer'];

const StatusBadge = ({ status, color }: { status: string; color: string }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${color}`}>
    {status}
  </span>
);

// Detail Panel
const ApplicationDetailPanel = ({ app, onClose }: { app: Application; onClose: () => void }) => {
  const [tab, setTab] = useState<'Overview' | 'Timeline' | 'Job Details' | 'Messages'>('Overview');
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-[#E5E7EB] bg-white flex-shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${app.companyColor} flex items-center justify-center text-white font-bold flex-shrink-0`}>
              {app.companyLogo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-[#0F172A] text-base">{app.jobTitle}</h2>
                <StatusBadge status={app.status} color={app.statusColor} />
              </div>
              <p className="text-sm text-slate-500 mt-0.5">{app.company}</p>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>📍 {app.location}</span>
                <span>·</span>
                <span>🌐 {app.workType}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-400">Applied on <span className="font-semibold text-slate-600">{app.appliedDate}</span></p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB] flex-shrink-0 bg-white">
        {(['Overview', 'Timeline', 'Job Details', 'Messages'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              tab === t ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {tab === 'Overview' && (
          <>
            {/* Current Stage + Next Step */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Current Stage</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{app.currentStage}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{app.nextStepLabel}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Next Step</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px]">📅</span>
                    <p className="text-xs font-bold text-primary-700">{app.nextStep}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Timeline */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Application Timeline</h3>
              <div className="space-y-0">
                {app.timeline.map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        t.done
                          ? t.upcoming ? 'bg-blue-500' : 'bg-emerald-500'
                          : 'bg-slate-200'
                      }`}>
                        {t.done && !t.upcoming && <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                        {t.done && t.upcoming && <div className="w-2 h-2 bg-white rounded-full" />}
                        {!t.done && <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                      </div>
                      {i < app.timeline.length - 1 && (
                        <div className={`w-0.5 h-8 my-1 ${t.done && !t.upcoming ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                      )}
                    </div>
                    <div className="pb-2 pt-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-xs font-semibold ${t.done ? 'text-slate-900' : 'text-slate-400'}`}>{t.event}</p>
                        {t.upcoming && <span className="text-[9px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded-full">Upcoming</span>}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{t.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            {app.notifications.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3">Notifications</h3>
                <div className="space-y-2">
                  {app.notifications.map((n, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-[#E5E7EB] bg-slate-50">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm ${n.color}`}>
                        {n.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900">{n.text}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{n.sub}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{n.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        {tab === 'Timeline' && (
          <div className="space-y-0">
            {app.timeline.map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${t.done ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    {t.done ? <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="none"><path d="M4 8l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> : <div className="w-2.5 h-2.5 bg-slate-400 rounded-full" />}
                  </div>
                  {i < app.timeline.length - 1 && <div className={`w-0.5 h-10 my-1 ${t.done ? 'bg-emerald-300' : 'bg-slate-200'}`} />}
                </div>
                <div className="pb-2 pt-1 flex-1">
                  <p className={`text-sm font-semibold ${t.done ? 'text-slate-900' : 'text-slate-400'}`}>{t.event}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-[#E5E7EB] flex gap-3 bg-white flex-shrink-0">
        <button className="flex-1 py-2.5 text-sm font-semibold border border-[#E5E7EB] rounded-xl text-slate-700 hover:bg-slate-50 transition-colors">
          View Job
        </button>
        <button className="flex-1 py-2.5 text-sm font-semibold border border-red-200 rounded-xl text-red-600 hover:bg-red-50 transition-colors">
          Withdraw Application
        </button>
      </div>
    </div>
  );
};

const MyApplicationsPage = () => {
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(applicationsData[0]);
  const [statusFilter, setStatusFilter] = useState('All Status');

  const filtered = applicationsData.filter(a => {
    const matchSearch = a.jobTitle.toLowerCase().includes(search.toLowerCase()) || a.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All Status' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: 'Total Applications', value: 18, change: '+12% this month', icon: '📋', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Under Review', value: 6, change: '+8% this month', icon: '🔍', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Interviews', value: 3, change: '+50% this month', icon: '🎤', color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Offers', value: 1, change: '🎉 Congratulations!', icon: '🎁', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Rejections', value: 2, change: '-10% this month', icon: '✕', color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <div className="-m-6 flex flex-col h-screen overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-5 flex-shrink-0">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-display font-bold text-[#0F172A]">My Applications</h1>
            <p className="text-sm text-slate-500 mt-0.5">Track the status of all the jobs you've applied for.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-sm text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />Export
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {stats.map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl p-3.5 border border-transparent`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">{s.icon}</span>
              </div>
              <p className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-slate-600 font-medium leading-tight">{s.label}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{s.change}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Applications list */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-[#E5E7EB] overflow-hidden">
          {/* Filters */}
          <div className="px-6 py-3 border-b border-[#E5E7EB] bg-white flex items-center gap-3 flex-wrap flex-shrink-0">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by job title or company"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            {['All Status', 'All Companies', 'All Time'].map(f => (
              <div key={f} className="relative">
                <select
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-[#E5E7EB] rounded-xl text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onChange={e => f === 'All Status' && setStatusFilter(e.target.value)}
                >
                  <option>{f}</option>
                  {f === 'All Status' && ['Interview', 'Under Review', 'Assessment', 'Offer', 'Rejected'].map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            ))}
            <button className="flex items-center gap-1.5 px-3 py-2 border border-[#E5E7EB] rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />Filters
            </button>
          </div>

          {/* Table header */}
          <div className="px-6 py-2 border-b border-[#E5E7EB] bg-slate-50 flex items-center justify-between flex-shrink-0">
            <p className="text-xs text-slate-500">Showing 1–{filtered.length} of {filtered.length} applications</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              Sort by:
              <button className="font-semibold text-slate-700 flex items-center gap-0.5">Most Recent <ChevronDown className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {/* Applications */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className={`px-6 py-4 border-b border-[#E5E7EB] hover:bg-slate-50 cursor-pointer transition-colors ${selectedApp?.id === app.id ? 'bg-primary-50/30 border-l-2 border-l-primary-500' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${app.companyColor} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                    {app.companyLogo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-slate-900">{app.jobTitle}</p>
                      <StatusBadge status={app.status} color={app.statusColor} />
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="font-medium text-slate-700">{app.company}</span>
                      <span>·</span>
                      <span>📍 {app.location}</span>
                      <span>·</span>
                      <span>🌐 {app.workType}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 hidden md:block">
                    <p className="text-[10px] text-slate-400 mb-0.5">Current Stage</p>
                    <p className="text-xs font-semibold text-slate-700">{app.currentStage}</p>
                  </div>
                  <div className="text-right flex-shrink-0 hidden md:block">
                    <p className="text-[10px] text-slate-400 mb-0.5">Applied on</p>
                    <p className="text-xs font-semibold text-slate-700">{app.appliedDate}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination + bottom bar */}
          <div className="border-t border-[#E5E7EB] bg-white px-6 py-3 flex items-center justify-between flex-shrink-0">
            <div className="bg-blue-50 rounded-xl px-4 py-2.5 flex items-center gap-3 flex-1 mr-4">
              <Bell className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs font-semibold text-slate-800">Stay updated on your applications</p>
                <p className="text-[10px] text-slate-500">Enable notifications so you never miss an update from recruiters.</p>
              </div>
              <button className="ml-auto px-3 py-1.5 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap">
                Enable Notifications
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded border border-[#E5E7EB] text-slate-500 hover:bg-slate-50">
                <ChevronDown className="w-4 h-4 rotate-90" />
              </button>
              {[1, 2, 3].map(p => (
                <button key={p} className={`w-8 h-8 rounded text-xs font-semibold ${p === 1 ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{p}</button>
              ))}
              <button className="p-1.5 rounded border border-[#E5E7EB] text-slate-500 hover:bg-slate-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="w-[380px] flex-shrink-0 flex flex-col overflow-hidden">
          {selectedApp ? (
            <ApplicationDetailPanel app={selectedApp} onClose={() => setSelectedApp(null)} />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              <p className="text-sm">Select an application to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplicationsPage;
