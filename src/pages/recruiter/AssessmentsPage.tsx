import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { assessmentApi, type AssessmentView } from '../../services/api/assessment.api';
import { assessmentKeys } from '../../constants/queryKeys';
import {
  Plus, Search, Filter, MoreHorizontal, Eye, Copy, Archive, X,
  ChevronDown, BarChart3, ClipboardList, Activity, TrendingUp,
  Check, ChevronRight, BookOpen, Loader2, Trash2, Pencil,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

import {
  assessmentsList as mockAssessments,
  assessmentScoreDistribution as scoreDistribution,
  assessmentPerformanceTrend as performanceTrend,
  topAssessments,
  assessmentRecentResults as recentResults,
} from '../../constants/recruiter_mockData';

const typeColor = (t: string) => ({
  Technical: 'bg-blue-50 text-blue-700 border-blue-200',
  Aptitude: 'bg-amber-50 text-amber-700 border-amber-200',
  MCQ: 'bg-purple-50 text-purple-700 border-purple-200',
  Communication: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Coding: 'bg-rose-50 text-rose-700 border-rose-200',
  DSA: 'bg-rose-50 text-rose-700 border-rose-200',
  MIXED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'MCQ + DSA': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  MACHINE_CODING: 'bg-violet-50 text-violet-700 border-violet-200',
  PROJECT: 'bg-amber-50 text-amber-700 border-amber-200',
})[t] || 'bg-slate-100 text-slate-600 border-slate-200';

const statusStyle = (s: string) => ({
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PUBLISHED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Draft: 'bg-slate-100 text-slate-600 border-slate-200',
  DRAFT: 'bg-slate-100 text-slate-600 border-slate-200',
  Archived: 'bg-red-50 text-red-600 border-red-200',
  ARCHIVED: 'bg-red-50 text-red-600 border-red-200',
})[s] || 'bg-slate-100 text-slate-600 border-slate-200';

const AssessmentsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const companyId = user?.companyId || user?.companies?.[0]?.companyId;

  const [activeTab, setActiveTab] = useState('All Assessments');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState('Overview');
  const [search, setSearch] = useState('');

  // 1. Fetch Assessments Query
  const {
    data: assessmentsData = { assessments: [], total: 0 },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: assessmentKeys.list({ search: search || undefined, companyId }),
    queryFn: () => assessmentApi.listAssessments({ search: search || undefined, companyId }),
    enabled: !!companyId,
  });

  // 2. Duplicate Mutation
  const duplicateMutation = useMutation({
    mutationFn: (id: string) => assessmentApi.duplicateAssessment(id),
    onSuccess: () => {
      toast.success('Assessment duplicated successfully!');
      queryClient.invalidateQueries({ queryKey: assessmentKeys.all });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to duplicate assessment');
    },
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => assessmentApi.deleteAssessment(id),
    onSuccess: () => {
      toast.success('Assessment deleted!');
      queryClient.invalidateQueries({ queryKey: assessmentKeys.all });
      setSelectedAssessmentId(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete assessment');
    },
  });

  // 4. Publish Assessment Mutation
  const publishMutation = useMutation({
    mutationFn: (id: string) => assessmentApi.publishAssessment(id),
    onSuccess: () => {
      toast.success('Assessment published successfully!');
      queryClient.invalidateQueries({ queryKey: assessmentKeys.all });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to publish assessment');
    },
  });

  const apiAssessments = assessmentsData.assessments || [];
  const displayList = apiAssessments.length > 0 ? apiAssessments : [];

  const filtered = displayList.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const selectedAssessment =
    filtered.find(a => a.id === selectedAssessmentId) || filtered[0] || null;



  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Assessments</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Create, manage and analyze assessments to evaluate candidates.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/recruiter/question-library')}
            className="btn-secondary text-sm flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            Question Bank
          </button>
          <button onClick={() => navigate('/recruiter/assessments/create')} className="btn-primary text-sm flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" />
            Create Assessment
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Assessments', value: '24', change: '+18% vs last month', icon: <ClipboardList className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Active Assessments', value: '16', change: '+12% vs last month', icon: <Activity className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50' },
          { label: 'Total Attempts', value: '1,248', change: '+22% vs last month', icon: <BarChart3 className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50' },
          { label: 'Average Score', value: '72%', change: '+8% vs last month', icon: <TrendingUp className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50' },
        ].map(k => (
          <div key={k.label} className="card p-4 flex items-start gap-3">
            <div className={`${k.bg} rounded-xl p-2.5 flex-shrink-0`}>{k.icon}</div>
            <div>
              <p className="text-[12px] text-slate-500 leading-tight">{k.label}</p>
              <p className="text-2xl font-display font-bold text-slate-900 mt-0.5">{k.value}</p>
              <p className="text-[10px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />{k.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Table + Side Panel */}
      <div className="flex gap-5" style={{ minHeight: '500px' }}>
        {/* Left: Table */}
        <div className="flex-1 min-w-0 card overflow-hidden flex flex-col">
          {/* Tabs + Search */}
          <div className="border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2 px-4 pt-3 pb-0">
              {['All Assessments', 'My Assessments', 'Assigned', 'Drafts', 'Archived'].map(t => (
                <button key={t} className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap ${t === 'All Assessments' ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="px-4 py-3 flex items-center gap-3 border-b border-[#E5E7EB]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search assessments..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 w-52"
              />
            </div>
            {['All Types', 'All Jobs', 'All Status'].map(f => (
              <div key={f} className="relative">
                <select className="appearance-none pl-3 pr-8 py-2 text-xs border border-[#E5E7EB] rounded-lg bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>{f}</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            ))}
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg text-slate-600 hover:bg-slate-50">
              <Filter className="w-3.5 h-3.5" />
              Filters
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-auto">
            {isLoading ? (
              <div className="p-12 text-center text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600 mb-3" />
                <p className="text-sm font-medium">Loading assessments...</p>
              </div>
            ) : isError ? (
              <div className="p-8 text-center text-red-500">
                <p className="text-sm font-semibold">Failed to load assessments</p>
                <p className="text-xs text-red-400 mt-1">{(error as any)?.message || 'Check connection'}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-semibold text-slate-700">No assessments created yet</p>
                <p className="text-xs text-slate-400 mt-1">Create your first assessment to start testing candidates.</p>
                <button
                  onClick={() => navigate('/recruiter/assessments/create')}
                  className="btn-primary text-xs mt-3 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Create Assessment
                </button>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 sticky top-0 border-b border-[#E5E7EB]">
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Assessment</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap min-w-[110px]">Type</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Sections</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Duration</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Attempts</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Passing Score</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filtered.map(a => {
                    const isSelected = selectedAssessment?.id === a.id;
                    const sectionTypes = Array.from(new Set(a.sections?.map(s => s.sectionType) || []));
                    let displayType = 'MCQ';
                    if (sectionTypes.length > 1) {
                      displayType = sectionTypes.includes('MCQ') && sectionTypes.includes('DSA') ? 'MCQ + DSA' : 'Mixed';
                    } else if (sectionTypes.length === 1) {
                      displayType = sectionTypes[0];
                    }
                    return (
                      <tr
                        key={a.id}
                        onClick={() => setSelectedAssessmentId(a.id)}
                        className={`hover:bg-slate-50 transition-colors cursor-pointer ${isSelected ? 'bg-primary-50/30' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-2xs">
                              <ClipboardList className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900 line-clamp-1">{a.title}</p>
                              <p className="text-[10px] text-slate-400">Total Marks: {a.totalMarks}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                            {displayType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">{a.sections?.length || 1}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{a.durationMinutes} mins</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-700">{a._count?.attempts || 0}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 rounded-full h-1.5">
                              <div className="h-1.5 rounded-full bg-primary-600" style={{ width: `${a.passingScore}%` }} />
                            </div>
                            <span className="text-xs font-bold text-slate-700">{a.passingScore}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${statusStyle(a.status)}`}>{a.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              title="Edit Assessment"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/recruiter/assessments/${a.id}/edit`);
                              }}
                              className="p-1 rounded text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Duplicate Assessment"
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateMutation.mutate(a.id);
                              }}
                              disabled={duplicateMutation.isPending}
                              className="p-1 rounded text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Delete Assessment"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Delete assessment "${a.title}"?`)) {
                                  deleteMutation.mutate(a.id);
                                }
                              }}
                              disabled={deleteMutation.isPending}
                              className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Bottom Charts */}
          <div className="border-t border-[#E5E7EB] p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Score Distribution */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-3">Score Distribution</h4>
              <div className="flex items-center gap-3">
                <div className="relative w-24 h-24">
                  <PieChart width={96} height={96}>
                    <Pie data={scoreDistribution} cx={44} cy={44} innerRadius={28} outerRadius={44} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                      {scoreDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-sm font-display font-bold text-slate-900">1,248</p>
                    <p className="text-[8px] text-slate-400">Total</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {scoreDistribution.map(s => (
                    <div key={s.name} className="flex items-center gap-1.5 text-[10px]">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-slate-600">{s.name}</span>
                      <span className="ml-auto font-medium text-slate-900">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Trend */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-900">Performance Over Time</h4>
                <span className="text-[10px] text-slate-400">Last 7 Months</span>
              </div>
              <div className="h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceTrend} margin={{ top: 2, right: 5, left: -25, bottom: 2 }}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94A3B8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94A3B8' }} domain={[60, 85]} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2} dot={{ r: 3, fill: '#2563EB' }} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Assessments */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-3">Top Performing Assessments</h4>
              <div className="space-y-2">
                {topAssessments.map((a, i) => (
                  <div key={a.name} className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 w-4">{i + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-slate-700 truncate font-medium">{a.name}</p>
                      <div className="w-full bg-slate-200 rounded-full h-1 mt-0.5">
                        <div className="h-1 rounded-full bg-primary-600" style={{ width: `${a.score}%` }} />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 w-8 text-right">{a.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detail Panel */}
        {selectedAssessment && (
          <div className="w-80 flex-shrink-0 card p-4 flex flex-col gap-4 overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{selectedAssessment.title}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{selectedAssessment.description || 'No description provided'}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Duration</span>
                <span className="font-semibold text-slate-800">{selectedAssessment.durationMinutes} mins</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Passing Score</span>
                <span className="font-semibold text-slate-800">{selectedAssessment.passingScore}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Total Marks</span>
                <span className="font-semibold text-slate-800">{selectedAssessment.totalMarks}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Status</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle(selectedAssessment.status)}`}>
                  {selectedAssessment.status}
                </span>
              </div>
            </div>

            <div className="mt-auto pt-3 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => navigate(`/recruiter/assessments/${selectedAssessment.id}/edit`)}
                className="w-full btn-primary text-xs flex items-center justify-center gap-1.5 py-2 cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit Assessment
              </button>
              {selectedAssessment.status === 'DRAFT' && (
                <button
                  type="button"
                  onClick={() => publishMutation.mutate(selectedAssessment.id)}
                  disabled={publishMutation.isPending}
                  className="w-full text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl py-2 font-medium cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Publish Assessment
                </button>
              )}
              <button
                type="button"
                onClick={() => duplicateMutation.mutate(selectedAssessment.id)}
                disabled={duplicateMutation.isPending}
                className="w-full btn-secondary text-xs flex items-center justify-center gap-1.5 py-2 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> Duplicate Assessment
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete assessment "${selectedAssessment.title}"?`)) {
                    deleteMutation.mutate(selectedAssessment.id);
                  }
                }}
                disabled={deleteMutation.isPending}
                className="w-full text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded-xl py-2 font-medium cursor-pointer"
              >
                Delete Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentsPage;
