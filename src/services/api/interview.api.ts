import { api } from './apiClient';

export interface CreateInterviewPayload {
  title: string;
  description?: string;
  instructions?: string;
  type: 'AI' | 'NORMAL';
  mode: 'INDIVIDUAL' | 'GROUP';
  status?: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  durationMinutes?: number;
  aiConfiguration?: {
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
    totalQuestions?: number;
    questionCount?: number;
    allowFollowUps?: boolean;
    skills?: string[];
    roleTitle?: string;
    focusAreas?: string[];
    systemPrompt?: string;
    evaluationMetrics?: any;
  };
}

export interface CreateAssignmentPayload {
  applicationIds: string[];
  expiresAt?: string;
}

export interface CreateSessionPayload {
  scheduledAt: string;
  assignmentIds?: string[];
  companyMemberIds?: string[];
}

export const interviewApi = {
  // ── 1. Recruiter Template Creation ────────────────────────────
  createInterview: (companyId: string, payload: CreateInterviewPayload) =>
    api.post(`/interviews/${companyId}/create/interview`, payload),

  getCompanyInterviews: (
    companyId: string,
    params?: { page?: number; limit?: number; search?: string; status?: string; type?: string; mode?: string }
  ) =>
    api.get(`/interviews/${companyId}/interviews`, { params }),

  getInterviewById: (companyId: string, interviewId: string) =>
    api.get(`/interviews/${companyId}/interviews/${interviewId}`),

  updateInterview: (companyId: string, interviewId: string, payload: Partial<CreateInterviewPayload>) =>
    api.patch(`/interviews/${companyId}/interviews/${interviewId}`, payload),

  changeInterviewStatus: (companyId: string, interviewId: string, status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT') =>
    api.patch(`/interviews/${companyId}/interviews/${interviewId}/status`, { status }),

  deleteInterview: (companyId: string, interviewId: string) =>
    api.delete(`/interviews/${companyId}/interviews/${interviewId}`),

  // ── 2. Assign Interview / Invite Candidate ────────────────────
  createAssignments: (companyId: string, interviewId: string, payload: CreateAssignmentPayload) =>
    api.post(`/interviews/${companyId}/interviews/${interviewId}/assignments`, payload),

  getAssignments: (companyId: string, interviewId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/interviews/${companyId}/interviews/${interviewId}/assignments`, { params }),

  getAssignmentById: (companyId: string, interviewId: string, assignmentId: string) =>
    api.get(`/interviews/${companyId}/interviews/${interviewId}/assignments/${assignmentId}`),

  deleteAssignment: (companyId: string, interviewId: string, assignmentId: string) =>
    api.delete(`/interviews/${companyId}/interviews/${interviewId}/assignments/${assignmentId}`),
    
  getEligibleCandidates: (companyId: string) =>
    api.get(`/interviews/${companyId}/eligible-candidates`),

  // ── 3. Sessions & Participants ────────────────────────────────
  createSession: (companyId: string, interviewId: string, payload: CreateSessionPayload) =>
    api.post(`/interviews/${companyId}/interviews/${interviewId}/sessions`, payload),

  getSessions: (companyId: string, interviewId: string) =>
    api.get(`/interviews/${companyId}/interviews/${interviewId}/sessions`),

  getAllSessions: (companyId: string) =>
    api.get(`/interviews/${companyId}/interview-sessions`),

  getSessionById: (companyId: string, sessionId: string) =>
    api.get(`/interviews/${companyId}/interview-sessions/${sessionId}`),

  updateSession: (companyId: string, sessionId: string, payload: any) =>
    api.patch(`/interviews/${companyId}/interview-sessions/${sessionId}`, payload),

  // ── 4. AI Interview Endpoints ─────────────────────────────────
  getCompanyAIInterviews: (companyId: string, params?: { search?: string }) =>
    api.get(`/interviews/ai/${companyId}/ai-interviews`, { params }),

  generateAIQuestion: (companyId: string, sessionId: string) =>
    api.post(`/interviews/ai/${companyId}/interview-sessions/${sessionId}/generate-questions`),

  getAIEvaluationResult: (companyId: string, sessionId: string) =>
    api.get(`/interviews/ai/${companyId}/interview-sessions/${sessionId}/ai-result`),

  // ── 5. Candidate-Facing Interview Endpoints ──────────────────
  getCandidateInterviews: (params?: { type?: 'AI' | 'NORMAL' }) =>
    api.get('/interviews/candidate/my-interviews', { params }),

  getCandidateSessionDetails: (sessionId: string) =>
    api.get(`/interviews/candidate/sessions/${sessionId}`),
};
