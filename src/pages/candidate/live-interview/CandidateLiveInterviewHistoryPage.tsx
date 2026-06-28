// ─────────────────────────────────────────────────────────────
// TalentForge AI — Candidate Interview History Page
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getCompletedInterviews } from '../../../constants/interview.mock';
import { LiveInterviewCard } from '../../../components/live-interview/LiveInterviewCard';
import { InterviewEmptyState } from '../../../components/live-interview/InterviewUIComponents';

const CandidateLiveInterviewHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const history = getCompletedInterviews();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/candidate/live-interviews')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        My Interviews
      </button>

      <div>
        <h1 className="text-2xl font-display font-bold text-[#0F172A]">Past Interviews</h1>
        <p className="text-sm text-slate-500 mt-0.5">Your completed, cancelled, and missed interviews.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Completed', count: history.filter((iv) => iv.status === 'Completed').length, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Cancelled', count: history.filter((iv) => iv.status === 'Cancelled').length, color: 'text-red-600 bg-red-50' },
          { label: 'Missed', count: history.filter((iv) => iv.status === 'Missed').length, color: 'text-amber-600 bg-amber-50' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`card p-4 ${color} border-0`}>
            <p className="text-2xl font-display font-black">{count}</p>
            <p className="text-xs font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {history.length === 0 ? (
        <InterviewEmptyState
          title="No past interviews"
          subtitle="Completed interviews will appear here."
          variant="history"
        />
      ) : (
        <div className="space-y-3">
          {history.map((iv) => (
            <LiveInterviewCard
              key={iv.id}
              interview={iv}
              mode="candidate"
              compact
              onViewDetails={(id) => navigate(`/candidate/live-interviews/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateLiveInterviewHistoryPage;
