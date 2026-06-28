import React, { useState } from 'react';
import { Calendar, CheckCircle, X, ChevronRight, Mic, Camera, Wifi, Home, Play, Star, MoreVertical, TrendingUp } from 'lucide-react';
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
  const filled = (score / 100) * circ;
  const color = score >= 80 ? '#22C55E' : score >= 65 ? '#3B82F6' : '#F59E0B';
  return (
    <div className="relative w-12 h-12">
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} fill="none" stroke="#E5E7EB" strokeWidth="4" />
        <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`} transform="rotate(-90 24 24)" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-bold text-slate-900">{score}%</span>
      </div>
    </div>
  );
};

const CandidateInterviewsPage = () => {
  const [selectedUpcoming, setSelectedUpcoming] = useState<typeof interviewsData.upcoming[0] | null>(interviewsData.upcoming[0]);
  const [detailTab, setDetailTab] = useState<'Overview' | 'Instructions & Prep' | 'About the Role' | 'Company'>('Overview');
  const stats = interviewsData.stats;
  const navigate = useNavigate();

  return (
    <div className="-m-6 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-[#0F172A]">Interviews</h1>
            <p className="text-sm text-slate-500 mt-0.5">Track your scheduled, upcoming and completed interviews.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-sm text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            <Calendar className="w-4 h-4" />
            Calendar View
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[
            { label: 'Upcoming', value: stats.upcoming, change: '+20% this month', icon: '📅', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Completed', value: stats.completed, change: '+50% this month', icon: '✅', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'AI Interviews', value: stats.aiInterviews, change: '+33% this month', icon: '🤖', color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: 'Feedback Received', value: stats.feedbackReceived, change: '+40% this month', icon: '💬', color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-transparent`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{s.icon}</span>
              </div>
              <p className={`text-3xl font-display font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-600 font-medium">{s.label}</p>
              <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />{s.change}
              </p>
            </div>
          ))}
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
                    onClick={(e) => { e.stopPropagation(); navigate('/candidate/live-interviews/liv_001/room'); }}
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
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      📍 {selectedUpcoming.location} · 🌐 {selectedUpcoming.workType}
                    </p>
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
                  onClick={() => navigate('/candidate/live-interviews/liv_001/room')}
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Join Interview Room
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-1.5">Please join 5 minutes before the scheduled time.</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#E5E7EB] flex-shrink-0 overflow-x-auto">
              {(['Overview', 'Instructions & Prep', 'About the Role', 'Company'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setDetailTab(t)}
                  className={`px-3 py-2.5 text-[11px] font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    detailTab === t ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {detailTab === 'Overview' && (
                <>
                  {/* Prep Checklist */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-3">Interview Preparation</h4>
                    <div className="space-y-2">
                      {[
                        { icon: Mic, label: 'Microphone Check', ok: true },
                        { icon: Camera, label: 'Camera Check', ok: true },
                        { icon: Wifi, label: 'Internet Check', ok: true },
                        { icon: Home, label: 'Environment Check', ok: false },
                      ].map((c, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50">
                          <c.icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="text-xs font-medium text-slate-700 flex-1">{c.label}</span>
                          <span className={c.ok ? 'text-emerald-500' : 'text-amber-500'}>
                            {c.ok ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-amber-400" />}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button className="mt-3 w-full flex items-center justify-center gap-2 py-2 border border-primary-200 text-primary-700 text-xs font-semibold rounded-xl hover:bg-primary-50 transition-colors">
                      Practice Now
                    </button>
                  </div>
                </>
              )}

              {detailTab === 'Instructions & Prep' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900">Instructions & Preparation</h4>
                  {selectedUpcoming.instructions.map((inst, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                      <span className="text-primary-500 text-lg flex-shrink-0">
                        {['🎙', '⏱', '📝', '🧠'][i] || '📌'}
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">{inst.text}</p>
                    </div>
                  ))}
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
