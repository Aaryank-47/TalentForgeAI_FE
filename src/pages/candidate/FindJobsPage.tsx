import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search, MapPin, Filter, X, Bookmark, ChevronDown, Star, ExternalLink, CheckCircle,
  Briefcase, Building, Globe, Users, ChevronRight, Loader2, FileText, CheckCircle2, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

import { jobApi, type JobItem } from '../../services/api/job.api';
import { candidateApi, type CandidateResume } from '../../services/api/candidate.api';
import { jobKeys, candidateKeys } from '../../constants/queryKeys';
import { companiesData } from '../../constants/candidate_mockData';

type Company = typeof companiesData[0];

// ─── Job Card ─────────────────────────────────────────────
const JobCard = ({
  job, selected, onSelect, saved, onSave, isApplied,
}: {
  job: JobItem;
  selected: boolean;
  onSelect: () => void;
  saved: boolean;
  onSave: () => void;
  isApplied?: boolean;
}) => {
  return (
    <div
      onClick={onSelect}
      className={`p-4 border-b border-[#E5E7EB] hover:bg-slate-50 cursor-pointer transition-colors ${selected ? 'bg-primary-50/40 border-l-2 border-l-primary-500' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-2xs">
          {(job as any).company?.companyName?.charAt(0) || '🏢'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900 leading-tight">{job.title}</h3>
                {isApplied && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Applied
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{(job as any).company?.companyName || 'TalentForge Employer'}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); onSave(); }}
                className="p-1 text-slate-300 hover:text-primary-500 transition-colors"
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-primary-500 text-primary-500' : ''}`} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1.5">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location || job.workplaceType}</span>
            <span>·</span>
            <span>🌐 {job.employmentType?.replace('_', ' ')}</span>
            <span>·</span>
            <span className="font-semibold text-slate-700">
              {job.hideSalary
                ? 'Competitive'
                : job.minimumSalary && job.maximumSalary
                  ? `$${job.minimumSalary.toLocaleString()} - $${job.maximumSalary.toLocaleString()}`
                  : 'Undisclosed'}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {(job.skills || []).slice(0, 3).map(s => (
              <span key={s.name || (s as any)} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                {s.name || (s as any)}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            {job.publishedAt ? `Posted ${new Date(job.publishedAt).toLocaleDateString()}` : 'Recently posted'}
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Company Card ─────────────────────────────────────────
const CompanyCard = ({
  company, selected, onSelect,
}: {
  company: Company; selected: boolean; onSelect: () => void;
}) => (
  <div
    onClick={onSelect}
    className={`p-4 border-b border-[#E5E7EB] flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors ${selected ? 'bg-primary-50/40 border-l-2 border-l-primary-500' : ''}`}
  >
    <div className={`w-10 h-10 rounded-xl ${company.logoColor} flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {company.logo}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1">
        <p className="text-sm font-bold text-slate-900">{company.name}</p>
        {company.verified && <CheckCircle className="w-3.5 h-3.5 text-blue-500" />}
      </div>
      <p className="text-[11px] text-slate-400">{company.openJobs} open jobs</p>
    </div>
    <div className="flex items-center gap-1 text-amber-500">
      <Star className="w-3 h-3 fill-amber-400" />
      <span className="text-xs font-bold text-slate-700">{company.rating}</span>
    </div>
  </div>
);

// ─── Apply Modal ──────────────────────────────────────────
const ApplyModal = ({
  job,
  resumes,
  onClose,
  onApply,
  isApplying
}: {
  job: JobItem;
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
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedResumeId === r.id
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
            className="flex-1 btn-secondary text-xs py-2.5"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedResumeId || isApplying || resumes.length === 0}
            onClick={() => onApply(selectedResumeId)}
            className="flex-1 btn-primary text-xs py-2.5 flex items-center justify-center gap-2"
          >
            {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Application'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Job Detail Panel ─────────────────────────────────────
const JobDetailPanel = ({
  job,
  onClose,
  onOpenApplyModal,
  isApplied,
}: {
  job: JobItem;
  onClose: () => void;
  onOpenApplyModal: () => void;
  isApplied?: boolean;
}) => {
  const [tab, setTab] = useState<'Overview' | 'Skills' | 'Benefits' | 'Company'>('Overview');
  const company = (job as any).company;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-5 border-b border-[#E5E7EB]">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {company?.companyName?.charAt(0) || '🏢'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-bold text-[#0F172A] text-base">{job.title}</h2>
                {isApplied && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Already Applied
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500">{company?.companyName || 'TalentForge Employer'}</p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{job.location || job.workplaceType}</span>
                <span>·</span>
                <span>{job.employmentType?.replace('_', ' ')}</span>
                <span>·</span>
                <span className="font-semibold text-slate-700">
                  {job.hideSalary
                    ? 'Competitive'
                    : job.minimumSalary && job.maximumSalary
                      ? `$${job.minimumSalary.toLocaleString()} - $${job.maximumSalary.toLocaleString()}`
                      : 'Undisclosed'}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Skills preview */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-wrap gap-1">
            {(job.skills || []).map(s => (
              <span key={s.name || (s as any)} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                {s.name || (s as any)}
              </span>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-2">
          {isApplied ? (
            <button
              disabled
              className="flex-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-sm py-2.5 rounded-xl cursor-default flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Already Applied
            </button>
          ) : (
            <button
              onClick={onOpenApplyModal}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-2xs"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB] overflow-x-auto">
        {(['Overview', 'Skills', 'Benefits', 'Company'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${tab === t ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 text-sm text-slate-700 leading-relaxed space-y-4">
        {tab === 'Overview' && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Workplace Type', value: job.workplaceType },
                { label: 'Job Type', value: job.employmentType?.replace('_', ' ') },
                { label: 'Experience', value: `${job.minExperience} - ${job.maxExperience} yrs` },
                { label: 'Apply Deadline', value: job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'Rolling' },
              ].map(f => (
                <div key={f.label} className="bg-slate-50 rounded-xl p-3 border border-[#E5E7EB]">
                  <p className="text-[10px] text-slate-400 mb-0.5">{f.label}</p>
                  <p className="text-xs font-bold text-slate-900">{f.value}</p>
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1.5">Job Description</h4>
              <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{job.description}</p>
            </div>
          </>
        )}
        {tab === 'Skills' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Required & Recommended Skills</h4>
            <div className="flex flex-wrap gap-2">
              {(job.skills || []).map((s, i) => (
                <span key={i} className="bg-primary-50 text-primary-700 border border-primary-100 text-xs font-semibold px-3 py-1 rounded-full">
                  {s.name || (s as any)}
                </span>
              ))}
            </div>
          </div>
        )}
        {tab === 'Benefits' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Perks & Benefits</h4>
            <div className="flex flex-wrap gap-2">
              {(job.benefits || []).map((b, i) => (
                <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-3 py-1.5 rounded-full">
                  ✓ {b.benefit || (b as any)}
                </span>
              ))}
            </div>
          </div>
        )}
        {tab === 'Company' && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white font-bold">
                {company?.companyName?.charAt(0) || '🏢'}
              </div>
              <div>
                <p className="font-bold text-slate-900">{company?.companyName || 'TalentForge Employer'}</p>
                <p className="text-xs text-slate-500">{company?.industry || 'Technology'} • {company?.location || 'Remote'}</p>
              </div>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">{company?.about || 'No company overview provided.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Company Detail Panel ─────────────────────────────────
const CompanyDetailPanel = ({ company, onClose }: { company: Company; onClose: () => void }) => {
  const [tab, setTab] = useState<'Overview' | 'About'>('Overview');
  return (
    <div className="flex flex-col h-full">
      <div className={`h-28 bg-gradient-to-r ${company.bannerColor} relative flex-shrink-0`}>
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 bg-black/20 hover:bg-black/30 rounded-lg text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="absolute -bottom-5 left-5">
          <div className={`w-14 h-14 rounded-2xl ${company.logoColor} flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg`}>
            {company.logo}
          </div>
        </div>
      </div>

      <div className="pt-7 px-5 pb-3 border-b border-[#E5E7EB] flex-shrink-0 bg-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{company.name}</h2>
              {company.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{company.industry} · {company.location}</p>
          </div>
          <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-2 border border-primary-200 text-primary-700 text-xs font-semibold rounded-xl hover:bg-primary-50 transition-colors">
            <Globe className="w-3.5 h-3.5" />
            Website
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB] overflow-x-auto flex-shrink-0 bg-white">
        {(['Overview', 'About'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${tab === t ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-white">
        {tab === 'Overview' && (
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">About {company.name}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{company.overview}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────
const FindJobsPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'Jobs' | 'Companies'>('Jobs');
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(companiesData[0]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // 1. Fetch Real Published Jobs
  const { data: publishedJobs = [], isLoading: isLoadingJobs } = useQuery({
    queryKey: jobKeys.published({ search, location }),
    queryFn: () => jobApi.listPublishedJobs({ search, location }),
  });

  // 2. Fetch Candidate Resumes for the Apply Flow
  const { data: resumes = [] } = useQuery({
    queryKey: candidateKeys.resumes,
    queryFn: candidateApi.getResumes,
  });

  // 3. Fetch Candidate's Existing Applications to show applied status
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

  // 4. Apply Job Mutation
  const applyMutation = useMutation({
    mutationFn: async ({ jobId, resumeId }: { jobId: string; resumeId: string }) => {
      return candidateApi.applyJob(jobId, resumeId);
    },
    onSuccess: () => {
      toast.success('Application submitted successfully!');
      setIsApplyModalOpen(false);
      queryClient.invalidateQueries({ queryKey: candidateKeys.applications() });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to submit application';
      toast.error(msg);
      if (typeof msg === 'string' && msg.toLowerCase().includes('already applied')) {
        setIsApplyModalOpen(false);
        queryClient.invalidateQueries({ queryKey: candidateKeys.applications() });
      }
    },
  });

  // Active selected job
  const selectedJob = publishedJobs.find(j => j.id === selectedJobId) || publishedJobs[0] || null;

  const toggleSave = (id: string) =>
    setSavedJobs(prev => prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]);

  return (
    <div className="space-y-0 -m-6 h-screen flex flex-col">
      {/* Top search bar */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex-shrink-0">
        {/* Tabs */}
        <div className="flex items-center gap-0 border-b border-[#E5E7EB] mb-4 -mx-6 px-6">
          {(['Jobs', 'Companies'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === t ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
              {t === 'Jobs' ? <Briefcase className="w-4 h-4" /> : <Building className="w-4 h-4" />}
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'Jobs' && (
          <div className="flex gap-3 mb-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by job title, skill or keyword..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="relative w-52">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Enter location..."
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              onClick={() => { setSearch(''); setLocation(''); }}
              className="px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-xs text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Jobs Tab */}
        {activeTab === 'Jobs' && (
          <>
            {/* Jobs list */}
            <div className="w-[420px] flex-shrink-0 border-r border-[#E5E7EB] flex flex-col overflow-hidden bg-white">
              <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between bg-white flex-shrink-0">
                <p className="text-xs font-bold text-slate-700">{publishedJobs.length} Published Jobs Found</p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {isLoadingJobs ? (
                  <div className="py-16 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-600 mb-2" />
                    <p className="text-xs">Loading published jobs...</p>
                  </div>
                ) : publishedJobs.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <Briefcase className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-semibold text-slate-600">No published jobs match your search</p>
                  </div>
                ) : (
                  publishedJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      selected={selectedJob?.id === job.id}
                      onSelect={() => setSelectedJobId(job.id)}
                      saved={savedJobs.includes(job.id)}
                      onSave={() => toggleSave(job.id)}
                      isApplied={appliedJobIds.has(job.id)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Job Detail */}
            <div className="flex-1 overflow-hidden">
              {selectedJob ? (
                <JobDetailPanel
                  job={selectedJob}
                  onClose={() => setSelectedJobId(null)}
                  onOpenApplyModal={() => setIsApplyModalOpen(true)}
                  isApplied={appliedJobIds.has(selectedJob.id)}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <p className="text-xs">Select a job to view details</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Companies Tab */}
        {activeTab === 'Companies' && (
          <>
            {/* Companies list */}
            <div className="w-72 flex-shrink-0 border-r border-[#E5E7EB] flex flex-col overflow-hidden bg-white">
              <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between bg-white flex-shrink-0">
                <p className="text-xs font-bold text-slate-900">Companies</p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {companiesData.map((co) => (
                  <CompanyCard key={co.id} company={co} selected={selectedCompany?.id === co.id} onSelect={() => setSelectedCompany(co)} />
                ))}
              </div>
            </div>

            {/* Company Detail */}
            <div className="flex-1 overflow-hidden">
              {selectedCompany ? (
                <CompanyDetailPanel company={selectedCompany} onClose={() => setSelectedCompany(null)} />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <p className="text-xs">Select a company to view details</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Apply Modal */}
      {isApplyModalOpen && selectedJob && (
        <ApplyModal
          job={selectedJob}
          resumes={resumes}
          onClose={() => setIsApplyModalOpen(false)}
          onApply={(resumeId) => applyMutation.mutate({ jobId: selectedJob.id, resumeId })}
          isApplying={applyMutation.isPending}
        />
      )}
    </div>
  );
};

export default FindJobsPage;
