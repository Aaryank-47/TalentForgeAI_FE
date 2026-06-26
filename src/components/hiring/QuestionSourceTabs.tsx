import { useState } from 'react';
import type { InterviewQuestion, QuestionSource } from '../../types/hiring';
import { ManualQuestionsEditor } from './ManualQuestionsEditor';
import { QuestionLibraryPicker } from './QuestionLibraryPicker';
import { AIQuestionGenerator } from './AIQuestionGenerator';
import { PenLine, Library, Sparkles } from 'lucide-react';

interface QuestionSourceTabsProps {
  source: QuestionSource;
  onSourceChange: (source: QuestionSource) => void;
  questions: InterviewQuestion[];
  onQuestionsChange: (questions: InterviewQuestion[]) => void;
  libraryQuestionIds: string[];
  onLibraryIdsChange: (ids: string[]) => void;
  jobRole?: string;
  experienceLevel?: string;
  skills?: string[];
}

const tabs: { id: QuestionSource; label: string; icon: React.ElementType; description: string; recommended?: boolean }[] = [
  { id: 'manual', label: 'Manual Questions', icon: PenLine, description: 'Write all questions manually' },
  { id: 'library', label: 'Question Library', icon: Library, description: 'Select from company question bank' },
  { id: 'ai_generated', label: 'AI Generation', icon: Sparkles, description: 'Auto-generate based on role & skills', recommended: true },
];

export function QuestionSourceTabs({
  source,
  onSourceChange,
  questions,
  onQuestionsChange,
  libraryQuestionIds,
  onLibraryIdsChange,
  jobRole = '',
  experienceLevel = 'mid',
  skills = [],
}: QuestionSourceTabsProps) {
  const [activeTab, setActiveTab] = useState<QuestionSource>(source);

  const handleTabChange = (tab: QuestionSource) => {
    setActiveTab(tab);
    onSourceChange(tab);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                active
                  ? 'border-primary-400 bg-primary-50/50 ring-2 ring-primary-100'
                  : 'border-[#E5E7EB] bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${active ? 'text-primary-600' : 'text-slate-500'}`} />
                <span className="text-sm font-semibold text-slate-900">{tab.label}</span>
                {tab.recommended && (
                  <span className="text-[10px] font-bold bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full">Recommended</span>
                )}
              </div>
              <p className="text-xs text-slate-500">{tab.description}</p>
            </button>
          );
        })}
      </div>

      <div className="card p-5">
        {activeTab === 'manual' && (
          <ManualQuestionsEditor questions={questions} onChange={onQuestionsChange} />
        )}
        {activeTab === 'library' && (
          <QuestionLibraryPicker
            selectedIds={libraryQuestionIds}
            onChange={onLibraryIdsChange}
          />
        )}
        {activeTab === 'ai_generated' && (
          <AIQuestionGenerator
            questions={questions}
            onChange={onQuestionsChange}
            jobRole={jobRole}
            experienceLevel={experienceLevel}
            skills={skills}
          />
        )}
      </div>
    </div>
  );
}
