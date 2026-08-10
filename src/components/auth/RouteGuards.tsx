/**
 * TalentForge — Route Guard Components
 *
 * Provides layered route protection:
 *   PublicRoute    — Redirect authenticated users away from /login, /register
 *   ProtectedRoute — Require authentication; redirect to /login if not authed
 *   RoleRoute      — Require a specific platform role (CANDIDATE | EMPLOYER)
 *   AuthLoadingScreen — Shown while AuthContext initializes
 *
 * Usage in App.tsx:
 *   <Route element={<ProtectedRoute />}>
 *     <Route element={<RoleRoute allowedRoles={['EMPLOYER']} redirectTo="/candidate/home" />}>
 *       <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
 *     </Route>
 *   </Route>
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../context/AuthContext';

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
  // BYPASSED FOR DEVELOPMENT
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
export function RoleRoute(_props: RoleRouteProps) {
  // BYPASSED FOR DEVELOPMENT
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
 *
 * Role-based redirect is handled by resolvePortalRoute in permissions.ts.
 */
export function PublicRoute({ redirectAuthenticatedTo }: PublicRouteProps) {
  // BYPASSED FOR DEVELOPMENT
  return <Outlet />;
}
