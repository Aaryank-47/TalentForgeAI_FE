// ─────────────────────────────────────────────────────────────
// TalentForge AI — Recruiter Interview Feedback / Evaluation Page
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { getInterviewById } from '../../../constants/interview.mock';
import { RecruiterFeedbackForm } from '../../../components/live-interview/RecruiterFeedbackForm';
import { LiveInterviewStatusBadge } from '../../../components/live-interview/LiveInterviewStatusBadge';
import { mockRecruiterEvaluations } from '../../../constants/feedback.mock';

import { useQuery } from '@tanstack/react-query';
import { interviewApi } from '../../../services/api/interview.api';
import { useAuth } from '../../../context/AuthContext';
import { toLiveInterview } from '../../../services/interviewSession.service';

const RecruiterInterviewFeedbackPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const companyId = user?.companyId || user?.companies?.[0]?.companyId;

  const { data: sessionResponse, isLoading } = useQuery({
    queryKey: ['interview-session', id, companyId],
    queryFn: () => interviewApi.getSessionById(companyId as string, id as string),
    enabled: !!id && !!companyId,
  });

  const session = (sessionResponse as any)?.data || sessionResponse;
  const realInterview = session ? toLiveInterview(session) : null;
  const mockInterview = getInterviewById(id ?? '');
  
  const interview = realInterview || mockInterview;
  const existingEval = mockRecruiterEvaluations.find((ev) => ev.interviewId === id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-slate-500 text-sm">Loading interview...</p>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-slate-500 text-sm">Interview not found.</p>
        <button onClick={() => navigate('/recruiter/live-interviews')} className="mt-4 btn-secondary text-sm">
          ← Back
        </button>
      </div>
    );
  }

  const handleSubmit = () => {
    toast.success('Evaluation submitted successfully!');
    setTimeout(() => navigate(`/recruiter/live-interviews/${interview.id}`), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(`/recruiter/live-interviews/${interview.id}`)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Interview
      </button>

      {/* Context banner */}
      <div className="card p-5 flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl ${interview.companyColor} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
        >
          {interview.companyLogo}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h2 className="text-lg font-display font-bold text-slate-900">{interview.title}</h2>
            <LiveInterviewStatusBadge status={interview.status} />
          </div>
          <p className="text-sm text-slate-500">
            Candidate: <strong className="text-slate-700">{interview.candidateName}</strong>
            &nbsp;· {interview.date} at {interview.timeStart}
          </p>
        </div>
        {existingEval && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-amber-700">Score: {existingEval.overallScore}/100</span>
          </div>
        )}
      </div>

      {/* The form */}
      <RecruiterFeedbackForm
        candidateName={interview.candidateName}
        interviewTitle={interview.title}
        sessionId={id}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default RecruiterInterviewFeedbackPage;
