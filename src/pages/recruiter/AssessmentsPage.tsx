import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Filter, MoreHorizontal, Eye, Copy, Archive, X,
  ChevronDown, BarChart3, ClipboardList, Activity, TrendingUp,
  Check, ChevronRight, BookOpen,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

import {
  assessmentsList as assessments,
  assessmentScoreDistribution as scoreDistribution,
  assessmentPerformanceTrend as performanceTrend,
  topAssessments,
  assessmentRecentResults as recentResults,
} from '../../constants/recruiter_mockData';


const typeColor = (t: string) => ({
  Technical: 'bg-blue-50 text-blue-700 border-blue-200',
  Aptitude: 'bg-amber-50 text-amber-700 border-amber-200',
  MCQ: 'bg-purple-50 text-purple-700 border-purple-200',
  Communication: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Coding: 'bg-rose-50 text-rose-700 border-rose-200',
})[t] || 'bg-slate-100 text-slate-600 border-slate-200';

const statusStyle = (s: string) => ({
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Draft: 'bg-slate-100 text-slate-600 border-slate-200',
  Archived: 'bg-red-50 text-red-600 border-red-200',
})[s] || 'bg-slate-100 text-slate-600 border-slate-200';

const AssessmentsPage = () => {
  const navigate = useNavigate();
  const [selectedAssessment, setSelectedAssessment] = useState(assessments[0]);
  const [detailTab, setDetailTab] = useState('Overview');
  const [search, setSearch] = useState('');

  const filtered = assessments.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));



  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Assessments</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Create, manage and analyze assessments to evaluate candidates.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Question Bank
          </button>
          <button onClick={() => navigate('/recruiter/assessments/create')} className="btn-primary text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Assessment
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Assessments', value: '24', change: '+18% vs last month', icon: <ClipboardList className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Active Assessments', value: '16', change: '+12% vs last month', icon: <Activity className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50' },
          { label: 'Total Attempts', value: '1,248', change: '+22% vs last month', icon: <BarChart3 className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50' },
          { label: 'Average Score', value: '72%', change: '+8% vs last month', icon: <TrendingUp className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50' },
        ].map(k => (
          <div key={k.label} className="card p-4 flex items-start gap-3">
            <div className={`${k.bg} rounded-xl p-2.5 flex-shrink-0`}>{k.icon}</div>
            <div>
              <p className="text-[12px] text-slate-500 leading-tight">{k.label}</p>
              <p className="text-2xl font-display font-bold text-slate-900 mt-0.5">{k.value}</p>
              <p className="text-[10px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />{k.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Table + Side Panel */}
      <div className="flex gap-5" style={{ minHeight: '500px' }}>
        {/* Left: Table */}
        <div className="flex-1 min-w-0 card overflow-hidden flex flex-col">
          {/* Tabs + Search */}
          <div className="border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2 px-4 pt-3 pb-0">
              {['All Assessments', 'My Assessments', 'Assigned', 'Drafts', 'Archived'].map(t => (
                <button key={t} className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap ${t === 'All Assessments' ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="px-4 py-3 flex items-center gap-3 border-b border-[#E5E7EB]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search assessments..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 w-52"
              />
            </div>
            {['All Types', 'All Jobs', 'All Status'].map(f => (
              <div key={f} className="relative">
                <select className="appearance-none pl-3 pr-8 py-2 text-xs border border-[#E5E7EB] rounded-lg bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>{f}</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            ))}
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg text-slate-600 hover:bg-slate-50">
              <Filter className="w-3.5 h-3.5" />
              Filters
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  {['Assessment', 'Type', 'Questions', 'Duration', 'Assigned Job', 'Attempts', 'Avg. Score', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filtered.map(a => (
                  <tr
                    key={a.id}
                    onClick={() => setSelectedAssessment(a)}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedAssessment.id === a.id ? 'bg-primary-50/30' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 ${a.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <ClipboardList className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{a.name}</p>
                          <p className="text-[10px] text-slate-400">{a.tags.slice(0, 30)}{a.tags.length > 30 ? '...' : ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${typeColor(a.type)}`}>{a.type}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{a.questions}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{a.duration}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 max-w-32 truncate">{a.job}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">{a.attempts}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-primary-600" style={{ width: `${a.avgScore}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{a.avgScore}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${statusStyle(a.status)}`}>{a.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1 rounded text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="p-1 rounded text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                        <button className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"><MoreHorizontal className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Charts */}
          <div className="border-t border-[#E5E7EB] p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Score Distribution */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-3">Score Distribution</h4>
              <div className="flex items-center gap-3">
                <div className="relative w-24 h-24">
                  <PieChart width={96} height={96}>
                    <Pie data={scoreDistribution} cx={44} cy={44} innerRadius={28} outerRadius={44} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                      {scoreDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-sm font-display font-bold text-slate-900">1,248</p>
                    <p className="text-[8px] text-slate-400">Total</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {scoreDistribution.map(s => (
                    <div key={s.name} className="flex items-center gap-1.5 text-[10px]">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-slate-600">{s.name}</span>
                      <span className="ml-auto font-medium text-slate-900">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Trend */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-900">Performance Over Time</h4>
                <span className="text-[10px] text-slate-400">Last 7 Months</span>
              </div>
              <div className="h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceTrend} margin={{ top: 2, right: 5, left: -25, bottom: 2 }}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94A3B8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94A3B8' }} domain={[60, 85]} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2} dot={{ r: 3, fill: '#2563EB' }} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Assessments */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-3">Top Performing Assessments</h4>
              <div className="space-y-2">
                {topAssessments.map((a, i) => (
                  <div key={a.name} className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 w-4">{i + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-slate-700 truncate font-medium">{a.name}</p>
                      <div className="w-full bg-slate-200 rounded-full h-1 mt-0.5">
                        <div className="h-1 rounded-full bg-primary-600" style={{ width: `${a.score}%` }} />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 w-8 text-right">{a.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detail Panel */}
        {selectedAssessment && (
          <div className="w-80 flex-shrink-0 card overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedAssessment.name}</h3>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 inline-block ${statusStyle(selectedAssessment.status)}`}>
                  {selectedAssessment.status}
                </span>
              </div>
              <button onClick={() => {}} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Detail Tabs */}
            <div className="flex border-b border-[#E5E7EB] overflow-x-auto">
              {['Overview', 'Questions', 'Assign', 'Results', 'Analytics'].map(t => (
                <button
                  key={t}
                  onClick={() => setDetailTab(t)}
                  className={`px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 ${detailTab === t ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {detailTab === 'Overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Type', val: selectedAssessment.type },
                      { label: 'Questions', val: selectedAssessment.questions },
                      { label: 'Duration', val: selectedAssessment.duration },
                    ].map(({ label, val }) => (
                      <div key={label} className="bg-slate-50 rounded-xl p-3 border border-[#E5E7EB] text-center">
                        <p className="text-[9px] text-slate-400 uppercase tracking-wide">{label}</p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">{val}</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-slate-500 grid grid-cols-2 gap-2">
                    <div><span className="text-slate-400">Created On</span><p className="font-medium text-slate-700">{selectedAssessment.created}</p></div>
                    <div><span className="text-slate-400">Created By</span><p className="font-medium text-slate-700">{selectedAssessment.by}</p></div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Description</p>
                    <p className="text-xs text-slate-700 leading-relaxed">Technical assessment to evaluate knowledge in HTML, CSS, JavaScript, React and front-end best practices.</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Assigned Jobs ({selectedAssessment.attempts > 100 ? 2 : 1})</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-slate-50 rounded-lg p-2.5 border border-[#E5E7EB]">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center"><span className="text-blue-600 text-[10px] font-bold">FE</span></div>
                          <span className="text-xs text-slate-700 font-medium">Senior Frontend Developer</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{selectedAssessment.attempts} Attempts</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {detailTab === 'Results' && (
                <div className="space-y-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Recent Results</p>
                  {recentResults.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${r.color} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                        {r.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900">{r.name}</p>
                        <p className="text-[10px] text-slate-400">{r.date}</p>
                      </div>
                      <span className={`text-sm font-bold ${r.score >= 80 ? 'text-emerald-600' : r.score >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
                        {r.score}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-[#E5E7EB] space-y-2">
              <button className="w-full btn-primary text-sm py-2.5">View Full Analytics Report</button>
              <button className="w-full py-2.5 text-sm border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium">
                Archive Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentsPage;
