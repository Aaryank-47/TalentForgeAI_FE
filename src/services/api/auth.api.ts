/**
 * TalentForge — Auth API Service
 *
 * All authentication-related HTTP calls live here.
 * Maps to backend /auth/* endpoints.
 *
 * Backend auth routes (verified from backend auth.routes.ts):
 *  POST /auth/register/candidate
 *  POST /auth/register/employer         (company-owner registration)
 *  POST /auth/register/company-owner
 *  POST /auth/login
 *  POST /auth/new-refresh-token
 *  POST /auth/logout
 *  POST /auth/logout/all-devices
 *  GET  /auth/me
 *  POST /auth/change/password
 *  POST /auth/forgot/password
 *  POST /auth/verify/otp
 *  POST /auth/verify-email
 *  POST /auth/resend-verification
 *  POST /auth/reset/password
 */

import { api } from './apiClient';
import type { AuthUser, UserRole, CompanyMemberRole } from '../../context/AuthContext';

// ─── Request DTOs ──────────────────────────────────────────────────────────────

export interface RegisterCandidateDto {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterEmployerDto {
  fullName: string;
  email: string;
  password: string;
  companyName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface VerifyEmailDto {
  token: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

// ─── Response DTOs ─────────────────────────────────────────────────────────────

export interface AuthResponse {
  user: AuthUser;
}

export interface MessageResponse {
  message: string;
}

// ─── API Calls ─────────────────────────────────────────────────────────────────

export const authApi = {
  /** Register a new candidate */
  registerCandidate: (dto: RegisterCandidateDto) =>
    api.post<AuthResponse>('/auth/register/candidate', dto),

  /** Register a new employer who will be company owner */
  registerEmployer: (dto: RegisterEmployerDto) =>
    api.post<AuthResponse>('/auth/register/company-owner', dto),

  /** Login — works for all roles */
  login: (dto: LoginDto) =>
    api.post<AuthResponse>('/auth/login', dto),

  /** Get current authenticated user */
  getMe: () =>
    api.get<AuthResponse>('/auth/me'),

  /** Logout from current device */
  logout: () =>
    api.post<MessageResponse>('/auth/logout'),

  /** Logout from all devices */
  logoutAll: () =>
    api.post<MessageResponse>('/auth/logout/all-devices'),

  /** Request password reset email */
  forgotPassword: (dto: ForgotPasswordDto) =>
    api.post<MessageResponse>('/auth/forgot/password', dto),

  /** Verify OTP code for password reset */
  verifyOtp: (dto: VerifyOtpDto) =>
    api.post<MessageResponse>('/auth/verify/otp', dto),

  /** Reset password using token from email */
  resetPassword: (dto: ResetPasswordDto) =>
    api.post<MessageResponse>('/auth/reset/password', dto),

  /** Verify email address using token from verification email */
  verifyEmail: (dto: VerifyEmailDto) =>
    api.post<MessageResponse>('/auth/verify-email', dto),

  /** Resend email verification */
  resendVerification: (email: string) =>
    api.post<MessageResponse>('/auth/resend-verification', { email }),

  /** Change password (must be authenticated) */
  changePassword: (dto: ChangePasswordDto) =>
    api.post<MessageResponse>('/auth/change/password', dto),
};

// Re-export types needed by AuthContext without circular imports
export type { AuthUser, UserRole, CompanyMemberRole };
