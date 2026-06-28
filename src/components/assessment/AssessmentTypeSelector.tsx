import React from 'react';
import { CheckCircle, Code2, Brain, Layers, MonitorPlay, FolderGit2 } from 'lucide-react';
import type { AssessmentType } from '../../types/assessment';

interface TypeOption {
  type: AssessmentType;
  label: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  color: string;
  bg: string;
  border: string;
}

const TYPE_OPTIONS: TypeOption[] = [
  {
    type: 'mcq',
    label: 'MCQ Assessment',
    description: 'Multiple choice questions with auto-grading and analytics.',
    icon: <CheckCircle className="w-6 h-6" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    type: 'dsa',
    label: 'DSA Assessment',
    description: 'Algorithmic coding problems with Monaco editor.',
    icon: <Code2 className="w-6 h-6" />,
    badge: 'Editor',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
  },
  {
    type: 'mixed',
    label: 'MCQ + DSA',
    description: 'Combined theoretical knowledge and coding ability evaluation.',
    icon: <Brain className="w-6 h-6" />,
    badge: 'Popular',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    type: 'live_machine_coding',
    label: 'Live Machine Coding',
    description: 'Real-time collaborative coding session with the recruiter.',
    icon: <MonitorPlay className="w-6 h-6" />,
    badge: 'Live',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
  {
    type: 'project',
    label: 'Coding Task / Project',
    description: 'Take-home assignment with flexible submission and deadline.',
    icon: <FolderGit2 className="w-6 h-6" />,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    type: 'coding',
    label: 'Coding Assessment',
    description: 'General programming challenges covering various topics.',
    icon: <Code2 className="w-6 h-6" />,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
  },
  {
    type: 'descriptive',
    label: 'Descriptive Exam',
    description: 'Long-form subjective text answers.',
    icon: <Layers className="w-6 h-6" />,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
  },
  {
    type: 'logical_reasoning',
    label: 'Logical Reasoning',
    description: 'Puzzles and aptitude tests.',
    icon: <Brain className="w-6 h-6" />,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
  {
    type: 'behavioral',
    label: 'Behavioral Test',
    description: 'Personality and culture fit assessments.',
    icon: <CheckCircle className="w-6 h-6" />,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
  },
  {
    type: 'case_study',
    label: 'Case Study',
    description: 'In-depth business or technical problem scenario.',
    icon: <FolderGit2 className="w-6 h-6" />,
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
  },
];

interface AssessmentTypeSelectorProps {
  value: AssessmentType | null;
  onChange: (type: AssessmentType) => void;
}

const AssessmentTypeSelector: React.FC<AssessmentTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {TYPE_OPTIONS.map(opt => {
        const selected = value === opt.type;
        return (
          <button
            key={opt.type}
            type="button"
            onClick={() => onChange(opt.type)}
            className={`relative text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${
              selected
                ? `${opt.border} ${opt.bg} shadow-md ring-2 ring-offset-2 ring-${opt.color.replace('text-', '')}`
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            {opt.badge && (
              <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${opt.bg} ${opt.color} border ${opt.border}`}>
                {opt.badge}
              </span>
            )}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${selected ? opt.bg : 'bg-slate-100'} ${selected ? opt.color : 'text-slate-500'} transition-colors`}>
              {opt.icon}
            </div>
            <p className={`font-semibold text-sm mb-1 ${selected ? 'text-slate-900' : 'text-slate-700'}`}>
              {opt.label}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">{opt.description}</p>
            {selected && (
              <div className={`absolute top-3 left-3 w-2.5 h-2.5 rounded-full ${opt.bg.replace('50', '500')}`} />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default AssessmentTypeSelector;
