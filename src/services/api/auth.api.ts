/**
 * TalentForge — Auth API Service
 *
 * All authentication-related HTTP calls live here.
 * Maps directly to backend /auth/* routes.
 */

import { api } from './apiClient';

// ─── Request DTOs ──────────────────────────────────────────────────────────────

export interface RegisterCandidateDto {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterCompanyOwnerDto {
  fullName: string;
  email: string;
  password: string;
  company: {
    companyName: string;
    slug?: string;
    email: string;
    phoneNumber: string;
    website?: string;
    logo?: string;
    coverImage?: string;
    description?: string;
    industry?: string;
    companySize?: string;
    foundedYear?: number;
    headquarters?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
  };
}

export interface RegisterUserDto {
  fullName?: string;
  email: string;
  password: string;
}

export interface RegisterUserApiResponse {
  user: AuthUserResponse;
  tokens: AuthTokens;
}

export interface RegisterEmployerSimpleDto {
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
  email: string;
  otp: string;
}

export interface ResendVerificationDto {
  email: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

// ─── Response DTOs ─────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUserResponse {
  id: string;
  email: string;
  role: 'CANDIDATE' | 'EMPLOYER' | 'ADMIN' | 'SUPER_ADMIN' | 'RECRUITER' | 'COMPANY_OWNER' | 'HIRING_MANAGER';
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BLOCKED' | 'DELETED';
  isEmailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateProfileData {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber?: string | null;
  profilePicture?: string | null;
  headline?: string | null;
  bio?: string | null;
  gender?: string | null;
  experienceLevel?: string | null;
  currentLocation?: string | null;
  preferredLocation?: string | null;
  currentCompany?: string | null;
  currentDesignation?: string | null;
  totalExperience?: number | null;
  expectedSalary?: number | null;
  currentSalary?: number | null;
  noticePeriod?: number | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  websiteUrl?: string | null;
  isOpenToWork?: boolean;
  profileCompletion?: number;
  skills?: any[];
  resumes?: any[];
  educations?: any[];
  experiences?: any[];
}

export interface EmployerProfileData {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber?: string | null;
  designation?: string | null;
  department?: string | null;
  profilePicture?: string | null;
  linkedinUrl?: string | null;
  isActive: boolean;
}

export interface AuthMeResponse {
  user: AuthUserResponse;
  profile: CandidateProfileData | EmployerProfileData | null;
  candidate?: {
    enabled: boolean;
    id: string;
    fullName: string;
  } | null;
  companies?: CompanyMemberItem[];
}

export interface LoginApiResponse {
  user: AuthUserResponse;
  profile: CandidateProfileData | EmployerProfileData | null;
  tokens?: AuthTokens;
}

export interface RegisterCandidateApiResponse {
  user: AuthUserResponse;
  candidate: {
    id: string;
    userId: string;
    fullName: string;
  };
  tokens: AuthTokens;
}

export interface RegisterCompanyOwnerApiResponse {
  user: AuthUserResponse;
  company: {
    id: string;
    companyName: string;
    slug: string;
  };
  employer: EmployerProfileData;
  tokens: AuthTokens;
}

export interface CompanyMemberItem {
  id: string;
  companyId: string;
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'RECRUITER' | 'HIRING_MANAGER';
  status: 'ACTIVE' | 'INVITED' | 'INACTIVE';
  company: {
    id: string;
    companyName: string;
    slug: string;
    logo: string | null;
    industry: string | null;
    companySize: string | null;
    headquarters: string | null;
  };
}

// ─── API Calls ─────────────────────────────────────────────────────────────────

export const authApi = {
  /** Register a base user (unified signup) */
  registerUser: (dto: RegisterUserDto) =>
    api.post<RegisterUserApiResponse>('/auth/register', dto),

  /** Register a new candidate */
  registerCandidate: (dto: RegisterCandidateDto) =>
    api.post<RegisterCandidateApiResponse>('/auth/register/candidate', dto),

  /** Register a company owner (full company info) */
  registerCompanyOwner: (dto: RegisterCompanyOwnerDto) =>
    api.post<RegisterCompanyOwnerApiResponse>('/auth/register/company-owner', dto),

  /** Login — works for all roles */
  login: (dto: LoginDto) =>
    api.post<LoginApiResponse>('/auth/login', dto),

  /** Get current authenticated user profile */
  getMe: () =>
    api.get<AuthMeResponse>('/auth/me'),

  /** Refresh access token using HttpOnly cookie */
  refreshToken: () =>
    api.post<AuthTokens>('/auth/new-refresh-token'),

  /** Logout from current device */
  logout: () =>
    api.post<null>('/auth/logout'),

  /** Logout from all devices */
  logoutAll: () =>
    api.post<null>('/auth/logout/all-devices'),

  /** Request password reset email */
  forgotPassword: (dto: ForgotPasswordDto) =>
    api.post<null>('/auth/forgot/password', dto),

  /** Verify OTP code for password reset */
  verifyOtp: (dto: VerifyOtpDto) =>
    api.post<string>('/auth/verify/otp', dto),

  /** Reset password using verified token */
  resetPassword: (dto: ResetPasswordDto) =>
    api.post<null>('/auth/reset/password', dto),

  /** Verify email address with OTP */
  verifyEmail: (dto: VerifyEmailDto) =>
    api.post<null>('/auth/verify-email', dto),

  /** Resend email verification */
  resendVerification: (dto: ResendVerificationDto) =>
    api.post<null>('/auth/resend-verification', dto),

  /** Change password (must be authenticated) */
  changePassword: (dto: ChangePasswordDto) =>
    api.post<null>('/auth/change/password', dto),

  /** Get company metadata options (industries, company sizes) */
  getCompanyMetadata: () =>
    api.get<{ industries: string[]; companySizes: string[] }>('/companies/metadata'),

  /** Get companies belonging to the current employer */
  getMyCompanies: () =>
    api.get<CompanyMemberItem[]>('/companies/my'),

  /** Create a new company for the existing user (become employer/create company) */
  createCompany: (dto: { companyName: string; website?: string; industry?: string; companySize?: string; headquarters?: string; description?: string; logo?: string }) =>
    api.post<any>('/companies/register', dto),

  /** Create candidate profile for existing user (become candidate) */
  createCandidateProfile: (dto: { fullName: string; phoneNumber?: string; headline?: string }) =>
    api.post<any>('/candidate/me', dto),
};
