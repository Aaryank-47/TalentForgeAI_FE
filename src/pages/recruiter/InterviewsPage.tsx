import React, { useState } from 'react';
import {
  Video, Calendar, Clock, Search, Filter, ChevronDown, MoreHorizontal,
  Play, RefreshCw, X, Mic, Brain, MessageSquare, Code, AlertCircle,
  CheckCircle, XCircle, Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Tab = 'All' | 'Upcoming' | 'Completed' | 'Cancelled';

import {
  interviewsList as interviews,
  interviewAiScores as aiScores,
} from '../../constants/recruiter_mockData';


const typeColor = (t: string) => ({
  'AI Interview': 'bg-violet-50 text-violet-700 border-violet-200',
  'Technical': 'bg-blue-50 text-blue-700 border-blue-200',
  'HR Round': 'bg-pink-50 text-pink-700 border-pink-200',
  'Final Round': 'bg-emerald-50 text-emerald-700 border-emerald-200',
})[t] || 'bg-slate-100 text-slate-600 border-slate-200';

const statusStyle = (s: string) => ({
  Upcoming: 'bg-amber-50 text-amber-700 border-amber-200',
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
})[s] || 'bg-slate-100 text-slate-600 border-slate-200';

const InterviewsPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [selectedInterview, setSelectedInterview] = useState(interviews[4]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = interviews.filter(iv => {
    const matchTab = activeTab === 'All' || iv.status === activeTab;
    const matchSearch = iv.candidate.toLowerCase().includes(search.toLowerCase()) || iv.job.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts: Record<Tab, number> = {
    All: interviews.length,
    Upcoming: interviews.filter(i => i.status === 'Upcoming').length,
    Completed: interviews.filter(i => i.status === 'Completed').length,
    Cancelled: interviews.filter(i => i.status === 'Cancelled').length,
  };


  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Interviews</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Schedule, manage and review all interview sessions.</p>
        </div>
        <button className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Schedule Interview
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E5E7EB]">
        <div className="flex items-center gap-0">
          {(['All', 'Upcoming', 'Completed', 'Cancelled'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'
              }`}>{counts[tab]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-5" style={{ minHeight: '520px' }}>
        {/* Left: Table */}
        <div className="flex-1 min-w-0 card overflow-hidden flex flex-col">
          {/* Filters */}
          <div className="p-4 border-b border-[#E5E7EB] flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search interviews..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 w-52"
              />
            </div>
            {['All Types', 'All Jobs'].map(f => (
              <div key={f} className="relative">
                <select className="appearance-none pl-3 pr-8 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>{f}</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  {['Candidate', 'Job', 'Interview Type', 'Date & Time', 'Status', 'AI Score', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filtered.map((iv) => (
                  <tr
                    key={iv.id}
                    onClick={() => setSelectedInterview(iv)}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedInterview?.id === iv.id ? 'bg-primary-50/30' : ''}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${iv.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                          {iv.initials}
                        </div>
                        <p className="text-sm font-semibold text-slate-900">{iv.candidate}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs text-slate-600 max-w-40 truncate">{iv.job}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${typeColor(iv.type)}`}>{iv.type}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{iv.date}</span>
                        <Clock className="w-3.5 h-3.5 text-slate-400 ml-1" />
                        <span>{iv.time}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${statusStyle(iv.status)}`}>{iv.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      {iv.aiScore ? (
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-slate-200 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-primary-600" style={{ width: `${iv.aiScore}%` }} />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{iv.aiScore}</span>
                        </div>
                      ) : <span className="text-xs text-slate-400">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        {iv.status === 'Upcoming' ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate('/recruiter/live-interviews/liv_001/room'); }}
                            className="text-xs btn-primary py-1 px-2.5 flex items-center gap-1"
                          >
                            <Play className="w-3 h-3" />
                            Join
                          </button>
                        ) : iv.status === 'Completed' ? (
                          <button className="text-xs btn-secondary py-1 px-2.5 flex items-center gap-1">
                            <Play className="w-3 h-3" />
                            Review
                          </button>
                        ) : null}
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Detail Panel */}
        {selectedInterview && (
          <div className="w-80 flex-shrink-0 card overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#E5E7EB] flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedInterview.color} flex items-center justify-center text-white text-sm font-bold`}>
                  {selectedInterview.initials}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedInterview.candidate}</h3>
                  <p className="text-xs text-slate-500">{selectedInterview.job}</p>
                </div>
              </div>
              <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 border-b border-[#E5E7EB] bg-slate-50 grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-3 border border-[#E5E7EB] text-center">
                <p className="text-[10px] text-slate-400">Type</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedInterview.type}</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-[#E5E7EB] text-center">
                <p className="text-[10px] text-slate-400">Status</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedInterview.status}</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-[#E5E7EB] text-center">
                <p className="text-[10px] text-slate-400">Date</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedInterview.date}</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-[#E5E7EB] text-center">
                <p className="text-[10px] text-slate-400">Time</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedInterview.time}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedInterview.aiScore && (
                <>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-3">AI Evaluation Scores</p>
                    <div className="space-y-3">
                      {[
                        { label: 'Confidence', score: aiScores.confidence, icon: <Brain className="w-3.5 h-3.5" />, color: 'bg-blue-500' },
                        { label: 'Communication', score: aiScores.communication, icon: <MessageSquare className="w-3.5 h-3.5" />, color: 'bg-emerald-500' },
                        { label: 'Technical Knowledge', score: aiScores.technical, icon: <Code className="w-3.5 h-3.5" />, color: 'bg-purple-500' },
                        { label: 'Problem Solving', score: aiScores.problemSolving, icon: <AlertCircle className="w-3.5 h-3.5" />, color: 'bg-amber-500' },
                      ].map(s => (
                        <div key={s.label}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <span className="text-slate-400">{s.icon}</span>
                              {s.label}
                            </div>
                            <span className="text-xs font-bold text-slate-900">{s.score}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${s.color}`} style={{ width: `${s.score}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Recording & Transcript</p>
                    <div className="bg-slate-800 rounded-xl h-28 flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors">
                      <div className="flex flex-col items-center gap-2 text-white">
                        <Play className="w-8 h-8" />
                        <span className="text-xs opacity-70">Play Recording</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">AI Feedback</p>
                    <div className="bg-slate-50 rounded-xl p-3 border border-[#E5E7EB] text-xs text-slate-700 leading-relaxed">
                      Strong technical foundation with good communication skills. Demonstrated solid React knowledge and problem-solving ability. Recommend advancing to technical round.
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Recruiter Notes</p>
                    <textarea className="w-full text-xs border border-[#E5E7EB] rounded-lg p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-300" rows={3} placeholder="Add notes..." />
                  </div>
                </>
              )}

              {!selectedInterview.aiScore && (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                  <Video className="w-8 h-8 mb-2 opacity-40" />
                  <p className="text-xs">Interview not completed yet</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-[#E5E7EB] space-y-2">
              {selectedInterview.status === 'Upcoming' ? (
                <>
                  <button
                    onClick={() => navigate('/recruiter/live-interviews/liv_001/room')}
                    className="w-full btn-primary text-sm py-2.5 flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Join Interview
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-2 text-xs border border-[#E5E7EB] rounded-xl text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors">
                      <RefreshCw className="w-3.5 h-3.5" />
                      Reschedule
                    </button>
                    <button className="py-2 text-xs border border-red-200 rounded-xl text-red-600 hover:bg-red-50 flex items-center justify-center gap-1.5 transition-colors">
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </div>
                </>
              ) : selectedInterview.status === 'Completed' ? (
                <button className="w-full btn-secondary text-sm py-2.5 flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  View Full Report
                </button>
              ) : (
                <button className="w-full btn-primary text-sm py-2.5 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Reschedule Interview
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewsPage;
