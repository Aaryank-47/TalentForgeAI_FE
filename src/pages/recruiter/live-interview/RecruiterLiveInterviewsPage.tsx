// ─────────────────────────────────────────────────────────────
// TalentForge AI — Recruiter Live Interviews Page
// Main hub: list of all interviews + schedule button + tabs
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  Plus, Search, Filter, Calendar, LayoutGrid, List,
  TrendingUp, Video, CheckCircle, XCircle, Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { mockInterviews, liveInterviewStats } from '../../../constants/interview.mock';
import type { LiveInterview, InterviewStatus } from '../../../types/interview.types';
import { LiveInterviewCard } from '../../../components/live-interview/LiveInterviewCard';
import { LiveInterviewStatusBadge } from '../../../components/live-interview/LiveInterviewStatusBadge';
import { CreateInterviewModal } from '../../../components/live-interview/CreateInterviewModal';
import { InterviewEmptyState, InterviewLoadingState } from '../../../components/live-interview/InterviewUIComponents';
import { useNavigate } from 'react-router-dom';

type TabFilter = 'All' | 'Upcoming' | 'Live' | 'Completed' | 'Cancelled';

const TAB_STATUSES: Record<TabFilter, InterviewStatus[]> = {
  All: [],
  Upcoming: ['Scheduled', 'Upcoming', 'Today'],
  Live: ['Live', 'Waiting'],
  Completed: ['Completed'],
  Cancelled: ['Cancelled', 'Missed', 'Rescheduled'],
};

const STAT_CARDS = [
  { label: 'Scheduled', value: liveInterviewStats.totalScheduled, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Live Now', value: liveInterviewStats.live, icon: Video, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Completed', value: liveInterviewStats.completed, icon: CheckCircle, color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'Avg Duration', value: liveInterviewStats.avgDuration, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
];

const RecruiterLiveInterviewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabFilter>('All');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();

  const filtered = mockInterviews.filter((iv) => {
    const matchTab =
      activeTab === 'All' || TAB_STATUSES[activeTab].includes(iv.status);
    const matchSearch =
      !search ||
      iv.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      iv.title.toLowerCase().includes(search.toLowerCase()) ||
      iv.company.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const tabCounts: Record<TabFilter, number> = {
    All: mockInterviews.length,
    Upcoming: mockInterviews.filter((iv) => TAB_STATUSES.Upcoming.includes(iv.status)).length,
    Live: mockInterviews.filter((iv) => TAB_STATUSES.Live.includes(iv.status)).length,
    Completed: mockInterviews.filter((iv) => TAB_STATUSES.Completed.includes(iv.status)).length,
    Cancelled: mockInterviews.filter((iv) => TAB_STATUSES.Cancelled.includes(iv.status)).length,
  };

  const handleCreate = () => {
    toast.success('Interview scheduled successfully!');
    setCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Live Interviews</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Schedule, manage and join live interview sessions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/recruiter/live-interviews/calendar')}
            className="btn-secondary text-sm flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Calendar
          </button>
          <button
            onClick={() => setCreateOpen(true)}
            id="schedule-interview-btn"
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Schedule Interview
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4 border border-transparent`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className={`text-2xl font-display font-black ${color}`}>{value}</p>
            <p className="text-xs text-slate-600 font-medium mt-0.5">{label}</p>
            <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +{Math.floor(Math.random() * 30 + 10)}% this month
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E5E7EB]">
        <div className="flex items-center gap-0 overflow-x-auto">
          {(Object.keys(TAB_STATUSES) as TabFilter[]).map((tab) => (
            <button
              key={tab}
              id={`tab-${tab.toLowerCase()}`}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === tab
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters + view toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, company or title..."
            className="pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
        <div className="ml-auto flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interview list / grid */}
      {filtered.length === 0 ? (
        <InterviewEmptyState
          title={search ? 'No interviews match your search' : 'No interviews yet'}
          subtitle={
            search
              ? 'Try different keywords or clear the search.'
              : 'Schedule your first interview to get started.'
          }
          action={!search ? { label: 'Schedule Interview', onClick: () => setCreateOpen(true) } : undefined}
        />
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'
              : 'space-y-3'
          }
        >
          {filtered.map((iv) => (
            <LiveInterviewCard
              key={iv.id}
              interview={iv}
              mode="recruiter"
              compact={viewMode === 'list'}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateInterviewModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default RecruiterLiveInterviewsPage;
