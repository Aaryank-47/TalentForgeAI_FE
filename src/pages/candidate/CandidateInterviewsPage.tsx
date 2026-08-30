import React, { useState } from 'react';
import { Calendar, CheckCircle, X, ChevronRight, Mic, Camera, Wifi, Home, Play, Star, MoreVertical, TrendingUp, Bot, CheckCircle2, MessageSquare, MapPin, Globe, Clock, FileText, Brain, Pin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { interviewsData } from '../../constants/candidate_mockData';

type SelectedInterview = typeof interviewsData.upcoming[0] | null;

// Countdown timer display
const CountdownTimer = ({ hrs, mins, secs }: { hrs: number; mins: number; secs: number }) => (
  <div className="flex items-center gap-2 justify-center my-3">
    {[
      { val: String(hrs).padStart(2, '0'), label: 'HRS' },
      { val: String(mins).padStart(2, '0'), label: 'MINS' },
      { val: String(secs).padStart(2, '0'), label: 'SECS' },
    ].map((t, i) => (
      <React.Fragment key={t.label}>
        <div className="text-center">
          <div className="bg-slate-900 text-white font-display font-bold text-xl px-3 py-2 rounded-xl min-w-[52px]">{t.val}</div>
          <p className="text-[9px] text-slate-400 mt-1">{t.label}</p>
        </div>
        {i < 2 && <span className="text-slate-400 font-bold text-xl mb-3">:</span>}
      </React.Fragment>
    ))}
  </div>
);

// Score ring
const ScoreRing = ({ score }: { score: number }) => {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const stroke = (score / 100) * circ;
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} fill="none" stroke="#E5E7EB" strokeWidth="4" />
        <circle
          cx="24" cy="24" r={r} fill="none"
          stroke="#059669" strokeWidth="4"
          strokeDasharray={`${stroke} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute font-display font-bold text-xs text-slate-900">{score}</span>
    </div>
  );
};

const CandidateInterviewsPage = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Upcoming' | 'Completed' | 'AI Interviews'>('All');
  const [selectedUpcoming, setSelectedUpcoming] = useState<SelectedInterview>(interviewsData.upcoming[0] || null);
  const [detailTab, setDetailTab] = useState<'Overview' | 'Instructions & Prep' | 'About the Role' | 'Company'>('Overview');
  const navigate = useNavigate();

  const stats = interviewsData.stats;

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-[#E5E7EB] flex-shrink-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-[#0F172A]">My Interviews</h1>
            <p className="text-sm text-[#64748B] mt-0.5">Manage your upcoming rounds, live interviews, and view performance feedback.</p>
          </div>
          <button
            onClick={() => navigate('/candidate/ai-interview')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
          >
            <Bot className="w-4 h-4" />
            AI Interview Portal
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[
            { label: 'Upcoming', value: stats.upcoming, change: '+20% this month', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Completed', value: stats.completed, change: '+50% this month', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'AI Interviews', value: stats.aiInterviews, change: '+33% this month', icon: Bot, color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: 'Feedback Received', value: stats.feedbackReceived, change: '+40% this month', icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-transparent`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-2xs ${s.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className={`text-3xl font-display font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-600 font-medium">{s.label}</p>
                <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />{s.change}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 border-r border-[#E5E7EB] space-y-6">
          {/* Scheduled Interviews */}
          <div>
            <h2 className="font-display font-bold text-[#0F172A] text-base mb-4">Scheduled Interviews</h2>
            <div className="card overflow-hidden divide-y divide-[#E5E7EB]">
              {interviewsData.upcoming.map((iv) => (
                <div
                  key={iv.id}
                  onClick={() => { setSelectedUpcoming(iv); setDetailTab('Overview'); }}
                  className={`px-5 py-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors ${selectedUpcoming?.id === iv.id ? 'bg-primary-50/40' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl ${iv.companyColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {iv.companyLogo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900">{iv.jobTitle}</p>
                    <p className="text-xs text-slate-500">{iv.company}</p>
                  </div>
                  <div className="text-center hidden md:block">
                    <p className="text-xs font-bold text-primary-600">{iv.dateLabel}</p>
                    <p className="text-[10px] text-slate-400">{iv.date}</p>
                  </div>
                  <div className="text-center hidden md:block">
                    <p className="text-xs font-semibold text-slate-700">{iv.timeStart} – {iv.timeEnd}</p>
                    <p className="text-[10px] text-slate-400">({iv.duration})</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${iv.typeColor}`}>{iv.type}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/candidate/interviews/${iv.id === 'iv_1' ? 'sess-1' : iv.id}/room`); }}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs rounded-xl transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    Join Interview
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button className="mt-3 text-xs text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1">
              View All Scheduled Interviews <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Completed Interviews */}
          <div>
            <h2 className="font-display font-bold text-[#0F172A] text-base mb-4">Completed Interviews</h2>
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-[#E5E7EB]">
                  <tr>
                    {['Role', 'Company', 'Type', 'Completed On', 'AI Score', 'Feedback', 'Action'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {interviewsData.completed.map(iv => (
                    <tr key={iv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl ${iv.companyColor} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                            {iv.companyLogo}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{iv.jobTitle}</p>
                            <p className="text-[10px] text-slate-400">{iv.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-xs text-slate-700 font-medium">{iv.company}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${iv.typeColor}`}>{iv.type}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-xs text-slate-700">{iv.date}</p>
                        <p className="text-[10px] text-slate-400">{iv.time}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        {iv.aiScore ? <ScoreRing score={iv.aiScore} /> : <span className="text-xs text-slate-400">—</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        {iv.hasFeedback ? (
                          <span className="text-[10px] text-emerald-600 font-semibold">Feedback received</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">No feedback</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <button className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                          {iv.hasFeedback ? 'View Feedback' : 'View Summary'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-3 border-t border-[#E5E7EB] bg-slate-50">
                <button className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                  View All Completed Interviews <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Detail Panel */}
        {selectedUpcoming && (
          <div className="w-80 flex-shrink-0 flex flex-col overflow-hidden bg-white">
            {/* Panel header */}
            <div className="px-5 py-4 border-b border-[#E5E7EB] flex-shrink-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl ${selectedUpcoming.companyColor} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                    {selectedUpcoming.companyLogo}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">{selectedUpcoming.jobTitle}</h3>
                    <p className="text-xs text-slate-500">{selectedUpcoming.company}</p>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-slate-400" />{selectedUpcoming.location}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5"><Globe className="w-3 h-3 text-slate-400" />{selectedUpcoming.workType}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedUpcoming(null)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedUpcoming.typeColor}`}>{selectedUpcoming.type}</span>
                <span className="text-[10px] text-slate-400">Interview ID: {selectedUpcoming.interviewId}</span>
              </div>

              {/* Time & Join */}
              <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-[#E5E7EB]">
                <p className="text-[10px] text-slate-400 mb-0.5">Your interview is</p>
                <p className="text-sm font-bold text-slate-900">{selectedUpcoming.dateLabel} at {selectedUpcoming.timeStart}</p>
                <CountdownTimer hrs={selectedUpcoming.countdownHrs} mins={selectedUpcoming.countdownMins} secs={selectedUpcoming.countdownSecs} />
                <button
                  onClick={() => navigate(`/candidate/interviews/${selectedUpcoming.id === 'iv_1' ? 'sess-1' : selectedUpcoming.id}/room`)}
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Join Interview Room
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-1.5">Please join 5 minutes before the scheduled time.</p>
              </div>
            </div>

            {/* Panel Tabs */}
            <div className="flex border-b border-[#E5E7EB] bg-slate-50 flex-shrink-0">
              {(['Overview', 'Instructions & Prep', 'About the Role', 'Company'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setDetailTab(t)}
                  className={`flex-1 py-2.5 text-[11px] font-semibold border-b-2 transition-colors ${
                    detailTab === t ? 'border-primary-600 text-primary-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-600">
              {detailTab === 'Overview' && (
                <>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900">Interview Format</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{selectedUpcoming.format}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900">Preparation Center</h4>
                    <p className="text-xs text-slate-500">Practice questions and system check before your interview.</p>
                    <div className="p-3 bg-primary-50 rounded-xl border border-primary-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-primary-900">Mock AI Interview</p>
                        <p className="text-[10px] text-primary-600">Practice speaking with the AI</p>
                      </div>
                      <button
                        onClick={() => navigate('/candidate/ai-interview')}
                        className="px-3 py-1.5 bg-primary-600 text-white font-semibold text-xs rounded-lg hover:bg-primary-700"
                      >
                        Launch
                      </button>
                    </div>
                  </div>
                </>
              )}

              {detailTab === 'Instructions & Prep' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900">Instructions & Preparation</h4>
                  {selectedUpcoming.instructions.map((inst, i) => {
                    const InstIcon = [Mic, Clock, FileText, Brain][i] || Pin;
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                        <div className="w-7 h-7 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                          <InstIcon className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{inst.text}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {detailTab === 'About the Role' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-2">About the Role</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{selectedUpcoming.aboutRole || 'No description available.'}</p>
                    {selectedUpcoming.skillsNeeded.length > 0 && (
                      <>
                        <h4 className="text-xs font-bold text-slate-900 mt-4 mb-2">Skills You'll Need</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedUpcoming.skillsNeeded.map(s => (
                            <span key={s} className="text-[10px] bg-primary-50 text-primary-700 border border-primary-100 px-2.5 py-1 rounded-full font-semibold">{s}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <button className="text-xs text-primary-600 font-semibold flex items-center gap-1">
                    View Full Job Description <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {detailTab === 'Company' && (
                <div>
                  <div className={`w-10 h-10 rounded-xl ${selectedUpcoming.companyColor} flex items-center justify-center text-white font-bold mb-3`}>
                    {selectedUpcoming.companyLogo}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{selectedUpcoming.company}</h4>
                  <p className="text-xs text-slate-500 mb-3">{selectedUpcoming.location}</p>
                  <button className="text-xs text-primary-600 font-semibold flex items-center gap-1">
                    View Company Profile <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateInterviewsPage;
