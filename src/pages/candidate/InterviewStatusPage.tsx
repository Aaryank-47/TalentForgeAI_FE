import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock, Home, Bot, ArrowUpRight, CheckCircle2, User, Target, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { interviewApi } from '../../services/api/interview.api';
import { TimelineCard, InterviewStatusBadge } from '../../components/interview/InterviewComponents';

export default function InterviewStatusPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch real candidate session details from backend
  const { data: realDetail, isLoading } = useQuery({
    queryKey: ['candidate-session-details', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const res: any = await interviewApi.getCandidateSessionDetails(id);
        return res?.data || res;
      } catch {
        return null;
      }
    },
    enabled: Boolean(id),
  });

  const role = realDetail?.role || realDetail?.title || 'AI Technical Interview';
  const company = realDetail?.company || 'Hiring Organization';
  const companyLogo = realDetail?.companyLogo || (company.slice(0, 2)).toUpperCase();
  const companyColor = realDetail?.companyColor || 'bg-primary-600';
  const status = realDetail?.status || 'COMPLETED';
  const confirmationCode = `TF-AI-${(id || 'SESSION').slice(-6).toUpperCase()}`;
  const submittedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  const dynamicTimeline = [
    {
      id: 'submitted',
      label: 'Interview Submitted',
      detail: submittedDate,
      status: 'done' as const,
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      id: 'ai_eval',
      label: 'AI Evaluation & Scoring',
      detail: status === 'COMPLETED' ? 'Evaluation scores and transcript generated' : 'Analyzing responses...',
      status: 'done' as const,
      icon: <Bot className="w-5 h-5" />,
    },
    {
      id: 'review',
      label: 'Recruiter Review',
      detail: 'Hiring team is reviewing your scorecard',
      status: 'active' as const,
      icon: <User className="w-5 h-5" />,
    },
    {
      id: 'decision',
      label: 'Decision Notification',
      detail: 'Will be notified via registered email',
      status: 'pending' as const,
      icon: <Target className="w-5 h-5" />,
    },
  ];

  const progressPct = 75;

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
          <div className={`w-14 h-14 ${companyColor} rounded-2xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0`}>
            {companyLogo}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-lg">{role}</h3>
            <p className="text-sm text-slate-600 font-medium">{company}</p>
            <p className="text-xs text-slate-400 mt-0.5">Submitted {submittedDate}</p>
          </div>
          <InterviewStatusBadge status="Under Review" />
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

        {/* Status notice */}
        <div className="mt-4 flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-xl p-3">
          <div className="flex gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse delay-75" />
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse delay-150" />
          </div>
          <p className="text-xs text-violet-800 font-medium">
            Currently: <strong>Recruiter Review</strong> — Hiring team is evaluating your AI scorecard and answers.
          </p>
        </div>

        <div className="mt-3 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
          <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <p className="text-xs text-slate-600">
            Expected review completion: <strong>Within 24–48 hours</strong>
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="card p-5">
        <h3 className="font-bold text-slate-900 mb-5">Interview Timeline</h3>
        <div>
          {dynamicTimeline.map((step, i) => (
            <TimelineCard
              key={step.id}
              label={step.label}
              detail={step.detail}
              status={step.status}
              icon={step.icon}
              isLast={i === dynamicTimeline.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Confirmation */}
      <div className="card p-4 bg-slate-50">
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-1">Confirmation Code</p>
        <p className="text-sm font-bold text-slate-800 font-mono">{confirmationCode}</p>
        <p className="text-xs text-slate-400 mt-1">Keep this confirmation code for your records.</p>
      </div>

      {/* Notification note */}
      <div className="card p-4 border-blue-200 bg-blue-50 flex items-start gap-3">
        <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-blue-800">Email Notification Enabled</p>
          <p className="text-xs text-blue-600 mt-0.5">
            You will receive an email update at <strong>{user?.email || 'your registered email'}</strong> when the hiring team has finalized their hiring decision.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/candidate/ai-interview')}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <Home className="w-4 h-4" /> AI Interview Dashboard
        </button>
        <button
          onClick={() => navigate('/candidate/my-applications')}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          My Applications <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

