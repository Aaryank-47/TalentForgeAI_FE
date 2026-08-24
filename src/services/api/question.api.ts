/**
 * TalentForge — Question API Service
 *
 * Connects Frontend to Backend Question Bank routes:
 * GET    /api/v1/questions
 * POST   /api/v1/questions
 * GET    /api/v1/questions/:id
 * PATCH  /api/v1/questions/:id
 * DELETE /api/v1/questions/:id
 * PATCH  /api/v1/questions/:id/publish
 * PATCH  /api/v1/questions/:id/archive
 * POST   /api/v1/questions/:id/duplicate
 * GET    /api/v1/questions/categories
 * GET    /api/v1/questions/tags
 * GET    /api/v1/questions/languages
 */

import { api } from './apiClient';

export type QuestionType = 'MCQ' | 'DSA' | 'MACHINE_CODING' | 'PROJECT';
export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type QuestionStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type QuestionOwnership = 'SYSTEM' | 'COMPANY';

export interface QuestionOption {
  id?: string;
  optionText: string;
  displayOrder: number;
  isCorrect: boolean;
}

export interface TestCase {
  id?: string;
  input: string;
  expectedOutput: string;
  type?: 'SAMPLE' | 'HIDDEN';
  explanation?: string | null;
  displayOrder: number;
}

export interface ProgrammingLanguage {
  id: string;
  name: string;
  isActive: boolean;
}

export interface QuestionCategory {
  id: string;
  name: string;
  parentId?: string | null;
}

export interface QuestionTag {
  id: string;
  name: string;
}

export interface QuestionItem {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  estimatedTime: number;
  defaultMarks: number;
  ownership: QuestionOwnership;
  status: QuestionStatus;
  categoryId?: string | null;
  category?: QuestionCategory | null;
  tags?: Array<{ tag: QuestionTag }>;
  companyId?: string | null;
  createdAt: string;
  updatedAt: string;
  mcqDetail?: {
    id: string;
    allowMultipleCorrectAnswers: boolean;
    negativeMarks: number;
    options: QuestionOption[];
  } | null;
  dsaDetail?: {
    id: string;
    starterCode: string;
    referenceSolution?: string;
    memoryLimit: number;
    timeLimit: number;
    supportedLanguages?: Array<{ programmingLanguage: ProgrammingLanguage }>;
    testCases: TestCase[];
  } | null;
  machineCodingDetail?: {
    id?: string;
    repositoryTemplate?: string | null;
    projectStructure?: string | null;
    techStack?: string | null;
    implementationInstructions: string;
    evaluationGuidelines?: string | null;
  } | null;
  projectDetail?: {
    id?: string;
    requirements: string;
    submissionInstructions: string;
    deadlineHours: number;
  } | null;
}

export interface GetQuestionsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: QuestionType;
  difficulty?: QuestionDifficulty;
  status?: QuestionStatus;
  ownership?: QuestionOwnership;
  categoryId?: string;
  companyId?: string;
  sortBy?: 'title' | 'createdAt' | 'difficulty' | 'defaultMarks';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateQuestionPayload {
  title: string;
  description: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  estimatedTime: number;
  defaultMarks: number;
  ownership: QuestionOwnership;
  categoryId?: string | null;
  tagIds?: string[];
  companyId?: string | null;
  mcqDetail?: {
    allowMultipleCorrectAnswers?: boolean;
    negativeMarks?: number;
    options: Array<{ optionText: string; displayOrder: number; isCorrect: boolean }>;
  } | null;
  dsaDetail?: {
    starterCode: string;
    referenceSolution?: string;
    memoryLimit: number;
    timeLimit: number;
    supportedLanguageIds: string[];
    testCases: Array<{
      input: string;
      expectedOutput: string;
      type?: 'SAMPLE' | 'HIDDEN';
      explanation?: string | null;
      displayOrder: number;
    }>;
  } | null;
  machineCodingDetail?: {
    repositoryTemplate?: string | null;
    projectStructure?: string | null;
    techStack?: string | null;
    implementationInstructions: string;
    evaluationGuidelines?: string | null;
  } | null;
  projectDetail?: {
    requirements: string;
    submissionInstructions: string;
    deadlineHours: number;
  } | null;
}

