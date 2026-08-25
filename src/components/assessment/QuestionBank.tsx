import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { Search, Loader2 } from 'lucide-react';
import QuestionCard from './QuestionCard';
import { questionApi, type QuestionItem, type QuestionCategory, type QuestionTag } from '../../services/api/question.api';
import { questionKeys } from '../../constants/queryKeys';
import type { MCQQuestion } from '../../types/assessment';

interface MCQPreviewModalProps {
  question: MCQQuestion | null;
  onClose: () => void;
}

const MCQPreviewModal: React.FC<MCQPreviewModalProps> = ({ question, onClose }) => {
  if (!question) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100">
              {question.category}
            </span>
            <span className="ml-2 text-[10px] text-slate-500">{question.difficulty} • {question.marks} marks</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer">×</button>
        </div>

        <p className="text-base font-semibold text-slate-900 mb-4 leading-relaxed">{question.question}</p>

        <div className="space-y-2">
          {question.options.map((opt, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border text-sm ${
              i === question.correctAnswer
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800 font-medium'
                : 'border-slate-200 bg-slate-50 text-slate-700'
            }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                i === question.correctAnswer ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </div>
          ))}
        </div>

        {question.explanation && (
          <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-xs font-bold text-blue-700 mb-1">Explanation</p>
            <p className="text-xs text-blue-600 leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface QuestionBankProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

const QuestionBank: React.FC<QuestionBankProps> = ({ selectedIds, onToggle }) => {
  const { user } = useAuth();
  const companyId = user?.companyId || user?.companies?.[0]?.companyId;

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [previewQuestion, setPreviewQuestion] = useState<MCQQuestion | null>(null);

  // 1. Fetch Real MCQ Questions from API (Company + Global)
  const { data: questionsData, isLoading: isLoadingQuestions } = useQuery({
    queryKey: questionKeys.list({ type: 'MCQ', search: search || undefined, companyId }),
    queryFn: () => questionApi.getQuestions({ type: 'MCQ', search: search || undefined, companyId }),
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

  // Map API QuestionItem -> MCQQuestion format for UI
  const mappedQuestions: MCQQuestion[] = rawQuestions.map((q) => {
    const correctIdx = q.mcqDetail?.options?.findIndex(o => o.isCorrect) ?? 0;
    const optTexts = q.mcqDetail?.options?.map(o => o.optionText) || [];
    return {
      id: q.id,
      question: q.title,
      options: optTexts,
      correctAnswer: correctIdx >= 0 ? correctIdx : 0,
      category: q.category?.name || 'General',
      difficulty: (q.difficulty.charAt(0) + q.difficulty.slice(1).toLowerCase()) as 'Easy' | 'Medium' | 'Hard',
      marks: q.defaultMarks || 1,
      explanation: q.description || undefined,
      tags: q.tags?.map((t: any) => t.tag?.name || t.name).filter(Boolean) || [],
    };
  });

  // Filter questions based on Category, Tag, Difficulty, and Search
  const filtered = mappedQuestions.filter(q => {
    const matchSearch = q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All' || q.category === selectedCategory;
    const matchTag = selectedTag === 'All' || (q.tags && q.tags.includes(selectedTag));
    const matchDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return matchSearch && matchCat && matchTag && matchDiff;
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          />
        </div>

        {/* Categories Dropdown */}
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

        {/* Difficulties Dropdown */}
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
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => setSelectedTag('All')}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
              selectedTag === 'All'
                ? 'bg-primary-600 text-white border-primary-600'
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
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      <div className="text-xs text-slate-500 font-medium">
        Showing {filtered.length} of {mappedQuestions.length} questions
      </div>

      {/* Questions List */}
      {isLoadingQuestions ? (
        <div className="p-8 text-center text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-600 mb-2" />
          <p className="text-xs font-medium">Loading questions from Question Bank...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50">
          <p className="text-sm font-semibold text-slate-700">No questions found</p>
          <p className="text-xs text-slate-500 mt-0.5">Try changing filters or add new questions in the Question Bank.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {filtered.map(q => (
            <QuestionCard
              key={q.id}
              question={q}
              selected={selectedIds.includes(q.id)}
              onSelect={onToggle}
              onPreview={setPreviewQuestion}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <MCQPreviewModal
        question={previewQuestion}
        onClose={() => setPreviewQuestion(null)}
      />
    </div>
  );
};

export default QuestionBank;
