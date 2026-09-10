import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, Plus, Trash2, Eye, Send, Check, Search,
  Clock, Award, BookOpen, AlertCircle, Pencil, Loader2, 
  CheckCircle2, FileQuestion
} from 'lucide-react';
import toast from 'react-hot-toast';

import { assessmentApi, type AssessmentView, type AssessmentSection } from '../../services/api/assessment.api';
import { questionApi, type QuestionItem } from '../../services/api/question.api';
import { questionKeys } from '../../constants/queryKeys';
import { useAuth } from '../../context/AuthContext';

const difficultyBadge = (difficulty?: string) => {
  const d = (difficulty || 'EASY').toUpperCase();
  if (d === 'HARD') return 'bg-rose-50 text-rose-700 border-rose-200';
  if (d === 'MEDIUM') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
};

const statusBadge = (status?: string) => {
  const s = (status || 'DRAFT').toUpperCase();
  if (s === 'PUBLISHED') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (s === 'ARCHIVED') return 'bg-slate-100 text-slate-600 border-slate-200';
  return 'bg-amber-50 text-amber-700 border-amber-200';
};

export const EditAssessmentPage: React.FC = () => {
  const { id: assessmentId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const companyId = user?.companyId || user?.companies?.[0]?.companyId;

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isAddQuestionsOpen, setIsAddQuestionsOpen] = useState(false);
  const [isEditDetailsOpen, setIsEditDetailsOpen] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<any | null>(null);

  // Add Question Modal state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedQuestionIdsToAdd, setSelectedQuestionIdsToAdd] = useState<string[]>([]);

  // Fetch Assessment Data
  const {
    data: assessmentData,
    isLoading: isLoadingAssessment,
    error: assessmentError,
    refetch: refetchAssessment
  } = useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: () => assessmentApi.getAssessment(assessmentId!),
    enabled: Boolean(assessmentId),
  });

  const assessment: AssessmentView | undefined =
    (assessmentData as any)?.data || assessmentData;

  const sections: AssessmentSection[] = (assessment as any)?.sections || [];

  // Determine current active section
  const currentSection =
    sections.find(s => s.id === activeSectionId) || sections[0] || null;

  // Edit details form state
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editInstructions, setEditInstructions] = useState('');
  const [editDuration, setEditDuration] = useState(60);
  const [editPassingScore, setEditPassingScore] = useState(70);
  const [editTotalMarks, setEditTotalMarks] = useState(100);

  // Initialize edit fields when assessment loads
  React.useEffect(() => {
    if (assessment) {
      setEditTitle(assessment.title || '');
      setEditDescription(assessment.description || '');
      setEditInstructions((assessment as any).instructions || '');
      setEditDuration(assessment.durationMinutes || 60);
      setEditPassingScore(assessment.passingScore || 70);
      setEditTotalMarks(assessment.totalMarks || 100);
      if (!activeSectionId && sections.length > 0) {
        setActiveSectionId(sections[0].id);
      }
    }
  }, [assessment, sections]);

  // Fetch Question Bank for Add Questions Modal
  const { data: questionsData, isLoading: isLoadingQuestions } = useQuery({
    queryKey: questionKeys.list({
      type: currentSection?.sectionType === 'DSA' ? 'DSA' : 'MCQ',
      search: searchQuery || undefined,
      companyId: companyId || assessment?.companyId
    }),
    queryFn: () => questionApi.getQuestions({
      type: currentSection?.sectionType === 'DSA' ? 'DSA' : 'MCQ',
      search: searchQuery || undefined,
      companyId: companyId || assessment?.companyId
    }),
    enabled: isAddQuestionsOpen,
  });

  // Fetch Categories for filters
  const { data: categories = [] } = useQuery({
    queryKey: questionKeys.categories,
    queryFn: () => questionApi.getCategories(),
    enabled: isAddQuestionsOpen,
  });

  const rawBankQuestions: QuestionItem[] = questionsData?.questions || [];

  // Existing question IDs in this section
  const existingQuestionIds = new Set(
    (currentSection?.items || []).map((item: any) => item.questionId || item.question?.id)
  );

  // Filter bank questions
  const filteredBankQuestions = rawBankQuestions.filter(q => {
    if (selectedCategory !== 'All' && q.category?.name !== selectedCategory) return false;
    if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty.toUpperCase()) return false;
    return true;
  });

  // Update Assessment Details Mutation
  const updateDetailsMutation = useMutation({
    mutationFn: async () => {
      if (!assessmentId) return;
      return assessmentApi.updateAssessment(assessmentId, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        instructions: editInstructions.trim() || undefined,
        durationMinutes: editDuration,
        passingScore: editPassingScore,
        totalMarks: editTotalMarks,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment', assessmentId] });
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      toast.success('Assessment details updated successfully');
      setIsEditDetailsOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update assessment');
    }
  });

  // Publish Assessment Mutation
  const publishMutation = useMutation({
    mutationFn: async () => {
      if (!assessmentId) return;
      return assessmentApi.publishAssessment(assessmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment', assessmentId] });
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      toast.success('Assessment published successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to publish assessment');
    }
  });

  // Add Questions to Section Mutation
  const addQuestionsMutation = useMutation({
    mutationFn: async () => {
      if (!currentSection || selectedQuestionIdsToAdd.length === 0) return;
      return assessmentApi.addQuestionsToSection(
        currentSection.id,
        selectedQuestionIdsToAdd.map(qId => ({ questionId: qId }))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment', assessmentId] });
      toast.success(`${selectedQuestionIdsToAdd.length} question(s) added successfully!`);
      setSelectedQuestionIdsToAdd([]);
      setIsAddQuestionsOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to add questions');
    }
  });

  // Remove Question from Section Mutation
  const removeQuestionMutation = useMutation({
    mutationFn: async (sectionItemId: string) => {
      return assessmentApi.removeQuestionFromSection(sectionItemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment', assessmentId] });
      toast.success('Question removed from assessment');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to remove question');
    }
  });

  // Toggle selection for adding questions
  const toggleSelectQuestionToAdd = (id: string) => {
    setSelectedQuestionIdsToAdd(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  if (isLoadingAssessment) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-600">Loading assessment details & questions...</p>
      </div>
    );
  }

  if (assessmentError || !assessment) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Assessment Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          Could not load the requested assessment. It may have been removed or you may not have access to it.
        </p>
        <button
          onClick={() => navigate('/recruiter/assessments')}
          className="btn-primary inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Assessments
        </button>
      </div>
    );
  }

  const allItems: any[] = sections.flatMap(s => s.items || []);
  const totalQuestionsCount = allItems.length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-20">
      {/* ── Top Header ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/recruiter/assessments')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Assessments
          </button>

          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-display font-bold text-slate-900">{assessment.title}</h1>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusBadge(assessment.status)}`}>
              {assessment.status}
            </span>
            <button
              onClick={() => setIsEditDetailsOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              title="Edit Assessment Details"
            >
              <Pencil className="w-3 h-3" /> Edit Info
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {assessment.description || 'Manage questions, add or remove questions from sections, and publish when ready.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {assessment.status === 'DRAFT' && (
            <button
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending || totalQuestionsCount === 0}
              className="btn-primary text-xs flex items-center gap-2 py-2 px-4 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
            >
              {publishMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Publish Assessment
            </button>
          )}

          <button
            onClick={() => {
              if (currentSection) {
                setIsAddQuestionsOpen(true);
              } else {
                toast.error('No section available in this assessment.');
              }
            }}
            disabled={assessment.status !== 'DRAFT'}
            className="btn-primary text-xs flex items-center gap-2 py-2 px-4 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" /> Add Questions
          </button>
        </div>
      </div>

      {/* ── Status Banner if Published ───────────────────────── */}
      {assessment.status === 'PUBLISHED' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div className="text-xs text-emerald-800">
            <span className="font-bold">This assessment is PUBLISHED and Active.</span> Candidates can take this assessment. If you need to modify questions, archive or duplicate this assessment.
          </div>
        </div>
      )}

      {/* ── Metric Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-3 border-slate-100 bg-white shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileQuestion className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-bold font-display text-slate-900">{totalQuestionsCount}</p>
            <p className="text-[11px] text-slate-500 font-medium">Total Questions</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-3 border-slate-100 bg-white shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-bold font-display text-slate-900">{assessment.totalMarks}</p>
            <p className="text-[11px] text-slate-500 font-medium">Total Marks</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-3 border-slate-100 bg-white shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-bold font-display text-slate-900">{assessment.durationMinutes}m</p>
            <p className="text-[11px] text-slate-500 font-medium">Duration</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-3 border-slate-100 bg-white shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-bold font-display text-slate-900">{assessment.passingScore}%</p>
            <p className="text-[11px] text-slate-500 font-medium">Passing Score</p>
          </div>
        </div>
      </div>

      {/* ── Section Tabs / Selector ──────────────────────────── */}
      {sections.length > 1 && (
        <div className="flex border-b border-slate-200 gap-2">
          {sections.map(section => {
            const isActive = (currentSection?.id === section.id);
            const count = section.items?.length || 0;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{section.title}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-primary-100 text-primary-700 font-bold' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-normal">
                  ({section.sectionType})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Questions List Container ─────────────────────────── */}
      <div className="card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>{currentSection?.title || 'Assessment Questions'}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {currentSection?.sectionType || 'Questions'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentSection?.items?.length || 0} questions assigned to this section
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddQuestionsOpen(true)}
              disabled={assessment.status !== 'DRAFT'}
              className="btn-primary text-xs flex items-center gap-1.5 py-1.5 px-3 cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" /> Add Questions
            </button>
          </div>
        </div>

        {/* List of Questions in Section */}
        {(!currentSection?.items || currentSection.items.length === 0) ? (
          <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">No Questions Added Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Add questions from the question library to build your assessment.
            </p>
            {assessment.status === 'DRAFT' && (
              <button
                onClick={() => setIsAddQuestionsOpen(true)}
                className="btn-primary text-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Browse Question Library
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {currentSection.items.map((item: any, idx: number) => {
              const q = item.question || {};
              const marks = item.marksOverride ?? q.defaultMarks ?? 1;

              return (
                <div
                  key={item.id || idx}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                          {q.title || 'Untitled Question'}
                        </h4>
                        {q.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{q.description}</p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap mt-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyBadge(q.difficulty)}`}>
                            {q.difficulty || 'EASY'}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {marks} {marks === 1 ? 'Mark' : 'Marks'}
                          </span>
                          {q.category && (
                            <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                              {q.category.name || q.category}
                            </span>
                          )}
                          <span className="text-[10px] font-medium text-slate-400">
                            Type: {q.type || currentSection.sectionType}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setPreviewQuestion(q)}
                        className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
                        title="Preview Question"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {assessment.status === 'DRAFT' && (
                        <button
                          onClick={() => {
                            if (window.confirm('Remove this question from the assessment?')) {
                              removeQuestionMutation.mutate(item.id);
                            }
                          }}
                          disabled={removeQuestionMutation.isPending}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove Question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Options Preview for MCQ */}
                  {q.mcqDetail?.options && q.mcqDetail.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      {q.mcqDetail.options.map((opt: any, optIdx: number) => (
                        <div
                          key={opt.id || optIdx}
                          className={`text-xs p-2 rounded-lg border flex items-center gap-2 ${
                            opt.isCorrect
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800 font-medium'
                              : 'bg-slate-50 border-slate-100 text-slate-600'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            opt.isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="truncate">{opt.optionText}</span>
                          {opt.isCorrect && (
                            <Check className="w-3.5 h-3.5 text-emerald-600 ml-auto flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* DSA Detail Preview */}
                  {q.dsaDetail && (
                    <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 flex items-center gap-4 flex-wrap">
                      <span>
                        <strong className="text-slate-700">Test Cases:</strong> {q.dsaDetail.testCases?.length || 0}
                      </span>
                      {q.dsaDetail.supportedLanguages && (
                        <span>
                          <strong className="text-slate-700">Languages:</strong>{' '}
                          {q.dsaDetail.supportedLanguages
                            .map((sl: any) => sl.programmingLanguage?.name || sl.name || sl)
                            .join(', ')}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Add Questions Modal ─────────────────────────────── */}
      {isAddQuestionsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span>Add Questions to {currentSection?.title || 'Section'}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-100">
                    {currentSection?.sectionType || 'MCQ'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select questions from the library to append to this assessment.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddQuestionsOpen(false);
                  setSelectedQuestionIdsToAdd([]);
                }}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search questions by title or keyword..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center gap-3 flex-wrap text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Category:</span>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="border border-slate-200 rounded-lg px-2.5 py-1 bg-white text-xs text-slate-700"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Difficulty:</span>
                  <select
                    value={selectedDifficulty}
                    onChange={e => setSelectedDifficulty(e.target.value)}
                    className="border border-slate-200 rounded-lg px-2.5 py-1 bg-white text-xs text-slate-700"
                  >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {isLoadingQuestions ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-500 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin text-primary-600 mb-2" />
                  Loading questions library...
                </div>
              ) : filteredBankQuestions.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No questions match the filter criteria.
                </div>
              ) : (
                filteredBankQuestions.map(q => {
                  const isAlreadyInAssessment = existingQuestionIds.has(q.id);
                  const isSelected = selectedQuestionIdsToAdd.includes(q.id);

                  return (
                    <div
                      key={q.id}
                      onClick={() => {
                        if (!isAlreadyInAssessment) {
                          toggleSelectQuestionToAdd(q.id);
                        }
                      }}
                      className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 transition-all ${
                        isAlreadyInAssessment
                          ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                          : isSelected
                          ? 'bg-primary-50/70 border-primary-400 cursor-pointer shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={isSelected || isAlreadyInAssessment}
                          disabled={isAlreadyInAssessment}
                          onChange={() => {}}
                          className="mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-900 text-xs leading-snug">{q.title}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${difficultyBadge(q.difficulty)}`}>
                              {q.difficulty}
                            </span>
                            <span className="text-[9px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                              {q.defaultMarks || 1} Marks
                            </span>
                            {q.category && (
                              <span className="text-[9px] text-slate-500">
                                {q.category.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isAlreadyInAssessment && (
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                            Added
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewQuestion(q);
                          }}
                          className="text-slate-400 hover:text-primary-600 p-1 rounded"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-2xl">
              <span className="text-xs font-semibold text-slate-600">
                {selectedQuestionIdsToAdd.length} question(s) selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddQuestionsOpen(false);
                    setSelectedQuestionIdsToAdd([]);
                  }}
                  className="btn-secondary text-xs py-1.5 px-3 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => addQuestionsMutation.mutate()}
                  disabled={addQuestionsMutation.isPending || selectedQuestionIdsToAdd.length === 0}
                  className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {addQuestionsMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  Add Selected Questions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Assessment Details Modal ────────────────────── */}
      {isEditDetailsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Edit Assessment Info</h3>
              <button onClick={() => setIsEditDetailsOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer">×</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assessment Title *</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    min={5}
                    value={editDuration}
                    onChange={e => setEditDuration(Number(e.target.value))}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Passing Score (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editPassingScore}
                    onChange={e => setEditPassingScore(Number(e.target.value))}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    min={1}
                    value={editTotalMarks}
                    onChange={e => setEditTotalMarks(Number(e.target.value))}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instructions for Candidates</label>
                <textarea
                  rows={2}
                  value={editInstructions}
                  onChange={e => setEditInstructions(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditDetailsOpen(false)}
                className="btn-secondary text-xs py-1.5 px-3 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => updateDetailsMutation.mutate()}
                disabled={updateDetailsMutation.isPending || !editTitle.trim()}
                className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {updateDetailsMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Question Preview Modal ───────────────────────────── */}
      {previewQuestion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={() => setPreviewQuestion(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyBadge(previewQuestion.difficulty)}`}>
                  {previewQuestion.difficulty || 'EASY'}
                </span>
                <span className="ml-2 text-[10px] text-slate-500">{previewQuestion.defaultMarks || 1} marks</span>
              </div>
              <button onClick={() => setPreviewQuestion(null)} className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer">×</button>
            </div>

            <p className="text-sm font-semibold text-slate-900 mb-4 leading-relaxed">{previewQuestion.title}</p>
            {previewQuestion.description && (
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">{previewQuestion.description}</p>
            )}

            {/* Options */}
            {previewQuestion.mcqDetail?.options && (
              <div className="space-y-2">
                {previewQuestion.mcqDetail.options.map((opt: any, i: number) => (
                  <div
                    key={opt.id || i}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs ${
                      opt.isCorrect
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800 font-medium'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                      opt.isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{opt.optionText}</span>
                    {opt.isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                ))}
              </div>
            )}

            {previewQuestion.explanation && (
              <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-xs font-bold text-blue-700 mb-1">Explanation</p>
                <p className="text-xs text-blue-600 leading-relaxed">{previewQuestion.explanation}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditAssessmentPage;
