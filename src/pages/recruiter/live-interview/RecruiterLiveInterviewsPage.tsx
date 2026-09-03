// ─────────────────────────────────────────────────────────────
// TalentForge AI — Recruiter Live Interviews Page (Phase 6)
// Main hub: list of all interviews + schedule button + tabs
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  Plus, Search, Filter, Calendar, LayoutGrid, List,
  TrendingUp, Video, CheckCircle, Clock,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { interviewApi } from '../../../services/api/interview.api';
import { useAuth } from '../../../context/AuthContext';
import { toLiveInterview } from '../../../services/interviewSession.service';
import type { LiveInterview, InterviewStatus } from '../../../types/interview.types';
import { LiveInterviewCard } from '../../../components/live-interview/LiveInterviewCard';
import { CreateInterviewModal } from '../../../components/live-interview/CreateInterviewModal';
import { InterviewEmptyState } from '../../../components/live-interview/InterviewUIComponents';
import { useNavigate } from 'react-router-dom';

type TabFilter = 'All' | 'Upcoming' | 'Live' | 'Completed' | 'Cancelled';

const TAB_STATUSES: Record<TabFilter, InterviewStatus[]> = {
  All: [],
  Upcoming: ['Scheduled', 'Upcoming', 'Today'],
  Live: ['Live', 'Waiting'],
  Completed: ['Completed'],
  Cancelled: ['Cancelled', 'Missed', 'Rescheduled'],
};

const RecruiterLiveInterviewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabFilter>('All');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuth();
  const companyId = user?.companyId || user?.companies?.[0]?.companyId;

  const { data: sessionsResponse, isLoading, refetch } = useQuery<any>({
    queryKey: ['sessions', companyId],
    queryFn: () => interviewApi.getAllSessions(companyId as string),
    enabled: !!companyId,
  });

  const interviewsList: LiveInterview[] = React.useMemo(() => {
    const dataArray = sessionsResponse?.data || sessionsResponse;
    if (!Array.isArray(dataArray)) return [];
    
    // Sort array by scheduledAt or createdAt descending (newest first)
    const sortedArray = [...dataArray].sort((a, b) => {
      const dateA = new Date(a.scheduledAt || a.createdAt).getTime();
      const dateB = new Date(b.scheduledAt || b.createdAt).getTime();
      return dateB - dateA;
    });

    return sortedArray.map(toLiveInterview);
  }, [sessionsResponse]);

  const filtered = interviewsList.filter((iv) => {
    const matchTab =
      activeTab === 'All' || TAB_STATUSES[activeTab].includes(iv.status);
    const matchSearch =
      !search ||
      iv.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      iv.title.toLowerCase().includes(search.toLowerCase()) ||
      iv.jobTitle.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const tabCounts: Record<TabFilter, number> = {
    All: interviewsList.length,
    Upcoming: interviewsList.filter((iv) => TAB_STATUSES.Upcoming.includes(iv.status)).length,
    Live: interviewsList.filter((iv) => TAB_STATUSES.Live.includes(iv.status)).length,
    Completed: interviewsList.filter((iv) => TAB_STATUSES.Completed.includes(iv.status)).length,
    Cancelled: interviewsList.filter((iv) => TAB_STATUSES.Cancelled.includes(iv.status)).length,
  };

  const handleCreateSubmit = () => {
    refetch(); // reload list
    setCreateOpen(false);
  };

  const scheduledCount = interviewsList.filter((iv) => ['Scheduled', 'Upcoming', 'Today'].includes(iv.status)).length;
  const liveCount = interviewsList.filter((iv) => iv.status === 'Live').length;
  const completedCount = interviewsList.filter((iv) => iv.status === 'Completed').length;

  const STAT_CARDS = [
    { label: 'Scheduled', value: scheduledCount, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Live Now', value: liveCount, icon: Video, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Completed', value: completedCount, icon: CheckCircle, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Avg Duration', value: '52 min', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

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
          <div key={label} className="card p-4 flex items-start gap-3">
            <div className={`${bg} rounded-xl p-2.5 flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-[12px] text-slate-500 leading-tight">{label}</p>
              <p className="text-2xl font-display font-bold text-slate-900 mt-0.5">{value}</p>
              <p className="text-[10px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +{Math.floor(Math.random() * 30 + 10)}% this month
              </p>
            </div>
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

      {/* Session list / grid */}
      {filtered.length === 0 ? (
        <InterviewEmptyState
          title={search ? 'No interviews match your search' : 'No interviews scheduled'}
          subtitle={
            search
              ? 'Try different keywords or clear the search.'
              : 'Schedule your first session to get started.'
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
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
};

export default RecruiterLiveInterviewsPage;
