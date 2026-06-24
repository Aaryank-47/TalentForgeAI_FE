import React, { useState } from 'react';
import {
  Search, Filter, Plus, MoreHorizontal, Star, X, ChevronRight,
  Video, Send, XCircle, Clock, Activity, Briefcase, MapPin,
  ChevronDown, GripVertical,
} from 'lucide-react';

import {
  PIPELINE_STAGES as STAGES,
  pipelineInitialData as initialData,
} from '../../constants/recruiter_mockData';
import type { StageKey } from '../../constants/recruiter_mockData';


const matchColor = (score: number) =>
  score >= 90 ? 'text-emerald-600' : score >= 80 ? 'text-blue-600' : score >= 70 ? 'text-amber-600' : 'text-red-500';

const PipelinePage = () => {
  const [data] = useState(initialData);
  const [preview, setPreview] = useState<any | null>(data.Applied[0]);

  const totalCandidates = Object.values(data).flat().length;

  const summaryColors = ['text-blue-600', 'text-amber-600', 'text-purple-600', 'text-violet-600', 'text-indigo-600', 'text-pink-600', 'text-emerald-600', 'text-green-600', 'text-red-500'];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-[#0F172A]">Senior Frontend Developer</h1>
              <p className="text-xs text-slate-500">Engineering • Bangalore, India • <span className="text-emerald-600 font-medium">● Active</span></p>
            </div>
          </div>
          <div className="flex items-center gap-5 mt-2 ml-13 text-xs text-slate-600">
            {[
              { label: 'Total Applicants', val: 128 },
              { label: 'In Pipeline', val: 32 },
              { label: 'Interviews', val: 24 },
              { label: 'Offered', val: 8 },
              { label: 'Hired', val: 4 },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center">
                <span className="font-bold text-slate-900 text-base">{s.val}</span>
                <span className="text-slate-400">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-sm">Share / Embed</button>
          <button className="btn-primary text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Candidate
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates..."
            className="pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 w-52"
          />
        </div>
        {['All Stages', 'All Sources'].map(f => (
          <div key={f} className="relative">
            <select className="appearance-none pl-3 pr-8 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>{f}</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        ))}
        <button className="flex items-center gap-2 px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
          <Filter className="w-4 h-4" />
          More Filters
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button className="text-xs text-slate-500 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E5E7EB] hover:bg-slate-50 transition-colors">
            <Activity className="w-3.5 h-3.5" />
            Automate
          </button>
        </div>
      </div>

      {/* Kanban + Summary */}
      <div className="flex gap-5" style={{ height: 'calc(100vh - 340px)', minHeight: '520px' }}>
        {/* Kanban Board */}
        <div className="flex-1 min-w-0 overflow-x-auto pb-2">
          <div className="flex gap-4 h-full min-w-max pr-2">
            {STAGES.map((stage) => {
              const cards = data[stage.key] || [];
              return (
                <div
                  key={stage.key}
                  className="w-60 flex-shrink-0 flex flex-col bg-slate-50 rounded-xl border border-[#E5E7EB] overflow-hidden"
                >
                  {/* Column Header */}
                  <div className={`px-3 py-2.5 border-b ${stage.color} flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${stage.dot}`} />
                      <h3 className={`text-xs font-bold ${stage.textColor}`}>{stage.label}</h3>
                    </div>
                    <span className="bg-white text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm border border-[#E5E7EB]">
                      {cards.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {cards.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setPreview(c)}
                        className={`bg-white rounded-lg border border-[#E5E7EB] p-3 cursor-pointer hover:shadow-md hover:border-primary-200 transition-all ${preview?.id === c.id ? 'border-primary-400 shadow-md' : ''}`}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                            {c.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900 leading-tight truncate">{c.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{c.exp} • {c.source}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {c.skills?.slice(0, 2).map((s: string) => (
                            <span key={s} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">{s}</span>
                          ))}
                        </div>

                        {c.testStatus && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${c.testStatus === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            {c.testStatus}
                          </span>
                        )}

                        {c.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary-50 text-primary-700">{c.badge}</span>
                        )}

                        {c.interview && (
                          <div className="mt-1.5 text-[9px] bg-primary-50 text-primary-700 px-2 py-1 rounded font-medium">
                            📅 {c.interview}
                          </div>
                        )}

                        {c.match > 0 && (
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                            <span className={`text-[10px] font-bold ${matchColor(c.match)}`}>{c.match}%</span>
                            <span className="text-[9px] text-slate-400">{c.date}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {cards.length > 4 && (
                      <button className="w-full text-center text-[10px] text-slate-400 hover:text-primary-600 py-1">
                        +{cards.length - 4} more
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Summary & Preview */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-4">
          {/* Pipeline Summary */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900">Pipeline Summary</h3>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#E5E7EB" strokeWidth="2.5" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#2563EB" strokeWidth="2.5"
                  strokeDasharray="57.1 42.9" strokeLinecap="round" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#3B82F6" strokeWidth="2.5"
                  strokeDasharray="16.3 83.7" strokeDashoffset="-57.1" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-lg font-display font-bold text-slate-900">{totalCandidates}</p>
                <p className="text-[9px] text-slate-400">Total</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {STAGES.slice(0, 8).map((s, i) => {
                const cnt = data[s.key]?.length || 0;
                const pct = Math.round((cnt / totalCandidates) * 100);
                return (
                  <div key={s.key} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                      <span className="text-slate-600">{s.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-900 font-semibold">{cnt}</span>
                      <span className="text-slate-400">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Candidate Preview */}
          {preview && (
            <div className="card p-4 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900">Candidate Preview</h3>
                <button onClick={() => setPreview(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${preview.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {preview.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{preview.name}</p>
                  <p className="text-[10px] text-slate-500">{preview.date}</p>
                  <p className="text-[10px] text-slate-400">{preview.source}</p>
                </div>
              </div>
              {preview.match > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Match Score</span>
                    <span className={`font-bold ${matchColor(preview.match)}`}>{preview.match}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-primary-600" style={{ width: `${preview.match}%` }} />
                  </div>
                </div>
              )}
              {preview.skills && (
                <div className="mb-3">
                  <p className="text-[9px] text-slate-400 uppercase tracking-wide mb-1.5">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {preview.skills.map((s: string) => (
                      <span key={s} className="text-[10px] bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full border border-primary-100 font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              <button className="w-full btn-primary text-xs py-2">View Full Profile</button>
            </div>
          )}
        </div>
      </div>

      {/* Footer note */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
        <div className="flex items-center gap-1.5">
          <GripVertical className="w-3.5 h-3.5" />
          Drag & drop candidates between stages
        </div>
        <button className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
          <Activity className="w-3 h-3" />
          Automate stage movement · Set Rules
        </button>
      </div>
    </div>
  );
};

export default PipelinePage;
