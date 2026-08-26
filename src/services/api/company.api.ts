/**
 * TalentForge — Company API Service
 *
 * Handles all company profile, settings, member management, and asset uploads.
 */

import { api } from './apiClient';

export interface CompanyDetails {
  id: string;
  companyName: string;
  slug: string;
  companyEmail: string | null;
  phoneNumber: string | null;
  website: string | null;
  logo: string | null;
  coverImage: string | null;
  description: string | null;
  industry: string | null;
  companySize: string | null;
  foundedYear: number | null;
  headquarters: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  profileCompletion?: number;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCompanyDto {
  companyName: string;
  companyEmail?: string;
  website?: string;
  phoneNumber?: string;
  industry?: string;
  companySize?: string;
  headquarters?: string;
  description?: string;
  logo?: string;
  foundedYear?: number;
  linkedinUrl?: string;
  twitterUrl?: string;
}

export type UpdateCompanyDto = Partial<CreateCompanyDto>;

export interface CompanyMetadataResponse {
  industries: string[];
  companySizes: string[];
}

export interface SearchCompanyParams {
  keyword?: string;
  industry?: string;
  location?: string;
  companySize?: string;
  page?: number;
  limit?: number;
  sortBy?: 'companyName' | 'createdAt' | 'profileCompletion' | 'foundedYear';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchCompanyResponse {
  companies: CompanyDetails[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type CompanyMemberRole = 'OWNER' | 'ADMIN' | 'RECRUITER' | 'HIRING_MANAGER';
export type CompanyMemberStatus = 'INVITED' | 'ACTIVE' | 'SUSPENDED' | 'REMOVED' | 'LEFT' | 'CANCELLED';

export interface CompanyMemberItem {
  id: string;
  userId: string;
  companyId: string;
  role: CompanyMemberRole;
  status: CompanyMemberStatus;
  joinedAt: string | null;
  invitedBy: string | null;
  user: {
    email: string;
    employer?: {
      fullName: string | null;
    } | null;
    candidate?: {
      fullName: string | null;
    } | null;
  };
}

export interface SendInvitationDto {
  inviterId: string;
  inviteeEmail: string;
  role?: CompanyMemberRole;
}

export interface SendInvitationResponse {
  token: string;
  invitationId: string | null;
}

export interface InvitationDetails {
  companyId: string;
  companyName: string;
  companyLogo: string | null;
  companyEmail: string | null;
  role: CompanyMemberRole;
  inviteeEmail: string;
  expiresAt: string | null;
}

export interface RemoveMembersDto {
  userIds: string[];
}

export interface RemoveMembersResponse {
  removedCount: number;
  removedMembers: any[];
}

export const companyApi = {
  /** Register / Create a new company */
  createCompany: (data: CreateCompanyDto) =>
    api.post<CompanyDetails>('/companies/register', data),

  /** Register alias for createCompany */
  registerCompany: (data: CreateCompanyDto) =>
    api.post<CompanyDetails>('/companies/register', data),

  /** Fetch detailed profile of a company by its ID (member access) */
  getCompanyDetails: (companyId: string) =>
    api.get<CompanyDetails>(`/companies/${companyId}`),

  /** Fetch public detailed profile of a company by its ID */
  getPublicCompanyDetails: (companyId: string) =>
    api.get<CompanyDetails>(`/companies/public/${companyId}`),

  /** Fetch all active verified public companies */
  getAllCompanies: () =>
    api.get<CompanyDetails[]>('/companies/get/all'),

  /** Update company profile information */
  updateCompanyProfile: (companyId: string, data: UpdateCompanyDto) =>
    api.patch<CompanyDetails>(`/companies/update/${companyId}`, data),

  /** Delete company profile */
  deleteCompanyProfile: (companyId: string) =>
    api.delete<{ message: string }>(`/companies/delete/${companyId}`),

  /** Search companies with filters and pagination */
  searchCompanies: (params?: SearchCompanyParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          searchParams.append(k, String(v));
        }
      });
    }
    const queryString = searchParams.toString();
    return api.get<SearchCompanyResponse>(`/companies/search${queryString ? `?${queryString}` : ''}`);
  },

  /** Send team invitation email (POST /companies/:companyId/invite) */
  sendInvitation: (companyId: string, data: SendInvitationDto) =>
    api.post<SendInvitationResponse>(`/companies/${companyId}/invite`, data),

  /** Get invitation details by verification token (GET /companies/invitation/:token) */
  getInvitation: (token: string) =>
    api.get<InvitationDetails>(`/companies/invitation/${token}`),

  /** Accept or reject invitation (POST /companies/invitation/:action/:token) */
  acceptOrRejectInvitation: (action: 'accept' | 'reject', token: string) =>
    api.post<{ message: string }>(`/companies/invitation/${action}/${token}`),

  /** List all members of a company (GET /companies/members/:companyId) */
  listCompanyMembers: (companyId: string) =>
    api.get<CompanyMemberItem[]>(`/companies/members/${companyId}`),

  /** Cancel an invitation by member/invitation ID (DELETE /companies/invitations/:invitationId/cancel) */
  cancelInvitation: (invitationId: string) =>
    api.delete<{ id: string; status: CompanyMemberStatus }>(`/companies/invitations/${invitationId}/cancel`),

  /** Resend an invitation by member/invitation ID (POST /companies/invitations/:invitationId/resend) */
  resendInvitation: (invitationId: string) =>
    api.post<{ id: string; status: CompanyMemberStatus; expiresAt: string }>(`/companies/invitations/${invitationId}/resend`),

  /** Update role of a company member (PATCH /companies/:companyId/members/:userId/role) */
  updateCompanyMemberRole: (companyId: string, userId: string, role: CompanyMemberRole) =>
    api.patch<CompanyMemberItem>(`/companies/${companyId}/members/${userId}/role`, { role }),

  /** Remove members from company (DELETE /companies/:companyId/remove/members) */
  removeCompanyMembers: (companyId: string, userIds: string[]) =>
    api.delete<RemoveMembersResponse>(`/companies/${companyId}/remove/members`, {
      body: { userIds },
    }),

  /** Upload company logo (PATCH /companies/:companyId/logo) */
  uploadLogo: (companyId: string, file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    return api.patch<CompanyDetails>(`/companies/${companyId}/logo`, formData, { isFormData: true });
  },

  /** Upload company cover banner (PATCH /companies/:companyId/cover) */
  uploadCover: (companyId: string, file: File) => {
    const formData = new FormData();
    formData.append('cover', file);
    return api.patch<CompanyDetails>(`/companies/${companyId}/cover`, formData, { isFormData: true });
  },

  /** Admin verify company profile (PATCH /companies/admin/companies/:companyId/verify) */
  verifyCompany: (companyId: string) =>
    api.patch<CompanyDetails>(`/companies/admin/companies/${companyId}/verify`),

  /** Get company metadata options (industries, sizes) */
  getCompanyMetadata: () =>
    api.get<CompanyMetadataResponse>('/companies/metadata'),

  /** Get all companies belonging to the current user */
  getMyCompanies: () =>
    api.get<any[]>('/companies/my'),
};


