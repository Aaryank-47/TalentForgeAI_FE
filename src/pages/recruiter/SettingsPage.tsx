import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Building, Users, GitBranch, Mail, CreditCard, Plus, MoreHorizontal,
  Upload, Trash2, GripVertical, CheckCircle, X, Edit2, Crown,
  ChevronDown, Loader2, ShieldCheck, AlertCircle, Image as ImageIcon,
  Ban, RefreshCw,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { 
  companyApi, 
  type UpdateCompanyDto,
  type CompanyMemberRole,
  type CompanyMemberItem 
} from '../../services/api/company.api';
import { companyKeys, authKeys } from '../../constants/queryKeys';
import { Modal } from '../../components/ui/Modal';

import {
  settingsTabs as tabs,
  settingsDefaultStages as defaultStages,
  settingsEmailPrefs as emailPrefs,
} from '../../constants/recruiter_mockData';


const SettingsPage = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, currentWorkspace, availableWorkspaces } = useAuth();

  // Determine active company ID
  const companyId =
    (currentWorkspace?.type === 'COMPANY' ? currentWorkspace.id : undefined) ||
    user?.companyId ||
    availableWorkspaces?.find(w => w.type === 'COMPANY')?.id ||
    user?.companies?.[0]?.companyId ||
    user?.companies?.[0]?.company?.id ||
    '';

  // Fallback metadata from current user session while server state loads
  const userCompanyMembership =
    user?.companies?.find(c => c.companyId === companyId) || user?.companies?.[0];
  const fallbackCompany = userCompanyMembership?.company;

  const getTabFromPath = (path: string) => {
    if (path.includes('/recruiter/team')) return 'Team Members';
    if (path.includes('/recruiter/company')) return 'Company Profile';
    return 'Company Profile';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const [stages, setStages] = useState(defaultStages);
  const [emailToggles, setEmailToggles] = useState<Record<string, boolean>>({
    newApplicant: true,
    interview: true,
    assessment: false,
    moved: true,
    offer: true,
  });

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);

  // Form state for Company Profile (synced with backend data)
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    industry: '',
    companySize: '',
    companyEmail: '',
    phoneNumber: '',
    description: '',
    headquarters: '',
    linkedinUrl: '',
    twitterUrl: '',
  });

  // Fetch Company Details from backend
  const {
    data: companyDetails,
    isLoading: isLoadingCompany,
  } = useQuery({
    queryKey: companyKeys.detail(companyId),
    queryFn: () => companyApi.getCompanyDetails(companyId),
    enabled: !!companyId,
  });

  // Fetch Metadata (Industry & Size dropdown options)
  const { data: metadata } = useQuery({
    queryKey: companyKeys.metadata,
    queryFn: () => companyApi.getCompanyMetadata(),
    staleTime: 1000 * 60 * 60,
  });

  const industries: string[] = metadata?.industries?.length
    ? metadata.industries
    : ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Design', 'Marketing', 'Consulting'];

  const companySizes: string[] = metadata?.companySizes?.length
    ? metadata.companySizes
    : ['1-10', '11-50', '50-200', '200-500', '500+'];

  // Sync actual database values into form state
  useEffect(() => {
    if (companyDetails) {
      setFormData({
        companyName: companyDetails.companyName || '',
        website: companyDetails.website || '',
        industry: companyDetails.industry || '',
        companySize: companyDetails.companySize || '',
        companyEmail: companyDetails.companyEmail || '',
        phoneNumber: companyDetails.phoneNumber || '',
        description: companyDetails.description || '',
        headquarters: companyDetails.headquarters || '',
        linkedinUrl: companyDetails.linkedinUrl || '',
        twitterUrl: companyDetails.twitterUrl || '',
      });
    } else if (fallbackCompany) {
      setFormData(prev => ({
        companyName: prev.companyName || fallbackCompany.companyName || '',
        website: prev.website || fallbackCompany.website || '',
        industry: prev.industry || fallbackCompany.industry || '',
        companySize: prev.companySize || fallbackCompany.companySize || '',
        companyEmail: prev.companyEmail || fallbackCompany.companyEmail || '',
        phoneNumber: prev.phoneNumber || fallbackCompany.phoneNumber || '',
        description: prev.description || fallbackCompany.description || '',
        headquarters: prev.headquarters || fallbackCompany.headquarters || '',
        linkedinUrl: prev.linkedinUrl || '',
        twitterUrl: prev.twitterUrl || '',
      }));
    }
  }, [companyDetails, fallbackCompany]);

  // Update Company Profile Mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateCompanyDto) => companyApi.updateCompanyProfile(companyId, data),
    onSuccess: () => {
      toast.success('Company profile updated successfully');
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) });
      queryClient.invalidateQueries({ queryKey: companyKeys.my });
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update company profile');
    },
  });

  // Logo Upload Mutation
  const uploadLogoMutation = useMutation({
    mutationFn: (file: File) => companyApi.uploadLogo(companyId, file),
    onSuccess: () => {
      toast.success('Logo uploaded successfully');
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) });
      queryClient.invalidateQueries({ queryKey: companyKeys.my });
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to upload logo');
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Invite Member Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState<{ inviteeEmail: string; role: CompanyMemberRole }>({
    inviteeEmail: '',
    role: 'RECRUITER',
  });

  // Team Members Query (GET /companies/members/:companyId)
  const {
    data: membersData,
    isLoading: isLoadingMembers,
  } = useQuery({
    queryKey: companyKeys.members(companyId),
    queryFn: () => companyApi.listCompanyMembers(companyId),
    enabled: !!companyId,
  });

  // Cover Image Upload Mutation (PATCH /companies/:companyId/cover)
  const uploadCoverMutation = useMutation({
    mutationFn: (file: File) => companyApi.uploadCover(companyId, file),
    onSuccess: () => {
      toast.success('Cover banner uploaded successfully');
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) });
      queryClient.invalidateQueries({ queryKey: companyKeys.my });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to upload cover banner');
    },
  });

  // Send Invitation Mutation (POST /companies/:companyId/invite)
  const inviteMemberMutation = useMutation({
    mutationFn: (data: { inviteeEmail: string; role: CompanyMemberRole }) =>
      companyApi.sendInvitation(companyId, {
        inviterId: user?.id || '',
        inviteeEmail: data.inviteeEmail,
        role: data.role,
      }),
    onSuccess: () => {
      toast.success('Invitation sent successfully!');
      setShowInviteModal(false);
      setInviteForm({ inviteeEmail: '', role: 'RECRUITER' });
      queryClient.invalidateQueries({ queryKey: companyKeys.members(companyId) });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to send invitation');
    },
  });

  // Update Member Role Mutation (PATCH /companies/:companyId/members/:userId/role)
  const updateMemberRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: CompanyMemberRole }) =>
      companyApi.updateCompanyMemberRole(companyId, userId, role),
    onSuccess: () => {
      toast.success('Member role updated successfully');
      queryClient.invalidateQueries({ queryKey: companyKeys.members(companyId) });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update member role');
    },
  });

  // Remove Member Mutation (DELETE /companies/:companyId/remove/members)
  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => companyApi.removeCompanyMembers(companyId, [userId]),
    onSuccess: () => {
      toast.success('Member removed successfully');
      queryClient.invalidateQueries({ queryKey: companyKeys.members(companyId) });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to remove member');
    },
  });

  // Cancel Invitation Mutation (DELETE /companies/invitations/:invitationId/cancel)
  const cancelInvitationMutation = useMutation({
    mutationFn: (invitationId: string) => companyApi.cancelInvitation(invitationId),
    onSuccess: () => {
      toast.success('Invitation cancelled successfully');
      queryClient.invalidateQueries({ queryKey: companyKeys.members(companyId) });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to cancel invitation');
    },
  });

  // Resend Invitation Mutation (POST /companies/invitations/:invitationId/resend)
  const resendInvitationMutation = useMutation({
    mutationFn: (invitationId: string) => companyApi.resendInvitation(invitationId),
    onSuccess: () => {
      toast.success('Invitation resent successfully');
      queryClient.invalidateQueries({ queryKey: companyKeys.members(companyId) });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to resend invitation');
    },
  });

  // Admin Verify Company Mutation (PATCH /companies/admin/companies/:companyId/verify)
  const verifyCompanyMutation = useMutation({
    mutationFn: () => companyApi.verifyCompany(companyId),
    onSuccess: () => {
      toast.success('Company verified successfully');
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) });
      queryClient.invalidateQueries({ queryKey: companyKeys.my });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to verify company');
    },
  });

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo image must be smaller than 2MB');
      return;
    }

    uploadLogoMutation.mutate(file);
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Cover image must be smaller than 5MB');
      return;
    }

    uploadCoverMutation.mutate(file);
  };

  // Restore original database values on Cancel
  const handleCancel = () => {
    if (companyDetails) {
      setFormData({
        companyName: companyDetails.companyName || '',
        website: companyDetails.website || '',
        industry: companyDetails.industry || '',
        companySize: companyDetails.companySize || '',
        companyEmail: companyDetails.companyEmail || '',
        phoneNumber: companyDetails.phoneNumber || '',
        description: companyDetails.description || '',
        headquarters: companyDetails.headquarters || '',
        linkedinUrl: companyDetails.linkedinUrl || '',
        twitterUrl: companyDetails.twitterUrl || '',
      });
    } else if (fallbackCompany) {
      setFormData({
        companyName: fallbackCompany.companyName || '',
        website: '',
        industry: fallbackCompany.industry || '',
        companySize: fallbackCompany.companySize || '',
        companyEmail: '',
        phoneNumber: '',
        description: '',
        headquarters: fallbackCompany.headquarters || '',
        linkedinUrl: '',
        twitterUrl: '',
      });
    }
    setIsEditing(false);
  };

  // Submit and save modified values only
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) {
      toast.error('No active company selected.');
      return;
    }

    if (!formData.companyName.trim()) {
      toast.error('Company Name is required.');
      return;
    }

    const payload: UpdateCompanyDto = {
      companyName: formData.companyName.trim() || undefined,
      companyEmail: formData.companyEmail.trim() || undefined,
      website: formData.website.trim() || undefined,
      phoneNumber: formData.phoneNumber.trim() || undefined,
      industry: formData.industry.trim() || undefined,
      companySize: formData.companySize.trim() || undefined,
      description: formData.description.trim() || undefined,
      headquarters: formData.headquarters.trim() || undefined,
      linkedinUrl: formData.linkedinUrl.trim() || undefined,
      twitterUrl: formData.twitterUrl.trim() || undefined,
    };

    updateMutation.mutate(payload);
  };

  const removeStage = (id: number) => setStages(ss => ss.filter(s => s.id !== id));

  // Determine current logo and fallback initials
  const currentLogo = companyDetails?.logo || fallbackCompany?.logo || null;
  const companyInitials = (
    formData.companyName ||
    companyDetails?.companyName ||
    fallbackCompany?.companyName ||
    currentWorkspace?.name ||
    'TF'
  )
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-[#0F172A]">Settings</h1>
        <p className="text-sm text-[#64748B] mt-0.5">Manage your company, team, and preferences.</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-52 flex-shrink-0 space-y-0.5">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                activeTab === tab
                  ? 'bg-primary-50 text-primary-700 border border-primary-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Company Profile Tab */}
          {activeTab === 'Company Profile' && (
            <div className="card p-6 space-y-6">
              {/* Header with Title & Edit Toggle Button */}
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
                <div>
                  <h2 className="text-base font-display font-bold text-[#0F172A]">Company Profile</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isEditing
                      ? 'Update your company details and branding.'
                      : 'View and manage your public company profile.'}
                  </p>
                </div>
                <div>
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="btn-secondary text-sm flex items-center gap-2 border-primary-200 text-primary-700 bg-primary-50/50 hover:bg-primary-100 hover:border-primary-300"
                    >
                      <Edit2 className="w-4 h-4 text-primary-600" />
                      Edit Profile
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Editing Active
                    </span>
                  )}
                </div>
              </div>

              {isLoadingCompany ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                  <p className="text-sm">Loading company profile...</p>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-6">
                  {/* Verification Status & Admin Verify */}
                  <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        companyDetails?.isVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">
                            {companyDetails?.isVerified ? 'Verified Company Profile' : 'Unverified Company'}
                          </p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            companyDetails?.isVerified 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {companyDetails?.isVerified ? 'VERIFIED' : 'PENDING'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {companyDetails?.isVerified 
                            ? 'Your organization is officially verified on the TalentForge network.' 
                            : 'Complete your profile details to receive verified employer status.'}
                        </p>
                      </div>
                    </div>

                    {user?.role === 'SUPER_ADMIN' && !companyDetails?.isVerified && (
                      <button
                        type="button"
                        onClick={() => verifyCompanyMutation.mutate()}
                        disabled={verifyCompanyMutation.isPending}
                        className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"
                      >
                        {verifyCompanyMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verify as Admin
                      </button>
                    )}
                  </div>

                  {/* Logo & Cover Banner Upload Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Logo Section */}
                    <div className="p-4 rounded-2xl border border-slate-100 bg-white flex items-center gap-4">
                      <div className="relative group flex-shrink-0">
                        {currentLogo ? (
                          <img
                            src={currentLogo}
                            alt={formData.companyName || 'Company Logo'}
                            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xl font-bold border border-slate-200 shadow-sm">
                            {companyInitials}
                          </div>
                        )}

                        {uploadLogoMutation.isPending && (
                          <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleLogoFileChange}
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadLogoMutation.isPending}
                          className="btn-secondary text-xs flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-60"
                        >
                          {uploadLogoMutation.isPending ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-600" />
                          ) : (
                            <Upload className="w-3.5 h-3.5 text-slate-600" />
                          )}
                          Upload Logo
                        </button>
                        <p className="text-[11px] text-slate-400 mt-1">PNG, JPG up to 2MB (200×200px)</p>
                      </div>
                    </div>

                    {/* Cover Banner Section */}
                    <div className="p-4 rounded-2xl border border-slate-100 bg-white flex items-center gap-4">
                      <div className="relative group w-24 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                        {companyDetails?.coverImage ? (
                          <img
                            src={companyDetails.coverImage}
                            alt="Cover Banner"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-slate-300" />
                        )}

                        {uploadCoverMutation.isPending && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <input
                          type="file"
                          ref={coverInputRef}
                          onChange={handleCoverFileChange}
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => coverInputRef.current?.click()}
                          disabled={uploadCoverMutation.isPending}
                          className="btn-secondary text-xs flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-60"
                        >
                          {uploadCoverMutation.isPending ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-600" />
                          ) : (
                            <Upload className="w-3.5 h-3.5 text-slate-600" />
                          )}
                          Upload Cover Banner
                        </button>
                        <p className="text-[11px] text-slate-400 mt-1">PNG, JPG up to 5MB (1200×400px)</p>
                      </div>
                    </div>
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-2 gap-5">
                    {/* Company Name */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company Name</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        className={`input-field text-sm transition-colors ${
                          !isEditing ? 'bg-slate-50 text-slate-600 cursor-not-allowed border-slate-200' : ''
                        }`}
                        placeholder="Enter company name"
                        value={formData.companyName}
                        onChange={e => setFormData(c => ({ ...c, companyName: e.target.value }))}
                        required
                      />
                    </div>

                    {/* Website */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Website</label>
                      <input
                        type="url"
                        disabled={!isEditing}
                        className={`input-field text-sm transition-colors ${
                          !isEditing ? 'bg-slate-50 text-slate-600 cursor-not-allowed border-slate-200' : ''
                        }`}
                        placeholder="https://example.com"
                        value={formData.website}
                        onChange={e => setFormData(c => ({ ...c, website: e.target.value }))}
                      />
                    </div>

                    {/* Industry */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Industry</label>
                      <div className="relative">
                        <select
                          disabled={!isEditing}
                          className={`input-field text-sm appearance-none transition-colors ${
                            !isEditing ? 'bg-slate-50 text-slate-600 cursor-not-allowed border-slate-200' : ''
                          }`}
                          value={formData.industry}
                          onChange={e => setFormData(c => ({ ...c, industry: e.target.value }))}
                        >
                          <option value="">Select an industry</option>
                          {industries.map(ind => (
                            <option key={ind} value={ind}>
                              {ind}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Company Size */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company Size</label>
                      <div className="relative">
                        <select
                          disabled={!isEditing}
                          className={`input-field text-sm appearance-none transition-colors ${
                            !isEditing ? 'bg-slate-50 text-slate-600 cursor-not-allowed border-slate-200' : ''
                          }`}
                          value={formData.companySize}
                          onChange={e => setFormData(c => ({ ...c, companySize: e.target.value }))}
                        >
                          <option value="">Select company size</option>
                          {companySizes.map(sz => (
                            <option key={sz} value={sz}>
                              {sz}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                      <input
                        type="email"
                        disabled={!isEditing}
                        className={`input-field text-sm transition-colors ${
                          !isEditing ? 'bg-slate-50 text-slate-600 cursor-not-allowed border-slate-200' : ''
                        }`}
                        placeholder="contact@company.com"
                        value={formData.companyEmail}
                        onChange={e => setFormData(c => ({ ...c, companyEmail: e.target.value }))}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
                      <input
                        type="tel"
                        disabled={!isEditing}
                        className={`input-field text-sm transition-colors ${
                          !isEditing ? 'bg-slate-50 text-slate-600 cursor-not-allowed border-slate-200' : ''
                        }`}
                        placeholder="+1 (555) 000-0000"
                        value={formData.phoneNumber}
                        onChange={e => setFormData(c => ({ ...c, phoneNumber: e.target.value }))}
                      />
                    </div>

                    {/* Description */}
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                      <textarea
                        disabled={!isEditing}
                        className={`input-field resize-none h-24 text-sm transition-colors ${
                          !isEditing ? 'bg-slate-50 text-slate-600 cursor-not-allowed border-slate-200' : ''
                        }`}
                        placeholder="Enter company description..."
                        value={formData.description}
                        onChange={e => setFormData(c => ({ ...c, description: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-5 border-t border-[#E5E7EB]">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={handleCancel}
                          disabled={updateMutation.isPending}
                          className="btn-secondary text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={updateMutation.isPending}
                          className="btn-primary text-sm flex items-center gap-2"
                        >
                          {updateMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="btn-primary text-sm flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Company Details
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Team Members */}
          {activeTab === 'Team Members' && (
            <div className="card overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h2 className="text-base font-display font-bold text-[#0F172A]">Team Members</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {membersData?.length || 0} active members & recruiters in your workspace
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(true)}
                  className="btn-primary text-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Invite Member
                </button>
              </div>

              {isLoadingMembers ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                  <p className="text-sm">Loading team members...</p>
                </div>
              ) : !membersData?.length ? (
                <div className="p-12 text-center text-slate-500">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">No team members found</p>
                  <p className="text-xs text-slate-400 mt-1">Invite recruiters and interviewers to collaborate.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      {['Member', 'Role', 'Status', 'Joined Date', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {membersData.map((m: CompanyMemberItem) => {
                      const memberName = m.user.employer?.fullName || m.user.candidate?.fullName || m.user.email.split('@')[0];
                      const isCurrentUser = m.userId === user?.id;
                      const initials = memberName.substring(0, 2).toUpperCase();

                      return (
                        <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {initials}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold text-slate-900">{memberName}</p>
                                  {isCurrentUser && (
                                    <span className="text-[9px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full font-medium">You</span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500">{m.user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <select
                              value={m.role}
                              disabled={isCurrentUser || updateMemberRoleMutation.isPending}
                              onChange={e => updateMemberRoleMutation.mutate({ userId: m.userId, role: e.target.value as CompanyMemberRole })}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none bg-white ${
                                m.role === 'OWNER' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                m.role === 'ADMIN' ? 'bg-red-50 text-red-700 border-red-200' :
                                m.role === 'RECRUITER' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-slate-100 text-slate-600 border-slate-200'
                              } disabled:opacity-75 disabled:cursor-not-allowed`}
                            >
                              <option value="OWNER">Owner</option>
                              <option value="ADMIN">Admin</option>
                              <option value="RECRUITER">Recruiter</option>
                              <option value="HIRING_MANAGER">Hiring Manager</option>
                            </select>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                              m.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              m.status === 'INVITED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              m.status === 'CANCELLED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                              'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-xs text-slate-500">
                              {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : (
                                m.status === 'CANCELLED' ? 'Cancelled Invitation' : 'Pending Invitation'
                              )}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              {/* Cancel / Resend actions for pending invitations */}
                              {m.status === 'INVITED' && !isCurrentUser && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm(`Are you sure you want to cancel the invitation for ${memberName}?`)) {
                                        cancelInvitationMutation.mutate(m.id);
                                      }
                                    }}
                                    disabled={cancelInvitationMutation.isPending}
                                    className="p-1.5 rounded text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                                    title="Cancel invitation"
                                  >
                                    <Ban className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => resendInvitationMutation.mutate(m.id)}
                                    disabled={resendInvitationMutation.isPending}
                                    className="p-1.5 rounded text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                                    title="Resend invitation"
                                  >
                                    <RefreshCw className={`w-4 h-4 ${resendInvitationMutation.isPending ? 'animate-spin' : ''}`} />
                                  </button>
                                </>
                              )}

                              {/* Resend for cancelled invitations */}
                              {m.status === 'CANCELLED' && !isCurrentUser && (
                                <button
                                  type="button"
                                  onClick={() => resendInvitationMutation.mutate(m.id)}
                                  disabled={resendInvitationMutation.isPending}
                                  className="p-1.5 rounded text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                                  title="Re-invite (Resend invitation)"
                                >
                                  <RefreshCw className={`w-4 h-4 ${resendInvitationMutation.isPending ? 'animate-spin' : ''}`} />
                                </button>
                              )}

                              {/* Remove member action */}
                              {!isCurrentUser && m.role !== 'OWNER' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to remove ${memberName} from the organization?`)) {
                                      removeMemberMutation.mutate(m.userId);
                                    }
                                  }}
                                  disabled={removeMemberMutation.isPending}
                                  className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                  title="Remove member"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Pipeline Stages */}
          {activeTab === 'Pipeline Stages' && (
            <div className="card p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-display font-bold text-[#0F172A]">Pipeline Configuration</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Customize your hiring pipeline stages. Drag to reorder.</p>
                </div>
                <button className="btn-primary text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Stage
                </button>
              </div>

              <div className="space-y-2">
                {stages.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3 p-3.5 bg-slate-50 border border-[#E5E7EB] rounded-xl group hover:border-primary-200 hover:bg-primary-50/20 transition-colors">
                    <GripVertical className="w-4 h-4 text-slate-300 cursor-grab group-hover:text-slate-400 flex-shrink-0" />
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 ${s.dot}`} />
                    <span className="text-sm font-medium text-slate-900 flex-1">{s.name}</span>
                    <span className="text-[10px] text-slate-400 bg-white px-2 py-1 rounded-lg border border-[#E5E7EB]">
                      {i + 1} of {stages.length}
                    </span>
                    {!s.removable ? (
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">Required</span>
                    ) : (
                      <button onClick={() => removeStage(s.id)} className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
                <button className="btn-secondary text-sm">Reset to Default</button>
                <button className="btn-primary text-sm">Save Pipeline</button>
              </div>
            </div>
          )}

          {/* Email Preferences */}
          {activeTab === 'Email Preferences' && (
            <div className="card p-6 space-y-5">
              <div>
                <h2 className="text-base font-display font-bold text-[#0F172A]">Email Notifications</h2>
                <p className="text-xs text-slate-500 mt-0.5">Choose which notifications you want to receive by email.</p>
              </div>
              <div className="space-y-3">
                {emailPrefs.map(pref => (
                  <div key={pref.key} className="flex items-center justify-between p-4 rounded-xl border border-[#E5E7EB] bg-slate-50 hover:bg-white transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{pref.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{pref.desc}</p>
                    </div>
                    <button
                      onClick={() => setEmailToggles(t => ({ ...t, [pref.key]: !t[pref.key] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                        emailToggles[pref.key] ? 'bg-primary-600' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        emailToggles[pref.key] ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4 border-t border-[#E5E7EB]">
                <button className="btn-primary text-sm">Save Preferences</button>
              </div>
            </div>
          )}

          {/* Subscription & Billing */}
          {activeTab === 'Subscription & Billing' && (
            <div className="space-y-4">
              {/* Current Plan */}
              <div className="card p-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-5 h-5 text-yellow-300" />
                      <span className="font-bold text-lg">Professional Plan</span>
                    </div>
                    <p className="text-primary-200 text-sm mb-4">$149 / month · Billed annually</p>
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <p className="text-primary-200 text-xs">Team Seats</p>
                        <p className="font-bold">5 / 10 used</p>
                      </div>
                      <div>
                        <p className="text-primary-200 text-xs">Active Jobs</p>
                        <p className="font-bold">18 / 25</p>
                      </div>
                      <div>
                        <p className="text-primary-200 text-xs">AI Interviews</p>
                        <p className="font-bold">247 / 500</p>
                      </div>
                    </div>
                  </div>
                  <button className="bg-white/20 hover:bg-white/30 transition-colors text-white font-semibold text-sm px-4 py-2 rounded-xl">
                    Upgrade Plan
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Payment Method */}
                <div className="card p-5">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Payment Method</h3>
                  <div className="flex items-center gap-3 p-3 border border-[#E5E7EB] rounded-xl">
                    <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">•••• •••• •••• 4242</p>
                      <p className="text-xs text-slate-500">Expires 12/2027</p>
                    </div>
                    <button className="ml-auto text-xs text-primary-600 font-medium">Update</button>
                  </div>
                </div>

                {/* Usage */}
                <div className="card p-5">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Usage This Month</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'AI Interviews', used: 247, total: 500 },
                      { label: 'Job Postings', used: 18, total: 25 },
                      { label: 'Assessments', used: 16, total: 50 },
                    ].map(u => (
                      <div key={u.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-600">{u.label}</span>
                          <span className="font-medium text-slate-900">{u.used}/{u.total}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-primary-600" style={{ width: `${(u.used / u.total) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Invoices */}
              <div className="card overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Billing History</h3>
                  <button className="text-xs text-primary-600 font-medium hover:text-primary-700">Download All</button>
                </div>
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      {['Date', 'Description', 'Amount', 'Status', ''].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {[
                      { date: 'Jun 1, 2024', desc: 'Professional Plan - June', amount: '$149.00', status: 'Paid' },
                      { date: 'May 1, 2024', desc: 'Professional Plan - May', amount: '$149.00', status: 'Paid' },
                      { date: 'Apr 1, 2024', desc: 'Professional Plan - April', amount: '$149.00', status: 'Paid' },
                    ].map((inv, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5 text-sm text-slate-600">{inv.date}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-900">{inv.desc}</td>
                        <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{inv.amount}</td>
                        <td className="px-5 py-3.5">
                          <span className="text-[10px] font-semibold px-2 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">Download</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Invite Team Member (POST /companies/:companyId/invite) */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Team Member"
        subtitle="Send an invitation email to collaborate on your hiring pipeline."
        maxWidth="max-w-md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!inviteForm.inviteeEmail.trim()) {
              toast.error('Email address is required.');
              return;
            }
            inviteMemberMutation.mutate(inviteForm);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Colleague's Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="colleague@company.com"
              value={inviteForm.inviteeEmail}
              onChange={(e) => setInviteForm({ ...inviteForm, inviteeEmail: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Role & Permissions *
            </label>
            <select
              value={inviteForm.role}
              onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as CompanyMemberRole })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
            >
              <option value="RECRUITER">Recruiter (Can create jobs, evaluate applicants)</option>
              <option value="ADMIN">Admin (Full access to company settings & team)</option>
              <option value="HIRING_MANAGER">Hiring Manager (Review candidates, manage interview stages)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowInviteModal(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={inviteMemberMutation.isPending}
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              {inviteMemberMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Send Invitation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SettingsPage;
