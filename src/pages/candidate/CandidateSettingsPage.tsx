import React, { useState } from 'react';
import { Lock, Bell, Shield, Trash2, Eye, EyeOff, ChevronRight } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('Account');
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    newJobs: true, applicationUpdate: true, interviewReminder: true,
    assessmentAssigned: true, offerReceived: true, emailDigest: false, smsAlerts: false,
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true, resumeVisible: false, searchable: true, activityStatus: false,
  });

  const toggle = (key: string) => setNotifications(n => ({ ...n, [key]: !n[key as keyof typeof n] }));
  const togglePrivacy = (key: string) => setPrivacy(p => ({ ...p, [key]: !p[key as keyof typeof p] }));

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
              <div className="card p-6 space-y-5">
                <h2 className="font-display font-bold text-[#0F172A] text-base">Personal Information</h2>
                <div className="grid grid-cols-2 gap-5">
                  {[
                    { label: 'Full Name', value: 'Aaryan ' },
                    { label: 'Title', value: 'Senior Frontend Developer' },
                    { label: 'Email', value: 'aaryan.singh@email.com' },
                    { label: 'Phone', value: '+91 98765 43210' },
                    { label: 'Location', value: 'Bangalore, India' },
                    { label: 'Website', value: 'https://aaryansingh.dev' },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{f.label}</label>
                      <input type="text" defaultValue={f.value} className="input-field text-sm" />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bio</label>
                    <textarea className="input-field text-sm resize-none h-24" defaultValue="Passionate Frontend Developer with 4+ years of experience..." />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
                  <button className="btn-secondary text-sm">Cancel</button>
                  <button className="btn-primary text-sm">Save Changes</button>
                </div>
              </div>

              {/* Job Preferences */}
              <div className="card p-6 space-y-4">
                <h2 className="font-display font-bold text-[#0F172A] text-base">Job Preferences</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Desired Role', value: 'Frontend Developer' },
                    { label: 'Preferred Location', value: 'Bangalore, Remote' },
                    { label: 'Expected Salary', value: '₹20 – ₹30 LPA' },
                    { label: 'Job Type', value: 'Full-time' },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{f.label}</label>
                      <input type="text" defaultValue={f.value} className="input-field text-sm" />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-3 border-t border-[#E5E7EB]">
                  <button className="btn-primary text-sm">Save Preferences</button>
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'Security' && (
            <div className="space-y-4">
              <div className="card p-6">
                <h2 className="font-display font-bold text-[#0F172A] text-base mb-5">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                    <div key={label}>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} className="input-field text-sm pr-10" placeholder="••••••••••" />
                        <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="btn-primary text-sm flex items-center gap-2">
                    <Lock className="w-4 h-4" />Update Password
                  </button>
                </div>
              </div>

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
                    { name: 'Google', connected: true, icon: '🔵' },
                    { name: 'LinkedIn', connected: false, icon: '🔷' },
                    { name: 'GitHub', connected: true, icon: '⚫' },
                  ].map(acc => (
                    <div key={acc.name} className="flex items-center justify-between p-3.5 rounded-xl border border-[#E5E7EB] bg-slate-50">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{acc.icon}</span>
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
                  ))}
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
