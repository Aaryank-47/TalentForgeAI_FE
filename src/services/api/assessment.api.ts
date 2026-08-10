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

// ─── Assessment API ───────────────────────────────────────────────────────────

export const assessmentApi = {
  // ── Recruiter: Manage Assessments ──────────────────────────────────────────

  /** List all assessments for the company */
  listAssessments: (params?: { status?: string; type?: string }) => {
    const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return api.get<{ assessments: Assessment[] }>(`/assessments${query}`);
  },

  /** Get a single assessment by ID */
  getAssessment: (id: string) =>
    api.get<{ assessment: Assessment }>(`/assessments/${id}`),

  /** Create a new assessment */
  createAssessment: (data: Partial<Assessment>) =>
    api.post<{ assessment: Assessment }>('/assessments', data),

  /** Update an assessment */
  updateAssessment: (id: string, data: Partial<Assessment>) =>
    api.put<{ assessment: Assessment }>(`/assessments/${id}`, data),

  /** Delete / archive an assessment */
  deleteAssessment: (id: string) =>
    api.delete(`/assessments/${id}`),

  /** Publish an assessment (changes status from draft to active) */
  publishAssessment: (id: string) =>
    api.patch(`/assessments/${id}/publish`),

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
