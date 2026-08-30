import { api } from './apiClient';

export type EmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'INTERN'
  | 'FREELANCE'
  | 'TEMPORARY'
  | 'APPRENTICESHIP';
export type WorkplaceType = 'ONSITE' | 'HYBRID' | 'REMOTE';
export type SalaryPeriod = 'HOURLY' | 'MONTHLY' | 'YEARLY';
export type JobStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'PAUSED'
  | 'CLOSED'
  | 'FILLED'
  | 'EXPIRED'
  | 'ARCHIVED';

export interface JobSkillItem {
  id?: string;
  name: string;
  isRequired?: boolean;
}

export interface JobBenefitItem {
  id?: string;
  benefit: string;
}

export interface JobItem {
  id: string;
  companyId: string;
  title: string;
  slug: string;
  summary?: string | null;
  description: string;
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  status: JobStatus;
  visibility: string;
  vacancies: number;
  location: string | null;
  minExperience: number;
  maxExperience: number;
  minimumSalary: number | null;
  maximumSalary: number | null;
  salaryPeriod: SalaryPeriod | null;
  hideSalary: boolean;
  applicationDeadline: string | null;
  publishedAt: string | null;
  closedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  skills: JobSkillItem[];
  benefits: JobBenefitItem[];
  workflowId: string | null;
  workflow?: {
    id: string;
    name: string;
    stages?: any[];
  } | null;
  _count?: {
    applications: number;
  };
}

export interface CreateJobPayload {
  title: string;
  description: string;
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  vacancies?: number;
  location?: string;
  minExperience?: number;
  maxExperience?: number;
  minimumSalary?: number;
  maximumSalary?: number;
  salaryPeriod?: SalaryPeriod;
  hideSalary?: boolean;
  applicationDeadline?: string;
  skills: string[];
  benefits?: string[];
  workflowId: string;
  status?: JobStatus;
}

export interface UpdateJobPayload {
  title?: string;
  description?: string;
  employmentType?: EmploymentType;
  workplaceType?: WorkplaceType;
  vacancies?: number;
  location?: string;
  minExperience?: number;
  maxExperience?: number;
  minimumSalary?: number;
  maximumSalary?: number;
  salaryPeriod?: SalaryPeriod;
  hideSalary?: boolean;
  applicationDeadline?: string;
  skills?: string[];
  benefits?: string[];
  workflowId?: string;
}

export const jobApi = {
  /** List all jobs for a company */
  listCompanyJobs: async (companyId: string): Promise<JobItem[]> => {
    const res = await api.get<{ status: string; message: string; data: JobItem[] }>(
      `/jobs/company/${companyId}/job/posts`
    );
    return (res as any).data || res;
  },

  /** Create a job posting */
  createJob: async (companyId: string, payload: CreateJobPayload): Promise<JobItem> => {
    const res = await api.post<{ status: string; message: string; data: JobItem }>(
      `/jobs/company/${companyId}/job`,
      payload
    );
    return (res as any).data || res;
  },

  /** Get specific job details */
  getJobDetails: async (companyId: string, jobId: string): Promise<JobItem> => {
    const res = await api.get<{ status: string; message: string; data: JobItem }>(
      `/jobs/company/${companyId}/jobs/${jobId}`
    );
    return (res as any).data || res;
  },

  /** List all published jobs for candidates (public) */
  listPublishedJobs: async (params?: {
    search?: string;
    employmentType?: string;
    workplaceType?: string;
    location?: string;
  }): Promise<JobItem[]> => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.employmentType) query.append('employmentType', params.employmentType);
    if (params?.workplaceType) query.append('workplaceType', params.workplaceType);
    if (params?.location) query.append('location', params.location);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await api.get<{ status: string; message: string; data: JobItem[] }>(
      `/jobs/published${queryString}`
    );
    return (res as any).data || res;
  },

  /** Get single published job details (public) */
  getPublicJob: async (jobId: string): Promise<JobItem> => {
    const res = await api.get<{ status: string; message: string; data: JobItem }>(
      `/jobs/published/${jobId}`
    );
    return (res as any).data || res;
  },

  /** Update job details */
  updateJobDetails: async (
    companyId: string,
    jobId: string,
    payload: UpdateJobPayload
  ): Promise<JobItem> => {
    const res = await api.patch<{ status: string; message: string; data: JobItem }>(
      `/jobs/company/${companyId}/job/${jobId}/update`,
      payload
    );
    return (res as any).data || res;
  },

  /** Update job status (DRAFT | PUBLISHED | CLOSED | ARCHIVED) */
  updateJobStatus: async (
    companyId: string,
    jobId: string,
    status: JobStatus
  ): Promise<JobItem> => {
    const res = await api.patch<{ status: string; message: string; data: JobItem }>(
      `/jobs/company/${companyId}/job/${jobId}/status`,
      { status }
    );
    return (res as any).data || res;
  },

  // ── Saved Jobs (Candidate) ──────────────────────────────────
  /** Fetch all saved jobs (GET /jobs/saved) */
  getSavedJobs: async (): Promise<any[]> => {
    const res: any = await api.get<any>('/jobs/saved');
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    return [];
  },

  /** Save a job (POST /jobs/:jobId/save) */
  saveJob: (jobId: string) =>
    api.post<any>(`/jobs/${jobId}/save`),

  /** Unsave a job (DELETE /jobs/:jobId/save) */
  unsaveJob: (jobId: string) =>
    api.delete<any>(`/jobs/${jobId}/save`),

  // ── Matching (AI Candidate & Job Matching) ─────────────────
  /** Fetch AI-matched jobs for current candidate */
  getMatchedJobs: async (params?: { page?: number; limit?: number; minScore?: number }) =>
    api.get<any>('/matching/candidate/matched-jobs', { params }),

  /** Trigger candidate matching recalculation */
  recalculateCandidateMatches: async () =>
    api.post<any>('/matching/candidate/recalculate-matches'),

  /** Fetch AI-matched candidates for a specific job (Recruiter) */
  getMatchedCandidatesForJob: async (jobId: string, params?: { page?: number; limit?: number; minScore?: number }) =>
    api.get<any>(`/matching/recruiter/jobs/${jobId}/matched-candidates`, { params }),

  /** Trigger job matching recalculation (Recruiter) */
  recalculateJobMatches: async (jobId: string) =>
    api.post<any>(`/matching/recruiter/jobs/${jobId}/recalculate-matches`),
};

