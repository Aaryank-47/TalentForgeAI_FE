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
  sectionType: 'MCQ' | 'DSA' | 'MIXED' | 'MACHINE_CODING' | 'PROJECT';
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

  /** Add questions to an assessment section */
  addQuestionsToSection: async (assessmentId: string, sectionId: string, questionIds: string[]): Promise<any> => {
    const res = await api.post<{ success: boolean; data: any }>(`/assessments/${assessmentId}/sections/${sectionId}/items`, {
      questionIds,
    });
    return (res as any).data || res;
  },

  // ── Candidate: Attempt Flow ────────────────────────────────────────────────

  /** Get assessments assigned to the current candidate */
  getCandidateAssessments: () =>
    api.get<{ assessments: Array<Assessment & { attempt?: AssessmentAttempt }> }>('/candidate/assessments'),

  /** Start an assessment attempt */
  startAttempt: (assessmentId: string) =>
    api.post<StartAttemptResponse>(`/assessments/${assessmentId}/start`),

  /** Submit a completed attempt */
  submitAttempt: (attemptId: string, data: SubmitAttemptDto) =>
    api.post<{ attempt: AssessmentAttempt }>(`/assessments/attempts/${attemptId}/submit`, data),

  /** Get attempt result/details */
  getAttemptResult: (attemptId: string) =>
    api.get<{ attempt: AssessmentAttempt; answers: AssessmentAnswer[] }>(`/assessments/attempts/${attemptId}`),

  /** Save progress during an ongoing attempt */
  saveProgress: (attemptId: string, data: { answers: Record<string, string | number>; timeSpentSeconds: number }) =>
    api.patch(`/assessments/attempts/${attemptId}/progress`, data),

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
