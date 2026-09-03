/**
 * TalentForge — Centralized Authentication Context & Workspace State Orchestration
 *
 * Bridge between:
 *  - Redux Toolkit:
 *      • authSlice: client-side in-memory auth state (accessToken, status, isInitialized)
 *      • workspaceSlice: active workspace context ('CANDIDATE' | 'COMPANY') and saved metadata
 *  - TanStack Query:
 *      • ['auth', 'me']: authoritative server-state user, candidate profile, and company memberships
 *      • ['companies', 'my']: list of active companies
 *
 * Security Guarantees:
 *  - Access token lives ONLY in Redux memory (never in localStorage/cookies).
 *  - Refresh token lives in backend-controlled HttpOnly cookie.
 *  - Workspace metadata in localStorage is purely UI context (never contains tokens/auth keys).
 *  - Switching workspace invalidates and cleanses company-scoped queries.
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../store';
import { setAccessToken, clearAccessToken, setAuthInitialized, resetAuth } from '../store/slices/authSlice';
import { setWorkspace, setAvailableWorkspaces, clearWorkspace, type Workspace } from '../store/slices/workspaceSlice';
import {
  authApi,
  type LoginDto,
  type RegisterCandidateDto,
  type RegisterCompanyOwnerDto,
  type RegisterEmployerSimpleDto,
  type AuthMeResponse,
  type CandidateProfileData,
  type EmployerProfileData,
  type CompanyMemberItem,
} from '../services/api/auth.api';
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
  hasCandidateProfile: boolean;
  candidateProfileId?: string;
  companies: CompanyMemberItem[];
  companyId?: string;
  companyRole?: CompanyMemberRole;
}

// ─── Context Value ────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: AuthUser | null;
  currentWorkspace: Workspace | null;
  availableWorkspaces: Workspace[];
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (dto: LoginDto) => Promise<{ user: AuthUser; availableWorkspaces: Workspace[] }>;
  registerUser: (dto: { fullName?: string; email: string; password: string }) => Promise<AuthUser>;
  registerCandidate: (dto: RegisterCandidateDto) => Promise<AuthUser>;
  registerEmployer: (dto: RegisterEmployerSimpleDto) => Promise<AuthUser>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  selectWorkspace: (workspace: Workspace) => void;
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
  const { currentWorkspace, availableWorkspaces } = useAppSelector((state) => state.workspace);
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

  // ── 2. Calculate Available Workspaces from Server State ───────────────────────
  useEffect(() => {
    if (!authMeData) return;

    const list: Workspace[] = [];

    // Candidate capability: if user has a candidate profile or explicit candidate capability returned by backend
    const hasCandidate = !!authMeData.candidate?.enabled || (!!authMeData.profile && 'profileCompletion' in authMeData.profile) || (!!authMeData.profile && 'isOpenToWork' in authMeData.profile);
    if (hasCandidate) {
      const candidateId = authMeData.candidate?.id || (authMeData.profile?.id ?? authMeData.user.id);
      let candidateName = authMeData.candidate?.fullName || '';
      if (!candidateName && authMeData.profile && 'fullName' in authMeData.profile) {
        candidateName = authMeData.profile.fullName;
      }
      list.push({
        type: 'CANDIDATE',
        id: candidateId,
        name: candidateName || 'Candidate',
      });
    }

    // Company memberships:
    if (authMeData.companies && Array.isArray(authMeData.companies)) {
      for (const item of authMeData.companies) {
        if (item.status === 'ACTIVE') {
          list.push({
            type: 'COMPANY',
            id: item.companyId,
            name: item.company.companyName,
            slug: item.company.slug,
            role: item.role as CompanyMemberRole,
            logo: item.company.logo,
            location: item.company.headquarters,
          });
        }
      }
    }

    dispatch(setAvailableWorkspaces(list));

    // Auto-reconcile current workspace
    if (list.length === 1) {
      // Exactly 1 workspace available -> auto enter it
      dispatch(setWorkspace(list[0]));
    } else if (list.length > 1) {
      // Multiple workspaces: check if currently selected workspace is valid
      if (currentWorkspace) {
        const match = list.find(
          (w) => w.type === currentWorkspace.type && w.id === currentWorkspace.id
        );
        if (match) {
          dispatch(setWorkspace(match));
        } else {
          dispatch(setWorkspace(null));
        }
      }
    } else {
      // 0 workspaces (e.g. fresh onboarding)
      dispatch(setWorkspace(null));
    }
  }, [authMeData, dispatch]);

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
      dispatch(clearWorkspace());
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.removeQueries({ queryKey: companyKeys.all });
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

    const companyMemberships = authMeData.companies || [];
    const activeCompanyWorkspace = currentWorkspace?.type === 'COMPANY' ? currentWorkspace : null;

    return {
      id: u.id,
      email: u.email,
      role: platformRole,
      status: u.status as AccountStatus,
      isEmailVerified: u.isEmailVerified,
      lastLoginAt: u.lastLoginAt,
      fullName,
      profile: p,
      hasCandidateProfile: !!p && 'profileCompletion' in p && (p as any).profileCompletion > 0,
      candidateProfileId: authMeData.candidate?.id,
      companies: companyMemberships,
      companyId: activeCompanyWorkspace?.id,
      companyRole: activeCompanyWorkspace?.role,
    };
  }, [authMeData, currentWorkspace]);

  // ── 6. Select Workspace Handler ─────────────────────────────────────────────
  const selectWorkspace = useCallback((workspace: Workspace) => {
    dispatch(setWorkspace(workspace));

    // When switching company, invalidate company-scoped queries to guarantee strict data isolation
    if (workspace.type === 'COMPANY') {
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(workspace.id) });
      queryClient.invalidateQueries({ queryKey: ['jobs', workspace.id] });
      queryClient.invalidateQueries({ queryKey: ['candidates', workspace.id] });
      queryClient.invalidateQueries({ queryKey: ['pipeline', workspace.id] });
    }
  }, [dispatch, queryClient]);

  // ── 7. Mutations ────────────────────────────────────────────────────────────

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: (dto: LoginDto) => authApi.login(dto),
    onSuccess: async (data) => {
      const token = data.tokens?.accessToken;
      if (token) {
        dispatch(setAccessToken(token));
      }
      // We intentionally do not setQueryData or invalidateQueries here.
      // The `login` wrapper function will fetch the full `me` data (including companies)
      // and update the cache, preventing premature redirects by <PublicRoute>.
      setLocalAuthError(null);
    },
    onError: (err: any) => {
      setLocalAuthError(err?.message || 'Login failed');
    },
  });

  // Base User Registration Mutation
  const registerUserMutation = useMutation({
    mutationFn: (dto: { fullName?: string; email: string; password: string }) => authApi.registerUser(dto),
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

  // Candidate Registration Mutation
  const registerCandidateMutation = useMutation({
    mutationFn: (dto: RegisterCandidateDto) => authApi.registerCandidate(dto),
    onSuccess: async (data) => {
      if (data.tokens?.accessToken) {
        dispatch(setAccessToken(data.tokens.accessToken));
      }
      dispatch(setWorkspace({
        type: 'CANDIDATE',
        id: data.candidate.id,
        name: data.candidate.fullName || 'Candidate',
      }));
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
      dispatch(setWorkspace({
        type: 'COMPANY',
        id: data.company.id,
        name: data.company.companyName,
        slug: data.company.slug,
        role: 'OWNER',
      }));
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
      dispatch(clearWorkspace());
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.removeQueries({ queryKey: companyKeys.all });
    },
  });

  // Logout All Devices Mutation
  const logoutAllMutation = useMutation({
    mutationFn: () => authApi.logoutAll(),
    onSettled: () => {
      dispatch(resetAuth());
      dispatch(clearWorkspace());
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.removeQueries({ queryKey: companyKeys.all });
    },
  });

  // ── 8. Public API Methods ────────────────────────────────────────────────────

  const login = useCallback(async (dto: LoginDto): Promise<{ user: AuthUser; availableWorkspaces: Workspace[] }> => {
    const res = await loginMutation.mutateAsync(dto);
    const platformRole = mapBackendRole(res.user.role);
    
    // Fetch authoritative me data with workspaces
    const meData = await authApi.getMe();

    // Set the full data in the cache to avoid incomplete states
    queryClient.setQueryData(authKeys.me, meData);
    
    const workspaces: Workspace[] = [];
    const hasCandidate = !!(meData.profile && 'profileCompletion' in meData.profile && (meData.profile as any).profileCompletion > 0);
    if (hasCandidate) {
      workspaces.push({
        type: 'CANDIDATE',
        id: meData.candidate?.id || meData.user.id,
        name: meData.candidate?.fullName || (meData.profile && 'fullName' in meData.profile ? (meData.profile as any).fullName : 'Candidate'),
      });
    }

    if (meData.companies && Array.isArray(meData.companies)) {
      for (const item of meData.companies) {
        if (item.status === 'ACTIVE') {
          workspaces.push({
            type: 'COMPANY',
            id: item.companyId,
            name: item.company.companyName,
            slug: item.company.slug,
            role: item.role as CompanyMemberRole,
            logo: item.company.logo,
            location: item.company.headquarters,
          });
        }
      }
    }

    const authUser: AuthUser = {
      id: res.user.id,
      email: res.user.email,
      role: platformRole,
      status: res.user.status as AccountStatus,
      isEmailVerified: res.user.isEmailVerified,
      lastLoginAt: res.user.lastLoginAt,
      profile: res.profile,
      hasCandidateProfile: hasCandidate,
      candidateProfileId: meData.candidate?.id,
      companies: meData.companies || [],
    };

    return {
      user: authUser,
      availableWorkspaces: workspaces,
    };
  }, [loginMutation]);

  const registerUser = useCallback(async (dto: { fullName?: string; email: string; password: string }): Promise<AuthUser> => {
    const res = await registerUserMutation.mutateAsync(dto);
    const platformRole = mapBackendRole(res.user.role);
    return {
      id: res.user.id,
      email: res.user.email,
      role: platformRole,
      status: res.user.status as AccountStatus,
      isEmailVerified: res.user.isEmailVerified,
      lastLoginAt: res.user.lastLoginAt,
      fullName: dto.fullName || '',
      hasCandidateProfile: false,
      companies: [],
    };
  }, [registerUserMutation]);

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
      hasCandidateProfile: true,
      candidateProfileId: res.candidate.id,
      companies: [],
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
      hasCandidateProfile: false,
      companyId: res.company.id,
      companyRole: 'OWNER',
      companies: [
        {
          id: res.company.id,
          companyId: res.company.id,
          userId: res.user.id,
          role: 'OWNER',
          status: 'ACTIVE',
          company: {
            id: res.company.id,
            companyName: res.company.companyName,
            slug: res.company.slug,
            logo: null,
            industry: null,
            companySize: null,
            headquarters: null,
          },
        },
      ],
    };
  }, [registerCompanyOwnerMutation]);

  const logout = useCallback(async (): Promise<void> => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const logoutAll = useCallback(async (): Promise<void> => {
    await logoutAllMutation.mutateAsync();
  }, [logoutAllMutation]);

  const setUserRole = useCallback((role: UserRole) => {
    if (user) {
      user.role = role;
    }
  }, [user]);

  // Overall loading state
  const isActionLoading =
    loginMutation.isPending ||
    registerUserMutation.isPending ||
    registerCandidateMutation.isPending ||
    registerCompanyOwnerMutation.isPending ||
    logoutMutation.isPending;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      currentWorkspace,
      availableWorkspaces,
      isAuthenticated: !!user && !!accessToken,
      isLoading: !isInitialized || isUserLoading || isActionLoading,
      isInitialized,
      error: localAuthError || (userError ? (userError as any).message : null),
      login,
      registerUser,
      registerCandidate,
      registerEmployer,
      logout,
      logoutAll,
      selectWorkspace,
      setUserRole,
    }),
    [
      user,
      currentWorkspace,
      availableWorkspaces,
      accessToken,
      isInitialized,
      isUserLoading,
      isActionLoading,
      localAuthError,
      userError,
      login,
      registerUser,
      registerCandidate,
      registerEmployer,
      logout,
      logoutAll,
      selectWorkspace,
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
