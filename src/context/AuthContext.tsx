/**
 * TalentForge — Centralized Authentication Context
 *
 * Single source of truth for:
 *  - Current authenticated user
 *  - Platform role (CANDIDATE | EMPLOYER | ADMIN | SUPER_ADMIN)
 *  - Company membership role (OWNER | ADMIN | RECRUITER | HIRING_MANAGER)
 *  - Auth loading / error state
 *  - Login / Logout / session persistence
 *
 * RBAC Note:
 *   Platform Role   → comes from User.role (JWT claim)
 *   Company Role    → comes from CompanyMember.role (separate concept)
 *   Do NOT collapse these two into one.
 *
 * DO NOT scatter auth checks across components.
 * Use `useAuth()` hook and `usePermissions()` from lib/permissions.ts.
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { tokenStorage } from '../services/api/apiClient';
import { authApi } from '../services/api/auth.api';
import type { LoginDto, RegisterCandidateDto, RegisterEmployerDto } from '../services/api/auth.api';

// ─── Role Enums (mirrors backend exactly) ─────────────────────────────────────
export type UserRole = 'CANDIDATE' | 'EMPLOYER' | 'ADMIN' | 'SUPER_ADMIN';

export type CompanyMemberRole = 'OWNER' | 'ADMIN' | 'RECRUITER' | 'HIRING_MANAGER';

export type AccountStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BLOCKED';

// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  companyId?: string;
  companyRole?: CompanyMemberRole;
}

// ─── MOCK USERS FOR FRONTEND DEVELOPMENT ──────────────────────────────────────
const MOCK_USER_CANDIDATE: AuthUser = {
  id: 'cand-123',
  email: 'candidate@example.com',
  role: 'CANDIDATE',
  status: 'ACTIVE',
  isEmailVerified: true,
};

const MOCK_USER_EMPLOYER: AuthUser = {
  id: 'emp-456',
  email: 'employer@example.com',
  role: 'EMPLOYER',
  status: 'ACTIVE',
  isEmailVerified: true,
  companyId: 'comp-789',
  companyRole: 'RECRUITER'
};

// ─── State ────────────────────────────────────────────────────────────────────

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean; // true after first /auth/me attempt (success or fail)
  error: string | null;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: AuthUser | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'INITIALIZE' }
  | { type: 'CLEAR' }
  | { type: 'SET_COMPANY'; payload: { companyId: string; companyRole: CompanyMemberRole } }
  | { type: 'SET_ROLE'; payload: UserRole };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, error: null, isLoading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'INITIALIZE':
      return { ...state, isInitialized: true, isLoading: false };
    case 'CLEAR':
      return { user: null, isLoading: false, isInitialized: true, error: null };
    case 'SET_COMPANY':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          companyId: action.payload.companyId,
          companyRole: action.payload.companyRole,
        },
      };
    case 'SET_ROLE':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          role: action.payload,
        },
      };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AuthContextValue extends AuthState {
  /** Log in and store the access token */
  login: (dto: LoginDto) => Promise<AuthUser>;
  /** Register a new candidate account */
  registerCandidate: (dto: RegisterCandidateDto) => Promise<AuthUser>;
  /** Register a new employer / company owner */
  registerEmployer: (dto: RegisterEmployerDto) => Promise<AuthUser>;
  /** Log out from current device */
  logout: () => Promise<void>;
  /** Log out from all devices */
  logoutAll: () => Promise<void>;
  /** Set selected company */
  setSelectedCompany: (companyId: string, companyRole: CompanyMemberRole) => void;
  /** Set active user role */
  setUserRole: (role: UserRole) => void;
  /** Whether the user is fully authenticated */
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    isInitialized: false,
    error: null,
  });

  // ── On mount: restore session from stored token ──────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      // MOCK IMPLEMENTATION
      const role = localStorage.getItem('tf_mock_role');
      if (role === 'EMPLOYER') {
        dispatch({ type: 'SET_USER', payload: MOCK_USER_EMPLOYER });
      } else if (role === 'CANDIDATE') {
        dispatch({ type: 'SET_USER', payload: MOCK_USER_CANDIDATE });
      } else {
        dispatch({ type: 'SET_USER', payload: null });
      }
      dispatch({ type: 'INITIALIZE' });
    };

    restoreSession();
  }, []);

  // ── Listen for global auth expiry event from apiClient ────────────────────
  useEffect(() => {
    const handleExpired = () => {
      dispatch({ type: 'CLEAR' });
    };
    window.addEventListener('tf:auth:expired', handleExpired);
    return () => window.removeEventListener('tf:auth:expired', handleExpired);
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────

  const login = useCallback(async (dto: LoginDto): Promise<AuthUser> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    // MOCK IMPLEMENTATION: Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // If email contains 'employer' or 'recruiter', log in as Employer. Otherwise Candidate.
    const user = (dto.email.toLowerCase().includes('employer') || dto.email.toLowerCase().includes('recruiter'))
      ? MOCK_USER_EMPLOYER 
      : MOCK_USER_CANDIDATE;
      
    localStorage.setItem('tf_mock_role', user.role);
    dispatch({ type: 'SET_USER', payload: user });
    return user;
  }, []);

  const registerCandidate = useCallback(async (dto: RegisterCandidateDto): Promise<AuthUser> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    localStorage.setItem('tf_mock_role', MOCK_USER_CANDIDATE.role);
    dispatch({ type: 'SET_USER', payload: MOCK_USER_CANDIDATE });
    return MOCK_USER_CANDIDATE;
  }, []);

  const registerEmployer = useCallback(async (dto: RegisterEmployerDto): Promise<AuthUser> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    localStorage.setItem('tf_mock_role', MOCK_USER_EMPLOYER.role);
    dispatch({ type: 'SET_USER', payload: MOCK_USER_EMPLOYER });
    return MOCK_USER_EMPLOYER;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    localStorage.removeItem('tf_mock_role');
    dispatch({ type: 'CLEAR' });
  }, []);

  const logoutAll = useCallback(async (): Promise<void> => {
    localStorage.removeItem('tf_mock_role');
    dispatch({ type: 'CLEAR' });
  }, []);

  const setSelectedCompany = useCallback((companyId: string, companyRole: CompanyMemberRole) => {
    dispatch({ type: 'SET_COMPANY', payload: { companyId, companyRole } });
  }, []);

  const setUserRole = useCallback((role: UserRole) => {
    localStorage.setItem('tf_mock_role', role);
    dispatch({ type: 'SET_ROLE', payload: role });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      isAuthenticated: !!state.user && state.isInitialized,
      login,
      registerCandidate,
      registerEmployer,
      logout,
      logoutAll,
      setSelectedCompany,
      setUserRole,
    }),
    [state, login, registerCandidate, registerEmployer, logout, logoutAll, setSelectedCompany, setUserRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
