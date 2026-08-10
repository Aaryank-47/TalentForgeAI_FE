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

/** Resolve which portal the user should be routed to after login */
export function resolvePortalRoute(user: AuthUser): string {
  switch (user.role) {
    case 'CANDIDATE':
      return '/candidate/home';
    case 'EMPLOYER':
      return '/recruiter/dashboard';
    case 'ADMIN':
    case 'SUPER_ADMIN':
      // Admin portal not yet implemented — route to a placeholder
      return '/admin/dashboard';
    default:
      return '/';
  }
}

/** Check if a user has a given platform role */
export function hasRole(user: AuthUser | null, ...roles: UserRole[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

/** Check if an employer user has a given company membership role */
export function hasCompanyRole(user: AuthUser | null, ...roles: CompanyMemberRole[]): boolean {
  if (!user || user.role !== 'EMPLOYER') return false;
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

    // ── Platform roles ──────────────────────────────────────────────────────
    isCandidate: isAuthenticated && user?.role === 'CANDIDATE',
    isEmployer: isAuthenticated && user?.role === 'EMPLOYER',
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
    canAccessRecruiterPortal: isAuthenticated && user?.role === 'EMPLOYER',
    /** Can access candidate portal */
    canAccessCandidatePortal: isAuthenticated && user?.role === 'CANDIDATE',

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
