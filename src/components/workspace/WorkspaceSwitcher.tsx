/**
 * TalentForge — Workspace Switcher & Multi-Capability Actions
 *
 * Rendered inside the top-right profile menu of both CandidateLayout and RecruiterLayout.
 * Allows:
 *  - Instant workspace switching (Candidate ↔ Company A ↔ Company B)
 *  - "Create a Company" modal (for Candidates becoming Employer/Owner)
 *  - "Become a Candidate" action (for Recruiters gaining Candidate profile)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { Workspace } from '../../store/slices/workspaceSlice';
import { authApi } from '../../services/api/auth.api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authKeys, companyKeys } from '../../constants/queryKeys';
import {
  Building,
  User,
  Check,
  PlusCircle,
  Sparkles,
  Loader2,
  X,
  Globe,
  MapPin,
  Briefcase,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface WorkspaceSwitcherProps {
  onClose?: () => void;
}

export const WorkspaceSwitcher: React.FC<WorkspaceSwitcherProps> = ({ onClose }) => {
  const { user, currentWorkspace, availableWorkspaces, selectWorkspace } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch industries & sizes dynamically from the backend / database
  const { data: metadataResponse } = useQuery({
    queryKey: companyKeys.metadata,
    queryFn: () => authApi.getCompanyMetadata(),
    staleTime: 1000 * 60 * 60,
  });

  const industries: string[] = metadataResponse?.industries || [];
  const companySizes: string[] = metadataResponse?.companySizes || [];

  // Form state for creating a new company
  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    website: '',
    industry: '',
    companySize: '',
    headquarters: '',
    description: '',
  });

  useEffect(() => {
    if (industries.length > 0 && !companyForm.industry) {
      setCompanyForm(prev => ({ ...prev, industry: industries[0] }));
    }
    if (companySizes.length > 0 && !companyForm.companySize) {
      setCompanyForm(prev => ({ ...prev, companySize: companySizes[0] }));
    }
  }, [industries, companySizes]);

  const handleSwitch = (ws: Workspace) => {
    selectWorkspace(ws);
    if (onClose) onClose();

    if (ws.type === 'CANDIDATE') {
      navigate('/candidate/home');
    } else {
      navigate('/recruiter/dashboard');
    }
  };

  const handleManageWorkspaces = () => {
    if (onClose) onClose();
    navigate('/select-workspace');
  };

  const handleBecomeCandidate = async () => {
    try {
      setIsSubmitting(true);
      await authApi.createCandidateProfile({
        fullName: user?.fullName || 'Candidate',
      });
      await queryClient.invalidateQueries({ queryKey: authKeys.me });
      toast.success('Candidate profile created! Switched to Candidate Workspace.');
      if (onClose) onClose();
      navigate('/candidate/home');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create candidate profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyForm.companyName.trim()) {
      toast.error('Please enter a company name');
      return;
    }

    if (!user?.isEmailVerified) {
      toast.error('Please verify your email before creating a company.');
      if (onClose) onClose();
      setShowCreateCompanyModal(false);
      navigate(`/verify-email?email=${encodeURIComponent(user?.email || '')}`);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await authApi.createCompany(companyForm);
      await queryClient.invalidateQueries({ queryKey: authKeys.me });
      await queryClient.invalidateQueries({ queryKey: companyKeys.my });
      toast.success(`Organization ${companyForm.companyName} created!`);
      setShowCreateCompanyModal(false);
      if (onClose) onClose();
      
      const newWs: Workspace = {
        type: 'COMPANY',
        id: res?.id || res?.data?.id,
        name: companyForm.companyName,
        role: 'OWNER',
      };
      selectWorkspace(newWs);
      navigate('/recruiter/dashboard');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create company organization');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasCandidateProfile = availableWorkspaces.some((w) => w.type === 'CANDIDATE') || user?.hasCandidateProfile;

  return (
    <>
      <div className="py-2">
        <div className="px-3 py-1.5 flex items-center justify-between">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Workspaces</p>
          <button
            onClick={handleManageWorkspaces}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            View all
          </button>
        </div>

        <div className="space-y-1 px-1 max-h-[220px] overflow-y-auto">
          {availableWorkspaces.map((ws) => {
            const isSelected =
              currentWorkspace?.type === ws.type && currentWorkspace?.id === ws.id;

            return (
              <button
                key={`${ws.type}-${ws.id}`}
                onClick={() => handleSwitch(ws)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all group ${
                  isSelected
                    ? 'bg-blue-50/80 text-blue-900 font-semibold'
                    : 'hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-xs flex-shrink-0 font-bold ${
                    ws.type === 'CANDIDATE'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {ws.type === 'CANDIDATE' ? (
                    <User className="w-3.5 h-3.5" />
                  ) : ws.logo ? (
                    <img src={ws.logo} className="w-full h-full object-cover rounded-md" alt="" />
                  ) : (
                    ws.name.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate leading-tight">{ws.name}</p>
                  <p className="text-[10px] text-slate-400 capitalize truncate mt-0.5">
                    {ws.type === 'CANDIDATE'
                      ? 'Job Seeker'
                      : ws.role
                      ? ws.role.replace('_', ' ').toLowerCase()
                      : 'Company'}
                  </p>
                </div>

                {isSelected && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        <div className="border-t border-slate-100 mt-2 pt-1.5 px-1 space-y-1">
          {/* Create Company Action */}
          <button
            onClick={() => setShowCreateCompanyModal(true)}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Create a Company</span>
          </button>

          {/* Become a Candidate Action (if user doesn't have candidate workspace yet) */}
          {!hasCandidateProfile && (
            <button
              onClick={handleBecomeCandidate}
              disabled={isSubmitting}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              )}
              <span>Become a Candidate</span>
            </button>
          )}
        </div>
      </div>

      {/* Modal: Create Company */}
      {showCreateCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">Create Organization</h3>
                  <p className="text-xs text-slate-500">Set up your company hiring workspace</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateCompanyModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCompanySubmit} className="space-y-3.5 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={companyForm.companyName}
                  onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                  placeholder="e.g. Acme Technologies"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
                  <select
                    value={companyForm.industry}
                    onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Headquarters</label>
                  <input
                    type="text"
                    value={companyForm.headquarters}
                    onChange={(e) => setCompanyForm({ ...companyForm, headquarters: e.target.value })}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateCompanyModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-60"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Building className="w-3.5 h-3.5" />}
                  <span>Create Organization</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkspaceSwitcher;
