import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bookmark, MapPin, Trash2, Loader2, Briefcase, CheckCircle, ExternalLink,
  Building, FileText, X, AlertCircle, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

import { candidateApi, type CandidateResume } from '../../services/api/candidate.api';
import { jobApi } from '../../services/api/job.api';
import { candidateKeys, jobKeys } from '../../constants/queryKeys';

// Apply Modal
const ApplyModal = ({
  job,
  resumes,
  onClose,
  onApply,
  isApplying
}: {
  job: any;
  resumes: CandidateResume[];
  onClose: () => void;
  onApply: (resumeId: string) => void;
  isApplying: boolean;
}) => {
  const [selectedResumeId, setSelectedResumeId] = useState<string>(resumes[0]?.id || '');

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-slate-100 max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Apply for Job</h3>
            <p className="text-xs text-slate-500 mt-0.5">{job.title}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Select Resume to Submit</label>
          {resumes.length === 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
              <p className="font-semibold flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> No resumes uploaded yet</p>
              <p className="text-amber-700">Please upload a resume in your profile before applying.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {resumes.map(r => (
                <label
                  key={r.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedResumeId === r.id
                      ? 'border-primary-500 bg-primary-50/50 ring-2 ring-primary-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="resume"
                    value={r.id}
                    checked={selectedResumeId === r.id}
                    onChange={() => setSelectedResumeId(r.id)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{r.resumeName}</p>
                    <p className="text-[10px] text-slate-400">Uploaded {new Date(r.uploadedAt).toLocaleDateString()}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedResumeId || isApplying || resumes.length === 0}
            onClick={() => onApply(selectedResumeId)}
            className="flex-1 px-4 py-2.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-2xs"
          >
            {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Application'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Details Modal
const JobDetailModal = ({ job, onClose, onApply, isApplied }: { job: any; onClose: () => void; onApply: () => void; isApplied?: boolean }) => {
  const company = job.company;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-slate-100 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            {company?.logo ? (
              <img src={company.logo} alt="" className="w-11 h-11 rounded-xl object-cover border border-slate-200" />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white font-bold">
                {company?.companyName?.charAt(0) || <Building className="w-5 h-5" />}
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">{job.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{company?.companyName || 'TalentForge Employer'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 text-xs text-slate-600 pr-1">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Workplace</span>
              <span className="font-bold text-slate-900">{job.workplaceType}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Employment Type</span>
              <span className="font-bold text-slate-900">{job.employmentType?.replace('_', ' ')}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Location</span>
              <span className="font-bold text-slate-900">{job.location || 'Remote'}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Compensation</span>
              <span className="font-bold text-slate-900">
                {job.hideSalary
                  ? 'Competitive'
                  : job.minimumSalary && job.maximumSalary
                    ? `$${job.minimumSalary.toLocaleString()} - $${job.maximumSalary.toLocaleString()}`
                    : 'Undisclosed'}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wide mb-1">Description</h4>
            <p className="leading-relaxed whitespace-pre-line text-slate-600">{job.description}</p>
          </div>

          {job.skills?.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wide mb-1.5">Required Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((s: any) => (
                  <span key={s.id || s.name} className="px-2.5 py-0.5 bg-primary-50 text-primary-700 rounded-full font-medium text-[11px] border border-primary-100">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          {isApplied ? (
            <button
              disabled
              className="flex-1 px-4 py-2.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              Already Applied
            </button>
          ) : (
            <button
              onClick={() => { onClose(); onApply(); }}
              className="flex-1 px-4 py-2.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const SavedJobsPage = () => {
  const queryClient = useQueryClient();
  const [selectedJobForApply, setSelectedJobForApply] = useState<any | null>(null);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<any | null>(null);

  // 1. Fetch Real Saved Jobs
  const { data: savedJobs = [], isLoading } = useQuery({
    queryKey: jobKeys.saved,
    queryFn: jobApi.getSavedJobs,
  });

  // 2. Fetch Resumes for Apply Modal
  const { data: resumes = [] } = useQuery({
    queryKey: candidateKeys.resumes,
    queryFn: candidateApi.getResumes,
  });

  // 3. Fetch Existing Applications to show applied status
  const { data: myApplicationsData } = useQuery({
    queryKey: candidateKeys.applications(),
    queryFn: () => candidateApi.getMyApplications({ limit: 100 }),
  });

  const applicationsList: any[] = Array.isArray(myApplicationsData)
    ? myApplicationsData
    : Array.isArray(myApplicationsData?.data)
      ? myApplicationsData.data
      : Array.isArray((myApplicationsData as any)?.applications)
        ? (myApplicationsData as any).applications
        : [];

  const appliedJobIds = new Set<string>(
    applicationsList.map((app: any) => app.jobId || app.job?.id).filter(Boolean)
  );

  // 4. Unsave Mutation
  const unsaveMutation = useMutation({
    mutationFn: async (jobId: string) => {
      return jobApi.unsaveJob(jobId);
    },
    onSuccess: () => {
      toast.success('Job removed from saved jobs');
      queryClient.invalidateQueries({ queryKey: jobKeys.saved });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to remove saved job');
    },
  });

  // 5. Apply Mutation
  const applyMutation = useMutation({
    mutationFn: async ({ jobId, resumeId }: { jobId: string; resumeId: string }) => {
      return candidateApi.applyJob(jobId, resumeId);
    },
    onSuccess: () => {
      toast.success('Application submitted successfully!');
      setSelectedJobForApply(null);
      queryClient.invalidateQueries({ queryKey: candidateKeys.applications() });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to submit application';
      toast.error(msg);
      if (typeof msg === 'string' && msg.toLowerCase().includes('already applied')) {
        setSelectedJobForApply(null);
        queryClient.invalidateQueries({ queryKey: candidateKeys.applications() });
      }
    },
  });

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Saved Jobs</h1>
          <p className="text-sm text-slate-500 mt-0.5">{savedJobs.length} jobs saved</p>
        </div>
      </div>

      {isLoading ? (
        <div className="card p-16 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-3" />
          <p className="text-xs text-slate-500">Loading saved jobs...</p>
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="card p-16 flex flex-col items-center justify-center text-center">
          <Bookmark className="w-12 h-12 text-slate-200 mb-4" />
          <h3 className="font-bold text-slate-900 mb-2">No saved jobs yet</h3>
          <p className="text-sm text-slate-500">Browse published jobs and save the ones you like for easy access later.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((item: any) => {
            const job = item.job || item;
            const company = job.company;
            const isApplied = appliedJobIds.has(job.id);

            return (
              <div key={item.id || job.id} className="card p-5 hover:border-primary-200 hover:shadow-sm transition-all bg-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {company?.logo ? (
                      <img
                        src={company.logo}
                        alt=""
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 flex-shrink-0 shadow-2xs"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-2xs">
                        {company?.companyName?.charAt(0) || <Building className="w-6 h-6" />}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">{job.title}</h3>
                        {isApplied && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Applied
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{company?.companyName || 'TalentForge Employer'}</p>

                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location || job.workplaceType}</span>
                        <span>·</span>
                        <span>{job.workplaceType}</span>
                        <span>·</span>
                        <span className="font-semibold text-emerald-600">
                          {job.hideSalary
                            ? 'Competitive'
                            : job.minimumSalary && job.maximumSalary
                              ? `$${job.minimumSalary.toLocaleString()} - $${job.maximumSalary.toLocaleString()}`
                              : 'Undisclosed'}
                        </span>
                      </div>

                      {job.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {job.skills.slice(0, 4).map((s: any) => (
                            <span key={s.id || s.name} className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-medium">
                              {s.name || s}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-[10px] text-slate-400 mt-2">
                        {item.savedAt ? `Saved ${new Date(item.savedAt).toLocaleDateString()}` : 'Saved'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      title="Remove from saved jobs"
                      onClick={() => unsaveMutation.mutate(job.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-[#E5E7EB]">
                  {isApplied ? (
                    <button
                      disabled
                      className="flex-1 py-2 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Already Applied
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedJobForApply(job)}
                      className="flex-1 py-2 text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors shadow-2xs"
                    >
                      Apply Now
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedJobForDetails(job)}
                    className="flex-1 py-2 text-xs font-semibold border border-[#E5E7EB] text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply Modal */}
      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          resumes={resumes}
          onClose={() => setSelectedJobForApply(null)}
          onApply={(resumeId) => applyMutation.mutate({ jobId: selectedJobForApply.id, resumeId })}
          isApplying={applyMutation.isPending}
        />
      )}

      {/* View Details Modal */}
      {selectedJobForDetails && (
        <JobDetailModal
          job={selectedJobForDetails}
          onClose={() => setSelectedJobForDetails(null)}
          onApply={() => setSelectedJobForApply(selectedJobForDetails)}
          isApplied={appliedJobIds.has(selectedJobForDetails.id)}
        />
      )}
    </div>
  );
};

export default SavedJobsPage;
