// ─────────────────────────────────────────────────────────────
// TalentForge AI — Live Interview Status Badge
// ─────────────────────────────────────────────────────────────
import React from 'react';
import type { InterviewStatus } from '../../types/interview.types';

interface LiveInterviewStatusBadgeProps {
  status: InterviewStatus;
  size?: 'sm' | 'md';
}

const STATUS_STYLES: Record<InterviewStatus, string> = {
  Scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  Upcoming: 'bg-amber-50 text-amber-700 border-amber-200',
  Today: 'bg-orange-50 text-orange-700 border-orange-200',
  Waiting: 'bg-slate-50 text-slate-600 border-slate-200',
  Live: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
  Missed: 'bg-red-50 text-red-600 border-red-200',
  Rescheduled: 'bg-violet-50 text-violet-700 border-violet-200',
};

const STATUS_DOTS: Record<InterviewStatus, string> = {
  Scheduled: 'bg-blue-500',
  Upcoming: 'bg-amber-500',
  Today: 'bg-orange-500',
  Waiting: 'bg-slate-400',
  Live: 'bg-emerald-500 animate-recording-pulse',
  Completed: 'bg-emerald-500',
  Cancelled: 'bg-red-500',
  Missed: 'bg-red-500',
  Rescheduled: 'bg-violet-500',
};

export const LiveInterviewStatusBadge: React.FC<LiveInterviewStatusBadgeProps> = ({
  status,
  size = 'sm',
}) => {
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';
  const padding = size === 'sm' ? 'px-2.5 py-1' : 'px-3 py-1.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-full border capitalize ${textSize} ${padding} ${STATUS_STYLES[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOTS[status]}`} />
      {status}
    </span>
  );
};

export default LiveInterviewStatusBadge;
