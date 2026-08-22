/**
 * TalentForge — Route Guard Components
 *
 * Provides layered route protection:
 *   PublicRoute    — Redirect authenticated users away from /login, /register
 *   ProtectedRoute — Require authentication; redirect to /login if not authed
 *   RoleRoute      — Require a specific platform role (CANDIDATE | EMPLOYER)
 *   AuthLoadingScreen — Shown while AuthContext initializes
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../context/AuthContext';
import { resolvePortalRoute } from '../../lib/permissions';

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

// ─── RoleRoute ────────────────────────────────────────────────────────────────

interface RoleRouteProps {
  /** Which platform roles are allowed to access this route group */
  allowedRoles: UserRole[];
  /** Where to redirect if user lacks the required role */
  redirectTo?: string;
}

/**
 * Requires the authenticated user to have one of the specified platform roles.
 * Must be nested inside ProtectedRoute (assumes user is authenticated).
 */
export function RoleRoute({ allowedRoles, redirectTo }: RoleRouteProps) {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) {
    return <AuthLoadingScreen />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    const fallback = redirectTo || (user ? resolvePortalRoute(user) : '/login');
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}

// ─── PublicRoute ──────────────────────────────────────────────────────────────

interface PublicRouteProps {
  /** If user is already authenticated, redirect them here instead */
  redirectAuthenticatedTo?: string;
}

/**
 * Routes that should redirect already-authenticated users away
 * (e.g. /login, /register — no point showing them if already logged in).
 */
export function PublicRoute({ redirectAuthenticatedTo }: PublicRouteProps) {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated && user) {
    // If redirected here from a protected route, go back there; otherwise resolve portal route
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
    const destination = redirectAuthenticatedTo || from || resolvePortalRoute(user);
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
}
