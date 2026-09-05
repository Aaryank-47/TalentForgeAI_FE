/**
 * TalentForge — Centralized API Client
 *
 * Single source of truth for all backend HTTP communication.
 * - Injects Authorization headers from in-memory Redux state
 * - Uses HttpOnly cookies for refresh token rotation (`credentials: 'include'`)
 * - Implements single-flight concurrent token refresh on 401
 * - Handles 400, 401, 403, 404, 409, 422, 429, 5xx cleanly
 */

import { store } from '../../store';
import { setAccessToken, clearAccessToken } from '../../store/slices/authSlice';
import { queryClient } from '../../lib/queryClient';
import { authKeys } from '../../constants/queryKeys';

// const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api/v1';
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';
// const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://talentforgeai-backend-uqrt.onrender.com/api/v1';
console.log("BASE_URL", BASE_URL);

export const tokenStorage = {
  getAccessToken: (): string | null => store.getState().auth.accessToken,
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
  /** Query parameters to append to the URL */
  params?: Record<string, unknown> | URLSearchParams;
  /** If true, send as multipart/form-data (skip JSON serialization) */
  isFormData?: boolean;
  /** Internal flag to prevent refresh recursion */
  _isRetry?: boolean;
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
    if ('tokens' in body) {
      const tokens = (body as any).tokens;
      if (tokens && tokens.accessToken) {
        store.dispatch(setAccessToken(tokens.accessToken));
      }
    }
    return (body as { data: T }).data;
  }

  return body as T;
}

// ─── Single-Flight Refresh Handler ────────────────────────────────────────────

let refreshPromise: Promise<string | null> | null = null;

export async function executeRefreshToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/new-refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new ApiError(response.status, 'REFRESH_FAILED', 'Session expired. Please log in again.');
      }

      const raw = await response.json();
      const tokenData = raw?.data ?? raw;
      const newToken = tokenData?.accessToken || null;

      if (newToken) {
        store.dispatch(setAccessToken(newToken));
      } else {
        store.dispatch(clearAccessToken());
      }

      return newToken;
    } catch (err) {
      store.dispatch(clearAccessToken());
      queryClient.removeQueries({ queryKey: authKeys.all });
      window.dispatchEvent(new CustomEvent('tf:auth:expired'));
      throw err;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ─── Core Request Function ────────────────────────────────────────────────────

export async function request<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, params, isFormData, _isRetry, ...rest } = options;

  let url = `${BASE_URL}${path}`;
  if (params) {
    let queryString = '';
    if (params instanceof URLSearchParams) {
      queryString = params.toString();
    } else {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      queryString = searchParams.toString();
    }

    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const buildHeaders = (): HeadersInit => {
    const headers: Record<string, string> = {};
    if (!isFormData) headers['Content-Type'] = 'application/json';
    
    // In-memory access token from Redux store
    const token = store.getState().auth.accessToken;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Active company workspace context
    const currentWorkspace = store.getState().workspace.currentWorkspace;
    if (currentWorkspace && currentWorkspace.type === 'COMPANY' && currentWorkspace.id) {
      headers['x-company-id'] = currentWorkspace.id;
    }

    return headers;
  };

  const makeRequest = async () =>
    fetch(url, {
      credentials: 'include',
      ...rest,
      headers: {
        ...buildHeaders(),
        ...rest.headers,
      },
      body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    });

  let response: Response;
  try {
    response = await makeRequest();
  } catch (netErr) {
    throw new ApiError(0, 'NETWORK_ERROR', 'Network error. Please check your connection.', netErr);
  }

  // ─── 401 Unauthorized Handling (Skip if it's already a refresh request or a retry) ───
  const isAuthEndpoint = path.includes('/auth/login') || path.includes('/auth/new-refresh-token') || path.includes('/auth/register');

  if (response.status === 401 && !_isRetry && !isAuthEndpoint) {
    try {
      await executeRefreshToken();
      // Retry the original request with new token
      return request<T>(path, { ...options, _isRetry: true });
    } catch (refreshErr) {
      return handleResponse<T>(response);
    }
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
