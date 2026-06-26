import { useNavigate, useParams } from 'react-router-dom';
import { Clock, Home, Bot, ArrowUpRight } from 'lucide-react';
import { aiInterviewData } from '../../constants/candidate_mockData';
import { TimelineCard, InterviewStatusBadge } from '../../components/interview/InterviewComponents';

export default function InterviewStatusPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { submission, statusTimeline, pendingInterviews } = aiInterviewData;
  const pending = pendingInterviews.find(iv => iv.id === id) || pendingInterviews[0];

  const activeStep = statusTimeline.find(s => s.status === 'active');
  const doneCount = statusTimeline.filter(s => s.status === 'done').length;
  const progressPct = Math.round((doneCount / statusTimeline.length) * 100);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary-600" />
          Interview Status
        </h1>
        <p className="text-sm text-slate-500 mt-1">Track the progress of your submitted interview.</p>
      </div>

      {/* Summary Card */}
      <div className="card p-5">
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-14 h-14 ${pending?.companyColor || 'bg-blue-600'} rounded-2xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0`}>
            {pending?.companyLogo || 'G'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900">{submission.role}</h3>
            <p className="text-sm text-slate-500">{submission.company}</p>
            <p className="text-xs text-slate-400 mt-0.5">Submitted {submission.submittedAt}</p>
          </div>
          <InterviewStatusBadge status={submission.status} />
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 font-medium">Evaluation Progress</span>
            <span className="text-xs font-bold text-primary-600">{progressPct}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Expected completion */}
        {activeStep && (
          <div className="mt-4 flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-xl p-3">
            <div className="flex gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ai-dot" />
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ai-dot-2" />
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ai-dot-3" />
            </div>
            <p className="text-xs text-violet-700 font-medium">
              Currently: <strong>{activeStep.label}</strong> — {activeStep.detail}
            </p>
          </div>
        )}

        <div className="mt-3 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
          <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <p className="text-xs text-slate-600">
            Expected completion: <strong>{submission.expectedCompletion}</strong>
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="card p-5">
        <h3 className="font-bold text-slate-900 mb-5">Interview Timeline</h3>
        <div>
          {statusTimeline.map((step, i) => (
            <TimelineCard
              key={step.id}
              label={step.label}
              detail={step.detail}
              status={step.status as 'done' | 'active' | 'pending'}
              icon={step.icon}
              isLast={i === statusTimeline.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Confirmation */}
      <div className="card p-4 bg-slate-50">
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-2">Confirmation Code</p>
        <p className="text-sm font-bold text-slate-800 font-mono">{submission.confirmationCode}</p>
        <p className="text-xs text-slate-400 mt-1">Save this code for your records.</p>
      </div>

      {/* Notification note */}
      <div className="card p-4 border-blue-200 bg-blue-50 flex items-start gap-3">
        <span className="text-xl flex-shrink-0">📧</span>
        <div>
          <p className="text-sm font-bold text-blue-800">Email Notification Enabled</p>
          <p className="text-xs text-blue-600 mt-0.5">
            You will receive an email at <strong>aaryan.singh@email.com</strong> when the recruiter has reviewed your interview and made a decision.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/candidate/ai-interview')}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <Home className="w-4 h-4" /> Dashboard
        </button>
        <button
          onClick={() => navigate('/candidate/interviews')}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          All Interviews <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
