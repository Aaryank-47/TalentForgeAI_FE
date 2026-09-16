import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi, type UpdateEmployerProfileDto, type EmployerProfileData } from '../../services/api/auth.api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getCountries, getCountryCallingCode, isValidPhoneNumber, type CountryCode } from 'libphonenumber-js';
import { CountryCodeSelect } from '../../components/ui/CountryCodeSelect';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  ShieldCheck,
  Edit3,
  Save,
  X,
  Camera,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Calendar,
  Key,
  ExternalLink,
  Loader2,
  Globe
} from 'lucide-react';

export const RecruiterProfilePage: React.FC = () => {
  const { user, currentWorkspace, refreshUser } = useAuth();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [country, setCountry] = useState<CountryCode>('US');
  const [phoneError, setPhoneError] = useState<string>('');

  const countries = useMemo(() => getCountries(), []);

  // Extract employer profile data safely from user context or getMe query
  const { data: meData } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.getMe(),
    staleTime: 1000 * 60 * 5,
  });

  const currentUser = meData?.user || (user ? { id: user.id, email: user.email, role: user.role, status: user.status, isEmailVerified: user.isEmailVerified } : null);
  const currentProfile = meData?.employer || (meData?.profile && 'designation' in meData.profile ? meData.profile : null) || user?.employerProfile || (user?.profile as EmployerProfileData | undefined);
  const companies = meData?.companies || user?.companies || [];

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    designation: '',
    department: '',
    phoneNumber: '',
    linkedinUrl: '',
    profilePicture: '',
  });

  // Populate form data when profile is available
  useEffect(() => {
    if (currentUser || currentProfile) {
      const profileToUse = currentProfile || meData?.employer || user?.employerProfile;
      const existingPhone = profileToUse?.phoneNumber || '';
      setFormData({
        fullName: profileToUse?.fullName || meData?.employer?.fullName || user?.fullName || '',
        designation: profileToUse?.designation || '',
        department: profileToUse?.department || '',
        phoneNumber: existingPhone,
        linkedinUrl: profileToUse?.linkedinUrl || '',
        profilePicture: profileToUse?.profilePicture || '',
      });

      // Auto-detect country code from existing phone number if present
      if (existingPhone.startsWith('+')) {
        for (const c of countries) {
          const callingCode = getCountryCallingCode(c);
          if (existingPhone.startsWith(`+${callingCode}`)) {
            setCountry(c);
            break;
          }
        }
      }
    }
  }, [currentUser, currentProfile, user, countries]);

  // Update Employer Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: (dto: UpdateEmployerProfileDto) => authApi.updateEmployerProfile(dto),
    onSuccess: async () => {
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setPhoneError('');
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
    onError: (err: any) => {
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to update profile';
      toast.error(errorMsg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');

    if (!formData.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }

    let finalPhone = formData.phoneNumber.trim();
    if (finalPhone) {
      const callingCode = getCountryCallingCode(country);
      let fullNumber = finalPhone;
      if (!fullNumber.startsWith('+')) {
        const cleanNumber = fullNumber.replace(/^0+/, '');
        fullNumber = `+${callingCode}${cleanNumber}`;
      }

      if (!isValidPhoneNumber(fullNumber, country)) {
        const errMsg = `Invalid phone number format for selected country (${country} +${callingCode})`;
        setPhoneError(errMsg);
        toast.error(`Invalid phone number length/digits for ${country} (+${callingCode})`);
        return;
      }
      finalPhone = fullNumber;
    }

    updateProfileMutation.mutate({
      fullName: formData.fullName.trim(),
      designation: formData.designation.trim() || null,
      department: formData.department.trim() || null,
      phoneNumber: finalPhone || null,
      linkedinUrl: formData.linkedinUrl.trim() || null,
      profilePicture: formData.profilePicture.trim() || null,
    });
  };

  const userInitials = (formData.fullName || currentUser?.email || 'Recruiter')
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-primary-700 via-primary-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar container */}
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 shadow-inner flex items-center justify-center text-white font-bold text-2xl sm:text-3xl overflow-hidden">
                {formData.profilePicture ? (
                  <img src={formData.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{userInitials}</span>
                )}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-1 -right-1 p-1.5 bg-white text-primary-600 rounded-lg shadow-md hover:bg-slate-100 transition-transform active:scale-95"
                title="Change Avatar"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {formData.fullName || currentUser?.email || 'Employer Profile'}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm border border-white/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Verified Employer
                </span>
              </div>

              <p className="text-white/80 text-sm mt-1 font-medium flex items-center gap-2 flex-wrap">
                <span>{formData.designation || 'Recruiter / Hiring Manager'}</span>
                {formData.department && (
                  <>
                    <span>•</span>
                    <span>{formData.department}</span>
                  </>
                )}
                {currentWorkspace?.name && (
                  <>
                    <span>•</span>
                    <span className="text-amber-200 font-semibold">{currentWorkspace.name}</span>
                  </>
                )}
              </p>

              <div className="flex items-center gap-4 text-xs text-white/70 mt-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {currentUser?.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Member since {meData?.user?.createdAt ? new Date(meData.user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '2026'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-primary-700 hover:bg-slate-50 rounded-xl font-semibold text-sm shadow-md transition-all active:scale-95"
              >
                <Edit3 className="w-4 h-4 text-primary-600" /> Edit Profile
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setPhoneError('');
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-sm backdrop-blur-sm border border-white/30 transition-all"
              >
                <X className="w-4 h-4" /> Cancel Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Personal Profile Info & Edit Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
                  <p className="text-xs text-slate-500">Manage your employer profile details and contact information.</p>
                </div>
              </div>
            </div>

            {isEditing ? (
              /* Edit Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      required
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Job Designation / Title
                    </label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={e => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="e.g. Lead Talent Partner"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={e => setFormData({ ...formData, department: e.target.value })}
                      placeholder="e.g. HR & Recruiting"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Phone Number (Country Option & Digit Validation)
                    </label>
                    <div className="flex gap-2">
                      <CountryCodeSelect
                        value={country}
                        onChange={c => {
                          setCountry(c);
                          setPhoneError('');
                        }}
                        className="w-2/5 sm:w-1/3"
                      />
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={e => {
                          setPhoneError('');
                          setFormData({ ...formData, phoneNumber: e.target.value });
                        }}
                        placeholder={`e.g. +${getCountryCallingCode(country)} 9876543210`}
                        className={`w-3/5 sm:w-2/3 px-3.5 py-2.5 text-sm bg-slate-50 border ${
                          phoneError ? 'border-red-500' : 'border-slate-200'
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all`}
                      />
                    </div>
                    {phoneError && <p className="text-red-500 text-[11px] mt-1 font-medium">{phoneError}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Profile Picture URL
                    </label>
                    <input
                      type="url"
                      value={formData.profilePicture}
                      onChange={e => setFormData({ ...formData, profilePicture: e.target.value })}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setPhoneError('');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Display View */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Full Name</span>
                  <p className="font-semibold text-slate-900">{formData.fullName || 'Not provided'}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Job Designation</span>
                  <p className="font-semibold text-slate-900">{formData.designation || 'Not specified'}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Department</span>
                  <p className="font-semibold text-slate-900">{formData.department || 'Not specified'}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Phone Number</span>
                  <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {formData.phoneNumber || 'Not provided'}
                  </p>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <span className="text-xs text-slate-400 font-medium">LinkedIn Profile</span>
                  {formData.linkedinUrl ? (
                    <a
                      href={formData.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary-600 hover:underline flex items-center gap-1.5"
                    >
                      <Globe className="w-4 h-4 text-[#0A66C2]" />
                      {formData.linkedinUrl}
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ) : (
                    <p className="font-semibold text-slate-400 italic">No LinkedIn profile connected</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Connected Workspaces & Company Memberships */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Company Workspaces</h2>
                  <p className="text-xs text-slate-500">Organizations and teams you belong to.</p>
                </div>
              </div>
              <Link
                to="/recruiter/company"
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                Manage Company <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {companies.length > 0 ? (
              <div className="space-y-3">
                {companies.map((c: any) => {
                  const isCurrent = currentWorkspace?.id === c.companyId || currentWorkspace?.id === c.company?.id;
                  return (
                    <div
                      key={c.id || c.companyId}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-primary-50/50 border-primary-200 shadow-sm'
                          : 'bg-slate-50/50 border-slate-200/70 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 shadow-sm overflow-hidden">
                          {c.company?.logo ? (
                            <img src={c.company.logo} alt={c.company.companyName} className="w-full h-full object-cover" />
                          ) : (
                            c.company?.companyName?.[0]?.toUpperCase() || 'C'
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-sm">{c.company?.companyName || 'Company'}</h3>
                            {isCurrent && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-600 text-white">
                                Active Workspace
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Role: <span className="font-semibold text-slate-700">{c.role || 'Member'}</span>
                          </p>
                        </div>
                      </div>

                      <Link
                        to="/recruiter/company"
                        className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-primary-600 hover:bg-white bg-white/80 border border-slate-200 rounded-lg shadow-2xs transition-all"
                      >
                        View Profile
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700">No company workspace connected</p>
                <p className="text-xs text-slate-400 mt-1">Create or join an organization to post jobs.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column — Account Details & Quick Actions */}
        <div className="space-y-6">
          {/* Account & Security Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary-600" /> Account Settings
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-medium block">Email Address</span>
                  <span className="font-bold text-slate-900 text-sm truncate max-w-[180px] block">{currentUser?.email}</span>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-medium block">Primary Role</span>
                  <span className="font-bold text-slate-900 text-sm block">
                    {currentUser?.role || 'EMPLOYER'}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  to="/recruiter/settings"
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-primary-50/30 transition-all font-semibold text-slate-700 group"
                >
                  <span className="flex items-center gap-2 text-xs">
                    <Key className="w-4 h-4 text-slate-400 group-hover:text-primary-600" /> Change Password & Security
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-600" />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats & Shortcuts */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 fill-amber-400" /> Hiring Dashboard
            </div>
            <h3 className="text-lg font-bold mb-2">Recruiter Workspace</h3>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Quickly jump into active pipelines, manage candidate assessments, or update team settings.
            </p>

            <div className="space-y-2.5">
              <Link
                to="/recruiter/jobs/create"
                className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold rounded-xl flex items-center justify-between transition-all shadow-sm"
              >
                <span>Create Job Posting</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/recruiter/pipeline"
                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl flex items-center justify-between transition-all border border-white/10"
              >
                <span>View Candidate Pipeline</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfilePage;
