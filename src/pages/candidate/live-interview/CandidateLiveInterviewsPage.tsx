// ─────────────────────────────────────────────────────────────
// TalentForge AI — Candidate Live Interviews Page (Phase 6)
// Upcoming + history for the candidate
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { Calendar, Clock, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockCandidateNotifications } from '../../../constants/notifications.mock';
import { LiveInterviewCard } from '../../../components/live-interview/LiveInterviewCard';
import { NotificationCard } from '../../../components/live-interview/InterviewUIComponents';
import { InterviewEmptyState } from '../../../components/live-interview/InterviewUIComponents';
import type { LiveInterview } from '../../../types/interview.types';

import { useQuery } from '@tanstack/react-query';
import { interviewApi } from '../../../services/api/interview.api';

const CandidateLiveInterviewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const navigate = useNavigate();

  const { data: interviewsResponse, isLoading } = useQuery({
    queryKey: ['candidateInterviews'],
    queryFn: () => interviewApi.getCandidateInterviews({ type: 'NORMAL' }),
  });

  const toCandidateLiveInterview = (dto: any): LiveInterview => ({
    id: dto.sessionId || dto.id,
    title: dto.role || 'Interview',
    type: dto.interviewType?.includes('AI') ? 'Technical' : 'Technical',
    status: dto.status === 'EXPIRED' ? 'Missed' : dto.status === 'COMPLETED' ? 'Completed' : 'Scheduled',
    meetingType: 'video',
    jobId: dto.id,
    jobTitle: dto.role,
    company: dto.company || 'Company',
    companyLogo: dto.companyLogo || 'C',
    companyColor: dto.companyColor || 'bg-primary-600',
    candidateId: 'me',
    candidateName: 'Me',
    candidateInitials: 'ME',
    candidateAvatarColor: 'from-blue-500 to-blue-700',
    candidateEmail: '',
    recruiterIds: [],
    date: dto.assignedDate || new Date().toLocaleDateString(),
    dateISO: new Date().toISOString(),
    timeStart: '10:00 AM', // Generic time since DTO lacks specific time
    timeEnd: '11:00 AM',
    duration: `${dto.durationMinutes || 45} min` as any,
    timezone: 'IST',
    settings: {
      allowCamera: true,
      allowMicrophone: true,
      allowScreenShare: true,
      instructions: ''
    },
    createdAt: new Date().toISOString(),
    createdBy: '',
    recordingEnabled: true,
    roomId: dto.sessionId,
    aiScore: dto.aiScore || null,
    recommendation: dto.recommendation,
  });

  const upcomingList = React.useMemo(() => {
    const response = interviewsResponse as any;
    const rawData = response?.data || response;
    if (!rawData) return [];
    
    const pendingArray = rawData.pending || [];
    return pendingArray.map(toCandidateLiveInterview);
  }, [interviewsResponse]);

  const pastList = React.useMemo(() => {
    const response = interviewsResponse as any;
    const rawData = response?.data || response;
    if (!rawData) return [];
    
    const completedArray = rawData.completed || [];
    return completedArray.map(toCandidateLiveInterview);
  }, [interviewsResponse]);

  const liveNow = upcomingList.filter((iv) => iv.status === 'Live');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">My Interviews</h1>
          <p className="text-sm text-slate-500 mt-0.5">View and join your scheduled live interviews.</p>
        </div>
      </div>

      {/* Live now alert */}
      {liveNow.length > 0 && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-recording-pulse flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-emerald-800">Interview is Live Now!</p>
            <p className="text-xs text-emerald-600 mt-0.5">
              {liveNow[0].title} with {liveNow[0].company} — started at {liveNow[0].timeStart}
            </p>
          </div>
          <button
            onClick={() => navigate(`/candidate/live-interviews/${liveNow[0].id}`)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors flex-shrink-0"
          >
            Join Now
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: interview list */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="border-b border-[#E5E7EB]">
            <div className="flex gap-0">
              {([
                { key: 'upcoming', label: 'Upcoming', count: upcomingList.length, icon: Calendar },
                { key: 'history', label: 'Past', count: pastList.length, icon: Clock },
              ] as const).map(({ key, label, count, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === key
                      ? 'border-primary-600 text-primary-700'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === key ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Interview cards */}
          {activeTab === 'upcoming' && (
            <div className="space-y-3">
              {upcomingList.length === 0 ? (
                <InterviewEmptyState
                  title="No upcoming interviews"
                  subtitle="Your scheduled interviews will appear here."
                />
              ) : (
                upcomingList.map((iv) => (
                  <LiveInterviewCard
                    key={iv.id}
                    interview={iv}
                    mode="candidate"
                    onJoinClick={(id) => navigate(`/candidate/live-interviews/${id}/room`)}
                    onViewDetails={(id) => navigate(`/candidate/live-interviews/${id}`)}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {pastList.length === 0 ? (
                <InterviewEmptyState
                  title="No past interviews"
                  subtitle="Completed interviews will appear here."
                  variant="history"
                />
              ) : (
                pastList.map((iv) => (
                  <LiveInterviewCard
                    key={iv.id}
                    interview={iv}
                    mode="candidate"
                    onViewDetails={(id) => navigate(`/candidate/live-interviews/${id}`)}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* Right: notifications */}
        <div className="space-y-4">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] bg-primary-100 text-primary-700 font-bold px-1.5 py-0.5 rounded-full">
                  {mockCandidateNotifications.filter((n) => !n.isRead).length}
                </span>
              </div>
              <button className="text-xs text-primary-600 font-semibold hover:text-primary-700">
                Mark all read
              </button>
            </div>
            <div className="divide-y divide-[#E5E7EB]">
              {mockCandidateNotifications.map((notif) => (
                <NotificationCard key={notif.id} notification={notif} />
              ))}
            </div>
          </div>

          {/* Quick tips card */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-wide opacity-80 mb-2">💡 Interview Tips</p>
            <ul className="space-y-2 text-xs opacity-90">
              {[
                'Test your mic & camera 15 min before',
                'Use a quiet, well-lit room',
                'Have a stable internet connection',
                'Keep a glass of water nearby',
                'Review the job description beforehand',
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <span className="text-primary-200 flex-shrink-0 mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateLiveInterviewsPage;
