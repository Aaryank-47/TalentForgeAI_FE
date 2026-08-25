import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { Hash, Clock, Percent, Search, Loader2 } from 'lucide-react';
import ProblemCard from './ProblemCard';
import DSAProblemModal from './DSAProblemModal';
import { questionApi, type QuestionItem, type QuestionCategory, type QuestionTag } from '../../services/api/question.api';
import { questionKeys } from '../../constants/queryKeys';
import type { DSAConfig, DSAProblem } from '../../types/assessment';

interface DSABuilderProps {
  config: DSAConfig;
  onChange: (config: DSAConfig) => void;
}

const DSABuilder: React.FC<DSABuilderProps> = ({ config, onChange }) => {
  const { user } = useAuth();
  const companyId = user?.companyId || user?.companies?.[0]?.companyId;

  const [previewProblem, setPreviewProblem] = useState<DSAProblem | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const set = <K extends keyof DSAConfig>(key: K, val: DSAConfig[K]) =>
    onChange({ ...config, [key]: val });

  const toggleProblem = (id: string) => {
    const ids = config.selectedProblemIds.includes(id)
      ? config.selectedProblemIds.filter(p => p !== id)
      : [...config.selectedProblemIds, id];
    onChange({ ...config, selectedProblemIds: ids });
  };

  // 1. Fetch Real DSA Questions from API (Company + Global)
  const { data: questionsData, isLoading: isLoadingQuestions } = useQuery({
    queryKey: questionKeys.list({ type: 'DSA', search: search || undefined, companyId }),
    queryFn: () => questionApi.getQuestions({
      type: 'DSA',
      search: search || undefined,
      companyId
    }),
  });

  // 2. Fetch Categories from API
  const { data: categories = [] } = useQuery({
    queryKey: questionKeys.categories,
    queryFn: () => questionApi.getCategories(),
  });

  // 3. Fetch Tags from API
  const { data: tags = [] } = useQuery({
    queryKey: questionKeys.tags,
    queryFn: () => questionApi.getTags(),
  });

  const rawQuestions: QuestionItem[] = questionsData?.questions || [];

  // Map API QuestionItem -> DSAProblem format for UI
  const mappedProblems: DSAProblem[] = rawQuestions.map((q) => {
    const supportedLangs =
      q.dsaDetail?.supportedLanguages?.map(
        (sl: any) => sl.programmingLanguage?.name || sl.name || 'javascript'
      ) || ['JavaScript', 'Python', 'Java', 'C++'];

    const sampleCases =
      q.dsaDetail?.testCases
        ?.filter((tc) => tc.type === 'SAMPLE')
        .map((tc) => ({
          input: tc.input,
          output: tc.expectedOutput,
          explanation: tc.explanation || undefined,
        })) || [];

    const hiddenCases =
      q.dsaDetail?.testCases
        ?.filter((tc) => tc.type !== 'SAMPLE')
        .map((tc) => ({
          input: tc.input,
          output: tc.expectedOutput,
          explanation: tc.explanation || undefined,
          isHidden: true,
        })) || [];

    const examples =
      sampleCases.length > 0
        ? sampleCases
        : q.dsaDetail?.testCases?.map((tc) => ({
            input: tc.input,
            output: tc.expectedOutput,
            explanation: tc.explanation || undefined,
          })) || [];

    return {
      id: q.id,
      title: q.title,
      statement: q.description || '',
      difficulty: (q.difficulty.charAt(0) + q.difficulty.slice(1).toLowerCase()) as 'Easy' | 'Medium' | 'Hard',
      category: q.category?.name || 'Algorithms',
      timeLimit: `${q.estimatedTime || 30} min`,
      memoryLimit: q.dsaDetail?.memoryLimit ? `${q.dsaDetail.memoryLimit} MB` : '256 MB',
      points: q.defaultMarks || 10,
      constraints: [],
      examples,
      hiddenTestCases: hiddenCases,
      supportedLanguages: supportedLangs,
      starterCode: q.dsaDetail?.starterCode
        ? { javascript: q.dsaDetail.starterCode }
        : { javascript: '// Write your solution here' },
      tags: q.tags?.map((t: any) => t.tag?.name || t.name).filter(Boolean) || [],
    };
  });

  const filtered = mappedProblems.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchTag = selectedTag === 'All' || (p.tags && p.tags.includes(selectedTag));
    const matchDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    return matchSearch && matchCat && matchTag && matchDiff;
  });

  const totalMarks = config.selectedProblemIds.length * config.marksPerQuestion;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Problems Selected', value: config.selectedProblemIds.length, color: 'bg-violet-50', textColor: 'text-violet-600' },
          { label: 'Marks/Problem', value: config.marksPerQuestion, color: 'bg-blue-50', textColor: 'text-blue-600' },
          { label: 'Total Marks', value: totalMarks, color: 'bg-emerald-50', textColor: 'text-emerald-600' },
          { label: 'Total Duration', value: `${config.totalDuration} min`, color: 'bg-amber-50', textColor: 'text-amber-600' },
        ].map(item => (
          <div key={item.label} className={`${item.color} rounded-xl p-3`}>
            <p className="text-2xl font-display font-bold text-slate-900">{item.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Config */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4">DSA Configuration</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Marks per Problem</label>
            <input
              type="number"
              min={1}
              value={config.marksPerQuestion}
              onChange={e => set('marksPerQuestion', Number(e.target.value))}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Total Duration (min)</label>
            <input
              type="number"
              min={30}
              value={config.totalDuration}
              onChange={e => set('totalDuration', Number(e.target.value))}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Passing Score (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={config.passingScore}
              onChange={e => set('passingScore', Number(e.target.value))}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Problem Bank */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Problem Bank</h3>
          <span className="text-xs text-slate-500">{config.selectedProblemIds.length} problems selected</span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="relative flex-1 min-w-40">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search problems by title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-slate-700"
          >
            <option value="All">All Categories</option>
            {categories.map((c: QuestionCategory) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-slate-700"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Question Tag Chips from DB */}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            <button
              type="button"
              onClick={() => setSelectedTag('All')}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                selectedTag === 'All'
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Tags
            </button>
            {tags.map((t: QuestionTag) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTag(selectedTag === t.name ? 'All' : t.name)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                  selectedTag === t.name
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        )}

        <div className="text-xs text-slate-500 font-medium mb-3">
          Showing {filtered.length} of {mappedProblems.length} problems
        </div>

        {/* Problems List */}
        {isLoadingQuestions ? (
          <div className="p-8 text-center text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-violet-600 mb-2" />
            <p className="text-xs font-medium">Loading problems from Question Bank...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50">
            <p className="text-sm font-semibold text-slate-700">No DSA problems found</p>
            <p className="text-xs text-slate-500 mt-0.5">Try changing filters or add coding questions to your Question Bank.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {filtered.map(problem => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                selected={config.selectedProblemIds.includes(problem.id)}
                onSelect={toggleProblem}
                onPreview={setPreviewProblem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Problem Modal */}
      {previewProblem && (
        <DSAProblemModal
          problem={previewProblem}
          onClose={() => setPreviewProblem(null)}
        />
      )}
    </div>
  );
};

export default DSABuilder;
