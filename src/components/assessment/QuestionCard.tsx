import React from 'react';
import { Check, Eye, HelpCircle } from 'lucide-react';
import type { MCQQuestion } from '../../types/assessment';

interface QuestionCardProps {
  question: MCQQuestion;
  selected: boolean;
  onSelect: (id: string) => void;
  onPreview: (question: MCQQuestion) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selected,
  onSelect,
  onPreview,
}) => {
  return (
    <div
      onClick={() => onSelect(question.id)}
      className={`group relative flex items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
        selected
          ? 'bg-primary-50/50 border-primary-200 shadow-sm'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* Checkbox Indicator */}
        <div
          className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-all ${
            selected
              ? 'bg-primary-600 border-primary-600 text-white'
              : 'border-slate-300 group-hover:border-slate-400'
          }`}
        >
          {selected && <Check className="w-3 h-3 stroke-[3]" />}
        </div>

        {/* Question Info */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="text-xs font-semibold text-slate-800 line-clamp-2 leading-relaxed pr-8">
            {question.question}
          </p>

          <div className="flex items-center gap-2 flex-wrap text-[10px]">
            <span className="font-bold text-primary-600 bg-primary-50 border border-primary-100 px-1.5 py-0.5 rounded">
              {question.category}
            </span>
            <span className={`font-semibold px-1.5 py-0.5 rounded ${
              question.difficulty === 'Easy'
                ? 'bg-emerald-50 text-emerald-700'
                : question.difficulty === 'Medium'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-rose-50 text-rose-700'
            }`}>
              {question.difficulty}
            </span>
            <span className="text-slate-400">
              {question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPreview(question);
          }}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          title="Preview Question"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
