/**
 * TalentForge — Route Guard Components
 *
 * Provides layered route protection:
 *   PublicRoute              — Redirect authenticated users away from /login, /register
 *   ProtectedRoute           — Require authentication; redirect to /login if not authed
 *   RequireCandidateWorkspace — Require authenticated candidate workspace context
 *   RequireCompanyWorkspace   — Require authenticated company workspace context
 *   RoleRoute                — Require specific platform roles (backward compatibility)
 *   AuthLoadingScreen        — Shown while AuthContext initializes
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../context/AuthContext';
import { resolvePortalRoute, resolveWorkspaceRoute } from '../../lib/permissions';

// ─── Auth Loading Screen ──────────────────────────────────────────────────────

export function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading TalentForge…</p>
      </div>
    </div>
  );
}

// ─── ProtectedRoute ───────────────────────────────────────────────────────────

/**
 * Requires the user to be authenticated.
 * Shows loading screen while auth initializes.
 * Redirects unauthenticated users to /login, preserving the intended destination.
 */
export function ProtectedRoute() {
  const { isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

// ─── RequireCandidateWorkspace ────────────────────────────────────────────────

/**
 * Ensures user is in the 'CANDIDATE' workspace context.
 * If user has no workspace selected, directs to /select-workspace.
 * If user is in a company workspace, redirects to /recruiter/dashboard.
 */
export function RequireCandidateWorkspace() {
  const { user, currentWorkspace, availableWorkspaces, isInitialized } = useAuth();

  if (!isInitialized) {
    return <AuthLoadingScreen />;
  }

  if (!currentWorkspace) {
    // If only 1 candidate workspace exists, let AuthContext reconcile or route to selector
    if (availableWorkspaces.length === 1 && availableWorkspaces[0].type === 'CANDIDATE') {
      return <Outlet />;
    }
    return <Navigate to="/select-workspace" replace />;
  }

  if (currentWorkspace.type !== 'CANDIDATE') {
    return <Navigate to="/recruiter/dashboard" replace />;
  }

  return <Outlet />;
}

// ─── RequireCompanyWorkspace ──────────────────────────────────────────────────

/**
 * Ensures user is in a 'COMPANY' workspace context.
 * If user has no workspace selected, directs to /select-workspace.
 * If user is in candidate workspace, redirects to /candidate/home.
 */
export function RequireCompanyWorkspace() {
  const { currentWorkspace, availableWorkspaces, isInitialized } = useAuth();

  if (!isInitialized) {
    return <AuthLoadingScreen />;
  }

  if (!currentWorkspace) {
    if (availableWorkspaces.length === 1 && availableWorkspaces[0].type === 'COMPANY') {
      return <Outlet />;
    }
    return <Navigate to="/select-workspace" replace />;
  }

  if (currentWorkspace.type !== 'COMPANY') {
    return <Navigate to="/candidate/home" replace />;
  }

  return <Outlet />;
}

// ─── RoleRoute (Backward Compatibility) ───────────────────────────────────────

interface RoleRouteProps {
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export function RoleRoute({ allowedRoles, redirectTo }: RoleRouteProps) {
  const { user, isInitialized, currentWorkspace } = useAuth();

  if (!isInitialized) {
    return <AuthLoadingScreen />;
  }

  // If in a candidate workspace, allowed if 'CANDIDATE' is allowed
  if (currentWorkspace?.type === 'CANDIDATE' && allowedRoles.includes('CANDIDATE')) {
    return <Outlet />;
  }

  // If in a company workspace, allowed if 'EMPLOYER' is allowed
  if (currentWorkspace?.type === 'COMPANY' && allowedRoles.includes('EMPLOYER')) {
    return <Outlet />;
  }

  if (!user || (!allowedRoles.includes(user.role) && !currentWorkspace)) {
    const fallback = redirectTo || resolveWorkspaceRoute(currentWorkspace, user);
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}

// ─── PublicRoute ──────────────────────────────────────────────────────────────

interface PublicRouteProps {
  redirectAuthenticatedTo?: string;
}

export function PublicRoute({ redirectAuthenticatedTo }: PublicRouteProps) {
  const { isAuthenticated, isInitialized, user, currentWorkspace } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated && user) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
    const destination = redirectAuthenticatedTo || from || resolveWorkspaceRoute(currentWorkspace, user);
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
}
