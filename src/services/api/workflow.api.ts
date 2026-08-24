/**
 * TalentForge — Workflow API Service
 *
 * Connects frontend to Backend Hiring Workflow routes:
 * POST   /api/v1/hiring-workflow/company/:companyId/workflow
 * GET    /api/v1/hiring-workflow/company/:companyId/workflows
 * GET    /api/v1/hiring-workflow/company/:companyId/workflow/:workflowId
 * PUT    /api/v1/hiring-workflow/company/:companyId/workflow/:workflowId
 * DELETE /api/v1/hiring-workflow/company/:companyId/workflow/:workflowId
 * PATCH  /api/v1/hiring-workflow/company/:companyId/workflow/:workflowId/default
 */

import { api } from './apiClient';

export interface WorkflowStageView {
  id: string;
  workflowId: string;
  stageLibraryId: string;
  order?: number;
  assessmentId?: string | null;
  assessment?: {
    id: string;
    title: string;
    status: string;
  } | null;
  stageLibrary: {
    id: string;
    name: string;
    type: string;
    description?: string | null;
    isActive?: boolean;
  };
}

export interface WorkflowItem {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  stages?: WorkflowStageView[];
  _count?: {
    jobs: number;
    applicationWorkflows?: number;
  };
}

export interface CreateWorkflowDto {
  name: string;
  description?: string;
  stages: (string | { name: string; assessmentId?: string | null })[];
}

export interface UpdateWorkflowDto {
  name: string;
  description?: string;
  isDefault?: boolean;
  stages: {
    stageLibraryId: string;
    order: number;
    assessmentId?: string | null;
  }[];
}

export const workflowApi = {
  /**
   * List all workflows for a company
   */
  getWorkflows: async (companyId: string, status?: 'ACTIVE' | 'INACTIVE'): Promise<WorkflowItem[]> => {
    const query = status ? `?status=${status}` : '';
    return api.get<WorkflowItem[]>(
      `/hiring-workflow/company/${companyId}/workflows${query}`
    );
  },

  /**
   * Get single workflow details by ID
   */
  getWorkflowDetails: async (companyId: string, workflowId: string): Promise<WorkflowItem> => {
    return api.get<WorkflowItem>(
      `/hiring-workflow/company/${companyId}/workflow/${workflowId}`
    );
  },

  /**
   * Create a new hiring workflow with stage names
   */
  createWorkflow: async (companyId: string, payload: CreateWorkflowDto): Promise<WorkflowItem> => {
    return api.post<WorkflowItem>(
      `/hiring-workflow/company/${companyId}/workflow`,
      payload
    );
  },

  /**
   * Update workflow details and stage order
   */
  updateWorkflow: async (
    companyId: string,
    workflowId: string,
    payload: UpdateWorkflowDto
  ): Promise<WorkflowItem> => {
    return api.put<WorkflowItem>(
      `/hiring-workflow/company/${companyId}/workflow/${workflowId}`,
      payload
    );
  },

  /**
   * Delete a workflow
   */
  deleteWorkflow: async (companyId: string, workflowId: string): Promise<void> => {
    await api.delete(`/hiring-workflow/company/${companyId}/workflow/${workflowId}`);
  },

  /**
   * Mark workflow as default for the company
   */
  setDefaultWorkflow: async (companyId: string, workflowId: string): Promise<WorkflowItem> => {
    return api.patch<WorkflowItem>(
      `/hiring-workflow/company/${companyId}/workflow/${workflowId}/default`
    );
  },
};

export interface StageLibraryItem {
  id: string;
  name: string;
  type: string;
  description?: string | null;
  isActive: boolean;
  companyId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomStageDto {
  name: string;
  type?: string;
}

export interface UpdateCustomStageDto {
  name: string;
  type: string;
}

export const stageLibraryApi = {
  /**
   * Get all system and company custom stages
   */
  getStages: async (companyId: string): Promise<StageLibraryItem[]> => {
    return api.get<StageLibraryItem[]>(
      `/hiring-workflow/stage-library/company/${companyId}/stages`
    );
  },

  /**
   * Create a new custom stage for a company
   */
  createCustomStage: async (
    companyId: string,
    payload: CreateCustomStageDto
  ): Promise<StageLibraryItem> => {
    return api.post<StageLibraryItem>(
      `/hiring-workflow/stage-library/company/${companyId}/custom-stage`,
      payload
    );
  },

  /**
   * Update a custom stage
   */
  updateCustomStage: async (
    companyId: string,
    stageId: string,
    payload: UpdateCustomStageDto
  ): Promise<StageLibraryItem> => {
    return api.patch<StageLibraryItem>(
      `/hiring-workflow/stage-library/company/${companyId}/stage/${stageId}`,
      payload
    );
  },

  /**
   * Delete a custom stage
   */
  deleteCustomStage: async (companyId: string, stageId: string): Promise<void> => {
    await api.delete(
      `/hiring-workflow/stage-library/company/${companyId}/stage/${stageId}`
    );
  },
};

