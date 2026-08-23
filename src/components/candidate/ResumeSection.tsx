import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText, Upload, Trash2, RefreshCw, CheckCircle, AlertCircle, Loader2,
  ExternalLink, Sparkles, Clock, ArrowRight, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { candidateApi, type CandidateResume } from '../../services/api/candidate.api';
import { candidateKeys, authKeys } from '../../constants/queryKeys';
import { subscribeToResumeProgress, type ResumeStagePayload } from '../../services/websocket/resumeSocket.service';

const STAGE_LABELS: Record<string, { label: string; desc: string }> = {
  QUEUED: { label: 'Queued', desc: 'Waiting for worker...' },
  FETCHING_FILE: { label: 'Fetching Document', desc: 'Retrieving resume file...' },
  EXTRACTION: { label: 'Extracting Text', desc: 'Reading text content...' },
  AI_PARSING: { label: 'AI Analysis', desc: 'AI parsing skills, experience & education...' },
  NORMALIZATION: { label: 'Normalizing', desc: 'Standardizing taxonomy & fields...' },
  PERSISTENCE: { label: 'Enriching Profile', desc: 'Populating candidate profile...' },
  COMPLETED: { label: 'Completed', desc: 'Profile successfully enriched!' },
  FAILED: { label: 'Failed', desc: 'Processing encountered an error.' },
};

const STAGES_ORDER = [
  'QUEUED',
  'FETCHING_FILE',
  'EXTRACTION',
  'AI_PARSING',
  'NORMALIZATION',
  'PERSISTENCE',
  'COMPLETED'
] as const;