export const questionApi = {
  /**
   * List all questions with filters
   */
  getQuestions: async (params?: GetQuestionsParams): Promise<{ questions: QuestionItem[]; total: number }> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await api.get<{ success: boolean; data: { questions: QuestionItem[]; total: number } | QuestionItem[] }>(
      `/questions${query}`
    );
    if (Array.isArray(res)) {
      return { questions: res, total: res.length };
    }
    if (res && Array.isArray((res as any).data)) {
      return { questions: (res as any).data, total: (res as any).data.length };
    }
    if (res && (res as any).data?.questions) {
      return (res as any).data;
    }
    return { questions: (res as any)?.questions || [], total: (res as any)?.total || 0 };
  },

  /**
   * Get single question by ID
   */
  getQuestionById: async (id: string): Promise<QuestionItem> => {
    const res = await api.get<{ success: boolean; data: QuestionItem }>(`/questions/${id}`);
    return (res as any).data || res;
  },

  /**
   * Create question
   */
  createQuestion: async (payload: CreateQuestionPayload): Promise<QuestionItem> => {
    const res = await api.post<{ success: boolean; data: QuestionItem }>('/questions', payload);
    return (res as any).data || res;
  },

  /**
   * Update question
   */
  updateQuestion: async (id: string, payload: Partial<CreateQuestionPayload>): Promise<QuestionItem> => {
    const res = await api.patch<{ success: boolean; data: QuestionItem }>(`/questions/${id}`, payload);
    return (res as any).data || res;
  },

  /**
   * Delete question
   */
  deleteQuestion: async (id: string): Promise<void> => {
    await api.delete(`/questions/${id}`);
  },

  /**
   * Remove a tag from a question
   */
  removeTagFromQuestion: async (questionId: string, tagId: string): Promise<void> => {
    await api.delete(`/questions/${questionId}/tags/${tagId}`);
  },

  /**
   * Publish question
   */
  publishQuestion: async (id: string): Promise<QuestionItem> => {
    const res = await api.patch<{ success: boolean; data: QuestionItem }>(`/questions/${id}/publish`);
    return (res as any).data || res;
  },

  /**
   * Duplicate question
   */
  duplicateQuestion: async (id: string): Promise<QuestionItem> => {
    const res = await api.post<{ success: boolean; data: QuestionItem }>(`/questions/${id}/duplicate`);
    return (res as any).data || res;
  },

  // ── Categories ─────────────────────────────────────────────────────────────

  /**
   * Get question categories
   */
  getCategories: async (): Promise<QuestionCategory[]> => {
    const res = await api.get<{ success: boolean; data: QuestionCategory[] | { categories: QuestionCategory[] } }>('/questions/categories');
    if (Array.isArray(res)) return res;
    if (res && Array.isArray((res as any).data)) return (res as any).data;
    if (res && (res as any).data?.categories) return (res as any).data.categories;
    return [];
  },

  createCategory: async (payload: { name: string; parentId?: string | null }): Promise<QuestionCategory> => {
    const res = await api.post<{ success: boolean; data: QuestionCategory }>('/questions/categories', payload);
    return (res as any).data || res;
  },

  deleteCategory: async (categoryId: string): Promise<void> => {
    await api.delete(`/questions/categories/${categoryId}`);
  },

  // ── Tags ───────────────────────────────────────────────────────────────────

  /**
   * Get question tags
   */
  getTags: async (): Promise<QuestionTag[]> => {
    const res = await api.get<{ success: boolean; data: QuestionTag[] | { tags: QuestionTag[] } }>('/questions/tags');
    if (Array.isArray(res)) return res;
    if (res && Array.isArray((res as any).data)) return (res as any).data;
    if (res && (res as any).data?.tags) return (res as any).data.tags;
    return [];
  },

  createTag: async (payload: { name: string }): Promise<QuestionTag> => {
    const res = await api.post<{ success: boolean; data: QuestionTag }>('/questions/tags', payload);
    return (res as any).data || res;
  },

  deleteTag: async (tagId: string): Promise<void> => {
    await api.delete(`/questions/tags/${tagId}`);
  },

  // ── Languages ──────────────────────────────────────────────────────────────

  /**
   * Get programming languages
   */
  getLanguages: async (): Promise<ProgrammingLanguage[]> => {
    const res = await api.get<{ success: boolean; data: ProgrammingLanguage[] | { languages: ProgrammingLanguage[] } }>('/questions/languages');
    if (Array.isArray(res)) return res;
    if (res && Array.isArray((res as any).data)) return (res as any).data;
    if (res && (res as any).data?.languages) return (res as any).data.languages;
    return [];
  },

  createLanguage: async (payload: { name: string; isActive?: boolean }): Promise<ProgrammingLanguage> => {
    const res = await api.post<{ success: boolean; data: ProgrammingLanguage }>('/questions/languages', payload);
    return (res as any).data || res;
  },

  deleteLanguage: async (id: string): Promise<void> => {
    await api.delete(`/questions/languages/${id}`);
  },
};

