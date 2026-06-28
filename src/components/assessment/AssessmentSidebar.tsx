import React from 'react';
import AssessmentTimer from './AssessmentTimer';
import QuestionPalette from './QuestionPalette';
import { BookOpen, ClipboardList, Clock } from 'lucide-react';

interface SidebarQuestion {
  id: string;
  number: number;
  status: 'unanswered' | 'answered' | 'skipped' | 'marked';
}

interface AssessmentSidebarProps {
  assessmentName: string;
  totalSeconds: number;
  secondsLeft: number;
  questions: SidebarQuestion[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const AssessmentSidebar: React.FC<AssessmentSidebarProps> = ({
  assessmentName, totalSeconds, secondsLeft, questions, currentIndex, onNavigate,
}) => {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto p-4 bg-white border-r border-slate-200">
      {/* Assessment Info */}
      <div className="p-3 bg-primary-50 rounded-xl border border-primary-100">
        <div className="flex items-center gap-2 mb-1">
          <ClipboardList className="w-4 h-4 text-primary-600" />
          <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wide">Assessment</span>
        </div>
        <p className="text-sm font-bold text-slate-900 leading-tight">{assessmentName}</p>
      </div>

      {/* Timer */}
      <div className="flex justify-center">
        <AssessmentTimer secondsLeft={secondsLeft} totalSeconds={totalSeconds} />
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200" />

      {/* Question Palette */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-700">Question Palette</span>
        </div>
        <QuestionPalette
          questions={questions}
          currentIndex={currentIndex}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
};

export default AssessmentSidebar;
