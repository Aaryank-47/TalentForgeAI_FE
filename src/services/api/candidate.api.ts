/**
 * TalentForge — Candidate API Service
 *
 * Handles candidate profile, settings, skills, resumes, educations, and experiences.
 */

import { api } from './apiClient';

export interface CandidateSkill {
  id: string;
  name: string;
  yearsOfExperience: number;
  candidateId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type GradingSystem =
  | 'PERCENTAGE'
  | 'CGPA'
  | 'GPA_4'
  | 'GPA_5'
  | 'GPA_10'
  | 'LETTER_GRADE'
  | 'PASS_FAIL'
  | 'OTHER';

export type EmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'INTERNSHIP'
  | 'FREELANCE'
  | 'REMOTE';

export interface CandidateEducation {
  id: string;
  candidateId: string;
  collegeName: string;
  degree: string;
  fieldOfStudy: string;
  currentlyStudying: boolean;
  startDate: string;
  endDate?: string | null;
  gradingSystem: GradingSystem;
  gradeText?: string | null;
  grade?: number | null;
}

export interface CandidateExperience {
  id: string;
  candidateId: string;
  companyName: string;
  designation: string;
  employmentType: EmploymentType;
  description: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  currentlyWorking: boolean;
}

export interface ResumeProcessingState {
  resumeId: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'QUEUED';
  stage: 'QUEUED' | 'FETCHING_FILE' | 'EXTRACTION' | 'AI_PARSING' | 'NORMALIZATION' | 'PERSISTENCE' | 'COMPLETED' | 'FAILED';
  progress: number;
  message: string;
  updatedAt: string;
}

export interface CandidateResume {
  id: string;
  resumeName: string;
  resumeUrl: string;
  fileSize: number;
  uploadedAt: string;
  parsingStatus: string;
  parsingError?: string | null;
  parsingStartedAt?: string | null;
  parsingCompletedAt?: string | null;
  processing?: ResumeProcessingState | null;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber?: string | null;
  profilePicture?: string | null;
  headline?: string | null;
  bio?: string | null;
  gender?: string | null;
  experienceLevel?: string | null;
  currentLocation?: string | null;
  preferredLocation?: string | null;
  currentCompany?: string | null;
  currentDesignation?: string | null;
  totalExperience?: number | null;
  expectedSalary?: number | null;
  currentSalary?: number | null;
  noticePeriod?: number | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  websiteUrl?: string | null;
  isOpenToWork?: boolean;
  profileCompletion?: number;
  createdAt?: string;
  updatedAt?: string;
  skills: CandidateSkill[];
  resumes?: CandidateResume[];
  educations?: CandidateEducation[];
  experiences?: CandidateExperience[];
}

export interface UpdateCandidateProfileDto {
  fullName?: string;
  phoneNumber?: string;
  profilePicture?: string;
  headline?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  experienceLevel?: string;
  currentLocation?: string;
  preferredLocation?: string;
  currentCompany?: string;
  currentDesignation?: string;
  totalExperience?: number;
  expectedSalary?: number;
  currentSalary?: number;
  noticePeriod?: number;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  websiteUrl?: string;
  isOpenToWork?: boolean;
}

export interface AddSkillDto {
  skillName: string;
  skillExperience: number;
}

export interface AddEducationDto {
  collegeName: string;
  degree: string;
  fieldOfStudy: string;
  currentlyStudying?: boolean;
  startDate: string;
  endDate?: string;
  gradingSystem: GradingSystem;
  gradeText?: string;
  grade?: number;
}

export interface UpdateEducationDto extends Partial<AddEducationDto> {}

export interface AddExperienceDto {
  companyName: string;
  designation: string;
  employmentType: EmploymentType;
  description: string;
  location?: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
}

export interface UpdateExperienceDto extends Partial<AddExperienceDto> {}

export const candidateApi = {
  /** Fetch candidate profile */
  getCandidateProfile: () =>
    api.get<CandidateProfile>('/candidate/me'),

  /** Update candidate profile */
  updateCandidateProfile: (data: UpdateCandidateProfileDto) =>
    api.patch<CandidateProfile>('/candidate/me', data),

  /** Get skills list */
  getSkills: () =>
    api.get<CandidateSkill[]>('/candidate/skills'),

  /** Add skills */
  addSkills: (skills: AddSkillDto[]) =>
    api.post<CandidateSkill[]>('/candidate/skills', { skills }),

  /** Update single skill */
  updateSkill: (skillId: string, data: AddSkillDto) =>
    api.patch<CandidateSkill>(`/candidate/skills/${skillId}`, data),

  /** Delete skills by IDs */
  deleteSkills: (skillIds: string[]) =>
    api.delete<null>('/candidate/skills/delete', { body: { skillIds } }),

  /** Get profile completion percentage */
  getProfileCompletion: () =>
    api.get<{ completion: number }>('/candidate/me/profile-completion'),

  // ── Educations ───────────────────────────────────────────────
  /** Get all educations */
  getEducations: () =>
    api.get<CandidateEducation[]>('/candidate/educations'),

  /** Get single education by ID */
  getEducationById: (educationId: string) =>
    api.get<CandidateEducation>(`/candidate/educations/${educationId}`),

  /** Add education */
  addEducation: (data: AddEducationDto) =>
    api.post<CandidateEducation>('/candidate/educations', data),

  /** Update education */
  updateEducation: (educationId: string, data: UpdateEducationDto) =>
    api.patch<CandidateEducation>(`/candidate/educations/${educationId}`, data),

  /** Delete education */
  deleteEducation: (educationId: string) =>
    api.delete<null>(`/candidate/educations/${educationId}`),

  // ── Experiences ──────────────────────────────────────────────
  /** Get all experiences */
  getExperiences: () =>
    api.get<CandidateExperience[]>('/candidate/experiences'),

  /** Get single experience by ID */
  getExperienceById: (experienceId: string) =>
    api.get<CandidateExperience>(`/candidate/experiences/${experienceId}`),

  /** Add experience */
  addExperience: (data: AddExperienceDto) =>
    api.post<CandidateExperience>('/candidate/experiences', data),

  /** Update experience */
  updateExperience: (experienceId: string, data: UpdateExperienceDto) =>
    api.patch<CandidateExperience>(`/candidate/experiences/${experienceId}`, data),

  /** Delete experience */
  deleteExperience: (experienceId: string) =>
    api.delete<null>(`/candidate/experiences/${experienceId}`),

  // ── Resumes ──────────────────────────────────────────────────
  /** Upload a resume file (POST /resume/upload) */
  uploadResume: (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post<{ resumeId: string; jobId: string; status: string }>('/resume/upload', formData, {
      isFormData: true,
    });
  },

  /** Get all resumes belonging to current candidate (GET /resume/my) */
  getResumes: () =>
    api.get<CandidateResume[]>('/resume/my'),

  /** Get single resume details by ID (GET /resume/:resumeId) */
  getResumeById: (resumeId: string) =>
    api.get<CandidateResume>(`/resume/${resumeId}`),

  /** Retry background parsing for a failed/stuck resume (POST /resume/:resumeId/retry) */
  retryResumeProcessing: (resumeId: string) =>
    api.post<{ resumeId: string; jobId: string; status: string }>(`/resume/${resumeId}/retry`),

  /** Delete a single resume by ID (DELETE /resume/:resumeId) */
  deleteResume: (resumeId: string) =>
    api.delete<{ message: string }>(`/resume/${resumeId}`),

  /** Delete multiple resumes (DELETE /resume) */
  deleteResumes: (resumeIds: string[]) =>
    api.delete<{ message: string }>('/resume', { body: { resumeIds } }),

  // ── Candidate Applications ───────────────────────────────────
  /** Apply to a published job with selected resume (POST /candidate/applications/:jobId/apply/:resumeId) */
  applyJob: (jobId: string, resumeId: string) =>
    api.post<any>(`/candidate/applications/${jobId}/apply/${resumeId}`),

  /** Fetch all candidate applications with pagination and filters (GET /candidate/applications/candidate/my/applications) */
  getMyApplications: (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return api.get<any>(`/candidate/applications/candidate/my/applications${queryString}`);
  },

  /** Fetch details of a single application (GET /candidate/applications/candidate/my/application/:applicationId) */
  getMyApplicationDetails: (applicationId: string) =>
    api.get<any>(`/candidate/applications/candidate/my/application/${applicationId}`),

  /** Withdraw an application (PATCH /candidate/applications/candidate/withdraw/:applicationId) */
  withdrawApplication: (applicationId: string, remarks?: string) =>
    api.patch<any>(`/candidate/applications/candidate/withdraw/${applicationId}`, { remarks }),

  // ── Preferences ──────────────────────────────────────────────
  /** Toggle Open To Work status */
  toggleOpenToWork: (isOpenToWork: boolean) =>
    api.patch<CandidateProfile>('/candidate/open-to-work', { isOpenToWork }),

  /** Update salary preferences */
  updateSalaryPreferences: (data: { expectedSalary?: number; currentSalary?: number }) =>
    api.patch<CandidateProfile>('/candidate/salary-preferences', data),

  /** Update location preferences */
  updateLocationPreferences: (data: { preferredLocation?: string; currentLocation?: string }) =>
    api.patch<CandidateProfile>('/candidate/location-preferences', data),
};


