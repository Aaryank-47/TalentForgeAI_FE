import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Bot, ChevronDown, AlertTriangle, Shield, Eye, Volume2, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { interviewApi } from '../../services/api/interview.api';
import { aiInterviewCompleted } from '../../constants/recruiter_mockData';
import { RiskBadge } from '../../components/interview/InterviewComponents';

const RECOMMENDATION_STYLES: Record<string, string> = {
  'Strong Hire': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Hire': 'bg-blue-100 text-blue-800 border-blue-200',
  'Consider': 'bg-amber-100 text-amber-800 border-amber-200',
  'Reject': 'bg-red-100 text-red-800 border-red-200',
};

export default function AIInterviewsPage() {
  const navigate = useNavigate();
  const { currentWorkspace, user } = useAuth();
  const companyId = currentWorkspace?.id || user?.companyId || user?.companies?.[0]?.companyId;

  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('All');
  const [filterRec, setFilterRec] = useState('All');

  // Query live completed AI interviews from DB
  const { data: apiData, isLoading } = useQuery({
    queryKey: ['recruiter-ai-interviews', companyId, search],
    queryFn: async () => {
      if (!companyId) return null;
      try {
        const res: any = await interviewApi.getCompanyAIInterviews(companyId, { search: search || undefined });
        return res?.data || res;
      } catch {
        return null;
      }
    },
    enabled: Boolean(companyId),
  });

  const rawList: any[] = Array.isArray(apiData) && apiData.length > 0 ? apiData : aiInterviewCompleted;

  const [selected, setSelected] = useState<any>(rawList[0] || null);

  useEffect(() => {
    if (rawList.length > 0 && (!selected || !rawList.find((x: any) => x.id === selected.id))) {
      setSelected(rawList[0]);
    }
  }, [apiData]);

  const filtered = rawList.filter((iv: any) => {
    const candidateName = iv.candidate || '';
    const roleName = iv.role || '';
    const matchSearch =
      candidateName.toLowerCase().includes(search.toLowerCase()) ||
      roleName.toLowerCase().includes(search.toLowerCase());
    const matchRisk = filterRisk === 'All' || iv.riskLevel === filterRisk;
    const matchRec = filterRec === 'All' || iv.recommendation === filterRec;
    return matchSearch && matchRisk && matchRec;
  });

  const totalCount = rawList.length;
  const avgScore = totalCount > 0
    ? Math.round(rawList.reduce((acc: number, item: any) => acc + (Number(item.aiScore) || 0), 0) / totalCount)
    : 0;

  return (
    <div className="h-[calc(100vh-8.5rem)] min-h-[580px] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            AI Interviews
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Review completed AI interviews, candidate scores, integrity telemetry, and reports.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-100/80 border border-slate-200/60 rounded-xl px-3 py-1.5 shadow-sm">
            <span className="text-xs text-slate-500 font-medium">Total Interviews:</span>
            <span className="text-sm font-bold text-slate-900">{totalCount}</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 rounded-xl px-3 py-1.5 shadow-sm">
            <span className="text-xs text-emerald-700 font-medium">Avg Score:</span>
            <span className="text-sm font-bold text-emerald-800">
              {avgScore} / 100
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Workspace with Dedicated Section Scrolling */}
      <div className="flex-1 min-h-0 flex gap-5">
        {/* Table Section */}
        <div className="flex-1 min-w-0 card overflow-hidden flex flex-col h-full border border-slate-200/80 shadow-sm bg-white">
          {/* Section Filter Bar (Pinned at top of section) */}
          <div className="p-3.5 border-b border-slate-200 bg-white flex items-center justify-between gap-3 flex-wrap flex-shrink-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search candidates, roles…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 w-52 transition-all"
                />
              </div>
              {['Risk Level', 'Recommendation'].map((label, i) => (
                <div key={label} className="relative">
                  <select
                    className="appearance-none pl-3 pr-7 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50/80 text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium cursor-pointer"
                    value={i === 0 ? filterRisk : filterRec}
                    onChange={e => i === 0 ? setFilterRisk(e.target.value) : setFilterRec(e.target.value)}
                  >
                    <option value="All">All {label}s</option>
                    {i === 0
                      ? ['Low', 'Medium', 'High'].map(v => <option key={v} value={v}>{v} Risk</option>)
                      : ['Strong Hire', 'Hire', 'Consider', 'Reject'].map(v => <option key={v} value={v}>{v}</option>)
                    }
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
              ))}
            </div>

            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              Showing {filtered.length} of {totalCount}
            </span>
          </div>

          {/* Section Scroller (Internal scroll container) */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto divide-y divide-slate-100 bg-white">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-slate-400">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-2" />
                <p className="text-xs">Loading AI evaluations...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-slate-400">
                <Bot className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium text-slate-700">No completed AI interviews found</p>
                <p className="text-xs text-slate-400 mt-1">Assign candidates to AI Interviews to generate real evaluations.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/95 backdrop-blur sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    {['Candidate', 'Role', 'Date', 'AI Score', 'Recommendation', 'Tab Switches', 'Noise Flags', 'Risk', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filtered.map((iv: any) => (
                    <tr
                      key={iv.id}
                      onClick={() => setSelected(iv)}
                      className={`hover:bg-slate-50/90 transition-all cursor-pointer group ${selected?.id === iv.id ? 'bg-primary-50/40 border-l-2 border-l-primary-600' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${iv.color || 'from-violet-500 to-violet-700'} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-xs`}>
                            {iv.initials || 'CD'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{iv.candidate}</p>
                            {iv.email && <p className="text-[10px] text-slate-400 truncate">{iv.email}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 max-w-[160px] truncate">{iv.role}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{iv.date}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className="h-1.5 rounded-full bg-primary-600 animate-score-fill" style={{ width: `${Math.min(100, Math.max(0, iv.aiScore))}%` }} />
                          </div>
                          <span className="text-xs font-bold text-slate-800">{iv.aiScore}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${RECOMMENDATION_STYLES[iv.recommendation] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          {iv.recommendation}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`flex items-center gap-1.5 text-xs font-semibold ${iv.tabSwitches > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {iv.tabSwitches > 0 ? <AlertTriangle className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                          {iv.tabSwitches}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`flex items-center gap-1.5 text-xs font-semibold ${iv.noiseFlags > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          <Volume2 className="w-3.5 h-3.5" />
                          {iv.noiseFlags}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <RiskBadge level={iv.riskLevel || 'Low'} />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/recruiter/ai-interviews/${iv.id || iv.sessionId}`); }}
                          className="text-xs btn-primary py-1 px-2.5 flex items-center gap-1 shadow-xs hover:shadow"
                        >
                          <Eye className="w-3 h-3" />
                          Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Preview Panel (With dedicated section scroller) */}
        {selected && (
          <div className="w-80 flex-shrink-0 card overflow-hidden flex flex-col h-full border border-slate-200/80 shadow-sm bg-white">
            <div className="p-3.5 border-b border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${selected.color || 'from-violet-500 to-violet-700'} flex items-center justify-center text-xs font-bold ring-2 ring-white/20 flex-shrink-0`}>
                  {selected.initials || 'CD'}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold truncate text-white">{selected.candidate}</h3>
                  <p className="text-[11px] text-slate-300 truncate">{selected.role}</p>
                </div>
              </div>
            </div>

            {/* Scrollable Preview Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
              {/* Score donut */}
              <div className="flex flex-col items-center py-2 bg-slate-50 rounded-xl border border-slate-100">
                <svg width={84} height={84} viewBox="0 0 90 90">
                  <circle cx={45} cy={45} r={38} fill="none" stroke="#e2e8f0" strokeWidth={7} />
                  <circle cx={45} cy={45} r={38} fill="none" stroke="#2563eb" strokeWidth={7} strokeLinecap="round"
                    strokeDasharray={`${(selected.aiScore / 100) * 2 * Math.PI * 38} ${2 * Math.PI * 38}`}
                    transform="rotate(-90 45 45)" />
                  <text x={45} y={49} textAnchor="middle" fontSize={20} fontWeight={800} fill="#0f172a" fontFamily="system-ui">{selected.aiScore}</text>
                </svg>
                <span className={`mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${RECOMMENDATION_STYLES[selected.recommendation] || 'bg-slate-100 text-slate-700'}`}>
                  {selected.recommendation}
                </span>
              </div>

              {/* Integrity mini */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Integrity Telemetry</p>
                <div className="space-y-1.5 bg-slate-50/60 p-2.5 rounded-lg border border-slate-200/60">
                  {[
                    { label: 'Tab Switches', value: selected.tabSwitches ?? 0, warn: (selected.tabSwitches ?? 0) > 0 },
                    { label: 'Noise Flags', value: selected.noiseFlags ?? 0, warn: (selected.noiseFlags ?? 0) > 0 },
                    { label: 'Face Visibility', value: selected.faceVisibility || 'Good', warn: selected.faceVisibility === 'Poor' },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">{item.label}</span>
                      <span className={`font-bold ${item.warn ? 'text-red-600' : 'text-emerald-600'}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <RiskBadge level={selected.riskLevel || 'Low'} />
                </div>
              </div>

              {/* Feedback Summary Snippet */}
              {selected.feedbackSummary && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Evaluation Snippet</p>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 leading-relaxed line-clamp-3">
                    {selected.feedbackSummary}
                  </p>
                </div>
              )}

              <div className="text-[10px] text-slate-400 bg-slate-50/80 rounded-lg p-2.5 border border-slate-200/60 leading-relaxed">
                Final hiring decision remains with the recruiter. Use integrity data as one of several factors.
              </div>
            </div>

            {/* Pinned Action Button */}
            <div className="p-3 border-t border-slate-200 bg-white flex-shrink-0">
              <button
                onClick={() => navigate(`/recruiter/ai-interviews/${selected.id || selected.sessionId}`)}
                className="w-full btn-primary text-xs py-2 font-semibold shadow-xs"
              >
                View Full Detailed Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
