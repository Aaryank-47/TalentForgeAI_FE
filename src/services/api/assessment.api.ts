/**
 * TalentForge — Assessment API Service
 *
 * Maps to the backend Assessment module endpoints.
 * Uses the centralized apiClient for all requests.
 *
 * BACKEND STATUS: Assessment module is currently being completed.
 * These endpoint paths match the expected backend API contract.
 * Some endpoints may not be fully available yet — check backend module status.
 */

import { api } from './apiClient';
import type { Assessment, AssessmentAttempt, AssessmentAnswer, AttemptStatus } from '../../types/assessment';

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface StartAttemptResponse {
  attempt: AssessmentAttempt;
  assessment: Assessment;
}

export interface SubmitAttemptDto {
  answers: Record<string, string | number>;
  timeSpentSeconds: number;
  violations?: Array<{
    type: string;
    timestamp: string;
    severity: string;
  }>;
}

export interface RunCodeDto {
  code: string;
  language: string;
  questionId: string;
}

export interface RunCodeResult {
  passed: boolean;
  passedCount: number;
  totalCount: number;
  runtimeMs: number;
  memoryMb: number;
  error?: string;
  output?: string;
}

export interface SubmitProjectDto {
  submissionUrl?: string;
  meta?: {
    githubUrl?: string;
    liveUrl?: string;
    zipUrl?: string;
    documentationUrl?: string;
    videoUrl?: string;
    notes?: string;
  };
}

export interface AssessmentSection {
  id: string;
  assessmentId: string;
  title: string;
  description?: string | null;
  instructions?: string | null;
  sectionType: string;
  durationMinutes?: number | null;
  displayOrder: number;
  items?: any[];
}

export interface AssessmentView {
  id: string;
  companyId: string;
  title: string;
  description?: string | null;
  instructions?: string | null;
  durationMinutes: number;
  passingScore: number;
  totalMarks: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isTemplate: boolean;
  createdAt: string;
  updatedAt: string;
  sections?: AssessmentSection[];
  _count?: {
    attempts: number;
    invitations: number;
  };
}

export interface CreateAssessmentPayload {
  companyId: string;
  title: string;
  description?: string;
  instructions?: string;
  durationMinutes: number;
  passingScore: number;
  totalMarks: number;
  isTemplate?: boolean;
}

export interface CreateAssessmentSectionPayload {
  title: string;
  description?: string;
  instructions?: string;
  sectionType: 'MCQ' | 'DSA' | 'MACHINE_CODING' | 'PROJECT';
  durationMinutes?: number;
}

// ─── Assessment API ───────────────────────────────────────────────────────────

