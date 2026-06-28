import React, { useState } from 'react';
import { Search, Filter, CheckSquare } from 'lucide-react';
import QuestionCard from './QuestionCard';
import type { MCQQuestion } from '../../types/assessment';

interface MCQPreviewModalProps {
  question: MCQQuestion | null;
  onClose: () => void;
}

const MCQPreviewModal: React.FC<MCQPreviewModalProps> = ({ question, onClose }) => {
  if (!question) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100">
              {question.category}
            </span>
            <span className="ml-2 text-[10px] text-slate-500">{question.difficulty} • {question.marks} marks</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">×</button>
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
  questions: MCQQuestion[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  categories: string[];
}

const QuestionBank: React.FC<QuestionBankProps> = ({ questions, selectedIds, onToggle, categories }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [previewQuestion, setPreviewQuestion] = useState<MCQQuestion | null>(null);

  const filtered = questions.filter(q => {
    const matchSearch = q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All' || q.category === selectedCategory;
    const matchDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return matchSearch && matchCat && matchDiff;
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions..."
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
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
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

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-primary-50 rounded-lg border border-primary-200">
            <CheckSquare className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">{selectedIds.length} selected</span>
          </div>
        )}
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {['All', ...categories].map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
              selectedCategory === cat
                ? 'bg-primary-600 text-white border-primary-600'
                : 'border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600 bg-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results info */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Showing {filtered.length} of {questions.length} questions</span>
        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={() => selectedIds.forEach(id => onToggle(id))}
            className="text-red-500 hover:text-red-700 font-medium"
          >
            Clear selection
          </button>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Filter className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No questions match your filters</p>
          </div>
        ) : (
          filtered.map(q => (
            <QuestionCard
              key={q.id}
              question={q}
              selected={selectedIds.includes(q.id)}
              onSelect={onToggle}
              onPreview={setPreviewQuestion}
            />
          ))
        )}
      </div>

      {/* Preview Modal */}
      <MCQPreviewModal question={previewQuestion} onClose={() => setPreviewQuestion(null)} />
    </div>
  );
};

export default QuestionBank;
