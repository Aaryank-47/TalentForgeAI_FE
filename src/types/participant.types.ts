// ─────────────────────────────────────────────────────────────
// TalentForge AI — Participant Types (Live Interview Module)
// ─────────────────────────────────────────────────────────────

import type { ParticipantRole, ConnectionStatus } from './interview.types';

// ─── Full Participant Profile ─────────────────────────────────
export interface ParticipantProfile {
  id: string;
  name: string;
  initials: string;
  role: ParticipantRole;
  title: string;
  email: string;
  avatarColor: string; // Tailwind gradient e.g. 'from-blue-500 to-blue-700'
  company?: string;
  department?: string;
  linkedinUrl?: string;
  phone?: string;
}

// ─── Media State ─────────────────────────────────────────────
export interface ParticipantMediaState {
  isMicOn: boolean;
  isCameraOn: boolean;
  isScreenSharing: boolean;
  isSpeaking: boolean;
  connectionStatus: ConnectionStatus;
  joinedAt?: string;
  leftAt?: string;
}

// ─── Combined (for use in room) ───────────────────────────────
export interface RoomParticipant extends ParticipantProfile, ParticipantMediaState {
  isPinned?: boolean;
  isHandRaised?: boolean;
}

// ─── Current User Context ─────────────────────────────────────
export interface CurrentUser {
  id: string;
  name: string;
  initials: string;
  role: ParticipantRole;
  title: string;
  avatarColor: string;
  isMicOn: boolean;
  isCameraOn: boolean;
  isScreenSharing: boolean;
}

// ─── Mock Recruiter / Interviewer ─────────────────────────────
export interface MockRecruiter extends ParticipantProfile {
  role: 'recruiter' | 'interviewer';
  totalInterviews: number;
  rating: number; // 1–5
}

// ─── Mock Candidate ──────────────────────────────────────────
export interface MockCandidate extends ParticipantProfile {
  role: 'candidate';
  jobTitle: string;
  experience: string;
  skills: string[];
  resumeUrl: string;
}
