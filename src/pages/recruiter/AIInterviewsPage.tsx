import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bot, ChevronDown, AlertTriangle, Shield, Eye, Volume2 } from 'lucide-react';
import {
  aiInterviewCompleted,
} from '../../constants/recruiter_mockData';
import { RiskBadge } from '../../components/interview/InterviewComponents';

const RECOMMENDATION_STYLES: Record<string, string> = {
  'Strong Hire': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Hire': 'bg-blue-100 text-blue-800 border-blue-200',
  'Consider': 'bg-amber-100 text-amber-800 border-amber-200',
  'Reject': 'bg-red-100 text-red-800 border-red-200',
};

export default function AIInterviewsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('All');
  const [filterRec, setFilterRec] = useState('All');
  const [selected, setSelected] = useState(aiInterviewCompleted[0]);

  const filtered = aiInterviewCompleted.filter(iv => {
    const matchSearch = iv.candidate.toLowerCase().includes(search.toLowerCase()) || iv.role.toLowerCase().includes(search.toLowerCase());
    const matchRisk = filterRisk === 'All' || iv.riskLevel === filterRisk;
    const matchRec = filterRec === 'All' || iv.recommendation === filterRec;
    return matchSearch && matchRisk && matchRec;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            AI Interviews
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Review completed AI interviews, scores, and integrity reports.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-1.5">
            <span className="text-xs text-slate-500">Total:</span>
            <span className="text-sm font-bold text-slate-900">{aiInterviewCompleted.length}</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5">
            <span className="text-xs text-emerald-700">Avg Score:</span>
            <span className="text-sm font-bold text-emerald-800">
              {Math.round(aiInterviewCompleted.reduce((a, iv) => a + iv.aiScore, 0) / aiInterviewCompleted.length)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-5" style={{ minHeight: 560 }}>
        {/* Table */}
        <div className="flex-1 min-w-0 card overflow-hidden flex flex-col">
          {/* Filters */}
          <div className="p-4 border-b border-slate-200 flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidates…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 w-48"
              />
            </div>
            {['Risk Level', 'Recommendation'].map((label, i) => (
              <div key={label} className="relative">
                <select
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={i === 0 ? filterRisk : filterRec}
                  onChange={e => i === 0 ? setFilterRisk(e.target.value) : setFilterRec(e.target.value)}
                >
                  <option value="All">All {label}s</option>
                  {i === 0
                    ? ['None', 'Low', 'Medium', 'High'].map(v => <option key={v}>{v}</option>)
                    : ['Strong Hire', 'Hire', 'Consider', 'Reject'].map(v => <option key={v}>{v}</option>)
                  }
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  {['Candidate', 'Role', 'Date', 'AI Score', 'Recommendation', 'Tab Switches', 'Noise Flags', 'Risk', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(iv => (
                  <tr
                    key={iv.id}
                    onClick={() => setSelected(iv)}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${selected?.id === iv.id ? 'bg-primary-50/30' : ''}`}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${iv.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                          {iv.initials}
                        </div>
                        <p className="text-sm font-semibold text-slate-900">{iv.candidate}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 max-w-40 truncate">{iv.role}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap">{iv.date}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div className="h-1.5 rounded-full bg-primary-600 animate-score-fill" style={{ width: `${iv.aiScore}%` }} />
                        </div>
                        <span className="text-sm font-bold text-slate-800">{iv.aiScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${RECOMMENDATION_STYLES[iv.recommendation] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {iv.recommendation}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className={`flex items-center gap-1.5 text-xs font-semibold ${iv.tabSwitches > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {iv.tabSwitches > 0 ? <AlertTriangle className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                        {iv.tabSwitches}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className={`flex items-center gap-1.5 text-xs font-semibold ${iv.noiseFlags > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        <Volume2 className="w-3.5 h-3.5" />
                        {iv.noiseFlags}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <RiskBadge level={iv.riskLevel} />
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/recruiter/ai-interviews/${iv.id}`); }}
                        className="text-xs btn-primary py-1.5 px-3 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Preview Panel */}
        {selected && (
          <div className="w-72 flex-shrink-0 card overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${selected.color} flex items-center justify-center text-sm font-bold`}>
                  {selected.initials}
                </div>
                <div>
                  <h3 className="text-sm font-bold">{selected.candidate}</h3>
                  <p className="text-xs text-slate-400">{selected.role}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Score donut */}
              <div className="flex flex-col items-center py-3">
                <svg width={90} height={90} viewBox="0 0 90 90">
                  <circle cx={45} cy={45} r={38} fill="none" stroke="#e5e7eb" strokeWidth={7} />
                  <circle cx={45} cy={45} r={38} fill="none" stroke="#2563eb" strokeWidth={7} strokeLinecap="round"
                    strokeDasharray={`${(selected.aiScore / 100) * 2 * Math.PI * 38} ${2 * Math.PI * 38}`}
                    transform="rotate(-90 45 45)" />
                  <text x={45} y={49} textAnchor="middle" fontSize={20} fontWeight={800} fill="#0f172a" fontFamily="system-ui">{selected.aiScore}</text>
                </svg>
                <span className={`mt-2 text-xs font-bold px-3 py-1 rounded-full ${RECOMMENDATION_STYLES[selected.recommendation]}`}>
                  {selected.recommendation}
                </span>
              </div>

              {/* Integrity mini */}
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Integrity Summary</p>
                <div className="space-y-1.5">
                  {[
                    { label: 'Tab Switches', value: selected.tabSwitches, warn: selected.tabSwitches > 0 },
                    { label: 'Noise Flags', value: selected.noiseFlags, warn: selected.noiseFlags > 0 },
                    { label: 'Face Visibility', value: selected.faceVisibility, warn: selected.faceVisibility === 'Poor' },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">{item.label}</span>
                      <span className={`font-bold ${item.warn ? 'text-red-600' : 'text-emerald-600'}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <RiskBadge level={selected.riskLevel} />
                </div>
              </div>

              <div className="text-[10px] text-slate-400 bg-slate-50 rounded-xl p-3 border border-slate-200 leading-relaxed">
                Final hiring decision remains with the recruiter. Use integrity data as one of several factors.
              </div>
            </div>

            <div className="p-4 border-t border-slate-200">
              <button
                onClick={() => navigate(`/recruiter/ai-interviews/${selected.id}`)}
                className="w-full btn-primary text-sm py-2.5"
              >
                View Full Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
