export const authKeys = {
  all: ['auth'] as const,
  me: ['auth', 'me'] as const,
};

export const companyKeys = {
  all: ['companies'] as const,
  metadata: ['companies', 'metadata'] as const,
  my: ['companies', 'my'] as const,
  detail: (id: string) => ['companies', 'detail', id] as const,
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

