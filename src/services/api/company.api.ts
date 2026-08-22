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

export const companyApi = {
  /** Register / Create a new company */
  createCompany: (data: CreateCompanyDto) =>
    api.post<CompanyDetails>('/companies/register', data),

  /** Register alias for createCompany */
  registerCompany: (data: CreateCompanyDto) =>
    api.post<CompanyDetails>('/companies/register', data),

  /** Fetch detailed profile of a company by its ID */
  getCompanyDetails: (companyId: string) =>
    api.get<CompanyDetails>(`/companies/${companyId}`),

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

  /** Upload company logo */
  uploadLogo: (companyId: string, file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    return api.patch<CompanyDetails>(`/companies/${companyId}/logo`, formData, { isFormData: true });
  },

  /** Upload company cover banner */
  uploadCover: (companyId: string, file: File) => {
    const formData = new FormData();
    formData.append('cover', file);
    return api.patch<CompanyDetails>(`/companies/${companyId}/cover`, formData, { isFormData: true });
  },

  /** Get company metadata options (industries, sizes) */
  getCompanyMetadata: () =>
    api.get<CompanyMetadataResponse>('/companies/metadata'),

  /** Get all companies belonging to the current user */
  getMyCompanies: () =>
    api.get<any[]>('/companies/my'),
};

