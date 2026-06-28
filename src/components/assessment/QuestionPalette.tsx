import React from 'react';
import { CheckCircle, Circle, SkipForward, Flag } from 'lucide-react';

type QuestionStatus = 'unanswered' | 'answered' | 'skipped' | 'marked';

interface PaletteQuestion {
  id: string;
  number: number;
  status: QuestionStatus;
}

interface QuestionPaletteProps {
  questions: PaletteQuestion[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const statusConfig: Record<QuestionStatus, { bg: string; text: string; border: string }> = {
  answered: { bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-500' },
  skipped: { bg: 'bg-amber-400', text: 'text-white', border: 'border-amber-400' },
  marked: { bg: 'bg-violet-500', text: 'text-white', border: 'border-violet-500' },
  unanswered: { bg: 'bg-white', text: 'text-slate-600', border: 'border-slate-300' },
};

const QuestionPalette: React.FC<QuestionPaletteProps> = ({ questions, currentIndex, onNavigate }) => {
  const answered = questions.filter(q => q.status === 'answered').length;
  const skipped = questions.filter(q => q.status === 'skipped').length;
  const marked = questions.filter(q => q.status === 'marked').length;
  const unanswered = questions.filter(q => q.status === 'unanswered').length;

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { label: 'Answered', count: answered, color: 'bg-emerald-500' },
          { label: 'Skipped', count: skipped, color: 'bg-amber-400' },
          { label: 'Marked', count: marked, color: 'bg-violet-500' },
          { label: 'Not Visited', count: unanswered, color: 'bg-slate-300' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${item.color}`} />
            <span className="text-[10px] text-slate-600">{item.label} ({item.count})</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-1.5">
        {questions.map((q, idx) => {
          const cfg = statusConfig[q.status];
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={q.id}
              onClick={() => onNavigate(idx)}
              className={`w-9 h-9 rounded-lg text-xs font-bold border-2 transition-all hover:scale-105 ${cfg.bg} ${cfg.text} ${cfg.border} ${
                isCurrent ? 'ring-2 ring-primary-600 ring-offset-1 scale-105' : ''
              }`}
            >
              {q.number}
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
          <span>Progress</span>
          <span>{answered}/{questions.length} answered</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full bg-emerald-500 transition-all"
            style={{ width: `${(answered / questions.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionPalette;
