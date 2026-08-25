import { api } from './apiClient';

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'TEMPORARY';
export type WorkplaceType = 'ONSITE' | 'HYBRID' | 'REMOTE';
export type SalaryPeriod = 'HOURLY' | 'MONTHLY' | 'YEARLY';
export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';

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

  /** Update job details */
  updateJobDetails: async (companyId: string, jobId: string, payload: UpdateJobPayload): Promise<JobItem> => {
    const res = await api.patch<{ status: string; message: string; data: JobItem }>(
      `/jobs/company/${companyId}/job/${jobId}/update`,
      payload
    );
    return (res as any).data || res;
  },

  /** Update job status */
  updateJobStatus: async (companyId: string, jobId: string, status: JobStatus): Promise<JobItem> => {
    const res = await api.patch<{ status: string; message: string; data: JobItem }>(
      `/jobs/company/${companyId}/job/${jobId}/status`,
      { status }
    );
    return (res as any).data || res;
  },
};
