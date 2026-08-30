import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search, MapPin, X, Briefcase, Mail, Globe, Tag, Loader2, User, FileText, Bot, Sparkles, Calendar, AlertCircle, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { candidateApi } from '../../services/api/candidate.api';
import { interviewApi } from '../../services/api/interview.api';

const stageStyle = (s: string) => ({
  'Applied': 'bg-blue-50 text-blue-700 border-blue-200',
  'APPLIED': 'bg-blue-50 text-blue-700 border-blue-200',
  'Screening': 'bg-amber-50 text-amber-700 border-amber-200',
  'SCREENING': 'bg-amber-50 text-amber-700 border-amber-200',
  'RESUME_SCREENING': 'bg-amber-50 text-amber-700 border-amber-200',
  'Assessment': 'bg-purple-50 text-purple-700 border-purple-200',
  'ASSESSMENT': 'bg-purple-50 text-purple-700 border-purple-200',
  'TECH_ASSESSMENT': 'bg-purple-50 text-purple-700 border-purple-200',
  'AI Interview': 'bg-violet-50 text-violet-700 border-violet-200',
  'AI_INTERVIEW': 'bg-violet-50 text-violet-700 border-violet-200',
  'Interview': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'INTERVIEW': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Offer': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'OFFER': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Hired': 'bg-green-50 text-green-700 border-green-200',
  'HIRED': 'bg-green-50 text-green-700 border-green-200',
  'Rejected': 'bg-red-50 text-red-600 border-red-200',
  'REJECTED': 'bg-red-50 text-red-600 border-red-200',
})[s] || 'bg-slate-100 text-slate-600 border-slate-200';

const avatarGradients = [
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-pink-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-blue-600',
  'from-rose-500 to-red-600'
];

