import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock, ChevronRight, MoreVertical, Play, CheckCircle, AlertCircle, Loader2, Sparkles, Building, ExternalLink, Building2, Mail, FileText, BarChart2 } from 'lucide-react';
import { assessmentApi } from '../../services/api/assessment.api';
import { candidateApi } from '../../services/api/candidate.api';
import { candidateKeys } from '../../constants/queryKeys';

type Tab = 'Pending' | 'Completed' | 'All Assessments';

const AssessmentsPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('Pending');

  // Fetch candidate applications to query assessment invitations via getAssessmentInvitation
  const { data: applicationsResponse, isLoading: isLoadingApps } = useQuery({
    queryKey: candidateKeys.applications({ limit: 50 }),
    queryFn: () => candidateApi.getMyApplications({ limit: 50 }),
  });

  const applications = applicationsResponse?.applications || applicationsResponse?.data || (Array.isArray(applicationsResponse) ? applicationsResponse : []);

  // Query assessment invitations for each application
  const { data: invitations = [], isLoading: isLoadingInvites } = useQuery({
    queryKey: ['candidate', 'assessment-invitations', applications.map((a: any) => a.id).join(',')],
    queryFn: async () => {
      if (!applications.length) return [];
      const results = await Promise.allSettled(
        applications.map((app: any) => assessmentApi.getAssessmentInvitation(app.id))
      );
      return results
        .filter((res): res is PromiseFulfilledResult<any> => res.status === 'fulfilled' && Boolean(res.value))
        .map(res => res.value);
    },
    enabled: applications.length > 0,
  });

  const isLoading = isLoadingApps || (applications.length > 0 && isLoadingInvites);

  const pendingInvitations = invitations.filter((inv: any) => inv.status === 'PENDING' || inv.status === 'IN_PROGRESS');
  const completedInvitations = invitations.filter((inv: any) => inv.status === 'COMPLETED' || inv.status === 'SUBMITTED');

  const tabCounts = {
    Pending: pendingInvitations.length,
    Completed: completedInvitations.length,
    'All Assessments': invitations.length,
  };

  const getDueDays = (expiresAtStr: string) => {
    const diff = new Date(expiresAtStr).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: 'Expired', urgency: 'expired', days: 0 };
    if (days <= 2) return { text: `${days} day${days === 1 ? '' : 's'}`, urgency: 'urgent', days };
    return { text: `${days} days`, urgency: 'normal', days };
  };

  const scoreColor = (score: number) =>
    score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-blue-600' : 'text-amber-600';

  const scoreBarColor = (score: number) =>
    score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-blue-500' : 'bg-amber-500';

  // Compute live performance metrics
  const completedWithScores = completedInvitations.filter((inv: any) => inv.attempt?.percentage !== undefined && inv.attempt?.percentage !== null);
  const avgScore = completedWithScores.length > 0
    ? Math.round(completedWithScores.reduce((acc: number, inv: any) => acc + (inv.attempt?.percentage || 0), 0) / completedWithScores.length)
    : 0;

  const bestScore = completedWithScores.length > 0
    ? Math.max(...completedWithScores.map((inv: any) => inv.attempt?.percentage || 0))
    : 0;

  return (
    <div className="space-y-0 -m-6 flex h-screen overflow-hidden">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-[#E5E7EB]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] bg-white flex-shrink-0">
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Assessments</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track your assigned test invitations, showcase your skills, and review results.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E5E7EB] bg-white flex-shrink-0 px-6">
          {(['Pending', 'Completed', 'All Assessments'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                tab === t ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tab === t ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'}`}>
                {tabCounts[t]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isLoading ? (
            <div className="card p-16 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-3" />
              <p className="text-xs text-slate-500">Loading your assessments...</p>
            </div>
          ) : invitations.length === 0 ? (
            <div className="card p-16 flex flex-col items-center justify-center text-center">
              <Sparkles className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">No Assessments Assigned Yet</h3>
              <p className="text-sm text-slate-500 max-w-sm">
                When recruiters invite you to take technical screening tests for your job applications, they will appear here.
              </p>
            </div>
          ) : (
            <>
              {/* Pending Assessments */}
              {(tab === 'Pending' || tab === 'All Assessments') && (
                <div className="mb-6">
                  {tab === 'All Assessments' && <h2 className="text-sm font-bold text-slate-900 mb-4">Pending Assessments</h2>}
                  {pendingInvitations.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-500">
                      No pending assessments at the moment.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingInvitations.map((a: any) => {
                        const due = getDueDays(a.expiresAt);
                        const company = a.assessment?.company || a.job?.company;

                        return (
                          <div key={a.id} className="card p-5 hover:border-primary-200 transition-all bg-white">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4">
                                {company?.logo ? (
                                  <img src={company.logo} alt="" className="w-11 h-11 rounded-xl object-cover border border-slate-200 flex-shrink-0" />
                                ) : (
                                  <div className="w-11 h-11 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                                    {company?.companyName?.charAt(0) || <Building2 className="w-5 h-5" />}
                                  </div>
                                )}
                                <div>
                                  <h3 className="font-bold text-slate-900 text-sm">{a.assessment?.title}</h3>
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    {company?.companyName || 'TalentForge Employer'} • For <span className="font-medium text-slate-700">{a.job?.title || 'Applied Position'}</span>
                                  </p>
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                                      Passing Score: {a.assessment?.passingScore}%
                                    </span>
                                    <span className="text-[10px] bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium border border-primary-100">
                                      Total Marks: {a.assessment?.totalMarks}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-6 flex-shrink-0">
                                <div className="text-center">
                                  <p className={`text-xs font-bold ${due.urgency === 'urgent' ? 'text-red-600' : 'text-slate-600'}`}>
                                    Due in<br /><span className="text-base">{due.text}</span>
                                  </p>
                                </div>
                                <div className="text-center">
                                  <Clock className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                                  <p className="text-[10px] text-slate-500">{a.assessment?.durationMinutes || 60} min</p>
                                  <p className="text-[10px] text-slate-400">Duration</p>
                                </div>
                                <button
                                  onClick={() => navigate(`/candidate/assessments/${a.assessment.id}/preparation?token=${a.token}&applicationId=${a.applicationId}`)}
                                  className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition-colors whitespace-nowrap shadow-2xs"
                                >
                                  <Play className="w-4 h-4 fill-white" />
                                  Start Assessment
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Completed Assessments */}
              {(tab === 'Completed' || tab === 'All Assessments') && (
                <div>
                  {tab === 'All Assessments' && <h2 className="text-sm font-bold text-slate-900 mb-4">Completed Assessments</h2>}
                  {completedInvitations.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-500">
                      No completed assessments yet.
                    </div>
                  ) : (
                    <div className="card overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-slate-50 border-b border-[#E5E7EB]">
                          <tr>
                            {['Assessment', 'Company', 'Completed On', 'Score', 'Status'].map(h => (
                              <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                          {completedInvitations.map((a: any) => {
                            const company = a.assessment?.company || a.job?.company;
                            const score = Math.round(a.attempt?.percentage || a.attempt?.overallScore || 0);

                            return (
                              <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3.5">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                      {company?.companyName?.charAt(0) || <Building2 className="w-4 h-4" />}
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-slate-900">{a.assessment?.title}</p>
                                      <p className="text-[10px] text-slate-400">{a.job?.title}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5">
                                  <p className="text-xs text-slate-700 font-medium">{company?.companyName || 'TalentForge Employer'}</p>
                                </td>
                                <td className="px-4 py-3.5">
                                  <p className="text-xs text-slate-700">{a.attempt?.submittedAt ? new Date(a.attempt.submittedAt).toLocaleDateString() : 'Completed'}</p>
                                </td>
                                <td className="px-4 py-3.5">
                                  <div className="flex items-center gap-2">
                                    <div className="w-24 bg-slate-200 rounded-full h-1.5">
                                      <div className={`h-1.5 rounded-full ${scoreBarColor(score)}`} style={{ width: `${score}%` }} />
                                    </div>
                                    <span className={`text-xs font-bold ${scoreColor(score)}`}>{score}%</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5">
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                                    Completed
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Performance Panel */}
      <div className="w-72 flex-shrink-0 overflow-y-auto p-5 space-y-6 bg-white">
        {/* How Assessments Work */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3">How Assessments Work</h3>
          <div className="space-y-3">
            {[
              { step: '1', icon: Mail, title: 'Accept Invitation', desc: "You'll receive an assessment invitation from the hiring company." },
              { step: '2', icon: FileText, title: 'Take Assessment', desc: 'Complete the test within the given time limit. Stay focused!' },
              { step: '3', icon: BarChart2, title: 'Get Results', desc: 'Results are automatically evaluated and sent to the recruiter.' },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-[#E5E7EB]">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{s.title}</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Summary */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">Performance Summary</h3>
          </div>

          {/* Score Ring */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-24 h-24">
              <svg width="96" height="96" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="38" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                <circle
                  cx="48" cy="48" r="38" fill="none"
                  stroke="#2563EB" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(avgScore / 100) * 238.76} 238.76`}
                  transform="rotate(-90 48 48)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-lg font-display font-bold text-slate-900">{avgScore}%</p>
                <p className="text-[9px] text-slate-400">Avg. Score</p>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {[
                { label: 'Assessments Taken', value: completedInvitations.length },
                { label: 'Average Score', value: `${avgScore}%` },
                { label: 'Best Score', value: `${bestScore}%` },
                { label: 'Pending Tests', value: pendingInvitations.length },
              ].map(m => (
                <div key={m.label} className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">{m.label}</span>
                  <span className="font-bold text-slate-900">{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Tips to Improve Your Score</p>
            <div className="space-y-1.5">
              {[
                'Read instructions and question details carefully before answering.',
                "Manage your time effectively and don't get stuck on one question.",
                'Ensure your camera and microphone are stable before beginning.',
                'Review your answers before the timer runs out.',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-[10px] text-slate-600">
                  <div className="w-4 h-4 bg-primary-100 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-600 font-bold">{i + 1}</span>
                  </div>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentsPage;
