import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import {
  questionApi,
  type QuestionItem,
  type QuestionType,
  type QuestionDifficulty,
  type QuestionCategory,
  type QuestionTag,
  type ProgrammingLanguage,
} from '../../services/api/question.api';
import { questionKeys } from '../../constants/queryKeys';
import { Badge } from '../../components/ui/Badge';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Code2,
  CheckSquare,
  Loader2,
  Copy,
  X,
  FileCode2,
  Layers,
  Tag,
  Cpu,
  Briefcase,
  Terminal,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

type Tab = 'QUESTIONS' | 'CATEGORIES' | 'TAGS' | 'LANGUAGES';
type QuestionTypeFilter = 'ALL' | 'MCQ' | 'DSA' | 'MACHINE_CODING' | 'PROJECT';

export default function QuestionLibraryPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const companyId = user?.companyId || user?.companies?.[0]?.companyId;

  const [activeMainTab, setActiveMainTab] = useState<Tab>('QUESTIONS');
  const [typeFilter, setTypeFilter] = useState<QuestionTypeFilter>('ALL');
  const [search, setSearch] = useState('');

  // Modals state
  const [showCreateQuestionModal, setShowCreateQuestionModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showCreateTagModal, setShowCreateTagModal] = useState(false);
  const [showCreateLanguageModal, setShowCreateLanguageModal] = useState(false);

  // New Category / Tag / Language form
  const [categoryName, setCategoryName] = useState('');
  const [tagName, setTagName] = useState('');
  const [languageName, setLanguageName] = useState('');

  // New/Edit Question Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState<QuestionType>('MCQ');
  const [newDifficulty, setNewDifficulty] = useState<QuestionDifficulty>('MEDIUM');
  const [newEstimatedTime, setNewEstimatedTime] = useState(15);
  const [newDefaultMarks, setNewDefaultMarks] = useState(10);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  // MCQ Config State
  const [mcqOptions, setMcqOptions] = useState([
    { optionText: '', displayOrder: 1, isCorrect: true },
    { optionText: '', displayOrder: 2, isCorrect: false },
    { optionText: '', displayOrder: 3, isCorrect: false },
    { optionText: '', displayOrder: 4, isCorrect: false },
  ]);

  // DSA Config State
  const [dsaStarterCode, setDsaStarterCode] = useState('function solution(input) {\n  // Write your code here\n  return output;\n}');
  const [dsaReferenceSolution, setDsaReferenceSolution] = useState('');
  const [dsaMemoryLimit, setDsaMemoryLimit] = useState(256);
  const [dsaTimeLimit, setDsaTimeLimit] = useState(2000);
  const [selectedLanguageIds, setSelectedLanguageIds] = useState<string[]>([]);
  const [testCases, setTestCases] = useState<Array<{ input: string; expectedOutput: string; type: 'SAMPLE' | 'HIDDEN'; explanation?: string; displayOrder: number }>>([
    { input: '2\n1 2', expectedOutput: '3', type: 'SAMPLE', explanation: '1 + 2 = 3', displayOrder: 1 },
    { input: '5\n10 20', expectedOutput: '30', type: 'HIDDEN', displayOrder: 2 },
  ]);

  // Machine Coding Config State
  const [repoTemplate, setRepoTemplate] = useState('');
  const [projectStructure, setProjectStructure] = useState('src/\n  components/\n  services/\n  App.tsx');
  const [techStack, setTechStack] = useState('React, TypeScript, TailwindCSS');
  const [implementationInstructions, setImplementationInstructions] = useState('');
  const [evaluationGuidelines, setEvaluationGuidelines] = useState('');

  // Project Detail State
  const [projectRequirements, setProjectRequirements] = useState('');
  const [projectSubmissionInstructions, setProjectSubmissionInstructions] = useState('');
  const [projectDeadlineHours, setProjectDeadlineHours] = useState(72);

  // ── 1. Queries ─────────────────────────────────────────────────────────────

  // Questions List Query
  const {
    data: questionData = { questions: [], total: 0 },
    isLoading: isLoadingQuestions,
    isError: isErrorQuestions,
    error: errorQuestions,
  } = useQuery({
    queryKey: questionKeys.list({
      type: typeFilter === 'ALL' ? undefined : typeFilter,
      search: search || undefined,
    }),
    queryFn: () =>
      questionApi.getQuestions({
        type: typeFilter === 'ALL' ? undefined : (typeFilter as QuestionType),
        search: search || undefined,
      }),
  });

  // Categories Query
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: questionKeys.categories,
    queryFn: () => questionApi.getCategories(),
  });

  // Tags Query
  const { data: tags = [], isLoading: isLoadingTags } = useQuery({
    queryKey: questionKeys.tags,
    queryFn: () => questionApi.getTags(),
  });

  // Languages Query
  const { data: languages = [], isLoading: isLoadingLanguages } = useQuery({
    queryKey: questionKeys.languages,
    queryFn: () => questionApi.getLanguages(),
  });

  // ── 2. Mutations ───────────────────────────────────────────────────────────

  // Create Question Mutation
  const createQuestionMutation = useMutation({
    mutationFn: () => {
      const payload: any = {
        title: newTitle.trim(),
        description: newDescription.trim(),
        type: newType,
        difficulty: newDifficulty,
        estimatedTime: Number(newEstimatedTime),
        defaultMarks: Number(newDefaultMarks),
        ownership: 'COMPANY',
        companyId: companyId || null,
        categoryId: selectedCategoryId || null,
        tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
      };

      if (newType === 'MCQ') {
        const validOptions = mcqOptions.filter(o => o.optionText.trim());
        if (validOptions.length < 2) throw new Error('At least 2 options are required for MCQ');
        if (!validOptions.some(o => o.isCorrect)) throw new Error('At least one option must be marked as correct');

        payload.mcqDetail = {
          allowMultipleCorrectAnswers: false,
          negativeMarks: 0,
          options: validOptions.map((o, idx) => ({
            optionText: o.optionText.trim(),
            displayOrder: idx + 1,
            isCorrect: o.isCorrect,
          })),
        };
      } else if (newType === 'DSA') {
        const langsToUse = selectedLanguageIds.length > 0 ? selectedLanguageIds : [languages[0]?.id].filter(Boolean);
        if (langsToUse.length === 0) throw new Error('At least one programming language is required for DSA');
        if (testCases.length === 0) throw new Error('At least one testcase is required');

        payload.dsaDetail = {
          starterCode: dsaStarterCode.trim() || '// Starter code',
          referenceSolution: dsaReferenceSolution.trim() || undefined,
          memoryLimit: Number(dsaMemoryLimit) || 256,
          timeLimit: Number(dsaTimeLimit) || 2000,
          supportedLanguageIds: langsToUse,
          testCases: testCases.map((tc, idx) => ({
            input: tc.input.trim(),
            expectedOutput: tc.expectedOutput.trim(),
            type: tc.type,
            explanation: tc.explanation?.trim() || null,
            displayOrder: idx + 1,
          })),
        };
      } else if (newType === 'MACHINE_CODING') {
        if (!implementationInstructions.trim()) throw new Error('Implementation instructions are required');
        payload.machineCodingDetail = {
          repositoryTemplate: repoTemplate.trim() || null,
          projectStructure: projectStructure.trim() || null,
          techStack: techStack.trim() || null,
          implementationInstructions: implementationInstructions.trim(),
          evaluationGuidelines: evaluationGuidelines.trim() || null,
        };
      } else if (newType === 'PROJECT') {
        if (!projectRequirements.trim()) throw new Error('Project requirements are required');
        if (!projectSubmissionInstructions.trim()) throw new Error('Submission instructions are required');
        payload.projectDetail = {
          requirements: projectRequirements.trim(),
          submissionInstructions: projectSubmissionInstructions.trim(),
          deadlineHours: Number(projectDeadlineHours) || 72,
        };
      }

      if (editingQuestionId) {
        return questionApi.updateQuestion(editingQuestionId, payload);
      }
      return questionApi.createQuestion(payload);
    },
    onSuccess: () => {
      toast.success(editingQuestionId ? 'Question updated successfully!' : 'Question added to Question Bank!');
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
      setShowCreateQuestionModal(false);
      setEditingQuestionId(null);
      resetQuestionForm();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to save question');
    },
  });

  // Delete Question Mutation
  const deleteQuestionMutation = useMutation({
    mutationFn: (id: string) => questionApi.deleteQuestion(id),
    onSuccess: () => {
      toast.success('Question deleted');
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete question');
    },
  });

  // Remove single tag from question
  const removeTagFromQuestionMutation = useMutation({
    mutationFn: ({ questionId, tagId }: { questionId: string; tagId: string }) =>
      questionApi.removeTagFromQuestion(questionId, tagId),
    onSuccess: () => {
      toast.success('Tag removed from question');
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
    },
    onError: (err: any) => toast.error(err.message || 'Failed to remove tag from question'),
  });

  // Duplicate Question Mutation
  const duplicateQuestionMutation = useMutation({
    mutationFn: (id: string) => questionApi.duplicateQuestion(id),
    onSuccess: () => {
      toast.success('Question duplicated!');
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to duplicate question');
    },
  });

  // Populate Form for Edit
  const handleEditQuestion = (q: QuestionItem) => {
    setEditingQuestionId(q.id);
    setNewTitle(q.title);
    setNewDescription(q.description);
    setNewType(q.type);
    setNewDifficulty(q.difficulty);
    setNewEstimatedTime(q.estimatedTime);
    setNewDefaultMarks(q.defaultMarks);
    setSelectedCategoryId(q.categoryId || '');
    setSelectedTagIds(q.tags?.map((t: any) => t.tagId || t.tag?.id).filter(Boolean) || []);

    if (q.type === 'MCQ' && q.mcqDetail?.options) {
      setMcqOptions(
        q.mcqDetail.options.map((o: any, idx: number) => ({
          optionText: o.optionText,
          displayOrder: o.displayOrder || idx + 1,
          isCorrect: o.isCorrect,
        }))
      );
    }

    if (q.type === 'DSA' && q.dsaDetail) {
      setDsaStarterCode(q.dsaDetail.starterCode || '');
      setDsaReferenceSolution(q.dsaDetail.referenceSolution || '');
      setDsaMemoryLimit(q.dsaDetail.memoryLimit || 256);
      setDsaTimeLimit(q.dsaDetail.timeLimit || 2000);
      setSelectedLanguageIds(q.dsaDetail.supportedLanguages?.map((sl: any) => sl.programmingLanguageId || sl.programmingLanguage?.id).filter(Boolean) || []);
      if (q.dsaDetail.testCases && q.dsaDetail.testCases.length > 0) {
        setTestCases(
          q.dsaDetail.testCases.map((tc: any, idx: number) => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            type: tc.type || 'SAMPLE',
            explanation: tc.explanation || '',
            displayOrder: tc.displayOrder || idx + 1,
          }))
        );
      }
    }

    if (q.type === 'MACHINE_CODING' && q.machineCodingDetail) {
      setRepoTemplate(q.machineCodingDetail.repositoryTemplate || '');
      setProjectStructure(q.machineCodingDetail.projectStructure || '');
      setTechStack(q.machineCodingDetail.techStack || '');
      setImplementationInstructions(q.machineCodingDetail.implementationInstructions || '');
      setEvaluationGuidelines(q.machineCodingDetail.evaluationGuidelines || '');
    }

    if (q.type === 'PROJECT' && q.projectDetail) {
      setProjectRequirements(q.projectDetail.requirements || '');
      setProjectSubmissionInstructions(q.projectDetail.submissionInstructions || '');
      setProjectDeadlineHours(q.projectDetail.deadlineHours || 72);
    }

    setShowCreateQuestionModal(true);
  };

  // Category Mutations
  const createCategoryMutation = useMutation({
    mutationFn: () => {
      if (!categoryName.trim()) throw new Error('Category name is required');
      return questionApi.createCategory({ name: categoryName.trim() });
    },
    onSuccess: () => {
      toast.success('Category created!');
      queryClient.invalidateQueries({ queryKey: questionKeys.categories });
      setCategoryName('');
      setShowCreateCategoryModal(false);
    },
    onError: (err: any) => toast.error(err.message || 'Failed to create category'),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => questionApi.deleteCategory(id),
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: questionKeys.categories });
    },
    onError: (err: any) => toast.error(err.message || 'Failed to delete category'),
  });

  // Tag Mutations
  const createTagMutation = useMutation({
    mutationFn: () => {
      if (!tagName.trim()) throw new Error('Tag name is required');
      return questionApi.createTag({ name: tagName.trim() });
    },
    onSuccess: () => {
      toast.success('Tag created!');
      queryClient.invalidateQueries({ queryKey: questionKeys.tags });
      setTagName('');
      setShowCreateTagModal(false);
    },
    onError: (err: any) => toast.error(err.message || 'Failed to create tag'),
  });

  const deleteTagMutation = useMutation({
    mutationFn: (id: string) => questionApi.deleteTag(id),
    onSuccess: () => {
      toast.success('Tag deleted');
      queryClient.invalidateQueries({ queryKey: questionKeys.tags });
    },
    onError: (err: any) => toast.error(err.message || 'Failed to delete tag'),
  });

  // Language Mutations
  const createLanguageMutation = useMutation({
    mutationFn: () => {
      if (!languageName.trim()) throw new Error('Language name is required');
      return questionApi.createLanguage({ name: languageName.trim(), isActive: true });
    },
    onSuccess: () => {
      toast.success('Programming language added!');
      queryClient.invalidateQueries({ queryKey: questionKeys.languages });
      setLanguageName('');
      setShowCreateLanguageModal(false);
    },
    onError: (err: any) => toast.error(err.message || 'Failed to add language'),
  });

  const deleteLanguageMutation = useMutation({
    mutationFn: (id: string) => questionApi.deleteLanguage(id),
    onSuccess: () => {
      toast.success('Programming language deleted');
      queryClient.invalidateQueries({ queryKey: questionKeys.languages });
    },
    onError: (err: any) => toast.error(err.message || 'Failed to delete language'),
  });

  const resetQuestionForm = () => {
    setNewTitle('');
    setNewDescription('');
    setNewType('MCQ');
    setNewDifficulty('MEDIUM');
    setNewEstimatedTime(15);
    setNewDefaultMarks(10);
    setSelectedCategoryId('');
    setSelectedTagIds([]);
    setMcqOptions([
      { optionText: '', displayOrder: 1, isCorrect: true },
      { optionText: '', displayOrder: 2, isCorrect: false },
      { optionText: '', displayOrder: 3, isCorrect: false },
      { optionText: '', displayOrder: 4, isCorrect: false },
    ]);
    setTestCases([
      { input: '2\n1 2', expectedOutput: '3', type: 'SAMPLE', explanation: '1 + 2 = 3', displayOrder: 1 },
      { input: '5\n10 20', expectedOutput: '30', type: 'HIDDEN', displayOrder: 2 },
    ]);
    setRepoTemplate('');
    setImplementationInstructions('');
    setProjectRequirements('');
    setProjectSubmissionInstructions('');
  };

  const questionsList = questionData.questions || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Question Bank & Assets</h1>
          <p className="text-sm text-slate-500 mt-1">
            Build and manage reusable MCQs, DSA problems, test cases, machine coding challenges, categories, and tags.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {activeMainTab === 'QUESTIONS' && (
            <button
              onClick={() => setShowCreateQuestionModal(true)}
              className="btn-primary text-sm flex items-center gap-2 px-4 py-2.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Question
            </button>
          )}
          {activeMainTab === 'CATEGORIES' && (
            <button
              onClick={() => setShowCreateCategoryModal(true)}
              className="btn-primary text-sm flex items-center gap-2 px-4 py-2.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          )}
          {activeMainTab === 'TAGS' && (
            <button
              onClick={() => setShowCreateTagModal(true)}
              className="btn-primary text-sm flex items-center gap-2 px-4 py-2.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Tag
            </button>
          )}
          {activeMainTab === 'LANGUAGES' && (
            <button
              onClick={() => setShowCreateLanguageModal(true)}
              className="btn-primary text-sm flex items-center gap-2 px-4 py-2.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Language
            </button>
          )}
        </div>
      </div>

      {/* Main Top Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-8">
        {[
          { id: 'QUESTIONS', label: 'Questions', icon: FileCode2, count: questionsList.length },
          { id: 'CATEGORIES', label: 'Categories', icon: Layers, count: categories.length },
          { id: 'TAGS', label: 'Question Tags', icon: Tag, count: tags.length },
          { id: 'LANGUAGES', label: 'Languages', icon: Terminal, count: languages.length },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeMainTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMainTab(tab.id as Tab)}
              className={`flex items-center gap-2 pb-3 px-1 border-b-2 transition-colors cursor-pointer text-sm font-medium ${
                isActive
                  ? 'border-primary-600 text-primary-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: QUESTIONS ──────────────────────────────────────────────── */}
      {activeMainTab === 'QUESTIONS' && (
        <div className="space-y-4">
          {/* Sub-Filters & Search */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              {(['ALL', 'MCQ', 'DSA', 'MACHINE_CODING', 'PROJECT'] as QuestionTypeFilter[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                    typeFilter === t
                      ? 'bg-primary-600 text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t === 'ALL' ? 'All Types' : t.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="relative min-w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className="input-field pl-9 text-xs"
                placeholder="Search questions by title or keyword..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Question List */}
          {isLoadingQuestions ? (
            <div className="card p-12 text-center text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600 mb-3" />
              <p className="text-sm font-medium">Loading questions...</p>
            </div>
          ) : isErrorQuestions ? (
            <div className="card p-8 text-center text-red-500 border-red-200 bg-red-50/50">
              <p className="text-sm font-semibold">Failed to load questions</p>
              <p className="text-xs text-red-400 mt-1">{(errorQuestions as any)?.message || 'Check connection'}</p>
            </div>
          ) : questionsList.length === 0 ? (
            <div className="card p-12 text-center">
              <FileCode2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-700 font-semibold">No questions found</p>
              <p className="text-sm text-slate-500 mt-1">Create custom questions or explore predefined question sets.</p>
              <button
                onClick={() => setShowCreateQuestionModal(true)}
                className="btn-primary text-sm mt-4 inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Question
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {questionsList.map(q => (
                <div key={q.id} className="card p-4.5 hover:shadow-xs transition-shadow flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 flex-shrink-0 mt-0.5">
                    {q.type === 'MCQ' && <CheckSquare className="w-5 h-5 text-blue-600" />}
                    {q.type === 'DSA' && <Code2 className="w-5 h-5 text-emerald-600" />}
                    {q.type === 'MACHINE_CODING' && <Cpu className="w-5 h-5 text-purple-600" />}
                    {q.type === 'PROJECT' && <Briefcase className="w-5 h-5 text-amber-600" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-slate-900">{q.title}</h3>
                      <Badge
                        variant={
                          q.type === 'MCQ'
                            ? 'info'
                            : q.type === 'DSA'
                            ? 'success'
                            : q.type === 'MACHINE_CODING'
                            ? 'purple'
                            : 'warning'
                        }
                      >
                        {q.type.replace('_', ' ')}
                      </Badge>
                      <Badge
                        variant={
                          q.difficulty === 'HARD'
                            ? 'danger'
                            : q.difficulty === 'MEDIUM'
                            ? 'warning'
                            : 'default'
                        }
                      >
                        {q.difficulty}
                      </Badge>
                      {q.status === 'DRAFT' && <Badge variant="warning">Draft</Badge>}
                    </div>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{q.description}</p>

                    {/* MCQ Options Preview */}
                    {q.mcqDetail?.options && (
                      <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-100">
                        {q.mcqDetail.options.map((opt, i) => (
                          <span
                            key={i}
                            className={`text-[11px] px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                              opt.isCorrect
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            {opt.isCorrect && <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />}
                            <span>{opt.optionText}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* DSA Testcases Preview */}
                    {q.dsaDetail && (
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">
                          {q.dsaDetail.testCases?.length || 0} Testcases ({q.dsaDetail.testCases?.filter(t => t.type === 'SAMPLE').length || 0} Public)
                        </span>
                        <span>Memory: {q.dsaDetail.memoryLimit}MB</span>
                        <span>Timeout: {q.dsaDetail.timeLimit}ms</span>
                      </div>
                    )}

                    {/* Machine Coding Preview */}
                    {q.machineCodingDetail && (
                      <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <p><span className="font-semibold text-slate-700">Tech Stack:</span> {q.machineCodingDetail.techStack || 'Any'}</p>
                        {q.machineCodingDetail.repositoryTemplate && (
                          <p className="truncate text-primary-600">Template: {q.machineCodingDetail.repositoryTemplate}</p>
                        )}
                      </div>
                    )}

                    {/* Project Detail Preview */}
                    {q.projectDetail && (
                      <div className="mt-2 text-xs text-slate-500 flex gap-4">
                        <span>Deadline: {q.projectDetail.deadlineHours} Hours</span>
                      </div>
                    )}

                    {/* Tags preview with individual tag remove buttons */}
                    {q.tags && q.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {q.tags.map((tMap: any) => {
                          const tagObj = tMap.tag || tMap;
                          const tagId = tMap.tagId || tagObj.id;
                          return (
                            <span
                              key={tagId}
                              className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200"
                            >
                              <Tag className="w-2.5 h-2.5 text-primary-500" />
                              {tagObj.name || 'Tag'}
                              <button
                                type="button"
                                title="Remove tag from question"
                                onClick={() => removeTagFromQuestionMutation.mutate({ questionId: q.id, tagId })}
                                className="text-slate-400 hover:text-red-500 ml-0.5 cursor-pointer"
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-2.5 text-xs text-slate-400">
                      <span>Marks: {q.defaultMarks}</span>
                      <span>Est. Time: {q.estimatedTime}m</span>
                      {q.category && <span>Category: {q.category.name}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      title="Edit Question"
                      onClick={() => handleEditQuestion(q)}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary-600 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Duplicate Question"
                      onClick={() => duplicateQuestionMutation.mutate(q.id)}
                      disabled={duplicateQuestionMutation.isPending}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Delete Question"
                      onClick={() => {
                        if (window.confirm(`Delete question "${q.title}"?`)) {
                          deleteQuestionMutation.mutate(q.id);
                        }
                      }}
                      disabled={deleteQuestionMutation.isPending}
                      className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: CATEGORIES ────────────────────────────────────────────── */}
      {activeMainTab === 'CATEGORIES' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((c: QuestionCategory) => (
              <div key={c.id} className="card p-4 flex items-center justify-between hover:shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{c.name}</h4>
                    <p className="text-[11px] text-slate-400">Category</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete category "${c.name}"?`)) {
                      deleteCategoryMutation.mutate(c.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 3: TAGS ──────────────────────────────────────────────────── */}
      {activeMainTab === 'TAGS' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2.5">
            {tags.map((t: QuestionTag) => (
              <div
                key={t.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-slate-300"
              >
                <Tag className="w-3.5 h-3.5 text-primary-600" />
                <span className="text-xs font-semibold text-slate-800">{t.name}</span>
                <button
                  type="button"
                  onClick={() => deleteTagMutation.mutate(t.id)}
                  className="text-slate-400 hover:text-red-600 ml-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 4: LANGUAGES ─────────────────────────────────────────────── */}
      {activeMainTab === 'LANGUAGES' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {languages.map((l: ProgrammingLanguage) => (
              <div key={l.id} className="card p-4 flex items-center justify-between hover:shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{l.name}</h4>
                    <span className="text-[10px] text-emerald-600 font-medium">Active Runtime</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete language "${l.name}"?`)) {
                      deleteLanguageMutation.mutate(l.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── MODAL: CREATE / EDIT QUESTION ────────────────────────────────────────── */}
      {showCreateQuestionModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display font-bold text-slate-900 text-base">
                {editingQuestionId ? 'Edit Question' : 'Add New Question'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowCreateQuestionModal(false);
                  setEditingQuestionId(null);
                  resetQuestionForm();
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Question Title <span className="text-red-500">*</span>
                </label>
                <input
                  className="input-field text-sm"
                  placeholder="e.g. Implement LRU Cache / React Memoization"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    className="input-field text-xs"
                    value={newType}
                    onChange={e => setNewType(e.target.value as QuestionType)}
                  >
                    <option value="MCQ">MCQ</option>
                    <option value="DSA">DSA Coding</option>
                    <option value="MACHINE_CODING">Machine Coding</option>
                    <option value="PROJECT">Project Assessment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select
                    className="input-field text-xs"
                    value={newDifficulty}
                    onChange={e => setNewDifficulty(e.target.value as QuestionDifficulty)}
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Est. Minutes</label>
                  <input
                    type="number"
                    className="input-field text-xs"
                    value={newEstimatedTime}
                    onChange={e => setNewEstimatedTime(Number(e.target.value))}
                    min={1}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Marks</label>
                  <input
                    type="number"
                    className="input-field text-xs"
                    value={newDefaultMarks}
                    onChange={e => setNewDefaultMarks(Number(e.target.value))}
                    min={1}
                  />
                </div>
              </div>

              {/* Category & Tags Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    className="input-field text-xs"
                    value={selectedCategoryId}
                    onChange={e => setSelectedCategoryId(e.target.value)}
                  >
                    <option value="">No Category</option>
                    {categories.map((c: QuestionCategory) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Attach Tags</label>
                  <select
                    className="input-field text-xs"
                    onChange={e => {
                      const val = e.target.value;
                      if (val && !selectedTagIds.includes(val)) {
                        setSelectedTagIds(prev => [...prev, val]);
                      }
                    }}
                  >
                    <option value="">Select tag to add...</option>
                    {tags.map((t: QuestionTag) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {selectedTagIds.map(tid => {
                      const tObj = tags.find((t: QuestionTag) => t.id === tid);
                      return (
                        <span key={tid} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          {tObj?.name || tid}
                          <button
                            type="button"
                            onClick={() => setSelectedTagIds(prev => prev.filter(id => id !== tid))}
                            className="text-slate-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Problem Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="input-field text-xs h-24 resize-none"
                  placeholder="Detailed instructions, requirements, constraints..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                />
              </div>

              {/* 1. MCQ Form Fields */}
              {newType === 'MCQ' && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-semibold text-slate-700">
                    MCQ Options (Check the correct answer)
                  </label>
                  {mcqOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={opt.isCorrect}
                        onChange={() => {
                          setMcqOptions(opts =>
                            opts.map((o, i) => ({ ...o, isCorrect: i === idx }))
                          );
                        }}
                        className="text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                      <input
                        className="input-field text-xs flex-1"
                        placeholder={`Option ${idx + 1}`}
                        value={opt.optionText}
                        onChange={e => {
                          const val = e.target.value;
                          setMcqOptions(opts =>
                            opts.map((o, i) => (i === idx ? { ...o, optionText: val } : o))
                          );
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 2. DSA Coding Form Fields */}
              {newType === 'DSA' && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">
                      Test Cases ({testCases.length}) <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setTestCases(prev => [
                          ...prev,
                          {
                            input: '',
                            expectedOutput: '',
                            type: 'HIDDEN',
                            displayOrder: prev.length + 1,
                          },
                        ]);
                      }}
                      className="text-xs text-primary-600 hover:text-primary-700 font-semibold cursor-pointer"
                    >
                      + Add Test Case
                    </button>
                  </div>

                  {testCases.map((tc, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-700">Case #{idx + 1}</span>
                        <div className="flex items-center gap-2">
                          <select
                            className="input-field text-[11px] py-1"
                            value={tc.type}
                            onChange={e => {
                              const val = e.target.value as 'SAMPLE' | 'HIDDEN';
                              setTestCases(prev => prev.map((item, i) => i === idx ? { ...item, type: val } : item));
                            }}
                          >
                            <option value="SAMPLE">Sample (Visible)</option>
                            <option value="HIDDEN">Hidden</option>
                          </select>
                          {testCases.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setTestCases(prev => prev.filter((_, i) => i !== idx))}
                              className="text-slate-400 hover:text-red-600 p-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-0.5">Input</label>
                          <textarea
                            className="input-field text-xs h-14 font-mono resize-none"
                            placeholder="Input args"
                            value={tc.input}
                            onChange={e => {
                              const val = e.target.value;
                              setTestCases(prev => prev.map((item, i) => i === idx ? { ...item, input: val } : item));
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-0.5">Expected Output</label>
                          <textarea
                            className="input-field text-xs h-14 font-mono resize-none"
                            placeholder="Expected return"
                            value={tc.expectedOutput}
                            onChange={e => {
                              const val = e.target.value;
                              setTestCases(prev => prev.map((item, i) => i === idx ? { ...item, expectedOutput: val } : item));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Starter Code</label>
                    <textarea
                      className="input-field text-xs h-20 font-mono resize-none"
                      value={dsaStarterCode}
                      onChange={e => setDsaStarterCode(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* 3. Machine Coding Form Fields */}
              {newType === 'MACHINE_CODING' && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Tech Stack</label>
                      <input
                        className="input-field text-xs"
                        placeholder="e.g. Node.js, Express, Redis"
                        value={techStack}
                        onChange={e => setTechStack(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Repo Template URL</label>
                      <input
                        className="input-field text-xs"
                        placeholder="https://github.com/org/template"
                        value={repoTemplate}
                        onChange={e => setRepoTemplate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Implementation Instructions <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="input-field text-xs h-20 resize-none"
                      placeholder="Step by step coding requirements, endpoints, state management..."
                      value={implementationInstructions}
                      onChange={e => setImplementationInstructions(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* 4. Project Assessment Form Fields */}
              {newType === 'PROJECT' && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Project Requirements <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="input-field text-xs h-20 resize-none"
                      placeholder="Deliverables, features to build, design specs..."
                      value={projectRequirements}
                      onChange={e => setProjectRequirements(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Submission Instructions <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="input-field text-xs"
                        placeholder="e.g. Submit GitHub Repo link & live deployment"
                        value={projectSubmissionInstructions}
                        onChange={e => setProjectSubmissionInstructions(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Deadline (Hours)</label>
                      <input
                        type="number"
                        className="input-field text-xs"
                        value={projectDeadlineHours}
                        onChange={e => setProjectDeadlineHours(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowCreateQuestionModal(false);
                  setEditingQuestionId(null);
                  resetQuestionForm();
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => createQuestionMutation.mutate()}
                disabled={createQuestionMutation.isPending || !newTitle.trim() || !newDescription.trim()}
                className="btn-primary text-xs flex items-center gap-1.5 px-4 py-2 cursor-pointer"
              >
                {createQuestionMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {editingQuestionId ? 'Update Question' : 'Save to Question Bank'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: CREATE CATEGORY ────────────────────────────────────────── */}
      {showCreateCategoryModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl border border-slate-100">
            <h3 className="font-display font-bold text-slate-900 text-sm">Add Category</h3>
            <input
              className="input-field text-xs"
              placeholder="e.g. Data Structures, System Design"
              value={categoryName}
              onChange={e => setCategoryName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateCategoryModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => createCategoryMutation.mutate()}
                disabled={createCategoryMutation.isPending || !categoryName.trim()}
                className="btn-primary text-xs px-3 py-1.5"
              >
                {createCategoryMutation.isPending && <Loader2 className="w-3 h-3 animate-spin mr-1 inline" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: CREATE TAG ────────────────────────────────────────────── */}
      {showCreateTagModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl border border-slate-100">
            <h3 className="font-display font-bold text-slate-900 text-sm">Add Question Tag</h3>
            <input
              className="input-field text-xs"
              placeholder="e.g. React, Docker, Binary Search"
              value={tagName}
              onChange={e => setTagName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateTagModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => createTagMutation.mutate()}
                disabled={createTagMutation.isPending || !tagName.trim()}
                className="btn-primary text-xs px-3 py-1.5"
              >
                {createTagMutation.isPending && <Loader2 className="w-3 h-3 animate-spin mr-1 inline" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: CREATE LANGUAGE ───────────────────────────────────────── */}
      {showCreateLanguageModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl border border-slate-100">
            <h3 className="font-display font-bold text-slate-900 text-sm">Add Programming Language</h3>
            <input
              className="input-field text-xs"
              placeholder="e.g. Python, Go, Java, Rust"
              value={languageName}
              onChange={e => setLanguageName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateLanguageModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => createLanguageMutation.mutate()}
                disabled={createLanguageMutation.isPending || !languageName.trim()}
                className="btn-primary text-xs px-3 py-1.5"
              >
                {createLanguageMutation.isPending && <Loader2 className="w-3 h-3 animate-spin mr-1 inline" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
