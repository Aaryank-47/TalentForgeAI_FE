/**
 * TalentForge — Centralized API Client
 *
 * Single source of truth for all backend HTTP communication.
 * - Injects Authorization headers automatically
 * - Handles 401 → token refresh → retry
 * - Handles 403 / 404 / 429 / 5xx consistently
 *
 * All backend API service files import from this module.
 * DO NOT create ad-hoc fetch() calls in components.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';

// ─── Token Storage Helpers ────────────────────────────────────────────────────

const ACCESS_TOKEN_KEY = 'tf_access_token';

export const tokenStorage = {
  getAccessToken: (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string): void => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  clearAccessToken: (): void => localStorage.removeItem(ACCESS_TOKEN_KEY),
};

// ─── API Error ─────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  code: string;
  data?: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

// ─── Request Helpers ──────────────────────────────────────────────────────────

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  /** If true, send as multipart/form-data (skip JSON serialization) */
  isFormData?: boolean;
};

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (isJson && (body as { message?: string })?.message) ||
      `HTTP ${response.status}`;
    const code =
      (isJson && (body as { error?: string })?.error) ||
      `HTTP_${response.status}`;
    throw new ApiError(response.status, code, message, body);
  }

  // Unwrap TalentForge Backend ApiResponse { success, message, data }
  if (isJson && typeof body === 'object' && body !== null && 'success' in body && 'data' in body) {
    return (body as { data: T }).data;
  }

  return body as T;
}

let isRefreshing = false;
let pendingQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

async function refreshAccessToken(): Promise<string> {
  // Refresh tokens are sent via HttpOnly cookie by the backend.
  const response = await fetch(`${BASE_URL}/auth/new-refresh-token`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new ApiError(response.status, 'REFRESH_FAILED', 'Session expired. Please log in again.');
  }

  const data = (await response.json()) as { accessToken: string };
  tokenStorage.setAccessToken(data.accessToken);
  return data.accessToken;
}

// ─── Core Request Function ────────────────────────────────────────────────────

export async function request<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, isFormData, ...rest } = options;

  const buildHeaders = (): HeadersInit => {
    const headers: Record<string, string> = {};
    if (!isFormData) headers['Content-Type'] = 'application/json';
    return headers;
  };

  const makeRequest = async () =>
    fetch(`${BASE_URL}${path}`, {
      credentials: 'include',
      ...rest,
      headers: {
        ...buildHeaders(),
        ...rest.headers,
      },
      body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    });

  let response = await makeRequest();

  // ─── 401 → attempt refresh once ──────────────────────────────────────────
  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        await refreshAccessToken();
        
        // Resolve all queued requests (token is ignored as it's in a cookie)
        pendingQueue.forEach(({ resolve }) => resolve(''));
      } catch (err) {
        pendingQueue.forEach(({ reject }) => reject(err));
        // Dispatch a global auth failure event so AuthContext can clear state
        window.dispatchEvent(new CustomEvent('tf:auth:expired'));

        throw err;
      } finally {
        isRefreshing = false;
        pendingQueue = [];
      }
    } else {
      // Queue this request until refresh completes
      await new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      });
    }

    // Retry the original request (cookies are automatically attached)
    response = await makeRequest();
  }

  return handleResponse<T>(response);
}

// ─── Convenience Methods ──────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),

  upload: <T>(path: string, formData: FormData, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body: formData, isFormData: true }),
};
