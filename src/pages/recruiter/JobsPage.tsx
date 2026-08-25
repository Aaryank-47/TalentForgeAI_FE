import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus, Search, Eye, Edit2, MoreHorizontal,
  Briefcase, Users,Globe,
  Loader2, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { jobApi, type JobStatus } from '../../services/api/job.api';
import { jobKeys } from '../../constants/queryKeys';

const tabs = ['All Jobs', 'Active', 'Draft', 'Archived'];

const statusStyle = (s: string) => {
  const norm = s?.toUpperCase();
  if (norm === 'PUBLISHED' || norm === 'ACTIVE') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  if (norm === 'DRAFT') return 'bg-slate-100 text-slate-600 border border-slate-200';
  if (norm === 'CLOSED') return 'bg-amber-50 text-amber-700 border border-amber-200';
  if (norm === 'ARCHIVED') return 'bg-red-50 text-red-600 border border-red-200';
  return 'bg-slate-100 text-slate-600';
};

const JobsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const companyId = user?.companyId || user?.companies?.[0]?.companyId;

  const [activeTab, setActiveTab] = useState('All Jobs');
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // 1. Fetch Real Jobs
  const { data: jobs = [], isLoading, isError, error } = useQuery({
    queryKey: jobKeys.list(companyId || ''),
    queryFn: () => (companyId ? jobApi.listCompanyJobs(companyId) : Promise.resolve([])),
    enabled: Boolean(companyId),
  });

  // 2. Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ jobId, status }: { jobId: string; status: JobStatus }) => {
      if (!companyId) throw new Error('Company ID missing');
      return jobApi.updateJobStatus(companyId, jobId, status);
    },
    onSuccess: (_, vars) => {
      toast.success(`Job status changed to ${vars.status}`);
      queryClient.invalidateQueries({ queryKey: jobKeys.list(companyId || '') });
      setMenuOpen(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update job status');
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpen !== null && !(event.target as Element).closest('.more-menu-container')) {
        setMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const filtered = jobs.filter(j => {
    const status = j.status?.toUpperCase();
    let matchTab = true;
    if (activeTab === 'Active') matchTab = status === 'PUBLISHED';
    else if (activeTab === 'Draft') matchTab = status === 'DRAFT';
    else if (activeTab === 'Archived') matchTab = status === 'ARCHIVED' || status === 'CLOSED';

    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      (j.location || '').toLowerCase().includes(search.toLowerCase()) ||
      (j.employmentType || '').toLowerCase().includes(search.toLowerCase());

    return matchTab && matchSearch;
  });

  const counts = {
    'All Jobs': jobs.length,
    'Active': jobs.filter(j => j.status === 'PUBLISHED').length,
    'Draft': jobs.filter(j => j.status === 'DRAFT').length,
    'Archived': jobs.filter(j => j.status === 'ARCHIVED' || j.status === 'CLOSED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">All Jobs</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Manage all your job openings and track applicants.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary text-sm flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-500" />
            Share Career Page
          </button>
          <Link to="/recruiter/jobs/create" className="btn-primary text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New Job
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E5E7EB]">
        <div className="flex items-center gap-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {counts[tab as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs by title, location, type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-72"
          />
        </div>
      </div>

      {/* Jobs Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600 mb-3" />
              <p className="text-sm font-medium">Loading jobs...</p>
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500">
              <AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-2" />
              <p className="text-sm font-semibold">Failed to load jobs</p>
              <p className="text-xs text-red-400 mt-1">{(error as any)?.message || 'Check connection'}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-semibold text-slate-700">No jobs found</p>
              <p className="text-xs text-slate-400 mt-1">Create your first job posting to start receiving applications.</p>
              <button
                onClick={() => navigate('/recruiter/jobs/create')}
                className="btn-primary text-xs mt-3 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Create New Job
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  {['Job Title', 'Workplace', 'Applications', 'Status', 'Posted On', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filtered.map((job) => (
                  <tr
                    key={job.id}
                    onClick={() => navigate(`/recruiter/jobs/create?editId=${job.id}`)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0 text-white shadow-2xs">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0F172A] group-hover:text-primary-600 transition-colors">{job.title}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-slate-400">
                              {job.minExperience}-{job.maxExperience} yrs • {job.employmentType?.replace('_', ' ')}
                            </span>
                            {job.workplaceType === 'REMOTE' && (
                              <span className="text-[10px] font-medium bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">Remote</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">{job.location || job.workplaceType}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-sm font-semibold text-slate-700">{job._count?.applications || 0}</span>
                        <span className="text-xs text-slate-400">Applicants</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-500">
                        {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/recruiter/jobs/create?editId=${job.id}`}
                          title={job.status === 'PUBLISHED' ? 'View Job Details (Published - Read Only)' : 'Edit Draft'}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                        >
                          {job.status === 'PUBLISHED' ? <Eye className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                        </Link>
                        <div className="relative more-menu-container">
                          <button
                            title="More Actions"
                            onClick={() => setMenuOpen(menuOpen === job.id ? null : job.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          {menuOpen === job.id && (
                            <div className="absolute right-0 top-8 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-20 w-44 overflow-hidden py-1">
                              {job.status !== 'PUBLISHED' && (
                                <button
                                  onClick={() => updateStatusMutation.mutate({ jobId: job.id, status: 'PUBLISHED' })}
                                  className="w-full text-left px-4 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                                >
                                  Publish Job
                                </button>
                              )}
                              {job.status === 'PUBLISHED' && (
                                <button
                                  onClick={() => updateStatusMutation.mutate({ jobId: job.id, status: 'CLOSED' })}
                                  className="w-full text-left px-4 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 transition-colors"
                                >
                                  Close Job
                                </button>
                              )}
                              {job.status !== 'ARCHIVED' && (
                                <button
                                  onClick={() => updateStatusMutation.mutate({ jobId: job.id, status: 'ARCHIVED' })}
                                  className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  Archive Job
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {!isLoading && filtered.length > 0 && (
          <div className="px-5 py-3.5 border-t border-[#E5E7EB] bg-slate-50 flex items-center justify-between">
            <p className="text-sm text-slate-500">Showing {filtered.length} of {jobs.length} jobs</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
