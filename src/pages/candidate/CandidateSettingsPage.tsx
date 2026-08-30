import React, { useState, useEffect } from 'react';
import { Lock, Shield, Trash2, Eye, EyeOff, Loader2, Globe } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { candidateApi, type UpdateCandidateProfileDto } from '../../services/api/candidate.api';
import { authApi } from '../../services/api/auth.api';
import { candidateKeys, authKeys } from '../../constants/queryKeys';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const tabs = ['Account', 'Security', 'Notifications', 'Privacy'];

const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${on ? 'bg-primary-600' : 'bg-slate-300'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

const CandidateSettingsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('Account');
  const [showPassword, setShowPassword] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [notifications, setNotifications] = useState({
    newJobs: true, applicationUpdate: true, interviewReminder: true,
    assessmentAssigned: true, offerReceived: true, emailDigest: false, smsAlerts: false,
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true, resumeVisible: false, searchable: true, activityStatus: false,
  });

  // Account & Preferences Form
  const [accountForm, setAccountForm] = useState<UpdateCandidateProfileDto>({
    fullName: '',
    headline: '',
    phoneNumber: '',
    currentLocation: '',
    preferredLocation: '',
    currentCompany: '',
    currentDesignation: '',
    websiteUrl: '',
    bio: '',
    expectedSalary: undefined,
    currentSalary: undefined,
    noticePeriod: undefined,
  });

  // Fetch Candidate Profile (GET /candidates/me)
  const { data: candidate, isLoading: isLoadingProfile } = useQuery({
    queryKey: candidateKeys.me,
    queryFn: () => candidateApi.getCandidateProfile(),
  });

  // Sync profile data to local form state
  useEffect(() => {
    if (candidate) {
      setAccountForm({
        fullName: candidate.fullName || user?.fullName || '',
        headline: candidate.headline || '',
        phoneNumber: candidate.phoneNumber || '',
        currentLocation: candidate.currentLocation || '',
        preferredLocation: candidate.preferredLocation || '',
        currentCompany: candidate.currentCompany || '',
        currentDesignation: candidate.currentDesignation || '',
        websiteUrl: candidate.websiteUrl || '',
        bio: candidate.bio || '',
        expectedSalary: candidate.expectedSalary || undefined,
        currentSalary: candidate.currentSalary || undefined,
        noticePeriod: candidate.noticePeriod || undefined,
      });
    }
  }, [candidate, user]);

  // Update Profile Mutation (PATCH /candidates/me)
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateCandidateProfileDto) => candidateApi.updateCandidateProfile(data),
    onSuccess: () => {
      toast.success('Settings updated successfully!');
      queryClient.invalidateQueries({ queryKey: candidateKeys.me });
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update settings');
    },
  });

  // Change Password Mutation
  const changePasswordMutation = useMutation({
    mutationFn: () => {
      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match');
      }
      return authApi.changePassword({
        oldPassword: currentPassword,
        newPassword,
      });
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to change password');
    },
  });

  const toggle = (key: string) => setNotifications(n => ({ ...n, [key]: !n[key as keyof typeof n] }));
  const togglePrivacy = (key: string) => setPrivacy(p => ({ ...p, [key]: !p[key as keyof typeof p] }));

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, any> = {};
    Object.entries(accountForm).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) {
        payload[k] = typeof v === 'string' ? v.trim() : v;
      }
    });
    updateProfileMutation.mutate(payload as UpdateCandidateProfileDto);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    changePasswordMutation.mutate();
  };

  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <h1 className="text-2xl font-display font-bold text-[#0F172A]">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your account, security, notifications, and privacy.</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-48 flex-shrink-0 space-y-0.5">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${activeTab === tab
                  ? 'bg-primary-50 text-primary-700 border border-primary-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          {/* Account */}
          {activeTab === 'Account' && (
            <div className="space-y-4">
              <form onSubmit={handleSaveAccount} className="card p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-[#0F172A] text-base">Personal Information</h2>
                  {isLoadingProfile && <Loader2 className="w-4 h-4 animate-spin text-primary-600" />}
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={accountForm.fullName || ''}
                      onChange={e => setAccountForm({ ...accountForm, fullName: e.target.value })}
                      className="input-field text-sm"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Headline / Title</label>
                    <input
                      type="text"
                      value={accountForm.headline || ''}
                      onChange={e => setAccountForm({ ...accountForm, headline: e.target.value })}
                      className="input-field text-sm"
                      placeholder="e.g. Full Stack Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                    <input
                      type="text"
                      disabled
                      value={user?.email || ''}
                      className="input-field text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
                    <input
                      type="text"
                      value={accountForm.phoneNumber || ''}
                      onChange={e => setAccountForm({ ...accountForm, phoneNumber: e.target.value })}
                      className="input-field text-sm"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
                    <input
                      type="text"
                      value={accountForm.currentLocation || ''}
                      onChange={e => setAccountForm({ ...accountForm, currentLocation: e.target.value })}
                      className="input-field text-sm"
                      placeholder="e.g. Bangalore, India"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Website / Portfolio</label>
                    <input
                      type="text"
                      value={accountForm.websiteUrl || ''}
                      onChange={e => setAccountForm({ ...accountForm, websiteUrl: e.target.value })}
                      className="input-field text-sm"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bio</label>
                    <textarea
                      rows={3}
                      value={accountForm.bio || ''}
                      onChange={e => setAccountForm({ ...accountForm, bio: e.target.value })}
                      className="input-field text-sm resize-none"
                      placeholder="Tell recruiters about yourself..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="btn-primary text-sm flex items-center gap-2"
                  >
                    {updateProfileMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </form>

              {/* Job Preferences */}
              <form onSubmit={handleSaveAccount} className="card p-6 space-y-4">
                <h2 className="font-display font-bold text-[#0F172A] text-base">Job & Career Preferences</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Company</label>
                    <input
                      type="text"
                      value={accountForm.currentCompany || ''}
                      onChange={e => setAccountForm({ ...accountForm, currentCompany: e.target.value })}
                      className="input-field text-sm"
                      placeholder="e.g. Google"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Designation</label>
                    <input
                      type="text"
                      value={accountForm.currentDesignation || ''}
                      onChange={e => setAccountForm({ ...accountForm, currentDesignation: e.target.value })}
                      className="input-field text-sm"
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Preferred Location</label>
                    <input
                      type="text"
                      value={accountForm.preferredLocation || ''}
                      onChange={e => setAccountForm({ ...accountForm, preferredLocation: e.target.value })}
                      className="input-field text-sm"
                      placeholder="e.g. Remote, San Francisco"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Expected Salary (Annual)</label>
                    <input
                      type="number"
                      value={accountForm.expectedSalary ?? ''}
                      onChange={e => setAccountForm({ ...accountForm, expectedSalary: Number(e.target.value) || undefined })}
                      className="input-field text-sm"
                      placeholder="e.g. 120000"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-3 border-t border-[#E5E7EB]">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="btn-primary text-sm flex items-center gap-2"
                  >
                    {updateProfileMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save Preferences
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security */}
          {activeTab === 'Security' && (
            <div className="space-y-4">
              <form onSubmit={handleChangePassword} className="card p-6">
                <h2 className="font-display font-bold text-[#0F172A] text-base mb-5">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        className="input-field text-sm pr-10"
                        placeholder="••••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="input-field text-sm"
                      placeholder="Minimum 8 characters"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="input-field text-sm"
                      placeholder="Repeat new password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                    className="btn-primary text-sm flex items-center gap-2"
                  >
                    {changePasswordMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    Update Password
                  </button>
                </div>
              </form>

              {/* 2FA */}
              <div className="card p-6">
                <h2 className="font-display font-bold text-[#0F172A] text-base mb-2">Two-Factor Authentication</h2>
                <p className="text-sm text-slate-500 mb-4">Add an extra layer of security to your account.</p>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-[#E5E7EB]">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Authenticator App</p>
                      <p className="text-xs text-slate-500">Not enabled</p>
                    </div>
                  </div>
                  <button className="btn-primary text-xs px-4 py-2">Enable 2FA</button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'Notifications' && (
            <div className="card p-6 space-y-5">
              <h2 className="font-display font-bold text-[#0F172A] text-base">Notification Preferences</h2>
              <div className="space-y-3">
                {[
                  { key: 'newJobs', label: 'New Job Matches', desc: 'Get notified when new jobs match your profile' },
                  { key: 'applicationUpdate', label: 'Application Updates', desc: 'Recruiter views your application or updates status' },
                  { key: 'interviewReminder', label: 'Interview Reminders', desc: 'Reminders before scheduled interviews' },
                  { key: 'assessmentAssigned', label: 'Assessment Assigned', desc: 'When a company sends you an assessment' },
                  { key: 'offerReceived', label: 'Offer Received', desc: 'When a company extends an offer to you' },
                  { key: 'emailDigest', label: 'Weekly Email Digest', desc: 'Summary of your hiring activity every week' },
                  { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Critical alerts sent to your phone number' },
                ].map(pref => (
                  <div key={pref.key} className="flex items-center justify-between p-4 rounded-xl border border-[#E5E7EB] bg-slate-50 hover:bg-white transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{pref.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{pref.desc}</p>
                    </div>
                    <Toggle on={notifications[pref.key as keyof typeof notifications]} onToggle={() => toggle(pref.key)} />
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4 border-t border-[#E5E7EB]">
                <button className="btn-primary text-sm">Save Preferences</button>
              </div>
            </div>
          )}

          {/* Privacy */}
          {activeTab === 'Privacy' && (
            <div className="space-y-4">
              <div className="card p-6 space-y-5">
                <h2 className="font-display font-bold text-[#0F172A] text-base">Privacy Controls</h2>
                <div className="space-y-3">
                  {[
                    { key: 'profileVisible', label: 'Public Profile', desc: 'Allow companies and recruiters to find your profile' },
                    { key: 'resumeVisible', label: 'Resume Visibility', desc: 'Make your resume visible to recruiters on TalentForge' },
                    { key: 'searchable', label: 'Searchable', desc: 'Allow your profile to appear in search results' },
                    { key: 'activityStatus', label: 'Show Activity Status', desc: 'Show when you were last active on the platform' },
                  ].map(pref => (
                    <div key={pref.key} className="flex items-center justify-between p-4 rounded-xl border border-[#E5E7EB] bg-slate-50">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{pref.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{pref.desc}</p>
                      </div>
                      <Toggle on={privacy[pref.key as keyof typeof privacy]} onToggle={() => togglePrivacy(pref.key)} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Accounts */}
              <div className="card p-6">
                <h2 className="font-display font-bold text-[#0F172A] text-base mb-4">Connected Accounts</h2>
                <div className="space-y-3">
                  {[
                    { name: 'Google', connected: true, icon: Globe, color: 'text-blue-500 bg-blue-50' },
                    { name: 'LinkedIn', connected: false, icon: FaLinkedin, color: 'text-sky-600 bg-sky-50' },
                    { name: 'GitHub', connected: true, icon: FaGithub, color: 'text-slate-800 bg-slate-100' },
                  ].map(acc => {
                    const Icon = acc.icon;
                    return (
                      <div key={acc.name} className="flex items-center justify-between p-3.5 rounded-xl border border-[#E5E7EB] bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${acc.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{acc.name}</p>
                            <p className="text-xs text-slate-500">{acc.connected ? 'Connected' : 'Not connected'}</p>
                          </div>
                        </div>
                        <button className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors ${acc.connected ? 'text-red-600 border border-red-200 hover:bg-red-50' : 'text-primary-600 border border-primary-200 hover:bg-primary-50'
                          }`}>
                          {acc.connected ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delete Account */}
              <div className="card p-6 border-red-100">
                <h2 className="font-display font-bold text-red-700 text-base mb-2 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />Danger Zone
                </h2>
                <p className="text-sm text-slate-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <button className="flex items-center gap-2 px-5 py-2.5 border border-red-300 text-red-600 font-semibold text-sm rounded-xl hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />Delete My Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateSettingsPage;
