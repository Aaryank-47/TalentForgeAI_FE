import React, { useState } from 'react';
import {
  Building, Users, GitBranch, Mail, CreditCard, Plus, MoreHorizontal,
  Upload, Trash2, GripVertical, CheckCircle, X, Edit2, Crown,
  ChevronDown,
} from 'lucide-react';

import {
  settingsTabs as tabs,
  settingsTeamMembers as teamMembers,
  settingsDefaultStages as defaultStages,
  settingsEmailPrefs as emailPrefs,
} from '../../constants/recruiter_mockData';


const roleStyle = (r: string) => ({
  Admin: 'bg-red-50 text-red-700 border-red-200',
  Recruiter: 'bg-blue-50 text-blue-700 border-blue-200',
  'Hiring Manager': 'bg-purple-50 text-purple-700 border-purple-200',
  HR: 'bg-emerald-50 text-emerald-700 border-emerald-200',
})[r] || 'bg-slate-100 text-slate-600 border-slate-200';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('Company Profile');
  const [stages, setStages] = useState(defaultStages);
  const [emailToggles, setEmailToggles] = useState<Record<string, boolean>>({
    newApplicant: true,
    interview: true,
    assessment: false,
    moved: true,
    offer: true,
  });
  const [company, setCompany] = useState({
    name: 'TalentForge Inc.',
    website: 'https://talentforge.ai',
    industry: 'Technology',
    size: '50-200 employees',
    email: 'hr@talentforge.ai',
    phone: '+91 98765 43210',
    description: 'AI-powered hiring operating system for modern teams.',
  });

  const removeStage = (id: number) => setStages(ss => ss.filter(s => s.id !== id));

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
          {/* Company Profile */}
          {activeTab === 'Company Profile' && (
            <div className="card p-6 space-y-6">
              <div>
                <h2 className="text-base font-display font-bold text-[#0F172A] mb-4">Company Profile</h2>
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                    TF
                  </div>
                  <div>
                    <button className="btn-secondary text-sm flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Logo
                    </button>
                    <p className="text-xs text-slate-400 mt-1.5">PNG, JPG up to 2MB. Recommended 200×200px.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  {[
                    { label: 'Company Name', key: 'name', type: 'text', full: false },
                    { label: 'Website', key: 'website', type: 'url', full: false },
                    { label: 'Industry', key: 'industry', type: 'select', full: false, opts: ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail'] },
                    { label: 'Company Size', key: 'size', type: 'select', full: false, opts: ['1-10', '11-50', '50-200', '200-500', '500+'] },
                    { label: 'Email', key: 'email', type: 'email', full: false },
                    { label: 'Phone', key: 'phone', type: 'tel', full: false },
                    { label: 'Description', key: 'description', type: 'textarea', full: true },
                  ].map(f => (
                    <div key={f.key} className={f.full ? 'col-span-2' : ''}>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{f.label}</label>
                      {f.type === 'textarea' ? (
                        <textarea
                          className="input-field resize-none h-24 text-sm"
                          value={company[f.key as keyof typeof company]}
                          onChange={e => setCompany(c => ({ ...c, [f.key]: e.target.value }))}
                        />
                      ) : f.type === 'select' ? (
                        <select className="input-field text-sm" value={company[f.key as keyof typeof company]} onChange={e => setCompany(c => ({ ...c, [f.key]: e.target.value }))}>
                          {(f.opts || []).map(o => <option key={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input
                          type={f.type}
                          className="input-field text-sm"
                          value={company[f.key as keyof typeof company]}
                          onChange={e => setCompany(c => ({ ...c, [f.key]: e.target.value }))}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-[#E5E7EB]">
                  <button className="btn-secondary text-sm">Cancel</button>
                  <button className="btn-primary text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Team Members */}
          {activeTab === 'Team Members' && (
            <div className="card overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h2 className="text-base font-display font-bold text-[#0F172A]">Team Members</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{teamMembers.length} members in your workspace</p>
                </div>
                <button className="btn-primary text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Invite Member
                </button>
              </div>
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {['Member', 'Role', 'Permissions', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {teamMembers.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                            {m.initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-slate-900">{m.name}</p>
                              {m.you && <span className="text-[9px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full font-medium">You</span>}
                            </div>
                            <p className="text-xs text-slate-500">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="relative">
                          <select className={`appearance-none text-[10px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${roleStyle(m.role)}`} defaultValue={m.role}>
                            {['Admin', 'Recruiter', 'Hiring Manager', 'HR'].map(r => <option key={r}>{r}</option>)}
                          </select>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-500">{m.role === 'Admin' ? 'Full Access' : m.role === 'Recruiter' ? 'Post & Review' : 'View & Comment'}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${
                          m.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>{m.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          {!m.you && (
                            <>
                              <button className="p-1.5 rounded text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                            </>
                          )}
                          <button className="p-1.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"><MoreHorizontal className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
    </div>
  );
};

export default SettingsPage;
