import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search, X, Send, XCircle, Activity, Briefcase, ChevronDown, 
  GripVertical, Loader2, AlertCircle, Calendar, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { jobApi } from '../../services/api/job.api';
import { assessmentApi } from '../../services/api/assessment.api';
import { applicationWorkflowApi, type HiringBoardApplication } from '../../services/api/workflow.api';
import { jobKeys, workflowKeys } from '../../constants/queryKeys';

const PipelinePage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const companyId = user?.companyId || user?.companies?.[0]?.companyId;

  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState<HiringBoardApplication | null>(null);

  // Scorecard modal state
  const [selectedScorecard, setSelectedScorecard] = useState<any>(null);
  const [isScorecardModalOpen, setIsScorecardModalOpen] = useState<boolean>(false);
  const [isLoadingScorecard, setIsLoadingScorecard] = useState<boolean>(false);

  // 1. Fetch Company Jobs to populate the Job Selector dropdown (only PUBLISHED jobs can have hiring boards)
  const { data: allJobs = [], isLoading: isLoadingJobs } = useQuery({
    queryKey: jobKeys.list(companyId || ''),
    queryFn: () => (companyId ? jobApi.listCompanyJobs(companyId) : Promise.resolve([])),
    enabled: Boolean(companyId),
  });

  const publishedJobs = allJobs.filter(j => j.status === 'PUBLISHED');

  // Auto-select first published job
  const activeJob = publishedJobs.find(j => j.id === selectedJobId) || publishedJobs[0];
  const currentJobId = activeJob?.id;

  // 2. Fetch Live Hiring Board (Kanban stages and candidate cards) for selected published job
  const {
    data: boardStages = [],
    isLoading: isLoadingBoard,
    isError: isBoardError,
    error: boardError
  } = useQuery({
    queryKey: workflowKeys.hiringBoard(currentJobId || ''),
    queryFn: () => (currentJobId ? applicationWorkflowApi.getHiringBoard(currentJobId) : Promise.resolve([])),
    enabled: Boolean(currentJobId),
  });

  // 2b. Fetch Assessments attached directly to the Job as fallback
  const { data: jobAssessments = [] } = useQuery({
    queryKey: jobKeys.assessments(currentJobId || ''),
    queryFn: () => (currentJobId ? assessmentApi.getJobAssessments(currentJobId) : Promise.resolve([])),
    enabled: Boolean(currentJobId),
  });

  // 3. Move Application Mutation
  const moveMutation = useMutation({
    mutationFn: async ({ applicationId, toWorkflowStageId }: { applicationId: string; toWorkflowStageId: string }) => {
      if (!companyId) throw new Error('Company ID missing');
      return applicationWorkflowApi.moveApplication(companyId, {
        applicationId,
        toWorkflowStageId,
      });
    },
    onSuccess: () => {
      toast.success('Candidate moved successfully');
      queryClient.invalidateQueries({ queryKey: workflowKeys.hiringBoard(currentJobId || '') });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to move candidate');
    },
  });

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent, applicationId: string) => {
    e.dataTransfer.setData('text/plain', applicationId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    const applicationId = e.dataTransfer.getData('text/plain');
    if (!applicationId || !targetStageId) return;
    moveMutation.mutate({ applicationId, toWorkflowStageId: targetStageId });
  };

  // Calculate totals
  const totalApplicants = boardStages.reduce((acc, stage) => acc + (stage.applications?.length || 0), 0);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header with Job Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center flex-shrink-0 text-white shadow-2xs">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-display font-bold text-[#0F172A]">
                  {activeJob?.title || (isLoadingJobs ? 'Loading jobs...' : 'No Published Jobs')}
                </h1>
                {activeJob && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                    PUBLISHED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeJob ? `${activeJob.employmentType?.replace('_', ' ')} • ${activeJob.location || activeJob.workplaceType}` : 'Only published jobs receive applications and have active Kanban pipelines'}
              </p>
            </div>
          </div>
        </div>

        {/* Job Switcher Dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative min-w-[220px]">
            <select
              value={currentJobId || ''}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="appearance-none w-full pl-3 pr-8 py-2 text-xs font-semibold border border-[#E5E7EB] rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-2xs cursor-pointer"
            >
              {isLoadingJobs ? (
                <option>Loading jobs...</option>
              ) : publishedJobs.length === 0 ? (
                <option>No published jobs found</option>
              ) : (
                publishedJobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j._count?.applications || 0} applicants)
                  </option>
                ))
              )}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-xs border border-[#E5E7EB] rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 w-64 shadow-2xs"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total Candidates in Pipeline: <span className="font-bold text-slate-900">{totalApplicants}</span>
        </div>
      </div>

      {/* Kanban Board Container */}
      {!currentJobId ? (
        <div className="card p-12 text-center text-slate-500">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No Published Jobs Found</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Jobs must be published to have an active candidate pipeline. Publish an existing draft job or create a new job opening.
          </p>
        </div>
      ) : isLoadingBoard ? (
        <div className="card p-16 text-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600 mb-3" />
          <p className="text-sm font-medium">Loading candidate pipeline & hiring board...</p>
        </div>
      ) : isBoardError ? (
        <div className="card p-8 text-center text-red-500">
          <AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-2" />
          <p className="text-sm font-semibold">Failed to load hiring board</p>
          <p className="text-xs text-red-400 mt-1">{(boardError as any)?.message || 'Check connection'}</p>
        </div>
      ) : boardStages.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">
          <p className="text-sm font-semibold text-slate-700">No Workflow Stages Configured</p>
          <p className="text-xs text-slate-400 mt-1">This job's workflow has no stages assigned.</p>
        </div>
      ) : (
        <div className="flex gap-5" style={{ height: 'calc(100vh - 280px)', minHeight: '520px' }}>
          {/* Kanban Board Columns */}
          <div className="flex-1 min-w-0 overflow-x-auto pb-2">
            <div className="flex gap-4 h-full min-w-max pr-2">
              {boardStages.map((stage) => {
                const stageApps = (stage.applications || []).filter(app =>
                  !search.trim() ||
                  app.candidate?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
                  app.candidate?.user?.email?.toLowerCase().includes(search.toLowerCase())
                );

                return (
                  <div
                    key={stage.stageId}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage.stageId)}
                    className="w-72 flex-shrink-0 flex flex-col bg-slate-50/80 rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-2xs"
                  >
                    {/* Column Header */}
                    <div className="px-4 py-3 bg-white border-b border-[#E5E7EB] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary-600" />
                        <h3 className="text-xs font-bold text-slate-800 truncate font-display">{stage.stageName}</h3>
                      </div>
                      <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                        {stageApps.length}
                      </span>
                    </div>

                    {/* Candidate Cards List */}
                    <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
                      {stageApps.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-xl m-1">
                          Drop candidate here
                        </div>
                      ) : (
                        stageApps.map((app) => (
                          <div
                            key={app.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, app.id)}
                            onClick={() => setPreview(app)}
                            className={`bg-white rounded-xl border border-slate-200 p-3.5 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-primary-300 transition-all ${
                              preview?.id === app.id ? 'border-primary-500 ring-2 ring-primary-100 shadow-sm' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2.5 mb-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {app.candidate?.fullName?.charAt(0) || 'C'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-900 leading-tight truncate">
                                  {app.candidate?.fullName || 'Candidate'}
                                </p>
                                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                  {app.candidate?.user?.email || 'No email'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recent'}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600">
                                {app.status || 'Active'}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Candidate Detail Preview */}
          {preview && (
            <div className="w-72 flex-shrink-0 card p-4 flex flex-col h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 font-display">Candidate Overview</h3>
                <button onClick={() => setPreview(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white text-sm font-bold shadow-2xs">
                  {preview.candidate?.fullName?.charAt(0) || 'C'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{preview.candidate?.fullName}</p>
                  <p className="text-xs text-slate-400 truncate">{preview.candidate?.user?.email}</p>
                </div>
              </div>

              <div className="space-y-3 text-xs border-t border-slate-100 pt-3">
                <div>
                  <span className="text-slate-400 text-[11px]">Applied Date</span>
                  <p className="font-semibold text-slate-700 mt-0.5">
                    {preview.appliedAt ? new Date(preview.appliedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Application Status</span>
                  <p className="font-semibold text-slate-700 mt-0.5">{preview.status || 'Active'}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Application ID</span>
                  <p className="font-mono text-[10px] text-slate-500 mt-0.5 break-all">{preview.id}</p>
                </div>
              </div>

              {/* Assessment Section in Drawer */}
              {(() => {
                const currentStage = boardStages.find(s => s.applications.some(a => a.id === preview.id));
                const isAssessmentStage = currentStage?.stageName?.toLowerCase().includes('assessment') ||
                                         Boolean(currentStage?.assessmentId);
                const stageAssessment = currentStage?.assessment || 
                                       (currentStage?.assessmentId ? { id: currentStage.assessmentId, title: 'Stage Assessment' } : null) ||
                                       (isAssessmentStage && jobAssessments[0]?.assessment ? jobAssessments[0].assessment : null);

                return (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">Technical Assessment</h4>
                    {stageAssessment ? (
                      <div className="p-3 bg-primary-50/50 rounded-xl border border-primary-100 space-y-2">
                        <p className="text-xs font-bold text-slate-800">{stageAssessment.title || 'Technical Assessment'}</p>
                        
                        <div className="flex flex-col gap-1.5 pt-1">
                          <button
                            onClick={async () => {
                              try {
                                const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
                                await assessmentApi.createAssessmentInvitation(preview.id, {
                                  assessmentId: stageAssessment.id,
                                  expiresAt: expiryDate,
                                  sendEmail: true
                                });
                                toast.success('Assessment invitation sent successfully!');
                                queryClient.invalidateQueries({ queryKey: workflowKeys.hiringBoard(currentJobId || '') });
                              } catch (err: any) {
                                toast.error(err?.response?.data?.message || err?.message || 'Failed to send assessment invitation');
                              }
                            }}
                            className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Send Test Invitation
                          </button>

                          <button
                            onClick={async () => {
                              try {
                                setIsLoadingScorecard(true);
                                const scorecard = await assessmentApi.getApplicationAssessmentResult(preview.id);
                                if (scorecard) {
                                  setSelectedScorecard(scorecard);
                                  setIsScorecardModalOpen(true);
                                }
                              } catch (err: any) {
                                toast.error(err?.response?.data?.message || 'No scorecard available yet for this candidate.');
                              } finally {
                                setIsLoadingScorecard(false);
                              }
                            }}
                            disabled={isLoadingScorecard}
                            className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            {isLoadingScorecard ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Activity className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                            View Full Scorecard
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">No assessment attached to this stage.</p>
                    )}
                  </div>
                );
              })()}

              <div className="mt-auto pt-4 border-t border-slate-100 space-y-2">
                <p className="text-[11px] text-slate-400 text-center">
                  Tip: Drag card to another stage on the board to advance
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Instructions */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <div className="flex items-center gap-1.5">
          <GripVertical className="w-3.5 h-3.5" />
          Drag & drop candidate cards across columns to advance or change their workflow stage
        </div>
      </div>

      {/* Full Assessment Scorecard Modal */}
      {isScorecardModalOpen && selectedScorecard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm md:text-base">
                    {selectedScorecard.assessmentTitle || 'Assessment Scorecard'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Candidate Evaluation Report & Performance Summary
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsScorecardModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Summary KPIs */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Overall Score
                  </span>
                  <span className="text-2xl font-black text-slate-900">
                    {selectedScorecard.score ?? 0}
                    <span className="text-xs text-slate-400 font-normal"> / {selectedScorecard.totalMarks ?? 100}</span>
                  </span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Percentage
                  </span>
                  <span className="text-2xl font-black text-primary-600">
                    {Math.round(selectedScorecard.percentage ?? 0)}%
                  </span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Status
                  </span>
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                    selectedScorecard.passed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedScorecard.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    {selectedScorecard.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
              </div>

              {/* Assessment & Submission Meta */}
              <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Passing Threshold:</span>
                  <span className="font-semibold text-slate-700">{selectedScorecard.passingScore ?? 60}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Evaluation State:</span>
                  <span className="font-semibold text-slate-700 capitalize">{selectedScorecard.evaluationStatus?.toLowerCase() || 'Completed'}</span>
                </div>
                {selectedScorecard.submittedAt && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Submitted At:</span>
                    <span className="font-semibold text-slate-700">{new Date(selectedScorecard.submittedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Question Breakdown List */}
              {selectedScorecard.answers && selectedScorecard.answers.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Question-by-Question Breakdown ({selectedScorecard.answers.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedScorecard.answers.map((ans: any, idx: number) => (
                      <div
                        key={ans.id || idx}
                        className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs hover:border-slate-300 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">
                              Q{idx + 1}. {ans.questionTitle || `Question ${idx + 1}`}
                            </span>
                            <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold">
                              {ans.questionType || 'MCQ'}
                            </span>
                          </div>
                          {ans.feedback && (
                            <p className="text-[11px] text-slate-500">{ans.feedback}</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`font-bold ${ans.isCorrect ? 'text-emerald-600' : 'text-slate-600'}`}>
                            {ans.score ?? 0} Marks
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setIsScorecardModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PipelinePage;
