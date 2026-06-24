import React, { useState } from 'react';
import {
  Search, Filter, Plus, MoreHorizontal, MapPin, Star, ChevronDown,
  X, FileText, Brain, Briefcase, GraduationCap, Clock, MessageSquare,
  Video, Send, XCircle, ChevronRight, User, Mail, Phone, Globe, Tag,
  TrendingUp, Activity, CheckCircle,
} from 'lucide-react';

import {
  candidatesList as candidates,
  candidateStages as stages,
  candidateSources as sources,
} from '../../constants/recruiter_mockData';


const stageStyle = (s: string) => ({
  'Applied': 'bg-blue-50 text-blue-700 border-blue-200',
  'Screening': 'bg-amber-50 text-amber-700 border-amber-200',
  'Assessment': 'bg-purple-50 text-purple-700 border-purple-200',
  'AI Interview': 'bg-violet-50 text-violet-700 border-violet-200',
  'Interview': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Offer': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Hired': 'bg-green-50 text-green-700 border-green-200',
  'Rejected': 'bg-red-50 text-red-600 border-red-200',
})[s] || 'bg-slate-100 text-slate-600 border-slate-200';

const matchColor = (score: number) =>
  score >= 90 ? 'text-emerald-600' : score >= 80 ? 'text-blue-600' : score >= 70 ? 'text-amber-600' : 'text-red-500';

