export const authKeys = {
  all: ['auth'] as const,
  me: ['auth', 'me'] as const,
};

export const companyKeys = {
  all: ['companies'] as const,
  metadata: ['companies', 'metadata'] as const,
  my: ['companies', 'my'] as const,
  detail: (id: string) => ['companies', 'detail', id] as const,
  search: (params?: Record<string, any>) => ['companies', 'search', params] as const,
  members: (companyId: string) => ['companies', 'members', companyId] as const,
  invitation: (token: string) => ['companies', 'invitation', token] as const,
};

export const candidateKeys = {
  all: ['candidate'] as const,
  me: ['candidate', 'me'] as const,
  skills: ['candidate', 'skills'] as const,
  completion: ['candidate', 'completion'] as const,
  resumes: ['candidate', 'resumes'] as const,
  educations: ['candidate', 'educations'] as const,
  experiences: ['candidate', 'experiences'] as const,
};

export const workflowKeys = {
  all: ['workflows'] as const,
  list: (companyId: string, status?: string) => ['workflows', companyId, status] as const,
  detail: (companyId: string, workflowId: string) => ['workflows', companyId, 'detail', workflowId] as const,
};

export const stageLibraryKeys = {
  all: ['stage-library'] as const,
  list: (companyId: string) => ['stage-library', companyId] as const,
};


export const questionKeys = {
  all: ['questions'] as const,
  list: (params?: Record<string, any>) => ['questions', 'list', params] as const,
  detail: (id: string) => ['questions', 'detail', id] as const,
  categories: ['questions', 'categories'] as const,
  tags: ['questions', 'tags'] as const,
  languages: ['questions', 'languages'] as const,
};

export const assessmentKeys = {
  all: ['assessments'] as const,
  list: (params?: Record<string, any>) => ['assessments', 'list', params] as const,
  detail: (id: string) => ['assessments', 'detail', id] as const,
};

export const jobKeys = {
  all: ['jobs'] as const,
  list: (companyId: string) => ['jobs', 'list', companyId] as const,
  detail: (companyId: string, jobId: string) => ['jobs', 'detail', companyId, jobId] as const,
  assessments: (jobId: string) => ['jobs', 'assessments', jobId] as const,
};





