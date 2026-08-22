/**
 * TalentForge — Centralized Authentication Context & State Orchestration
 *
 * Bridge between:
 *  - Redux Toolkit (client-side in-memory auth state: accessToken, status, isInitialized)
 *  - TanStack Query (server-side authoritative state: ['auth', 'me'], ['companies', 'my'])
 *
 * Security Guarantee:
 *  - Access token lives ONLY in Redux memory (never in localStorage/sessionStorage/cookies).
 *  - Refresh token lives in backend-controlled HttpOnly cookie.
 *  - On F5 / initial boot: calls /auth/new-refresh-token silently before rendering protected routes.
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../store';
import { setAccessToken, clearAccessToken, setAuthInitialized, resetAuth } from '../store/slices/authSlice';
import { authApi, type LoginDto, type RegisterCandidateDto, type RegisterCompanyOwnerDto, type RegisterEmployerSimpleDto, type AuthMeResponse, type CandidateProfileData, type EmployerProfileData } from '../services/api/auth.api';
import { executeRefreshToken } from '../services/api/apiClient';
import { authKeys, companyKeys } from '../constants/queryKeys';

// ─── Role Enums ───────────────────────────────────────────────────────────────

export type UserRole = 'CANDIDATE' | 'EMPLOYER' | 'ADMIN' | 'SUPER_ADMIN';
export type CompanyMemberRole = 'OWNER' | 'ADMIN' | 'RECRUITER' | 'HIRING_MANAGER';
export type AccountStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BLOCKED' | 'DELETED';

// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  isEmailVerified: boolean;
  lastLoginAt?: string | null;
  fullName?: string;
  profile?: CandidateProfileData | EmployerProfileData | null;
  companyId?: string;
  companyRole?: CompanyMemberRole;
}

// ─── Context Value ────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (dto: LoginDto) => Promise<AuthUser>;
  registerCandidate: (dto: RegisterCandidateDto) => Promise<AuthUser>;
  registerEmployer: (dto: RegisterEmployerSimpleDto) => Promise<AuthUser>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  setSelectedCompany: (companyId: string, companyRole: CompanyMemberRole) => void;
  setUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Helper function to map backend roles to platform roles ──────────────────

function mapBackendRole(rawRole: string): UserRole {
  if (rawRole === 'CANDIDATE') return 'CANDIDATE';
  if (rawRole === 'EMPLOYER' || rawRole === 'RECRUITER' || rawRole === 'COMPANY_OWNER' || rawRole === 'HIRING_MANAGER') {
    return 'EMPLOYER';
  }
  if (rawRole === 'SUPER_ADMIN') return 'SUPER_ADMIN';
  if (rawRole === 'ADMIN') return 'ADMIN';
  return 'CANDIDATE';
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const { accessToken, isInitialized } = useAppSelector((state) => state.auth);
  const [selectedCompany, setSelectedCompanyState] = useState<{ companyId: string; companyRole: CompanyMemberRole } | null>(null);
  const [localAuthError, setLocalAuthError] = useState<string | null>(null);

  // ── 1. Current User Server State Query (['auth', 'me']) ─────────────────────
  const {
    data: authMeData,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery<AuthMeResponse>({
    queryKey: authKeys.me,
    queryFn: () => authApi.getMe(),
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // ── 2. Active Recruiter Companies Query (['companies', 'my']) ────────────────
  const isEmployer = authMeData?.user && mapBackendRole(authMeData.user.role) === 'EMPLOYER';
  const { data: myCompanies } = useQuery({
    queryKey: companyKeys.my,
    queryFn: () => authApi.getMyCompanies(),
    enabled: !!accessToken && !!isEmployer,
    staleTime: 1000 * 60 * 5,
  });

  // Auto-select primary company if employer has companies
  useEffect(() => {
    if (myCompanies && myCompanies.length > 0 && !selectedCompany) {
      const primary = myCompanies[0];
      setSelectedCompanyState({
        companyId: primary.companyId,
        companyRole: primary.role as CompanyMemberRole,
      });
    }
  }, [myCompanies, selectedCompany]);

  // ── 3. Silent Auth Initialization (Runs once on mount) ──────────────────────
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const token = await executeRefreshToken();
        if (isMounted) {
          if (token) {
            dispatch(setAccessToken(token));
          }
          dispatch(setAuthInitialized(true));
        }
      } catch {
        if (isMounted) {
          dispatch(clearAccessToken());
          dispatch(setAuthInitialized(true));
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  // ── 4. Listen for Auth Expiry Event ─────────────────────────────────────────
  useEffect(() => {
    const handleAuthExpired = () => {
      dispatch(clearAccessToken());
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.removeQueries({ queryKey: companyKeys.all });
      setSelectedCompanyState(null);
    };

    window.addEventListener('tf:auth:expired', handleAuthExpired);
    return () => window.removeEventListener('tf:auth:expired', handleAuthExpired);
  }, [dispatch, queryClient]);

  // ── 5. Construct Normalized AuthUser ─────────────────────────────────────────
  const user = useMemo<AuthUser | null>(() => {
    if (!authMeData?.user) return null;

    const u = authMeData.user;
    const p = authMeData.profile;
    const platformRole = mapBackendRole(u.role);

    let fullName = '';
    if (p && 'fullName' in p && typeof p.fullName === 'string') {
      fullName = p.fullName;
    }

    return {
      id: u.id,
      email: u.email,
      role: platformRole,
      status: u.status as AccountStatus,
      isEmailVerified: u.isEmailVerified,
      lastLoginAt: u.lastLoginAt,
      fullName,
      profile: p,
      companyId: selectedCompany?.companyId,
      companyRole: selectedCompany?.companyRole,
    };
  }, [authMeData, selectedCompany]);

  // ── 6. Mutations ────────────────────────────────────────────────────────────

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: (dto: LoginDto) => authApi.login(dto),
    onSuccess: async (data) => {
      const token = data.tokens?.accessToken;
      if (token) {
        dispatch(setAccessToken(token));
      }
      queryClient.setQueryData(authKeys.me, {
        user: data.user,
        profile: data.profile,
      });
      setLocalAuthError(null);
    },
    onError: (err: any) => {
      setLocalAuthError(err?.message || 'Login failed');
    },
  });

  // Candidate Registration Mutation
  const registerCandidateMutation = useMutation({
    mutationFn: (dto: RegisterCandidateDto) => authApi.registerCandidate(dto),
    onSuccess: async (data) => {
      if (data.tokens?.accessToken) {
        dispatch(setAccessToken(data.tokens.accessToken));
      }
      await queryClient.invalidateQueries({ queryKey: authKeys.me });
      setLocalAuthError(null);
    },
    onError: (err: any) => {
      setLocalAuthError(err?.message || 'Registration failed');
    },
  });

  // Employer Registration Mutation
  const registerCompanyOwnerMutation = useMutation({
    mutationFn: (dto: RegisterCompanyOwnerDto) => authApi.registerCompanyOwner(dto),
    onSuccess: async (data) => {
      if (data.tokens?.accessToken) {
        dispatch(setAccessToken(data.tokens.accessToken));
      }
      await queryClient.invalidateQueries({ queryKey: authKeys.me });
      await queryClient.invalidateQueries({ queryKey: companyKeys.my });
      setLocalAuthError(null);
    },
    onError: (err: any) => {
      setLocalAuthError(err?.message || 'Registration failed');
    },
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      dispatch(resetAuth());
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.removeQueries({ queryKey: companyKeys.all });
      setSelectedCompanyState(null);
    },
  });

  // Logout All Devices Mutation
  const logoutAllMutation = useMutation({
    mutationFn: () => authApi.logoutAll(),
    onSettled: () => {
      dispatch(resetAuth());
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.removeQueries({ queryKey: companyKeys.all });
      setSelectedCompanyState(null);
    },
  });

  // ── 7. Public API Methods ────────────────────────────────────────────────────

  const login = useCallback(async (dto: LoginDto): Promise<AuthUser> => {
    const res = await loginMutation.mutateAsync(dto);
    const platformRole = mapBackendRole(res.user.role);
    return {
      id: res.user.id,
      email: res.user.email,
      role: platformRole,
      status: res.user.status as AccountStatus,
      isEmailVerified: res.user.isEmailVerified,
      lastLoginAt: res.user.lastLoginAt,
      profile: res.profile,
    };
  }, [loginMutation]);

  const registerCandidate = useCallback(async (dto: RegisterCandidateDto): Promise<AuthUser> => {
    const res = await registerCandidateMutation.mutateAsync(dto);
    const platformRole = mapBackendRole(res.user.role);
    return {
      id: res.user.id,
      email: res.user.email,
      role: platformRole,
      status: res.user.status as AccountStatus,
      isEmailVerified: res.user.isEmailVerified,
      lastLoginAt: res.user.lastLoginAt,
      fullName: res.candidate.fullName,
    };
  }, [registerCandidateMutation]);

  const registerEmployer = useCallback(async (dto: RegisterEmployerSimpleDto): Promise<AuthUser> => {
    const fullPayload: RegisterCompanyOwnerDto = {
      fullName: dto.fullName,
      email: dto.email,
      password: dto.password,
      company: {
        companyName: dto.companyName || `${dto.fullName}'s Organization`,
        email: dto.email,
        phoneNumber: '+919999999999',
      },
    };
    const res = await registerCompanyOwnerMutation.mutateAsync(fullPayload);
    const platformRole = mapBackendRole(res.user.role);
    return {
      id: res.user.id,
      email: res.user.email,
      role: platformRole,
      status: res.user.status as AccountStatus,
      isEmailVerified: res.user.isEmailVerified,
      lastLoginAt: res.user.lastLoginAt,
      fullName: res.employer.fullName,
      companyId: res.company.id,
      companyRole: 'OWNER',
    };
  }, [registerCompanyOwnerMutation]);

  const logout = useCallback(async (): Promise<void> => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const logoutAll = useCallback(async (): Promise<void> => {
    await logoutAllMutation.mutateAsync();
  }, [logoutAllMutation]);

  const setSelectedCompany = useCallback((companyId: string, companyRole: CompanyMemberRole) => {
    setSelectedCompanyState({ companyId, companyRole });
  }, []);

  const setUserRole = useCallback((role: UserRole) => {
    // Role is server-authoritative from authMeData, but allow switching context view if justified
    if (user) {
      user.role = role;
    }
  }, [user]);

  // Overall loading state
  const isActionLoading =
    loginMutation.isPending ||
    registerCandidateMutation.isPending ||
    registerCompanyOwnerMutation.isPending ||
    logoutMutation.isPending;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user && !!accessToken,
      isLoading: !isInitialized || isUserLoading || isActionLoading,
      isInitialized,
      error: localAuthError || (userError ? (userError as any).message : null),
      login,
      registerCandidate,
      registerEmployer,
      logout,
      logoutAll,
      setSelectedCompany,
      setUserRole,
    }),
    [
      user,
      accessToken,
      isInitialized,
      isUserLoading,
      isActionLoading,
      localAuthError,
      userError,
      login,
      registerCandidate,
      registerEmployer,
      logout,
      logoutAll,
      setSelectedCompany,
      setUserRole,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
