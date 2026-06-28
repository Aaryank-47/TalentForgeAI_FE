import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight, MoreVertical, Play, TrendingUp, Star } from 'lucide-react';
import { assessmentsData } from '../../constants/candidate_mockData';

type Tab = 'Pending' | 'Completed' | 'All Assessments';

const AssessmentsPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('Pending');
  const perf = assessmentsData.performance;

  const tabCounts = {
    Pending: assessmentsData.pending.length,
    Completed: assessmentsData.completed.length,
    'All Assessments': assessmentsData.pending.length + assessmentsData.completed.length,
  };

  const scoreColor = (score: number) =>
    score >= 85 ? 'text-emerald-600' : score >= 70 ? 'text-blue-600' : 'text-amber-600';

  const scoreBarColor = (score: number) =>
    score >= 85 ? 'bg-emerald-500' : score >= 70 ? 'bg-blue-500' : 'bg-amber-500';

  return (
    <div className="space-y-0 -m-6 flex h-screen overflow-hidden">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-[#E5E7EB]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] bg-white flex-shrink-0">
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Assessments</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track your assessments, test your skills and stand out to employers.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E5E7EB] bg-white flex-shrink-0 px-6">
          {(['Pending', 'Completed', 'All Assessments'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                tab === t ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tab === t ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'}`}>
                {tabCounts[t]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Pending Assessments */}
          {(tab === 'Pending' || tab === 'All Assessments') && (
            <div className="mb-6">
              {tab === 'All Assessments' && <h2 className="text-sm font-bold text-slate-900 mb-4">Pending Assessments</h2>}
              <div className="space-y-3">
                {assessmentsData.pending.map((a) => (
                  <div key={a.id} className="card p-5 hover:border-primary-200 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 ${a.companyColor} rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0`}>
                          {a.companyLogo}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{a.name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{a.company}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {a.tags.map(tag => (
                              <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 flex-shrink-0">
                        <div className="text-center">
                          <p className={`text-xs font-bold ${a.dueUrgency === 'urgent' ? 'text-red-600' : a.dueUrgency === 'moderate' ? 'text-amber-600' : 'text-slate-600'}`}>
                            Due in<br /><span className="text-base">{a.dueDays} days</span>
                          </p>
                        </div>
                        <div className="text-center">
                          <Clock className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                          <p className="text-[10px] text-slate-500">{a.duration} min</p>
                          <p className="text-[10px] text-slate-400">Duration</p>
                        </div>
                        <button onClick={() => navigate(`/candidate/assessments/${a.id}/preparation`)} className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition-colors whitespace-nowrap">
                          <Play className="w-4 h-4 fill-white" />
                          Start Assessment
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {tab === 'Pending' && (
                <button className="mt-4 text-xs text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1">
                  View All Pending Assessments <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Completed Assessments */}
          {(tab === 'Completed' || tab === 'All Assessments') && (
            <div>
              {tab === 'All Assessments' && <h2 className="text-sm font-bold text-slate-900 mb-4">Completed Assessments</h2>}
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-[#E5E7EB]">
                    <tr>
                      {['Assessment', 'Company', 'Completed On', 'Score', 'Status', 'Action'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {assessmentsData.completed.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 ${a.companyColor} rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                              {a.companyLogo}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">{a.name}</p>
                              <p className="text-[10px] text-slate-400">{a.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-xs text-slate-700 font-medium">{a.company}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-xs text-slate-700">{a.completedOn}</p>
                          <p className="text-[10px] text-slate-400">{a.completedTime}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-200 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${scoreBarColor(a.score)}`} style={{ width: `${a.score}%` }} />
                            </div>
                            <span className={`text-xs font-bold ${scoreColor(a.score)}`}>{a.score}%</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">({a.scoreLabel})</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-[10px] font-bold ${a.statusColor}`}>{a.status}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <button className="text-xs font-semibold text-primary-600 hover:text-primary-700">View Result</button>
                            <button className="p-1 text-slate-300 hover:text-slate-500 rounded transition-colors">
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-3 border-t border-[#E5E7EB] bg-slate-50">
                  <button className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                    View All Completed Assessments <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Performance Panel */}
      <div className="w-72 flex-shrink-0 overflow-y-auto p-5 space-y-6 bg-white">
        {/* How Assessments Work */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3">How Assessments Work</h3>
          <div className="space-y-3">
            {[
              { step: '1', icon: '📨', title: 'Accept Invitation', desc: "You'll receive an assessment invitation from the company." },
              { step: '2', icon: '📝', title: 'Take Assessment', desc: 'Complete the test within the given time limit. Stay focused!' },
              { step: '3', icon: '📊', title: 'Get Results', desc: 'Results are shared with the company. Some scores may be visible to you.' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-[#E5E7EB]">
                <span className="text-2xl flex-shrink-0">{s.icon}</span>
                <div>
                  <p className="text-xs font-bold text-slate-900">{s.title}</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">Performance Summary</h3>
            <select className="text-[10px] border border-[#E5E7EB] rounded-lg px-2 py-1 text-slate-500 focus:outline-none">
              <option>This Month</option>
            </select>
          </div>

          {/* Score Ring */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-24 h-24">
              <svg width="96" height="96" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="38" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                <circle
                  cx="48" cy="48" r="38" fill="none"
                  stroke="#2563EB" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(perf.avgScore / 100) * 238.76} 238.76`}
                  transform="rotate(-90 48 48)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-lg font-display font-bold text-slate-900">{perf.avgScore}%</p>
                <p className="text-[9px] text-slate-400">Avg. Score</p>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {[
                { label: 'Assessments Taken', value: perf.totalTaken },
                { label: 'Average Score', value: `${perf.avgScore}%` },
                { label: 'Best Score', value: `${perf.bestScore}%` },
                { label: 'Total Time Taken', value: perf.totalTime },
              ].map(m => (
                <div key={m.label} className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">{m.label}</span>
                  <span className="font-bold text-slate-900">{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Strength Areas */}
          <div className="mb-3">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Strength Areas</p>
            <div className="flex flex-wrap gap-1.5">
              {perf.strengthAreas.map(s => (
                <span key={s} className="text-[10px] bg-primary-50 text-primary-700 border border-primary-100 px-2.5 py-1 rounded-full font-semibold">{s}</span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Improve Areas</p>
            <div className="flex flex-wrap gap-1.5">
              {perf.improveAreas.map(s => (
                <span key={s} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-full font-semibold">{s}</span>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Tips to Improve Your Score</p>
            <div className="space-y-1.5">
              {[
                'Read questions carefully before answering.',
                "Manage your time and don't get stuck.",
                'Practice regularly to build confidence.',
                'Review your performance and learn.',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-[10px] text-slate-600">
                  <div className="w-4 h-4 bg-primary-100 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-600 font-bold">{i + 1}</span>
                  </div>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentsPage;
