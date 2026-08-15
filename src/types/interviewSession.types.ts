// ─────────────────────────────────────────────────────────────
// TalentForge AI — Interview Session Management Types (Phase 6)
// ─────────────────────────────────────────────────────────────

export type JobStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';

export interface Job {
  id: string;
  title: string;
  department: string;
  status: JobStatus;
}

export type ApplicationStage = 'Applied' | 'Screening' | 'Assessment' | 'AI Interview' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  avatar: string;
  stage: ApplicationStage;
  status: 'ACTIVE' | 'REJECTED' | 'HIRED';
}

export type InterviewType = 'AI' | 'NORMAL';
export type InterviewMode = 'INDIVIDUAL' | 'GROUP';
export type SessionStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED' | 'Upcoming' | 'Live' | 'Today';

export interface Interview {
  id: string;
  title: string;
  description: string;
  instructions: string;
  type: InterviewType;
  mode: InterviewMode;
  status: 'ACTIVE' | 'INACTIVE';
  durationMinutes: number;
}

export interface JobInterview {
  id: string;
  jobId: string;
  interviewId: string;
  displayOrder: number;
  isMandatory: boolean;
}

export interface CompanyMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  department: string;
  email?: string;
  initials?: string;
  avatarColor?: string;
}

export interface InterviewAssignment {
  id: string;
  interviewId: string;
  applicationId: string;
  creationSource: 'RECRUITER' | 'SYSTEM';
  candidate: {
    id: string;
    name: string;
    email: string;
    initials: string;
    avatarColor: string;
    title: string;
    experience: string;
    skills: string[];
  };
}

export interface InterviewSessionParticipant {
  id: string;
  sessionId: string;
  participantType: 'CANDIDATE' | 'INTERVIEWER';
  assignmentId?: string;
  companyMemberId?: string;
  hasJoined?: boolean;
  joinedAt?: string;
}

export interface InterviewSession {
  id: string;
  interviewId: string;
  status: SessionStatus;
  scheduledAt: string;
  startedAt: string | null;
  endedAt: string | null;
  participants: InterviewSessionParticipant[];
  
  // Front-end hydrated fields
  assignmentId?: string;
  jobId?: string;
  applicationId?: string;
  candidates?: {
    id: string;
    name: string;
    avatar: string;
    applicationId: string;
    email?: string;
  }[];
  job?: {
    id: string;
    title: string;
  };
  interview?: {
    id: string;
    title: string;
    type: InterviewType;
    mode: InterviewMode;
    durationMinutes: number;
  };
  interviewers?: CompanyMember[];
  aiScore?: number | null;
}
