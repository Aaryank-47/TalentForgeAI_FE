/**
 * TalentForge — Workspace Selection Screen
 *
 * Allows a single authenticated user to select their desired workspace context:
 *  - Candidate Workspace: AI interviews, jobs, applications, assessments
 *  - Company Workspaces: Organization hiring pipelines with company-specific roles
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { Workspace } from '../../store/slices/workspaceSlice';
import {
  Building,
  User,
  ArrowRight,
  Sparkles,
  LogOut,
  Bot,
  GraduationCap,
  Shield,
  Briefcase,
  Check,
} from 'lucide-react';
import jobportal from '../../assets/jobportal_logo2.jpg';

const SelectCompanyPage: React.FC = () => {
  const { user, currentWorkspace, availableWorkspaces, selectWorkspace, logout } = useAuth();
  const navigate = useNavigate();

  const handleSelectWorkspace = (ws: Workspace) => {
    selectWorkspace(ws);
    if (ws.type === 'CANDIDATE') {
      navigate('/candidate/home', { replace: true });
    } else {
      navigate('/recruiter/dashboard', { replace: true });
    }
  };

  const companyWorkspaces = availableWorkspaces.filter((w) => w.type === 'COMPANY');
  const candidateWorkspace = availableWorkspaces.find((w) => w.type === 'CANDIDATE') || {
    type: 'CANDIDATE' as const,
    id: user?.candidateProfileId || user?.id || 'candidate',
    name: user?.fullName || 'Candidate',
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
      </div>

      <div className="relative max-w-[880px] w-full bg-white rounded-[24px] shadow-2xl shadow-slate-300/80 border border-slate-200/50 p-6 sm:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] p-2.5 rounded-[12px] shadow-md shadow-blue-200/50">
              <img src={jobportal} className="h-6 w-6" alt="TalentForge" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-[#0F172A]">
                TalentForge <span className="text-[#2563EB]">AI</span>
              </span>
              <p className="text-[12px] text-slate-500">Logged in as {user?.email}</p>
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

        <div className="mb-6 text-center sm:text-left">
          <h2 className="text-[24px] font-display font-extrabold text-[#0F172A] mb-1">
            Welcome back{user?.fullName ? `, ${user.fullName}` : ''}! Where would you like to continue?
          </h2>
          <p className="text-[14px] text-slate-500">
            Select an organization you represent or enter your candidate workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Candidate Workspace Choice */}
          <div className="flex flex-col justify-between bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-blue-200">
            <div className="absolute top-[-20%] right-[-10%] w-[200px] h-[200px] bg-white/[0.08] rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-white text-[11px] font-semibold border border-white/25 backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5" /> For Job Seekers
                </div>
                {currentWorkspace?.type === 'CANDIDATE' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white text-blue-700 px-2 py-0.5 rounded-full shadow-sm">
                    <Check className="w-3 h-3" /> Active
                  </span>
                )}
              </div>

              <h3 className="text-[20px] font-display font-extrabold mb-2">
                Candidate Workspace
              </h3>

              <p className="text-blue-100/90 text-[13px] leading-relaxed mb-6">
                Practice AI mock interviews, track active job applications, submit coding assessments, and communicate with recruiters.
              </p>

              <div className="space-y-2.5 mb-6">
                {[
                  { icon: <Bot className="w-4 h-4 text-blue-200" />, text: 'AI Interview Practice Rooms' },
                  { icon: <GraduationCap className="w-4 h-4 text-blue-200" />, text: 'Live Job Pipeline Tracking' },
                  { icon: <Shield className="w-4 h-4 text-blue-200" />, text: 'Verified Online Assessments' },
                ].map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-[12px] text-blue-50">
                    {f.icon}
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSelectWorkspace(candidateWorkspace)}
              className="relative z-10 w-full bg-white hover:bg-blue-50 text-[#2563EB] hover:text-blue-700 font-bold text-[14px] py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
            >
              <User className="w-4 h-4" />
              <span>Continue as Candidate</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Recruiter / Companies list */}
          <div className="flex flex-col h-full bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-slate-700 flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                Your Companies
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {companyWorkspaces.length} {companyWorkspaces.length === 1 ? 'organization' : 'organizations'}
              </span>
            </div>

            {companyWorkspaces.length > 0 ? (
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[340px] pr-1">
                {companyWorkspaces.map((item) => {
                  const isActive = currentWorkspace?.type === 'COMPANY' && currentWorkspace.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectWorkspace(item)}
                      className={`w-full text-left bg-white border rounded-xl p-3.5 transition-all hover:shadow-md group relative overflow-hidden ${
                        isActive
                          ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-sm'
                          : 'border-slate-200/70 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.logo ? (
                          <img
                            src={item.logo}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                            alt={item.name}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100 flex-shrink-0">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-[14px] font-bold text-[#0F172A] truncate group-hover:text-blue-600 transition-colors">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {item.role && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 capitalize">
                                  {item.role.replace('_', ' ').toLowerCase()}
                                </span>
                              )}
                              {isActive && (
                                <span className="text-emerald-600">
                                  <Check className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {item.location || 'Remote'}
                          </p>
                        </div>
                      </div>
                      <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                <Briefcase className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-700">No company memberships yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                  You haven't created or been invited to any company organizations yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectCompanyPage;
