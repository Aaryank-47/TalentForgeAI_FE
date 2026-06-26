import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Clock, AlertCircle, ChevronRight, ArrowUpRight, CheckCircle, Calendar, Zap } from 'lucide-react';
import { aiInterviewData } from '../../constants/candidate_mockData';
import { InterviewStatusBadge } from '../../components/interview/InterviewComponents';

const urgencyColor = (u: string) => ({
  urgent: 'text-red-600 bg-red-50 border-red-200',
  moderate: 'text-amber-600 bg-amber-50 border-amber-200',
  normal: 'text-emerald-600 bg-emerald-50 border-emerald-200',
})[u] || 'text-slate-600 bg-slate-50 border-slate-200';

export default function CandidateAIInterviewPage() {
  const navigate = useNavigate();
  const { pendingInterviews, pastInterviews } = aiInterviewData;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            AI Interviews
          </h1>
          <p className="text-sm text-slate-500 mt-1">Complete your assigned AI interviews before the deadline.</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 p-5 text-white relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-20 bottom-0 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">How AI Interviews Work</h2>
            <p className="text-blue-100 text-sm mt-1">
              Our AI interviewer asks you one question at a time. Respond verbally — no typing required.
              Each answer allows 2–3 minutes. Responses are recorded, transcribed, and evaluated.
            </p>
            <div className="flex flex-wrap gap-3 mt-3">
              {['Conversational Format', 'Auto-recorded', 'AI Evaluated', 'Results in 24h'].map(tag => (
                <span key={tag} className="text-xs bg-white/15 text-white px-2.5 py-1 rounded-full font-medium border border-white/20">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Interviews */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Pending Interviews
          </h2>
          <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-bold border border-amber-200">
            {pendingInterviews.length} pending
          </span>
        </div>
        <div className="space-y-4">
          {pendingInterviews.map(iv => (
            <div key={iv.id} className="card p-5 hover:shadow-md transition-all hover:border-primary-200">
              <div className="flex items-start gap-4">
                {/* Company Logo */}
                <div className={`w-14 h-14 ${iv.companyColor} rounded-2xl flex items-center justify-center text-white font-black text-xl flex-shrink-0`}>
                  {iv.companyLogo}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="font-bold text-slate-900">{iv.role}</h3>
                      <p className="text-sm text-slate-500">{iv.company}</p>
                    </div>
                    <div className={`text-xs font-bold px-3 py-1 rounded-full border ${urgencyColor(iv.deadlineUrgency)}`}>
                      Due {iv.deadline}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-3">
                    {[
                      { icon: <Clock className="w-3.5 h-3.5" />, label: iv.estimatedDuration },
                      { icon: <Zap className="w-3.5 h-3.5" />, label: `${iv.questionCount} Questions` },
                      { icon: <Bot className="w-3.5 h-3.5" />, label: iv.interviewType },
                      { icon: <Calendar className="w-3.5 h-3.5" />, label: `Assigned ${iv.assignedDate}` },
                    ].map(item => (
                      <span key={item.label} className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                        <span className="text-slate-400">{item.icon}</span>
                        {item.label}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-slate-400">
                      Attempt {iv.attemptsUsed + 1} of {iv.attemptsAllowed}
                    </p>
                    <button
                      onClick={() => navigate(`/candidate/ai-interview/${iv.id}/details`)}
                      className="btn-primary text-sm flex items-center gap-2"
                    >
                      Start Interview
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Interviews */}
      {pastInterviews.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Submitted Interviews
            </h2>
          </div>
          <div className="space-y-3">
            {pastInterviews.map(iv => (
              <div key={iv.id} className="card p-4 flex items-center gap-4">
                <div className={`w-11 h-11 ${iv.companyColor} rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0`}>
                  {iv.companyLogo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900">{iv.role}</p>
                  <p className="text-xs text-slate-500">{iv.company} · Submitted {iv.submittedDate}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-lg font-black text-primary-600">{iv.aiScore}</p>
                    <p className="text-[10px] text-slate-400">AI Score</p>
                  </div>
                  <InterviewStatusBadge status={iv.status} />
                  <Link
                    to={`/candidate/ai-interview/${iv.id}/status`}
                    className="text-xs btn-secondary py-1.5 px-3 flex items-center gap-1"
                  >
                    View Status <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
