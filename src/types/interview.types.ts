// ─────────────────────────────────────────────────────────────
// TalentForge AI — Live Interview Module Types
// ─────────────────────────────────────────────────────────────

// ─── Interview Status ──────────────────────────────────────────
export type InterviewStatus =
  | 'Scheduled'
  | 'Upcoming'
  | 'Today'
  | 'Waiting'
  | 'Live'
  | 'Completed'
  | 'Cancelled'
  | 'Missed'
  | 'Rescheduled';

// ─── Interview Type ────────────────────────────────────────────
export type InterviewType =
  | 'Technical'
  | 'HR Round'
  | 'Final Round'
  | 'Behavioural'
  | 'System Design'
  | 'Culture Fit'
  | 'Managerial';

// ─── Meeting Type ──────────────────────────────────────────────
export type MeetingType = 'video' | 'audio-only' | 'in-person';

// ─── Duration options ─────────────────────────────────────────
export type InterviewDuration =
  | '30 min'
  | '45 min'
  | '60 min'
  | '90 min'
  | '120 min';

// ─── Reminder intervals ───────────────────────────────────────
export type ReminderInterval =
  | '24 hours'
  | '1 hour'
  | '30 minutes'
  | '15 minutes'
  | '5 minutes';

// ─── Participant role ─────────────────────────────────────────
export type ParticipantRole = 'recruiter' | 'interviewer' | 'candidate';

// ─── Connection Status ────────────────────────────────────────
export type ConnectionStatus = 'excellent' | 'good' | 'poor' | 'disconnected';

// ─── Notification Type ────────────────────────────────────────
export type InterviewNotificationType =
  | 'scheduled'
  | 'rescheduled'
  | 'cancelled'
  | 'starting_soon'
  | 'started'
  | 'completed'
  | 'reminder'
  | 'feedback_request';

// ─── Feedback Rating ─────────────────────────────────────────
export type FeedbackRating = 1 | 2 | 3 | 4 | 5;

// ─── Recommendation ──────────────────────────────────────────
export type HiringRecommendation =
  | 'Strong Hire'
  | 'Hire'
  | 'Consider'
  | 'Reject'
  | 'Strong Reject';

// ─── Participant ──────────────────────────────────────────────
export interface LiveParticipant {
  id: string;
  name: string;
  initials: string;
  role: ParticipantRole;
  avatarColor: string; // Tailwind gradient class e.g. 'from-blue-500 to-blue-700'
  title: string;
  isMicOn: boolean;
  isCameraOn: boolean;
  isSpeaking: boolean;
  isScreenSharing: boolean;
  connectionStatus: ConnectionStatus;
  joinedAt?: string;
}

// ─── Interview Instructions ───────────────────────────────────
export interface InterviewInstructions {
  allowCamera: boolean;
  allowMicrophone: boolean;
  allowScreenShare: boolean;
  instructions: string;
}

// ─── Live Interview ───────────────────────────────────────────
export interface LiveInterview {
  id: string;
  title: string;
  type: InterviewType;
  status: InterviewStatus;
  meetingType: MeetingType;

  // Job & Company
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  companyColor: string;

  // Candidate
  candidateId: string;
  candidateName: string;
  candidateInitials: string;
  candidateAvatarColor: string;
  candidateEmail: string;

  // Recruiters / Interviewers
  recruiterIds: string[];

  // Scheduling
  date: string;        // e.g. 'Jun 30, 2026'
  dateISO: string;     // ISO format for calculations
  timeStart: string;   // e.g. '10:00 AM'
  timeEnd: string;     // e.g. '11:00 AM'
  duration: InterviewDuration;
  timezone: string;

  // Settings
  settings: InterviewInstructions;

  // Metadata
  createdAt: string;
  createdBy: string;   // recruiter ID
  notes?: string;
  roomId?: string;     // mock room identifier
  recordingEnabled: boolean;
}

// ─── Interview Notification ────────────────────────────────────
export interface InterviewNotification {
  id: string;
  type: InterviewNotificationType;
  interviewId: string;
  interviewTitle: string;
  candidateName?: string;
  recruiterName?: string;
  company?: string;
  message: string;
  time: string;       // relative time e.g. '2h ago'
  timestamp: string;  // ISO
  isRead: boolean;
  icon: string;       // emoji
}

// ─── Reminder ─────────────────────────────────────────────────
export interface InterviewReminder {
  interviewId: string;
  interval: ReminderInterval;
  scheduledAt: string; // ISO of when reminder fires
  message: string;
}

// ─── Chat Message ─────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderInitials: string;
  senderRole: ParticipantRole;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

// ─── Interview Note ───────────────────────────────────────────
export interface InterviewNote {
  id: string;
  interviewId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Candidate Feedback ───────────────────────────────────────
export interface CandidateFeedback {
  id: string;
  interviewId: string;
  candidateId: string;
  recruiterRating: FeedbackRating;
  companyRating: FeedbackRating;
  experienceRating: FeedbackRating;
  platformRating: FeedbackRating;
  overallRating: FeedbackRating;
  comments: string;
  wouldRecommend: boolean;
  submittedAt: string;
}

// ─── Recruiter Evaluation ─────────────────────────────────────
export interface RecruiterEvaluation {
  id: string;
  interviewId: string;
  recruiterId: string;
  candidateId: string;

  // Skill ratings (1–5)
  communication: FeedbackRating;
  technical: FeedbackRating;
  problemSolving: FeedbackRating;
  behaviour: FeedbackRating;
  cultureFit: FeedbackRating;

  // Overall
  overallScore: number; // 1–100
  recommendation: HiringRecommendation;
  comments: string;
  strengths: string[];
  improvements: string[];
  submittedAt: string;
}

// ─── Schedule Entry (Calendar) ────────────────────────────────
export interface ScheduleEntry {
  date: string;        // ISO date 'YYYY-MM-DD'
  interviews: LiveInterview[];
}

// ─── Create Interview Form Data ───────────────────────────────
export interface CreateInterviewFormData {
  title: string;
  candidateId: string;
  jobId: string;
  type: InterviewType;
  date: string;
  timeStart: string;
  duration: InterviewDuration;
  timezone: string;
  meetingType: MeetingType;
  instructions: string;
  allowCamera: boolean;
  allowMicrophone: boolean;
  allowScreenShare: boolean;
  recordingEnabled: boolean;
}