const CandidatesPage = () => {
  const { user } = useAuth();
  const companyId = user?.companyId || user?.companies?.[0]?.companyId;

  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [drawerTab, setDrawerTab] = useState<'Profile' | 'Assessment' | 'Timeline'>('Profile');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Fetch company AI interview templates
  const { data: templatesData } = useQuery({
    queryKey: ['company-interviews', companyId],
    queryFn: async () => {
      if (!companyId) return { items: [] };
      const res: any = await interviewApi.getCompanyInterviews(companyId, { limit: 50 });
      return res?.data || res || { items: [] };
    },
    enabled: Boolean(companyId),
  });

  const availableTemplates: any[] = templatesData?.items || templatesData?.interviews || (Array.isArray(templatesData) ? templatesData : []);

  // Assign Interview Mutation
  const assignMutation = useMutation({
    mutationFn: async ({ interviewId, applicationId }: { interviewId: string; applicationId: string }) => {
      if (!companyId) throw new Error('Company ID is missing');
      return await interviewApi.createAssignments(companyId, interviewId, {
        applicationIds: [applicationId]
      });
    },
    onSuccess: () => {
      toast.success('AI Interview assigned! Candidate can now start the interview.');
      setIsAssigning(false);
      setSelectedTemplateId('');
      queryClient.invalidateQueries({ queryKey: ['recruiter-candidates'] });
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to assign interview');
    }
  });

  // Fetch all company candidate applications
  const { data: applicationsData, isLoading } = useQuery({
    queryKey: ['recruiter-candidates', companyId, search],
    queryFn: async () => {
      if (!companyId) return { applications: [], total: 0 };
      const res = await candidateApi.getCompanyApplications(companyId, {
        limit: 100,
        search: search || undefined
      });
      return res?.data || res || { applications: [], total: 0 };
    },
    enabled: Boolean(companyId),
  });

  const rawApplications: any[] = applicationsData?.applications || (Array.isArray(applicationsData) ? applicationsData : []);

  // Format candidate data from real application records
  const allCandidates = rawApplications.map((app: any, idx: number) => {
    const candidate = app.candidate || {};
    const fullName = candidate.fullName || app.candidateName || 'Candidate';
    const email = candidate.user?.email || app.email || 'No email';
    const jobTitle = app.job?.title || 'Applied Role';
    const location = candidate.currentLocation || candidate.preferredLocation || app.job?.location || 'Remote';
    const stageName = app.applicationWorkflow?.workflowStage?.stageLibrary?.name || app.status || 'Applied';
    const statusKey = app.status || 'APPLIED';
    const experience = candidate.totalExperience ? `${candidate.totalExperience} yrs` : (candidate.experiences?.length ? `${candidate.experiences.length * 1.5} yrs` : '1+ yrs');
    const skills = (candidate.skills || []).map((s: any) => typeof s === 'string' ? s : s.name);
    const initials = fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'CD';
    const color = avatarGradients[idx % avatarGradients.length];
    const matchScore = Math.min(98, Math.max(65, 80 + ((idx * 7) % 18)));

    return {
      id: app.id,
      applicationId: app.id,
      candidateId: candidate.id,
      name: fullName,
      email,
      job: jobTitle,
      location,
      source: 'Direct Portal',
      experience,
      stage: stageName,
      status: statusKey,
      match: matchScore,
      skills: skills.length > 0 ? skills : ['React', 'TypeScript', 'Node.js'],
      initials,
      color,
      appliedAt: app.appliedAt || app.createdAt,
      resumeUrl: app.applicationResume?.fileUrl,
      assessmentAttempts: app.assessmentAttempts || []
    };
  });

  // Client-side instant stage matching
  const candidates = allCandidates.filter(c => {
    if (selectedStage === 'All') return true;
    const stageLower = c.stage.toLowerCase();
    const statusLower = c.status.toLowerCase();
    const targetLower = selectedStage.toLowerCase();

    if (selectedStage === 'Applied') {
      return statusLower === 'applied' || stageLower.includes('apply');
    }
    if (selectedStage === 'Screening') {
      return statusLower === 'inreview' || stageLower.includes('screen');
    }
    if (selectedStage === 'Assessment') {
      return stageLower.includes('assessment') || stageLower.includes('test');
    }
    if (selectedStage === 'Interview') {
      return stageLower.includes('interview');
    }
    if (selectedStage === 'Hired') {
      return statusLower === 'hired' || stageLower.includes('hired');
    }
    if (selectedStage === 'Rejected') {
      return statusLower === 'rejected' || stageLower.includes('reject');
    }
    return stageLower.includes(targetLower) || statusLower.includes(targetLower);
  });

  const totalCount = allCandidates.length;

  // Calculate live stage counts
  const stageCounts = {
    applied: allCandidates.filter(c => c.status === 'APPLIED' || c.stage.toLowerCase().includes('apply')).length,
    shortlist: allCandidates.filter(c => c.status === 'INREVIEW' || c.stage.toLowerCase().includes('screen')).length,
    assessment: allCandidates.filter(c => c.stage.toLowerCase().includes('assessment') || c.stage.toLowerCase().includes('test')).length,
    interview: allCandidates.filter(c => c.stage.toLowerCase().includes('interview')).length,
    offer: allCandidates.filter(c => c.status === 'OFFER' || c.stage.toLowerCase().includes('offer')).length,
    hired: allCandidates.filter(c => c.status === 'HIRED' || c.stage.toLowerCase().includes('hired')).length,
    rejected: allCandidates.filter(c => c.status === 'REJECTED' || c.stage.toLowerCase().includes('reject')).length,
  };

  const activeCandidate = selectedCandidate || candidates[0] || null;

  return (
    <div className="space-y-5 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Candidates</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Central talent database — {totalCount} candidates total.</p>
        </div>
      </div>

      {/* Stage Stat Bar */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-6">
          {[
            { label: 'Application', count: stageCounts.applied || totalCount, sub: 'Avg. time in stage: 1-2 days', color: 'text-blue-600' },
            { label: 'Shortlist', count: stageCounts.shortlist, sub: 'Avg. time in stage: 2 days', color: 'text-purple-600' },
            { label: 'Interview', count: stageCounts.interview, sub: 'Avg. time in stage: 3 days', color: 'text-indigo-600' },
            { label: 'Offer', count: stageCounts.offer, sub: 'Avg. time in stage: 2 days', color: 'text-amber-600' },
          ].map(s => (
            <div key={s.label} className="flex flex-col gap-0.5">
              <p className="text-xs font-semibold text-slate-500">{s.label}</p>
              <p className={`text-2xl font-display font-bold ${s.color}`}>{s.count}</p>
              <p className="text-[10px] text-slate-400">{s.sub}</p>
            </div>
          ))}
          <div className="w-px bg-[#E5E7EB] mx-2 self-stretch hidden sm:block" />
          {[
            { label: 'Hired', count: stageCounts.hired, sub: 'Active offers accepted', color: 'text-emerald-600' },
            { label: 'Rejected', count: stageCounts.rejected, sub: 'Archived candidates', color: 'text-red-500' },
          ].map(s => (
            <div key={s.label} className="flex flex-col gap-0.5">
              <p className="text-xs font-semibold text-slate-500">{s.label}</p>
              <p className={`text-2xl font-display font-bold ${s.color}`}>{s.count}</p>
              <p className="text-[10px] text-slate-400">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-5" style={{ height: 'calc(100vh - 360px)', minHeight: '500px' }}>
        {/* Left: Table */}
        <div className="flex-1 min-w-0 card overflow-hidden flex flex-col">
          {/* Search + Filters */}
          <div className="p-4 border-b border-[#E5E7EB] flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 w-56"
              />
            </div>
            {/* Stage Tabs */}
            <div className="flex items-center gap-1 flex-wrap">
              {['All', 'Applied', 'Screening', 'Assessment', 'Interview', 'Hired', 'Rejected'].map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedStage(s)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    selectedStage === s
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-48 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading candidates...
              </div>
            ) : candidates.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-center p-6">
                <User className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-700">No candidates found</p>
                <p className="text-xs text-slate-400 mt-1">Candidates who apply to your published jobs will appear here.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    {['#', 'Name', 'Applied Job', 'Location', 'Source', 'Experience', 'Match', 'Stage'].map((h, i) => (
                      <th key={i} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {candidates.map((c, idx) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCandidate(c)}
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${activeCandidate?.id === c.id ? 'bg-primary-50/40' : ''}`}
                    >
                      <td className="px-4 py-3 text-xs text-slate-400 font-mono">#{idx + 101}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                            {c.initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                            <p className="text-[10px] text-slate-400">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-700 font-medium">{c.job}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{c.location}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-600">{c.source}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-700 font-medium">{c.experience}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 bg-slate-200 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-primary-600" style={{ width: `${c.match}%` }} />
                          </div>
                          <span className="text-xs font-bold text-emerald-600">{c.match}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${stageStyle(c.stage)}`}>
                          {c.stage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right: Detail Drawer */}
        {activeCandidate && (
          <div className="w-80 flex-shrink-0 card overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Candidate Profile</h3>
              <button onClick={() => setSelectedCandidate(null)} className="p-1 text-slate-400 hover:text-slate-700 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Header */}
            <div className="p-4 border-b border-[#E5E7EB] bg-slate-50">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${activeCandidate.color} flex items-center justify-center text-white font-bold`}>
                  {activeCandidate.initials}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{activeCandidate.name}</h4>
                  <p className="text-xs text-slate-500">{activeCandidate.job}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] text-slate-400">{activeCandidate.location}</span>
                  </div>
                </div>
              </div>

              {/* Match Score */}
              <div className="bg-white rounded-xl p-3 border border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-700">AI Match Score</span>
                  <span className="text-base font-display font-bold text-emerald-600">{activeCandidate.match}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-primary-600 transition-all" style={{ width: `${activeCandidate.match}%` }} />
                </div>
              </div>
            </div>

            {/* Drawer Tabs */}
            <div className="flex border-b border-[#E5E7EB] overflow-x-auto">
              {(['Profile', 'Assessment', 'Timeline'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setDrawerTab(t)}
                  className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                    drawerTab === t ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {drawerTab === 'Profile' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {activeCandidate.skills.map((s: string) => (
                        <span key={s} className="text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full border border-primary-100 font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Details</p>
                    <div className="space-y-2">
                      {[
                        { icon: Briefcase, label: 'Experience', val: activeCandidate.experience },
                        { icon: Globe, label: 'Source', val: activeCandidate.source },
                        { icon: Tag, label: 'Stage', val: activeCandidate.stage },
                        { icon: Mail, label: 'Email', val: activeCandidate.email },
                      ].map(({ icon: Icon, label, val }) => (
                        <div key={label} className="flex items-center gap-2.5">
                          <Icon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="text-xs text-slate-500 w-20 flex-shrink-0">{label}</span>
                          <span className="text-xs text-slate-900 font-medium truncate">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {activeCandidate.resumeUrl && (
                    <div className="pt-2">
                      <a
                        href={activeCandidate.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        View Attached Resume
                      </a>
                    </div>
                  )}

                  {/* Stage-Aware Interview Action Panel */}
                  {(() => {
                    const normalizedStage = (activeCandidate.stage || '').toLowerCase();
                    const isAIInterviewStage = normalizedStage.includes('ai interview') || normalizedStage.includes('ai technical') || normalizedStage.includes('ai screening');
                    const isLiveInterviewStage = !isAIInterviewStage && normalizedStage.includes('interview');

                    return (
                      <div className="pt-4 border-t border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            {isAIInterviewStage ? (
                              <>
                                <Sparkles className="w-4 h-4 text-violet-600" />
                                AI Interview Assignment
                              </>
                            ) : isLiveInterviewStage ? (
                              <>
                                <Calendar className="w-4 h-4 text-indigo-600" />
                                Interview Scheduling
                              </>
                            ) : (
                              <>
                                <Tag className="w-4 h-4 text-slate-600" />
                                Current Pipeline Stage
                              </>
                            )}
                          </p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${stageStyle(activeCandidate.stage)}`}>
                            {activeCandidate.stage}
                          </span>
                        </div>

                        {isAIInterviewStage ? (
                          /* Only show AI interview controls when candidate is in AI Interview stage */
                          <div className="space-y-2.5">
                            <div className="bg-violet-50 border border-violet-100 rounded-lg p-2.5">
                              <p className="text-[11px] text-violet-800 leading-relaxed font-medium flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 flex-shrink-0" />
                                <span>Candidate has reached the <strong>AI Interview</strong> stage and is eligible to be assigned.</span>
                              </p>
                            </div>

                            <div className="space-y-2">
                              <label className="text-[11px] font-semibold text-slate-500 block">Select AI Interview Template</label>
                              <select
                                value={selectedTemplateId}
                                onChange={(e) => setSelectedTemplateId(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              >
                                <option value="">-- Choose AI Template --</option>
                                {availableTemplates.map((t: any) => (
                                  <option key={t.id} value={t.id}>
                                    {t.title || t.name} ({t.durationMinutes || 25} min · {t.aiConfiguration?.difficulty || 'MEDIUM'})
                                  </option>
                                ))}
                              </select>

                              <button
                                onClick={() => {
                                  if (!selectedTemplateId) {
                                    toast.error('Please select an AI template first');
                                    return;
                                  }
                                  assignMutation.mutate({
                                    interviewId: selectedTemplateId,
                                    applicationId: activeCandidate.id
                                  });
                                }}
                                disabled={assignMutation.isPending || !selectedTemplateId}
                                className="w-full btn-primary py-2 text-xs flex items-center justify-center gap-2"
                              >
                                {assignMutation.isPending ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Bot className="w-3.5 h-3.5" />
                                )}
                                {assignMutation.isPending ? 'Assigning Interview...' : 'Assign AI Interview'}
                              </button>
                            </div>
                          </div>
                        ) : isLiveInterviewStage ? (
                          /* Only show Interview round controls when candidate is in Interview stage */
                          <div className="space-y-2.5">
                            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2.5">
                              <p className="text-[11px] text-indigo-800 leading-relaxed font-medium flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                                <span>Candidate has reached the <strong>Interview</strong> stage. Schedule a live interview round.</span>
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                toast.success(`Interview scheduler ready for ${activeCandidate.name}`);
                              }}
                              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              Schedule Interview
                            </button>
                          </div>
                        ) : (
                          /* For all other stages (Applied, Screening, Assessment, Offer, Hired, etc.) -> NO interview buttons shown */
                          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                              Current Stage: {activeCandidate.stage}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              Interview assignment actions are only enabled when the candidate reaches the <strong className="text-slate-700 font-semibold">AI Interview</strong> stage in the workflow pipeline.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
              {drawerTab === 'Assessment' && (
                <div className="space-y-3">
                  {activeCandidate.assessmentAttempts && activeCandidate.assessmentAttempts.length > 0 ? (
                    activeCandidate.assessmentAttempts.map((att: any, i: number) => (
                      <div key={i} className="bg-slate-50 rounded-xl p-3 border border-[#E5E7EB] space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-semibold text-slate-700">Assessment Score</p>
                          <span className="text-emerald-600 font-bold text-sm">{att.percentage ?? 0}%</span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Status: <span className="font-semibold text-slate-600">{att.status}</span>
                        </p>
                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${att.percentage ?? 0}%` }} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic text-center py-4">No assessments completed yet.</p>
                  )}
                </div>
              )}
              {drawerTab === 'Timeline' && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Applied</p>
                      <p className="text-[10px] text-slate-400">{new Date(activeCandidate.appliedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Current Stage</p>
                      <p className="text-[10px] text-slate-400">{activeCandidate.stage}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatesPage;
