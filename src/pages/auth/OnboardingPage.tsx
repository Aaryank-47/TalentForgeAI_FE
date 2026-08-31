/**
 * TalentForge — Onboarding Intent Selection & Setup
 *
 * Rendered at /onboarding.
 * After base user creation / email verification, the user chooses what they want to accomplish today:
 *  - [Find a Job] -> Setup Candidate profile & enter Candidate portal
 *  - [Hire Talent] -> Create Organization & enter Recruiter portal
 *
 * Clear message: "You can use both experiences with the same account."
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api/auth.api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authKeys, companyKeys } from '../../constants/queryKeys';
import type { Workspace } from '../../store/slices/workspaceSlice';
import {
  User,
  Building,
  ArrowRight,
  Sparkles,
  Bot,
  GraduationCap,
  Shield,
  Briefcase,
  Loader2,
  CheckCircle2,
  Layers,
  LogOut,
} from 'lucide-react';
import jobportal from '../../assets/jobportal_logo2.jpg';
import toast from 'react-hot-toast';

type OnboardingStep = 'choose' | 'candidate_setup' | 'company_setup';

export default function OnboardingPage() {
  const { user, selectWorkspace, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<OnboardingStep>('choose');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch industries & sizes dynamically from the backend / database
  const { data: metadataResponse } = useQuery({
    queryKey: companyKeys.metadata,
    queryFn: () => authApi.getCompanyMetadata(),
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });

  const industries: string[] = metadataResponse?.industries || [];
  const companySizes: string[] = metadataResponse?.companySizes || [];

  // Candidate Setup Form
  const [candidateForm, setCandidateForm] = useState({
    fullName: user?.fullName || '',
    phoneNumber: '',
    headline: '',
  });

  // Company Setup Form
  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    website: '',
    industry: '',
    companySize: '',
    headquarters: '',
    description: '',
  });

  // Populate default selects once metadata loads
  useEffect(() => {
    if (industries.length > 0 && !companyForm.industry) {
      setCompanyForm(prev => ({ ...prev, industry: industries[0] }));
    }
    if (companySizes.length > 0 && !companyForm.companySize) {
      setCompanyForm(prev => ({ ...prev, companySize: companySizes[0] }));
    }
  }, [industries, companySizes]);

  // ── 1. Candidate Setup Submission ──────────────────────────────────────────
  const handleCandidateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await authApi.createCandidateProfile({
        fullName: candidateForm.fullName || user?.fullName || 'Candidate',
        ...(candidateForm.phoneNumber ? { phoneNumber: candidateForm.phoneNumber } : {}),
        ...(candidateForm.headline ? { headline: candidateForm.headline } : {}),
      });

      await queryClient.invalidateQueries({ queryKey: authKeys.me });
      toast.success('Candidate profile initialized! Welcome to TalentForge AI.');

      const candidateWs: Workspace = {
        type: 'CANDIDATE',
        id: res?.id || res?.data?.id || user?.id || 'candidate',
        name: candidateForm.fullName || user?.fullName || 'Candidate',
      };
      selectWorkspace(candidateWs);
      navigate('/candidate/home', { replace: true });
    } catch (err: any) {
      toast.error(err?.message || 'Failed to setup candidate profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── 2. Company Setup Submission ────────────────────────────────────────────
  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyForm.companyName.trim()) {
      toast.error('Please enter a company name');
      return;
    }

    if (!user?.isEmailVerified) {
      toast.error('Please verify your email before creating a company.');
      navigate(`/verify-email?email=${encodeURIComponent(user?.email || '')}`);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await authApi.createCompany(companyForm);
      await queryClient.invalidateQueries({ queryKey: authKeys.me });
      await queryClient.invalidateQueries({ queryKey: companyKeys.my });
      toast.success(`Organization ${companyForm.companyName} created!`);

      const companyWs: Workspace = {
        type: 'COMPANY',
        id: res?.id || res?.data?.id,
        name: companyForm.companyName,
        role: 'OWNER',
      };
      selectWorkspace(companyWs);
      navigate('/recruiter/dashboard', { replace: true });
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create company');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4FA] font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.45]"
          style={{ background: 'radial-gradient(circle, #E0E7FF 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.45]"
          style={{ background: 'radial-gradient(circle, #DBEAFE 0%, transparent 70%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: 'radial-gradient(circle, #0F172A 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
      </div>

      <div className="relative max-w-[920px] w-full bg-white rounded-[24px] shadow-2xl shadow-slate-300/80 border border-slate-200/50 p-6 sm:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-[#0175b2] shadow-md shadow-blue-200/50 flex-shrink-0">
              <img src={jobportal} className="h-full w-full object-cover" alt="TalentForge" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-[#0F172A]">
                TalentForge <span className="text-[#0175b2]">AI</span>
              </span>
              <p className="text-[12px] text-slate-500">Account: {user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="flex items-center gap-2 text-[13px] font-semibold text-slate-500 hover:text-red-600 transition-colors bg-slate-50 hover:bg-red-50 px-4 py-2 rounded-lg border border-slate-100"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* ─── STEP 1: CHOOSE INTENT ────────────────────────────────────────── */}
        {step === 'choose' && (
          <div>
            <div className="text-center max-w-xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-100">
                <Sparkles className="w-3.5 h-3.5" /> Welcome to TalentForge AI
              </div>
              <h2 className="text-[28px] font-display font-extrabold text-[#0F172A] tracking-tight mb-2">
                How do you want to get started?
              </h2>
              <p className="text-[14px] text-slate-500 leading-relaxed">
                Choose what you want to accomplish today. You can always switch between candidate and hiring experiences later with this same account.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Find a Job */}
              <div className="flex flex-col justify-between bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-7 relative overflow-hidden shadow-xl shadow-blue-200/60 transition-all hover:-translate-y-1">
                <div className="absolute top-[-20%] right-[-10%] w-[200px] h-[200px] bg-white/[0.08] rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white mb-6 border border-white/25 backdrop-blur-sm shadow-inner">
                    <User className="w-6 h-6" />
                  </div>

                  <h3 className="text-[22px] font-display font-extrabold mb-2 text-white">
                    Find a Job
                  </h3>
                  <p className="text-blue-100 text-[13px] leading-relaxed mb-6">
                    Build your professional profile, practice AI mock interviews, and apply to top opportunities matching your skillset.
                  </p>

                  <div className="space-y-2.5 mb-8">
                    {[
                      { icon: <Bot className="w-4 h-4 text-blue-200" />, text: 'AI Interview Practice Rooms' },
                      { icon: <GraduationCap className="w-4 h-4 text-blue-200" />, text: 'Live Application Tracking' },
                      { icon: <Shield className="w-4 h-4 text-blue-200" />, text: 'Verified Coding Assessments' },
                    ].map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-[12px] text-blue-50 font-medium">
                        {f.icon}
                        <span>{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep('candidate_setup')}
                  className="relative z-10 w-full bg-white hover:bg-blue-50 text-[#2563EB] hover:text-blue-700 font-bold text-[14px] py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Get Started as Job Seeker</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Card 2: Hire Talent */}
              <div className="flex flex-col justify-between bg-white rounded-2xl p-7 border-2 border-slate-200 hover:border-blue-500 transition-all hover:shadow-xl group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 border border-blue-100 shadow-xs">
                    <Building className="w-6 h-6" />
                  </div>

                  <h3 className="text-[22px] font-display font-extrabold mb-2 text-slate-900 group-hover:text-blue-600 transition-colors">
                    Hire Talent
                  </h3>
                  <p className="text-slate-500 text-[13px] leading-relaxed mb-6">
                    Create your company hiring workspace, post jobs, run AI resume screening, and manage your full candidate pipeline.
                  </p>

                  <div className="space-y-2.5 mb-8">
                    {[
                      { icon: <Briefcase className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />, text: 'Post Jobs & Manage Openings' },
                      { icon: <Layers className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />, text: 'Full ATS Pipeline & Kanban' },
                      { icon: <CheckCircle2 className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />, text: 'Automated AI Resume Screening' },
                    ].map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-[12px] text-slate-600 font-medium">
                        {f.icon}
                        <span>{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep('company_setup')}
                  className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold text-[14px] py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Create Company & Start Hiring</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                You can use both candidate and hiring experiences simultaneously with this single account.
              </p>
            </div>
          </div>
        )}

        {/* ─── STEP 2A: CANDIDATE PROFILE SETUP ─────────────────────────────── */}
        {step === 'candidate_setup' && (
          <div className="max-w-md mx-auto py-2">
            <div className="mb-6 text-center">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-[22px] font-display font-extrabold text-[#0F172A] mb-1">
                Candidate Profile Setup
              </h3>
              <p className="text-xs text-slate-500">
                Let's set up your basic profile so recruiters can discover you.
              </p>
            </div>

            <form onSubmit={handleCandidateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={candidateForm.fullName}
                  onChange={(e) => setCandidateForm({ ...candidateForm, fullName: e.target.value })}
                  placeholder="e.g. Jordan Clark"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Headline</label>
                <input
                  type="text"
                  value={candidateForm.headline}
                  onChange={(e) => setCandidateForm({ ...candidateForm, headline: e.target.value })}
                  placeholder="e.g. Full-Stack Engineer | React & Node.js"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={candidateForm.phoneNumber}
                  onChange={(e) => setCandidateForm({ ...candidateForm, phoneNumber: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep('choose')}
                  className="w-1/3 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  <span>Enter Candidate Portal</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ─── STEP 2B: COMPANY SETUP ───────────────────────────────────────── */}
        {step === 'company_setup' && (
          <div className="max-w-lg mx-auto py-2">
            <div className="mb-6 text-center">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-[22px] font-display font-extrabold text-[#0F172A] mb-1">
                Create Your Company Workspace
              </h3>
              <p className="text-xs text-slate-500">
                You will be assigned as the <strong>Owner</strong> of this organization.
              </p>
            </div>

            <form onSubmit={handleCompanySubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={companyForm.companyName}
                  onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                  placeholder="e.g. Acme Technologies"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
                  <select
                    value={companyForm.industry}
                    onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {industries.length > 0 ? (
                      industries.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))
                    ) : (
                      <option value="Technology & SaaS">Technology & SaaS</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company Size</label>
                  <select
                    value={companyForm.companySize}
                    onChange={(e) => setCompanyForm({ ...companyForm, companySize: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {companySizes.length > 0 ? (
                      companySizes.map((sz) => (
                        <option key={sz} value={sz}>{sz}</option>
                      ))
                    ) : (
                      <option value="11-50 employees">11-50 employees</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={companyForm.website}
                    onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                    placeholder="https://company.com"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Headquarters</label>
                  <input
                    type="text"
                    value={companyForm.headquarters}
                    onChange={(e) => setCompanyForm({ ...companyForm, headquarters: e.target.value })}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Brief Description</label>
                <textarea
                  rows={2}
                  value={companyForm.description}
                  onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                  placeholder="What does your company do?"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep('choose')}
                  className="w-1/3 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Building className="w-4 h-4" />}
                  <span>Create Company & Continue</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
