export const authKeys = {
  all: ['auth'] as const,
  me: ['auth', 'me'] as const,
};

export const companyKeys = {
  all: ['companies'] as const,
  my: ['companies', 'my'] as const,
  detail: (id: string) => ['companies', 'detail', id] as const,
};
