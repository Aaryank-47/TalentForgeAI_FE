import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search, Filter, ChevronDown, Download, X, Bell, ChevronRight, CheckCircle,
  Circle, AlertCircle, ExternalLink, Briefcase, MapPin, Loader2, FileText, XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

import { candidateApi } from '../../services/api/candidate.api';
import { candidateKeys } from '../../constants/queryKeys';

const StatusBadge = ({ status }: { status: string }) => {
  const getBadgeStyle = () => {
    switch (status?.toUpperCase()) {
      case 'HIRED':
      case 'OFFER':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'REJECTED':
      case 'WITHDRAWN':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'IN_REVIEW':
      case 'SHORTLISTED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'INTERVIEW':
      case 'ASSESSMENT':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle()}`}>
      {status || 'APPLIED'}
    </span>
  );
};

// Detail Panel
const ApplicationDetailPanel = ({
  app,
  onClose,
  onWithdraw,
  isWithdrawing
}: {
  app: any;
  onClose: () => void;
  onWithdraw: (appId: string) => void;
  isWithdrawing: boolean;
}) => {
  const [tab, setTab] = useState<'Overview' | 'Job Details'>('Overview');
  const job = app.job;
  const company = job?.company;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-5 border-b border-[#E5E7EB] bg-white flex-shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-2xs">
              {company?.companyName?.charAt(0) || '🏢'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-[#0F172A] text-base">{job?.title}</h2>
                <StatusBadge status={app.status} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{company?.companyName || 'TalentForge Employer'}</p>
              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                <span>📍 {job?.location || job?.workplaceType}</span>
                <span>·</span>
                <span>🌐 {job?.employmentType?.replace('_', ' ')}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-400">
          Applied on <span className="font-semibold text-slate-600">{new Date(app.appliedAt).toLocaleDateString()}</span>
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB] flex-shrink-0 bg-white">
        {(['Overview', 'Job Details'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              tab === t ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {tab === 'Overview' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-primary-50 to-indigo-50 rounded-xl p-4 border border-primary-100">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Application Status</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{app.status}</p>
              <p className="text-xs text-slate-500 mt-0.5">Your application has been received and is being processed.</p>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Application Info</h4>
              <div className="text-xs space-y-1.5 text-slate-600">
                <p><span className="text-slate-400">Application ID:</span> <span className="font-mono text-[10px]">{app.id}</span></p>
                <p><span className="text-slate-400">Submitted Date:</span> {new Date(app.appliedAt).toLocaleString()}</p>
              </div>
            </div>

            {app.status !== 'WITHDRAWN' && app.status !== 'REJECTED' && (
              <div className="pt-4 border-t border-slate-100">
                <button
                  disabled={isWithdrawing}
                  onClick={() => onWithdraw(app.id)}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  {isWithdrawing ? 'Withdrawing...' : 'Withdraw Application'}
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'Job Details' && (
          <div className="space-y-3 text-xs text-slate-600">
            <div>
              <span className="text-slate-400">Position</span>
              <p className="font-bold text-slate-900 mt-0.5">{job?.title}</p>
            </div>
            <div>
              <span className="text-slate-400">Employment Type</span>
              <p className="font-semibold text-slate-800 mt-0.5">{job?.employmentType?.replace('_', ' ')}</p>
            </div>
            <div>
              <span className="text-slate-400">Location</span>
              <p className="font-semibold text-slate-800 mt-0.5">{job?.location || job?.workplaceType}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────
const MyApplicationsPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  // 1. Fetch Candidate Applications
  const { data: responseData, isLoading } = useQuery({
    queryKey: candidateKeys.applications({ search }),
    queryFn: () => candidateApi.getMyApplications({ search }),
  });

  const applications: any[] = responseData?.data || [];

  // 2. Withdraw Mutation
  const withdrawMutation = useMutation({
    mutationFn: async (appId: string) => {
      return candidateApi.withdrawApplication(appId, 'Candidate requested withdrawal');
    },
    onSuccess: () => {
      toast.success('Application withdrawn successfully');
      queryClient.invalidateQueries({ queryKey: candidateKeys.applications() });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to withdraw application');
    },
  });

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0] || null;

  return (
    <div className="space-y-0 -m-6 h-screen flex flex-col">
      {/* Top Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white shadow-2xs">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-slate-900">My Applications</h1>
              <p className="text-xs text-slate-500">Track all your applied job roles and recruitment statuses</p>
            </div>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by job or company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Applications List */}
        <div className="w-[420px] flex-shrink-0 border-r border-[#E5E7EB] flex flex-col overflow-hidden bg-white">
          <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between bg-white flex-shrink-0">
            <p className="text-xs font-bold text-slate-700">{applications.length} Applications</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="py-16 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-600 mb-2" />
                <p className="text-xs">Loading applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="py-16 text-center text-slate-400 p-4">
                <Briefcase className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-600">No applications found</p>
                <p className="text-[11px] text-slate-400 mt-1">Explore published jobs to submit your first job application.</p>
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-4 border-b border-[#E5E7EB] hover:bg-slate-50 cursor-pointer transition-colors ${
                    selectedApp?.id === app.id ? 'bg-primary-50/40 border-l-2 border-l-primary-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-2xs">
                      {app.job?.company?.companyName?.charAt(0) || '🏢'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 leading-tight truncate">{app.job?.title}</h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">{app.job?.company?.companyName || 'Employer'}</p>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-2">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{app.job?.location || app.job?.workplaceType}</span>
                        <span>·</span>
                        <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Application Detail */}
        <div className="flex-1 overflow-hidden bg-slate-50">
          {selectedApp ? (
            <ApplicationDetailPanel
              app={selectedApp}
              onClose={() => setSelectedAppId(null)}
              onWithdraw={(id) => withdrawMutation.mutate(id)}
              isWithdrawing={withdrawMutation.isPending}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              <p className="text-xs">Select an application to view full details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplicationsPage;
