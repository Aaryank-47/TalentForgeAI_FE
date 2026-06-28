// ─────────────────────────────────────────────────────────────
// TalentForge AI — Candidate Interview Feedback Page
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { getInterviewById } from '../../../constants/interview.mock';
import { getRecruiterById } from '../../../constants/participants.mock';
import { FeedbackForm } from '../../../components/live-interview/FeedbackForm';
import { LiveInterviewStatusBadge } from '../../../components/live-interview/LiveInterviewStatusBadge';

const CandidateLiveInterviewFeedbackPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const interview = getInterviewById(id ?? '');
  const recruiter = interview ? getRecruiterById(interview.recruiterIds[0]) : null;

  if (!interview) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-slate-500 text-sm">Interview not found.</p>
        <button onClick={() => navigate('/candidate/live-interviews')} className="mt-4 btn-secondary text-sm">
          ← Back
        </button>
      </div>
    );
  }

  const handleSubmit = () => {
    toast.success('Thank you for your feedback!');
    setTimeout(() => navigate('/candidate/live-interviews'), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('/candidate/live-interviews')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        My Interviews
      </button>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-display font-bold text-[#0F172A]">Share Your Feedback</h1>
        <LiveInterviewStatusBadge status={interview.status} />
      </div>

      <FeedbackForm
        interviewTitle={interview.title}
        company={interview.company}
        recruiterName={recruiter?.name ?? 'Interviewer'}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CandidateLiveInterviewFeedbackPage;
