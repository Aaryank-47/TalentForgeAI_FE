import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search, X, Briefcase, Loader2, FileText, XCircle, Check
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
        return 'bg-slate-100 text-slate-700 border-slate-200';
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
  onWithdraw: (appId: string, reason?: string) => void;
  isWithdrawing: boolean;
}) => {
  const [tab, setTab] = useState<'Overview' | 'Timeline' | 'Job Details'>('Overview');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('Candidate requested withdrawal');

  const job = app.job;
  const company = job?.company;
  const workflow = app.applicationWorkflow;
  const currentStage = workflow?.workflowStage;
  const allStages = currentStage?.workflow?.workflowStages || [];
  const histories = workflow?.workflowHistories || [];

  // Find index of current stage
  const currentStageIndex = allStages.findIndex((s: any) => s.id === currentStage?.id);

  const handleConfirmWithdraw = () => {
    onWithdraw(app.id, withdrawReason);
    setShowConfirmModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="p-5 border-b border-[#E5E7EB] bg-white flex-shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {company?.logo ? (
              <img src={company.logo} alt={company.companyName} className="w-11 h-11 rounded-xl object-cover border border-slate-200 flex-shrink-0" />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-2xs">
                {company?.companyName?.charAt(0) || '🏢'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
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
        <div className="flex items-center justify-between text-xs text-slate-400">
          <p>Applied on <span className="font-semibold text-slate-600">{new Date(app.appliedAt).toLocaleDateString()}</span></p>
          {app.applicationResume && (
            <p className="flex items-center gap-1 text-[11px] text-slate-500">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>{app.applicationResume.fileName}</span>
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB] flex-shrink-0 bg-white">
        {(['Overview', 'Timeline', 'Job Details'] as const).map(t => (
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
            {/* Current Stage Card */}
            <div className="bg-gradient-to-r from-primary-50 to-indigo-50 rounded-xl p-4 border border-primary-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Current Stage</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{currentStage?.stageLibrary?.name || 'Application Received'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{currentStage?.stageLibrary?.description || 'Your application is currently active.'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Stage Updated</p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    {workflow?.movedAt ? new Date(workflow.movedAt).toLocaleDateString() : new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Workflow Progression Stepper */}
            {allStages.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">Recruitment Pipeline</h4>
                <div className="space-y-0">
                  {allStages.map((stage: any, index: number) => {
                    const isDone = currentStageIndex > index || app.status === 'HIRED';
                    const isCurrent = currentStageIndex === index && app.status !== 'HIRED' && app.status !== 'REJECTED' && app.status !== 'WITHDRAWN';
                    const isPassed = isDone || isCurrent;

                    return (
                      <div key={stage.id} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isDone ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-primary-600 text-white ring-4 ring-primary-100' : 'bg-slate-200 text-slate-400'
                          }`}>
                            {isDone ? <Check className="w-3.5 h-3.5" /> : <span className="text-[10px] font-bold">{index + 1}</span>}
                          </div>
                          {index < allStages.length - 1 && (
                            <div className={`w-0.5 h-7 my-1 ${isDone ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                          )}
                        </div>
                        <div className="pb-3">
                          <p className={`text-xs font-bold ${isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                            {stage.stageLibrary?.name || `Stage ${index + 1}`}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{stage.stageLibrary?.description || ''}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Application Summary */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Application Information</h4>
              <div className="text-xs space-y-1.5 text-slate-600">
                <p><span className="text-slate-400">Application ID:</span> <span className="font-mono text-[10px]">{app.id}</span></p>
                <p><span className="text-slate-400">Submitted:</span> {new Date(app.appliedAt).toLocaleString()}</p>
                {app.applicationResume && (
                  <p><span className="text-slate-400">Resume Attached:</span> {app.applicationResume.fileName}</p>
                )}
              </div>
            </div>

            {app.status !== 'WITHDRAWN' && app.status !== 'REJECTED' && app.status !== 'HIRED' && (
              <div className="pt-4 border-t border-slate-100">
                <button
                  disabled={isWithdrawing}
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <XCircle className="w-4 h-4" />
                  Withdraw Application
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'Timeline' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Stage Activity Log</h4>
            {histories.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-[#E5E7EB] text-xs text-slate-500">
                Application submitted and registered in the hiring workflow.
              </div>
            ) : (
              <div className="space-y-2">
                {histories.map((hist: any, i: number) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-[#E5E7EB] space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span>{hist.toStage?.stageLibrary?.name || 'Moved Stage'}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{new Date(hist.createdAt).toLocaleString()}</span>
                    </div>
                    {hist.fromStage && (
                      <p className="text-[11px] text-slate-500">Moved from: {hist.fromStage.stageLibrary?.name}</p>
                    )}
                    {hist.comment && (
                      <p className="text-[11px] text-slate-600 italic">"{hist.comment}"</p>
                    )}
                  </div>
                ))}
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
              <span className="text-slate-400">Company</span>
              <p className="font-semibold text-slate-800 mt-0.5">{company?.companyName || 'TalentForge Employer'}</p>
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-100 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900">Withdraw Application?</h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl space-y-1">
              <p className="text-xs font-bold text-red-800">⚠️ Irreversible Action</p>
              <p className="text-xs text-red-700 leading-relaxed">
                Once you withdraw this application, <strong>you cannot apply for this job posting again</strong>. Your application status will be permanently marked as withdrawn.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Reason for withdrawal (optional)
              </label>
              <input
                type="text"
                value={withdrawReason}
                onChange={e => setWithdrawReason(e.target.value)}
                placeholder="e.g., Accepted another offer, relocation, etc."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Keep Application
              </button>
              <button
                type="button"
                disabled={isWithdrawing}
                onClick={handleConfirmWithdraw}
                className="flex-1 px-4 py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-2xs"
              >
                {isWithdrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, Withdraw'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────
const MyApplicationsPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  // 1. Fetch Candidate Applications
  const { data: responseData, isLoading } = useQuery({
    queryKey: candidateKeys.applications({ search, status: statusFilter === 'ALL' ? undefined : statusFilter }),
    queryFn: () => candidateApi.getMyApplications({
      search: search || undefined,
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      limit: 100,
    }),
  });

  const applications: any[] = Array.isArray(responseData)
    ? responseData
    : Array.isArray(responseData?.data)
      ? responseData.data
      : Array.isArray((responseData as any)?.applications)
        ? (responseData as any).applications
        : [];

  // Statistics counters
  const totalCount = applications.length;
  const activeCount = applications.filter(a => !['REJECTED', 'WITHDRAWN', 'HIRED'].includes(a.status?.toUpperCase())).length;
  const inReviewCount = applications.filter(a => ['IN_REVIEW', 'SHORTLISTED', 'APPLIED'].includes(a.status?.toUpperCase())).length;
  const interviewCount = applications.filter(a => ['INTERVIEW', 'ASSESSMENT'].includes(a.status?.toUpperCase())).length;
  const offerCount = applications.filter(a => ['OFFER', 'HIRED'].includes(a.status?.toUpperCase())).length;

  // 2. Withdraw Mutation
  const withdrawMutation = useMutation({
    mutationFn: async ({ appId, reason }: { appId: string; reason?: string }) => {
      return candidateApi.withdrawApplication(appId, reason);
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white shadow-2xs">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-slate-900">My Applications</h1>
              <p className="text-xs text-slate-500">Track and monitor real-time candidate hiring stages and statuses</p>
            </div>
          </div>

          {/* Stat summary pills */}
          <div className="flex items-center gap-3 text-xs flex-wrap">
            {[
              { label: 'Total', count: totalCount, color: 'text-slate-800 bg-slate-100' },
              { label: 'Active', count: activeCount, color: 'text-blue-700 bg-blue-50 border-blue-200' },
              { label: 'In Review', count: inReviewCount, color: 'text-amber-700 bg-amber-50 border-amber-200' },
              { label: 'Assessments/Interviews', count: interviewCount, color: 'text-purple-700 bg-purple-50 border-purple-200' },
              { label: 'Offers', count: offerCount, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
            ].map(s => (
              <div key={s.label} className={`px-3 py-1 rounded-xl border border-transparent font-medium flex items-center gap-1.5 ${s.color}`}>
                <span className="font-bold">{s.count}</span>
                <span className="text-[11px] opacity-80">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between gap-3 mt-4 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {[
              { label: 'All', value: 'ALL' },
              { label: 'Applied', value: 'APPLIED' },
              { label: 'In Review', value: 'IN_REVIEW' },
              { label: 'Shortlisted', value: 'SHORTLISTED' },
              { label: 'Hired', value: 'HIRED' },
            ].map(t => (
              <button
                key={t.value}
                onClick={() => setStatusFilter(t.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  statusFilter === t.value ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by position or company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-2xs"
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
                    {app.job?.company?.logo ? (
                      <img src={app.job.company.logo} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-2xs">
                        {app.job?.company?.companyName?.charAt(0) || '🏢'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 leading-tight truncate">{app.job?.title}</h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">{app.job?.company?.companyName || 'Employer'}</p>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                        <span className="truncate">
                          Stage: <span className="font-semibold text-slate-700">{app.applicationWorkflow?.workflowStage?.stageLibrary?.name || 'Applied'}</span>
                        </span>
                        <span>{new Date(app.appliedAt).toLocaleDateString()}</span>
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
              onWithdraw={(id, reason) => withdrawMutation.mutate({ appId: id, reason })}
              isWithdrawing={withdrawMutation.isPending}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              <p className="text-xs">Select an application to view full stage progression and details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplicationsPage;