const CandidatesPage = () => {
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All Sources');
  const [selectedCandidate, setSelectedCandidate] = useState<typeof candidates[0] | null>(candidates[0]);
  const [drawerTab, setDrawerTab] = useState('Profile');

  const filtered = candidates.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.job.toLowerCase().includes(search.toLowerCase());
    const matchStage = selectedStage === 'All' || c.stage === selectedStage;
    const matchSource = selectedSource === 'All Sources' || c.source === selectedSource;
    return matchSearch && matchStage && matchSource;
  });

  const stageCounts: Record<string, number> = {};
  stages.forEach(s => { stageCounts[s] = s === 'All' ? candidates.length : candidates.filter(c => c.stage === s).length; });

  return (
    <div className="space-y-5 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Candidates</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Central talent database — {candidates.length} candidates total.</p>
        </div>
        <button className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Candidate
        </button>
      </div>

      {/* Stage Stat Bar */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-6">
          {[
            { label: 'Application', count: 421, sub: 'Avg. time in stage: 2 days', color: 'text-blue-600' },
            { label: 'Shortlist', count: 120, sub: 'Avg. time in stage: 2 days', color: 'text-purple-600' },
            { label: 'Interview', count: 90, sub: 'Avg. time in stage: 2 days', color: 'text-indigo-600' },
            { label: 'Offer', count: 45, sub: 'Avg. time in stage: 2 days', color: 'text-amber-600' },
          ].map(s => (
            <div key={s.label} className="flex flex-col gap-0.5">
              <p className="text-xs font-semibold text-slate-500">{s.label}</p>
              <p className={`text-2xl font-display font-bold ${s.color}`}>{s.count}</p>
              <p className="text-[10px] text-slate-400">{s.sub}</p>
            </div>
          ))}
          <div className="w-px bg-[#E5E7EB] mx-2 self-stretch hidden sm:block" />
          {[
            { label: 'Hired', count: 35, sub: 'Acceptance rate: 8.3%', color: 'text-emerald-600' },
            { label: 'Rejected', count: 131, sub: 'Rejection rate: 31.1%', color: 'text-red-500' },
          ].map(s => (
            <div key={s.label} className="flex flex-col gap-0.5">
              <p className="text-xs font-semibold text-slate-500">{s.label}</p>
              <p className={`text-2xl font-display font-bold ${s.color}`}>{s.count}</p>
              <p className="text-[10px] text-slate-400">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-5" style={{ height: 'calc(100vh - 360px)', minHeight: '500px' }}>
        {/* Left: Table */}
        <div className="flex-1 min-w-0 card overflow-hidden flex flex-col">
          {/* Search + Filters */}
          <div className="p-4 border-b border-[#E5E7EB] flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 w-52"
              />
            </div>
            {/* Stage Tabs */}
            <div className="flex items-center gap-1 flex-wrap">
              {['All', 'Application', 'Shortlist', 'Interview', 'Offer', 'Hired', 'Rejected'].map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedStage(s === 'Application' ? 'Applied' : s === 'All' ? 'All' : s)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    (s === 'Application' && selectedStage === 'Applied') || (s === 'All' && selectedStage === 'All') || selectedStage === s
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="btn-primary text-sm flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                Add Candidate
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 sticky top-0 z-10">
                <tr>
                  {['#', 'Name', 'Applied Job', 'Location', 'Source', 'Experience', 'Match', 'Stage', ''].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCandidate(c)}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedCandidate?.id === c.id ? 'bg-primary-50/40' : ''}`}
                  >
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">#{7780 + c.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                          {c.initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                          <p className="text-[10px] text-slate-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-700">{c.job}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3 h-3" />
                        <span>{c.location}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-600">{c.source}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-700 font-medium">{c.experience}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 bg-slate-200 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-primary-600" style={{ width: `${c.match}%` }} />
                        </div>
                        <span className={`text-xs font-bold ${matchColor(c.match)}`}>{c.match}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${stageStyle(c.stage)}`}>
                        {c.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="p-1 rounded text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Detail Drawer */}
        {selectedCandidate && (
          <div className="w-80 flex-shrink-0 card overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Candidate Profile</h3>
              <button onClick={() => setSelectedCandidate(null)} className="p-1 text-slate-400 hover:text-slate-700 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Header */}
            <div className="p-4 border-b border-[#E5E7EB] bg-slate-50">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${selectedCandidate.color} flex items-center justify-center text-white font-bold`}>
                  {selectedCandidate.initials}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{selectedCandidate.name}</h4>
                  <p className="text-xs text-slate-500">{selectedCandidate.job}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] text-slate-400">{selectedCandidate.location}</span>
                  </div>
                </div>
              </div>

              {/* Match Score */}
              <div className="bg-white rounded-xl p-3 border border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-700">AI Match Score</span>
                  <span className={`text-base font-display font-bold ${matchColor(selectedCandidate.match)}`}>{selectedCandidate.match}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-primary-600 transition-all" style={{ width: `${selectedCandidate.match}%` }} />
                </div>
              </div>
            </div>

            {/* Drawer Tabs */}
            <div className="flex border-b border-[#E5E7EB] overflow-x-auto">
              {['Profile', 'Resume', 'Assessment', 'Notes', 'Timeline'].map(t => (
                <button
                  key={t}
                  onClick={() => setDrawerTab(t)}
                  className={`px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                    drawerTab === t ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {drawerTab === 'Profile' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCandidate.skills.map(s => (
                        <span key={s} className="text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full border border-primary-100 font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Details</p>
                    <div className="space-y-2">
                      {[
                        { icon: Briefcase, label: 'Experience', val: selectedCandidate.experience },
                        { icon: Globe, label: 'Source', val: selectedCandidate.source },
                        { icon: Tag, label: 'Stage', val: selectedCandidate.stage },
                        { icon: Mail, label: 'Email', val: selectedCandidate.email },
                      ].map(({ icon: Icon, label, val }) => (
                        <div key={label} className="flex items-center gap-2.5">
                          <Icon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="text-xs text-slate-500 w-20 flex-shrink-0">{label}</span>
                          <span className="text-xs text-slate-900 font-medium truncate">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Recruiter Notes</p>
                    <textarea
                      className="w-full text-xs border border-[#E5E7EB] rounded-lg p-2.5 text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-300"
                      rows={3}
                      placeholder="Add a note about this candidate..."
                    />
                  </div>
                </div>
              )}
              {drawerTab === 'Assessment' && (
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-xl p-3 border border-[#E5E7EB]">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-semibold text-slate-700">Frontend Assessment</p>
                      <span className="text-emerald-600 font-bold text-sm">88%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Completed May 11, 2024</p>
                    <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: '88%' }} />
                    </div>
                  </div>
                </div>
              )}
              {drawerTab === 'Timeline' && (
                <div className="space-y-3">
                  {[
                    { event: 'Applied', date: 'May 12, 2024', color: 'bg-blue-500' },
                    { event: 'Screening Started', date: 'May 13, 2024', color: 'bg-amber-500' },
                    { event: 'Assessment Sent', date: 'May 14, 2024', color: 'bg-purple-500' },
                    { event: 'Interview Scheduled', date: 'May 20, 2024', color: 'bg-emerald-500' },
                  ].map((t, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-2 h-2 ${t.color} rounded-full mt-1.5 flex-shrink-0`} />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{t.event}</p>
                        <p className="text-[10px] text-slate-400">{t.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-[#E5E7EB] space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button className="text-xs btn-secondary py-2 flex items-center justify-center gap-1.5">
                  <Video className="w-3.5 h-3.5" />
                  Interview
                </button>
                <button className="text-xs btn-primary py-2 flex items-center justify-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5" />
                  Move Stage
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="text-xs py-2 border border-[#E5E7EB] rounded-lg text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors">
                  <Send className="w-3.5 h-3.5" />
                  Send Offer
                </button>
                <button className="text-xs py-2 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 flex items-center justify-center gap-1.5 transition-colors">
                  <XCircle className="w-3.5 h-3.5" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatesPage;
