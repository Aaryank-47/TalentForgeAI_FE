import React from 'react';
import { Eye, Plus, Check, Clock, Zap } from 'lucide-react';
import type { DSAProblem } from '../../types/assessment';

const difficultyConfig = (d: string) =>
  d === 'Easy'
    ? { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' }
    : d === 'Medium'
    ? { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' }
    : { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };

interface ProblemCardProps {
  problem: DSAProblem;
  selected: boolean;
  onSelect: (id: string) => void;
  onPreview: (p: DSAProblem) => void;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, selected, onSelect, onPreview }) => {
  const diff = difficultyConfig(problem.difficulty);

  return (
    <div className={`rounded-xl border p-4 transition-all ${
      selected
        ? 'border-violet-300 bg-violet-50/50 shadow-sm'
        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
    }`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
          selected ? 'bg-violet-100' : 'bg-slate-100'
        }`}>
          <Zap className={`w-4 h-4 ${selected ? 'text-violet-600' : 'text-slate-500'}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900">{problem.title}</p>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diff.bg} ${diff.color} ${diff.border}`}>
              {problem.difficulty}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {problem.category}
            </span>
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {problem.timeLimit}
            </span>
            <span className="text-[10px] text-slate-500">
              {problem.points} pts
            </span>
          </div>

          <div className="flex items-center gap-1 mt-1.5">
            {problem.supportedLanguages.slice(0, 3).map(lang => (
              <span key={lang} className="text-[9px] text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded capitalize">
                {lang}
              </span>
            ))}
            {problem.supportedLanguages.length > 3 && (
              <span className="text-[9px] text-slate-400">+{problem.supportedLanguages.length - 3}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => onPreview(problem)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-colors"
            title="Preview problem"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onSelect(problem.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              selected
                ? 'bg-violet-100 text-violet-600 hover:bg-red-50 hover:text-red-500'
                : 'hover:bg-violet-50 text-slate-400 hover:text-violet-600'
            }`}
            title={selected ? 'Remove problem' : 'Add problem'}
          >
            {selected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemCard;