export const assessmentApi = {
  // ── Recruiter: Manage Assessments ──────────────────────────────────────────

  /** List all assessments with filters */
  listAssessments: async (params?: { search?: string; status?: string; companyId?: string }): Promise<{ assessments: AssessmentView[]; total: number }> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await api.get<{ success: boolean; data: { assessments: AssessmentView[]; total: number } | AssessmentView[] }>(`/assessments${query}`);
    if (Array.isArray(res)) {
      return { assessments: res, total: res.length };
    }
    if (res && Array.isArray((res as any).data)) {
      return { assessments: (res as any).data, total: (res as any).data.length };
    }
    if (res && (res as any).data?.assessments) {
      return (res as any).data;
    }
    return { assessments: (res as any)?.assessments || [], total: (res as any)?.total || 0 };
  },

  /** Get a single assessment by ID */
  getAssessment: async (assessmentId: string): Promise<AssessmentView> => {
    const res = await api.get<{ success: boolean; data: AssessmentView }>(`/assessments/${assessmentId}`);
    return (res as any).data || res;
  },

  /** Create a new assessment */
  createAssessment: async (data: CreateAssessmentPayload): Promise<AssessmentView> => {
    const res = await api.post<{ success: boolean; data: AssessmentView }>('/assessments', data);
    return (res as any).data || res;
  },

  /** Update an assessment */
  updateAssessment: async (assessmentId: string, data: Partial<CreateAssessmentPayload>): Promise<AssessmentView> => {
    const res = await api.patch<{ success: boolean; data: AssessmentView }>(`/assessments/${assessmentId}`, data);
    return (res as any).data || res;
  },

  /** Delete an assessment */
  deleteAssessment: async (assessmentId: string): Promise<void> => {
    await api.delete(`/assessments/${assessmentId}`);
  },

  /** Publish an assessment (changes status from DRAFT to PUBLISHED) */
  publishAssessment: async (assessmentId: string): Promise<AssessmentView> => {
    const res = await api.patch<{ success: boolean; data: AssessmentView }>(`/assessments/${assessmentId}/publish`);
    return (res as any).data || res;
  },

  /** Archive an assessment */
  archiveAssessment: async (assessmentId: string): Promise<AssessmentView> => {
    const res = await api.patch<{ success: boolean; data: AssessmentView }>(`/assessments/${assessmentId}/archive`);
    return (res as any).data || res;
  },

  /** Duplicate an assessment */
  duplicateAssessment: async (assessmentId: string): Promise<AssessmentView> => {
    const res = await api.post<{ success: boolean; data: AssessmentView }>(`/assessments/${assessmentId}/duplicate`);
    return (res as any).data || res;
  },

  /** Add section to assessment */
  createAssessmentSection: async (assessmentId: string, data: CreateAssessmentSectionPayload): Promise<AssessmentSection> => {
    const res = await api.post<{ success: boolean; data: AssessmentSection }>(`/assessments/${assessmentId}/sections`, data);
    return (res as any).data || res;
  },

  /** Add questions to an assessment section (supports both (sectionId, questions) and legacy (assessmentId, sectionId, questions)) */
  addQuestionsToSection: async (
    arg1: string,
    arg2: string | Array<string | { questionId: string; marksOverride?: number; timeLimitOverride?: number }>,
    arg3?: Array<string | { questionId: string; marksOverride?: number; timeLimitOverride?: number }>
  ): Promise<any> => {
    let sectionId = arg1;
    let questionsInput = arg2;
    if (arg3 !== undefined) {
      // Legacy call: (assessmentId, sectionId, questions)
      sectionId = arg2 as string;
      questionsInput = arg3;
    }

    const rawList = Array.isArray(questionsInput) ? questionsInput : [];
    const formattedQuestions = rawList.map((q) => (typeof q === 'string' ? { questionId: q } : q));

    const res = await api.post<{ success: boolean; data: any }>(`/assessments/section/${sectionId}/questions`, {
      questions: formattedQuestions,
    });
    return (res as any).data || res;
  },

  /** Remove a question item from an assessment section */
  removeQuestionFromSection: async (sectionItemId: string): Promise<any> => {
    const res = await api.delete(`/assessments/section-items/${sectionItemId}`);
    return (res as any).data || res;
  },

  /** Update a section item (e.g. marks override, time limit, isRequired) */
  updateSectionItem: async (sectionItemId: string, data: { marksOverride?: number | null; timeLimitOverride?: number | null; isRequired?: boolean }): Promise<any> => {
    const res = await api.patch(`/assessments/section-items/${sectionItemId}`, data);
    return (res as any).data || res;
  },

  /** Get questions of a section */
  getSectionQuestions: async (sectionId: string): Promise<any[]> => {
    const res = await api.get<{ success: boolean; data: any[] }>(`/assessments/section/${sectionId}/questions`);
    return (res as any).data || res;
  },

  // ── Job Assessment Assignments ──────────────────────────────────────────────

  /** Attach one or more published assessments to a job */
  attachAssessmentsToJob: async (
    jobId: string,
    assessments: Array<{ assessmentId: string; displayOrder?: number; isMandatory?: boolean }>
  ): Promise<{ jobId: string; assignedCount: number }> => {
    const res = await api.post<{ success: boolean; message: string; data: { jobId: string; assignedCount: number } }>(
      `/assessments/assignments/job/${jobId}/assessments`,
      { assessments }
    );
    return (res as any).data || res;
  },

  /** Get all assessments assigned to a job */
  getJobAssessments: async (
    jobId: string
  ): Promise<Array<{ id: string; assessment: { id: string; title: string; status: string; durationMinutes: number | null } }>> => {
    const res = await api.get<{
      success: boolean;
      message: string;
      data: Array<{ id: string; assessment: { id: string; title: string; status: string; durationMinutes: number | null } }>;
    }>(`/assessments/assignments/job/${jobId}/assessments`);
    return (res as any).data || res;
  },

  /** Update/sync assessments assigned to a job */
  updateJobAssessments: async (
    jobId: string,
    assessments: Array<{ assessmentId: string; displayOrder?: number; isMandatory?: boolean }>
  ): Promise<{ jobId: string; assignedCount: number }> => {
    const res = await api.patch<{ success: boolean; message: string; data: { jobId: string; assignedCount: number } }>(
      `/assessments/assignments/job/${jobId}/assessments`,
      { assessments }
    );
    return (res as any).data || res;
  },

  /** Detach an assessment from a job (pass jobAssessmentId formatted as jobId_assessmentId) */
  removeJobAssessment: async (jobAssessmentId: string): Promise<void> => {
    await api.delete(`/assessments/assignments/job/${jobAssessmentId}`);
  },

  /** Reorder assessments for a job */
  reorderJobAssessments: async (
    jobId: string,
    assessments: Array<{ assessmentId: string; displayOrder: number }>
  ): Promise<void> => {
    await api.patch('/assessments/assignments/job/reorder', { jobId, assessments });
  },

  // ── Candidate: Attempt Flow & Invitations ─────────────────────────────────

  /** Recruiter: Invite candidate to assessment (POST /assessments/assignments/applications/:applicationId/assessment-invitation) */
  createAssessmentInvitation: async (
    applicationId: string,
    data: { assessmentId: string; expiresAt: string; sendEmail?: boolean }
  ): Promise<{ invitationId: string; assessmentId: string; token: string; expiresAt: string }> => {
    const res = await api.post<{ success: boolean; message: string; data: any }>(
      `/assessments/assignments/applications/${applicationId}/assessment-invitation`,
      data
    );
    return (res as any).data || res;
  },

  /** Fetch assessment invitation by application (GET /assessments/assignments/applications/:applicationId/assessment-invitation) */
  getAssessmentInvitation: async (applicationId: string): Promise<any> => {
    const res = await api.get<{ success: boolean; message: string; data: any }>(
      `/assessments/assignments/applications/${applicationId}/assessment-invitation`
    );
    return (res as any).data || res;
  },

  /** Validate invitation by token (GET /assessments/assignments/invitation/:token) */
  validateInvitation: async (token: string): Promise<any> => {
    const res = await api.get<{ success: boolean; message: string; data: any }>(
      `/assessments/assignments/invitation/${token}`
    );
    return (res as any).data || res;
  },

  /** Get candidate assessment scorecard/result by application (GET /assessment/applications/:applicationId/assessment-result) */
  getApplicationAssessmentResult: async (applicationId: string): Promise<any> => {
    const res = await api.get<{ success: boolean; message: string; data: any }>(
      `/assessment/applications/${applicationId}/assessment-result`
    );
    return (res as any).data || res;
  },

  /** Candidate: Start assessment attempt (POST /assessment-attempts/start) */
  startAssessmentAttempt: async (invitationToken: string): Promise<{ attemptId: string; assessmentId: string; status: string; startedAt: string; endsAt: string; remainingSeconds: number }> => {
    const res = await api.post<{ success: boolean; message: string; data: any }>(
      '/assessment-attempts/start',
      { invitationToken }
    );
    return (res as any).data || res;
  },

  /** Candidate: Get attempt details (GET /assessment-attempts/:attemptId) */
  getAttemptDetails: async (attemptId: string): Promise<any> => {
    const res = await api.get<{ success: boolean; message: string; data: any }>(
      `/assessment-attempts/${attemptId}`
    );
    return (res as any).data || res;
  },

  /** Candidate: Save question answer (PUT /assessment-attempts/:attemptId/answers/:questionId) */
  saveAssessmentAnswer: async (
    attemptId: string,
    questionId: string,
    data: {
      selectedOptionIds?: string[];
      codeResponse?: { code: string; language: string };
      submissionUrl?: string;
      attachmentUrls?: string[];
      meta?: any;
    }
  ): Promise<any> => {
    const res = await api.put<{ success: boolean; message: string; data: any }>(
      `/assessment-attempts/${attemptId}/answers/${questionId}`,
      data
    );
    return (res as any).data || res;
  },

  /** Candidate: Submit completed assessment (POST /assessment-attempts/:attemptId/submit) */
  submitAssessmentAttempt: async (attemptId: string): Promise<any> => {
    const res = await api.post<{ success: boolean; message: string; data: any }>(
      `/assessment-attempts/${attemptId}/submit`
    );
    return (res as any).data || res;
  },

  // ── Code Execution (BACKEND DEPENDENCY: requires sandboxed execution) ──────
  /**
   * Run code against test cases.
   * BACKEND DEPENDENCY: Requires sandboxed execution service (Judge0 or Docker worker).
   */
  runCode: (attemptId: string, data: RunCodeDto) =>
    api.post<RunCodeResult>(`/assessments/attempts/${attemptId}/run-code`, data),

  // ── Project Submission ─────────────────────────────────────────────────────

  /** Submit a project assessment */
  submitProject: (attemptId: string, data: SubmitProjectDto) =>
    api.post<{ answer: AssessmentAnswer }>(`/assessments/attempts/${attemptId}/project-submit`, data),

  // ── Admin/Recruiter: View Attempt Results ──────────────────────────────────

  /** Get all attempts for a specific assessment */
  getAssessmentAttempts: (assessmentId: string, params?: { status?: AttemptStatus }) => {
    const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return api.get<{ attempts: AssessmentAttempt[] }>(`/assessments/${assessmentId}/attempts${query}`);
  },
};
