// ─────────────────────────────────────────────────────────────
// TalentForge AI — Interview Notifications Mock Data
// ─────────────────────────────────────────────────────────────
import type { InterviewNotification, InterviewReminder } from '../types/interview.types';

export const mockInterviewNotifications: InterviewNotification[] = [
  {
    id: 'notif_001',
    type: 'started',
    interviewId: 'liv_001',
    interviewTitle: 'Frontend Engineer — Technical Round',
    recruiterName: 'Lamine Yamal',
    company: 'Google',
    message: 'Your interview with Google has started. Join now!',
    time: 'Just now',
    timestamp: '2026-06-28T11:00:00Z',
    isRead: false,
    icon: '🟢',
  },
  {
    id: 'notif_002',
    type: 'scheduled',
    interviewId: 'liv_002',
    interviewTitle: 'HR Round — Culture & Values',
    candidateName: 'Priya Sharma',
    recruiterName: 'Lamine Yamal',
    company: 'Meta',
    message: 'Interview scheduled with Priya Sharma for Jun 29 at 2:00 PM.',
    time: '1h ago',
    timestamp: '2026-06-28T10:00:00Z',
    isRead: false,
    icon: '📅',
  },
  {
    id: 'notif_003',
    type: 'reminder',
    interviewId: 'liv_002',
    interviewTitle: 'HR Round — Culture & Values',
    company: 'Meta',
    message: 'Reminder: Your interview tomorrow at 2:00 PM is in 24 hours.',
    time: '2h ago',
    timestamp: '2026-06-28T09:00:00Z',
    isRead: false,
    icon: '⏰',
  },
  {
    id: 'notif_004',
    type: 'completed',
    interviewId: 'liv_005',
    interviewTitle: 'Technical Interview — React & Performance',
    candidateName: 'Vikram Iyer',
    message: 'Interview with Vikram Iyer completed. Submit your evaluation.',
    time: '1d ago',
    timestamp: '2026-06-20T12:00:00Z',
    isRead: true,
    icon: '✅',
  },
  {
    id: 'notif_005',
    type: 'feedback_request',
    interviewId: 'liv_005',
    interviewTitle: 'Technical Interview — React & Performance',
    candidateName: 'Vikram Iyer',
    message: 'Vikram Iyer submitted their feedback. View the rating.',
    time: '1d ago',
    timestamp: '2026-06-20T13:00:00Z',
    isRead: true,
    icon: '💬',
  },
  {
    id: 'notif_006',
    type: 'cancelled',
    interviewId: 'liv_007',
    interviewTitle: 'Culture Fit Interview',
    candidateName: 'Tanmay Shah',
    message: 'Interview with Tanmay Shah was cancelled.',
    time: '2d ago',
    timestamp: '2026-06-15T10:00:00Z',
    isRead: true,
    icon: '❌',
  },
  {
    id: 'notif_007',
    type: 'rescheduled',
    interviewId: 'liv_003',
    interviewTitle: 'System Design — Backend Architecture',
    candidateName: 'Rahul Verma',
    message: 'Interview with Rahul Verma rescheduled to Jul 2 at 10:30 AM.',
    time: '3d ago',
    timestamp: '2026-06-14T08:00:00Z',
    isRead: true,
    icon: '🔄',
  },
];

// ─── Candidate-specific notifications ─────────────────────────
export const mockCandidateNotifications: InterviewNotification[] = [
  {
    id: 'cnotif_001',
    type: 'started',
    interviewId: 'liv_001',
    interviewTitle: 'Frontend Engineer — Technical Round',
    recruiterName: 'Lamine Yamal',
    company: 'Google',
    message: 'Your interview has started. Join immediately!',
    time: 'Just now',
    timestamp: '2026-06-28T11:00:00Z',
    isRead: false,
    icon: '🟢',
  },
  {
    id: 'cnotif_002',
    type: 'scheduled',
    interviewId: 'liv_001',
    interviewTitle: 'Frontend Engineer — Technical Round',
    recruiterName: 'Lamine Yamal',
    company: 'Google',
    message: 'Google has scheduled a Technical interview for Jun 28 at 11:00 AM.',
    time: '8d ago',
    timestamp: '2026-06-20T09:00:00Z',
    isRead: true,
    icon: '📅',
  },
  {
    id: 'cnotif_003',
    type: 'reminder',
    interviewId: 'liv_001',
    interviewTitle: 'Frontend Engineer — Technical Round',
    company: 'Google',
    message: 'Your interview is starting in 30 minutes. Ensure mic & camera are working.',
    time: '30m ago',
    timestamp: '2026-06-28T10:30:00Z',
    isRead: false,
    icon: '⏰',
  },
];

// ─── Mock Reminders ───────────────────────────────────────────
export const mockReminders: InterviewReminder[] = [
  {
    interviewId: 'liv_002',
    interval: '24 hours',
    scheduledAt: '2026-06-28T14:00:00Z',
    message: 'Interview tomorrow at 2:00 PM — HR Round with Meta.',
  },
  {
    interviewId: 'liv_002',
    interval: '1 hour',
    scheduledAt: '2026-06-29T13:00:00Z',
    message: 'Interview in 1 hour — HR Round with Meta. Get ready!',
  },
  {
    interviewId: 'liv_003',
    interval: '24 hours',
    scheduledAt: '2026-07-01T10:30:00Z',
    message: 'System Design interview tomorrow at 10:30 AM with Amazon.',
  },
];

export const unreadNotificationCount = mockInterviewNotifications.filter(
  (n) => !n.isRead
).length;
