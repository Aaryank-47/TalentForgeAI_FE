/**
 * TalentForge — Centralized RBAC Permissions
 *
 * Frontend permission helpers. These are UX/navigation guards ONLY.
 * The backend remains the final authority on authorization.
 *
 * Usage:
 *   const { isCandidate, isOwner, canManageTeam } = usePermissions();
 */

import { useAuth } from '../context/AuthContext';
import type { UserRole, CompanyMemberRole, AuthUser } from '../context/AuthContext';

// ─── Pure permission functions (no hook dependency) ───────────────────────────

export function getUserRole(user: AuthUser | null): UserRole | null {
  return user?.role ?? null;
}

export function getCompanyRole(user: AuthUser | null): CompanyMemberRole | null {
  return user?.companyRole ?? null;
}

/** Resolve portal route based on current workspace or user role */
export function resolveWorkspaceRoute(workspace: { type: 'CANDIDATE' | 'COMPANY' } | null, user: AuthUser | null): string {
  if (workspace) {
    if (workspace.type === 'CANDIDATE') return '/candidate/home';
    if (workspace.type === 'COMPANY') return '/recruiter/dashboard';
  }
  if (user) {
    return resolvePortalRoute(user);
  }
  return '/login';
}

/** Resolve which portal the user should be routed to after login or when accessing root */
export function resolvePortalRoute(user: AuthUser): string {
  if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
    return '/admin/dashboard';
  }

  const isCandidate = user.capabilities?.candidate ?? false;
  const hasEmployer = user.capabilities?.employer ?? false;

  if (!isCandidate && !hasEmployer) {
    return '/onboarding';
  }

  if (isCandidate && !hasEmployer) {
    return '/candidate/home';
  }

  return '/select-workspace';
}

/** Check if a user has a given platform role */
export function hasRole(user: AuthUser | null, ...roles: UserRole[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

/** Check if an employer user has a given company membership role */
export function hasCompanyRole(user: AuthUser | null, ...roles: CompanyMemberRole[]): boolean {
  if (!user || !user.capabilities?.employer) return false;
  if (!user.companyRole) return false;
  return roles.includes(user.companyRole);
}

// ─── Hook: usePermissions ─────────────────────────────────────────────────────

export function usePermissions() {
  const { user, isAuthenticated } = useAuth();

  return {
    // ── Auth state ──────────────────────────────────────────────────────────
    isAuthenticated,
    user,

    // ── Platform capabilities ───────────────────────────────────────────────
    isCandidate: isAuthenticated && !!user?.capabilities?.candidate,
    isEmployer: isAuthenticated && !!user?.capabilities?.employer,
    isAdmin: isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'),
    isSuperAdmin: isAuthenticated && user?.role === 'SUPER_ADMIN',

    // ── Company membership roles (Employer sub-roles) ───────────────────────
    /** Company owner — can manage billing, delete company, transfer ownership */
    isOwner: isAuthenticated && hasCompanyRole(user, 'OWNER'),
    /** Company admin — can invite/remove members, manage settings */
    isCompanyAdmin: isAuthenticated && hasCompanyRole(user, 'ADMIN', 'OWNER'),
    /** Recruiter — can post jobs, move candidates through pipeline */
    isRecruiter: isAuthenticated && hasCompanyRole(user, 'RECRUITER', 'ADMIN', 'OWNER'),
    /** Hiring Manager — reviews candidates, provides feedback */
    isHiringManager: isAuthenticated &&
      hasCompanyRole(user, 'HIRING_MANAGER', 'RECRUITER', 'ADMIN', 'OWNER'),

    // ── Compound checks ─────────────────────────────────────────────────────
    /** Can access recruiter/employer portal */
    canAccessRecruiterPortal: isAuthenticated && !!user?.capabilities?.employer,
    /** Can access candidate portal */
    canAccessCandidatePortal: isAuthenticated && !!user?.capabilities?.candidate,

    /** Can create jobs */
    canCreateJob: isAuthenticated &&
      hasCompanyRole(user, 'RECRUITER', 'ADMIN', 'OWNER', 'HIRING_MANAGER'),

    /** Can manage team members */
    canManageTeam: isAuthenticated && hasCompanyRole(user, 'ADMIN', 'OWNER'),

    /** Can manage billing */
    canManageBilling: isAuthenticated && hasCompanyRole(user, 'OWNER'),

    /** Can create/manage assessments */
    canManageAssessments: isAuthenticated &&
      hasCompanyRole(user, 'HIRING_MANAGER', 'RECRUITER', 'ADMIN', 'OWNER'),
  };
}
