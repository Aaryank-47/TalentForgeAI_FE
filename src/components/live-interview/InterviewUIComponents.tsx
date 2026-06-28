// ─────────────────────────────────────────────────────────────
// TalentForge AI — Interview Utility Components
// NotificationCard + ReminderBanner + InterviewEmptyState
// (Tightly related small UI pieces — kept in one file per Rule 6)
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { Bell, Clock, Calendar, Video } from 'lucide-react';
import type { InterviewNotification, InterviewReminder } from '../../types/interview.types';

// ─── Notification Card ────────────────────────────────────────
interface NotificationCardProps {
  notification: InterviewNotification;
  onClick?: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-[#E5E7EB] last:border-0 ${
        !notification.isRead ? 'bg-primary-50/30' : ''
      }`}
    >
      <span className="text-xl flex-shrink-0 mt-0.5">{notification.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-700 leading-relaxed">{notification.message}</p>
        {notification.candidateName && (
          <p className="text-[10px] text-slate-500 mt-0.5">
            Candidate: {notification.candidateName}
          </p>
        )}
        <p className="text-[10px] text-slate-400 mt-1">{notification.time}</p>
      </div>
      {!notification.isRead && (
        <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1.5" />
      )}
    </div>
  );
};

// ─── Reminder Banner ─────────────────────────────────────────
interface ReminderBannerProps {
  reminder: InterviewReminder;
  onDismiss?: () => void;
}

export const ReminderBanner: React.FC<ReminderBannerProps> = ({ reminder, onDismiss }) => {
  const intervalColors: Record<string, string> = {
    '24 hours': 'bg-blue-50 border-blue-200 text-blue-800',
    '1 hour': 'bg-amber-50 border-amber-200 text-amber-800',
    '30 minutes': 'bg-orange-50 border-orange-200 text-orange-800',
    '15 minutes': 'bg-red-50 border-red-200 text-red-700',
    '5 minutes': 'bg-red-100 border-red-300 text-red-800',
  };
  const colorClass = intervalColors[reminder.interval] || 'bg-slate-50 border-slate-200 text-slate-700';

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${colorClass} animate-slide-in-right`}>
      <Bell className="w-4 h-4 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold">{reminder.interval} reminder</p>
        <p className="text-xs opacity-80 truncate">{reminder.message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-xs font-medium opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
        >
          Dismiss
        </button>
      )}
    </div>
  );
};

// ─── Empty State ─────────────────────────────────────────────
interface InterviewEmptyStateProps {
  title?: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
  variant?: 'upcoming' | 'history' | 'calendar';
}

export const InterviewEmptyState: React.FC<InterviewEmptyStateProps> = ({
  title = 'No interviews found',
  subtitle = 'Interviews you schedule will appear here.',
  action,
  variant = 'upcoming',
}) => {
  const icons = {
    upcoming: Calendar,
    history: Clock,
    calendar: Calendar,
  };
  const Icon = icons[variant];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-base font-display font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed">{subtitle}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary mt-5 text-sm flex items-center gap-2"
        >
          <Video className="w-4 h-4" />
          {action.label}
        </button>
      )}
    </div>
  );
};

// ─── Loading State ────────────────────────────────────────────
export const InterviewLoadingState: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="card p-4 animate-pulse">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
            <div className="h-3 bg-slate-200 rounded w-1/3" />
          </div>
          <div className="h-5 w-20 bg-slate-200 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);
