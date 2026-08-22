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

export interface UpdateCompanyDto {
  companyName?: string;
  companyEmail?: string;
  website?: string;
  phoneNumber?: string;
  logo?: string;
  coverImage?: string;
  description?: string;
  industry?: string;
  companySize?: string;
  foundedYear?: number;
  headquarters?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

export interface CompanyMetadataResponse {
  industries: string[];
  companySizes: string[];
}

export const companyApi = {
  /** Fetch detailed profile of a company by its ID */
  getCompanyDetails: (companyId: string) =>
    api.get<CompanyDetails>(`/companies/${companyId}`),

  /** Update company profile information */
  updateCompanyProfile: (companyId: string, data: UpdateCompanyDto) =>
    api.patch<CompanyDetails>(`/companies/update/${companyId}`, data),

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