export const ResumeSection: React.FC = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeProcessingResumeId, setActiveProcessingResumeId] = useState<string | null>(null);
  const [liveStage, setLiveStage] = useState<{ stage: string; message: string; progress?: number } | null>(null);

  // Resumes list query (GET /resume/my) - includes PostgreSQL status + Redis current micro-stage
  const {
    data: resumes = [],
    isLoading: isLoadingResumes,
  } = useQuery({
    queryKey: candidateKeys.resumes,
    queryFn: () => candidateApi.getResumes(),
    refetchOnWindowFocus: true,
  });

  // Watch for any active PROCESSING or QUEUED resume in the list and recover stage
  useEffect(() => {
    const processingResume = resumes.find(
      r => r.parsingStatus === 'PROCESSING' || r.parsingStatus === 'QUEUED'
    );

    if (processingResume) {
      setActiveProcessingResumeId(processingResume.id);

      // Restore stage from Redis recovery payload if liveStage is not set yet
      if (processingResume.processing) {
        setLiveStage({
          stage: processingResume.processing.stage,
          message: processingResume.processing.message,
          progress: processingResume.processing.progress
        });
      } else if (!liveStage) {
        setLiveStage({
          stage: processingResume.parsingStatus === 'QUEUED' ? 'QUEUED' : 'PROCESSING',
          message: STAGE_LABELS[processingResume.parsingStatus]?.desc || 'Processing resume...',
        });
      }
    }
  }, [resumes]);

  // Subscribe to real-time WebSocket progress updates for the active resume
  useEffect(() => {
    if (!activeProcessingResumeId) return;

    const unsubscribe = subscribeToResumeProgress(activeProcessingResumeId, {
      onStageChange: (payload: ResumeStagePayload) => {
        setLiveStage({
          stage: payload.stage,
          message: payload.message || STAGE_LABELS[payload.stage]?.desc || 'Processing resume...',
        });
      },
      onCompleted: () => {
        toast.success('Resume parsed and candidate profile updated!');
        setActiveProcessingResumeId(null);
        setLiveStage(null);
        // Refresh all candidate queries to show newly populated skills, experiences, educations
        queryClient.invalidateQueries({ queryKey: candidateKeys.all });
        queryClient.invalidateQueries({ queryKey: candidateKeys.resumes });
        queryClient.invalidateQueries({ queryKey: authKeys.me });
      },
      onFailed: (err) => {
        toast.error(`Resume processing failed: ${err.error}`);
        setActiveProcessingResumeId(null);
        setLiveStage(null);
        queryClient.invalidateQueries({ queryKey: candidateKeys.resumes });
      },
    });

    return () => {
      unsubscribe();
    };
  }, [activeProcessingResumeId, queryClient]);

  // Upload Resume Mutation (POST /resume/upload)
  const uploadMutation = useMutation({
    mutationFn: (file: File) => candidateApi.uploadResume(file),
    onSuccess: (data) => {
      toast.success('Resume uploaded! AI processing started.');
      setActiveProcessingResumeId(data.resumeId);
      setLiveStage({ stage: 'QUEUED', message: 'Enqueued for AI processing...' });
      queryClient.invalidateQueries({ queryKey: candidateKeys.resumes });
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to upload resume.');
    },
  });

  // Retry Resume Processing Mutation (POST /resume/:id/retry)
  const retryMutation = useMutation({
    mutationFn: (resumeId: string) => candidateApi.retryResumeProcessing(resumeId),
    onSuccess: (data) => {
      toast.success('Resume re-queued for processing!');
      setActiveProcessingResumeId(data.resumeId);
      setLiveStage({ stage: 'QUEUED', message: 'Re-queued for AI processing...' });
      queryClient.invalidateQueries({ queryKey: candidateKeys.resumes });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to retry resume processing.');
    },
  });

  // Delete Resume Mutation (DELETE /resume/:id)
  const deleteMutation = useMutation({
    mutationFn: (resumeId: string) => candidateApi.deleteResume(resumeId),
    onSuccess: () => {
      toast.success('Resume deleted successfully.');
      queryClient.invalidateQueries({ queryKey: candidateKeys.resumes });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete resume.');
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate mime type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or DOCX file.');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Resume file size must be less than 10MB.');
      return;
    }

    uploadMutation.mutate(file);
  };

  const currentStageIndex = liveStage ? STAGES_ORDER.indexOf(liveStage.stage as any) : -1;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Resume & CV</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary-50 text-primary-700 border border-primary-100/80">
              <Sparkles className="w-3 h-3 text-primary-600" />
              AI Powered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload your resume. Our AI parser will automatically extract your work history, education, and skills.
          </p>
        </div>

        {/* Upload Button */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
          />
          <button
            type="button"
            disabled={uploadMutation.isPending || !!activeProcessingResumeId}
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto px-4 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {uploadMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            Upload Resume
          </button>
        </div>
      </div>

      {/* Recoverable Multi-Stage Progress Stepper */}
      {activeProcessingResumeId && liveStage && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-50 to-indigo-50 border border-primary-100 mb-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary-900">
                    {STAGE_LABELS[liveStage.stage]?.label || liveStage.stage}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                    PROCESSING
                  </span>
                </div>
                <p className="text-xs text-primary-700 mt-0.5">{liveStage.message}</p>
              </div>
            </div>

            <div className="text-right text-[11px] text-primary-600 font-medium hidden sm:block">
              Auto-enriching profile...
            </div>
          </div>

          {/* Stepper Dots & Labels */}
          <div className="grid grid-cols-6 gap-1 pt-2 border-t border-primary-100/60">
            {STAGES_ORDER.slice(0, 6).map((stageKey, idx) => {
              const isPast = currentStageIndex > idx;
              const isCurrent = currentStageIndex === idx;

              return (
                <div key={stageKey} className="flex flex-col items-center text-center">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      isPast
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-primary-600 text-white ring-2 ring-primary-300 animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isPast ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`text-[9px] mt-1 font-medium truncate max-w-full ${
                      isCurrent ? 'text-primary-900 font-bold' : isPast ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {STAGE_LABELS[stageKey]?.label || stageKey}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resumes List */}
      {isLoadingResumes ? (
        <div className="py-8 flex items-center justify-center text-slate-400 text-xs">
          <Loader2 className="w-4 h-4 animate-spin mr-2 text-primary-600" /> Loading your resumes...
        </div>
      ) : resumes.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">No resume uploaded yet</p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
            Upload your resume in PDF or DOCX format. Our AI parser will read your experience and enrich your profile in seconds.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 text-xs font-bold text-primary-600 hover:text-primary-700 underline inline-flex items-center gap-1"
          >
            <Upload className="w-3.5 h-3.5" /> Choose file to upload
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {resumes.map((resume) => {
            const isProcessing =
              resume.parsingStatus === 'PROCESSING' || resume.parsingStatus === 'QUEUED';
            const isCompleted = resume.parsingStatus === 'COMPLETED';
            const isFailed = resume.parsingStatus === 'FAILED';

            return (
              <div
                key={resume.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900 truncate">{resume.resumeName}</p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isFailed
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {resume.parsingStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                      <span>{(resume.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                      <span>•</span>
                      <span>Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Retry parsing button if failed */}
                  {isFailed && (
                    <button
                      type="button"
                      onClick={() => retryMutation.mutate(resume.id)}
                      disabled={retryMutation.isPending}
                      className="btn-secondary text-xs flex items-center gap-1 text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5"
                      title="Retry AI parsing"
                    >
                      {retryMutation.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5" />
                      )}
                      Retry
                    </button>
                  )}

                  {/* View / Download */}
                  {resume.resumeUrl && (
                    <a
                      href={resume.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition-colors"
                      title="View resume"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  {/* Delete Resume */}
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${resume.resumeName}"?`)) {
                        deleteMutation.mutate(resume.id);
                      }
                    }}
                    disabled={deleteMutation.isPending || isProcessing}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                    title="Delete resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResumeSection;
