// ─────────────────────────────────────────────────────────────
// TalentForge AI — Recruiter Interview History Page
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCompletedInterviews } from '../../../constants/interview.mock';
import { LiveInterviewCard } from '../../../components/live-interview/LiveInterviewCard';
import { InterviewEmptyState } from '../../../components/live-interview/InterviewUIComponents';

const RecruiterInterviewHistoryPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const pastInterviews = getCompletedInterviews();

  const filtered = pastInterviews.filter(
    (iv) =>
      !search ||
      iv.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      iv.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Interview History</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Past interviews — completed, cancelled, and missed.
          </p>
        </div>
        <button className="btn-secondary text-sm flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Completed', count: pastInterviews.filter((iv) => iv.status === 'Completed').length, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Cancelled', count: pastInterviews.filter((iv) => iv.status === 'Cancelled').length, color: 'text-red-600 bg-red-50' },
          { label: 'Missed', count: pastInterviews.filter((iv) => iv.status === 'Missed').length, color: 'text-amber-600 bg-amber-50' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`card p-4 ${color} border-0`}>
            <p className="text-2xl font-display font-black">{count}</p>
            <p className="text-xs font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search past interviews..."
            className="pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <InterviewEmptyState
          title="No past interviews"
          subtitle="Completed and cancelled interviews will appear here."
          variant="history"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((iv) => (
            <LiveInterviewCard
              key={iv.id}
              interview={iv}
              mode="recruiter"
              compact
              onViewDetails={(id) => navigate(`/recruiter/live-interviews/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterInterviewHistoryPage;
