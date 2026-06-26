import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHiring } from '../../context/HiringContext';
import { AIInterviewConfigPanel } from '../../components/hiring/AIInterviewConfigPanel';
import { QuestionSourceTabs } from '../../components/hiring/QuestionSourceTabs';
import type { InterviewQuestion } from '../../types/hiring';
import { ChevronLeft, Save } from 'lucide-react';

export default function InterviewTemplateEditorPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { getInterviewTemplate, updateInterviewTemplate } = useHiring();

  const template = templateId ? getInterviewTemplate(templateId) : undefined;
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<'config' | 'questions'>('config');

  if (!template) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-600">Interview template not found.</p>
        <button onClick={() => navigate('/recruiter/interview-templates')} className="btn-primary text-sm mt-4">
          Back to Templates
        </button>
      </div>
    );
  }

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateConfig = (config: typeof template.config) => {
    updateInterviewTemplate(template.id, { config, name: config.name });
    handleSave();
  };

  const updateQuestions = (questions: InterviewQuestion[]) => {
    updateInterviewTemplate(template.id, {
      questions,
      config: { ...template.config, questionCount: questions.length },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <button onClick={() => navigate('/recruiter/interview-templates')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 mt-1">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-[#0F172A]">{template.name}</h1>
            <p className="text-sm text-slate-500 mt-1">Configure AI interview settings and questions</p>
          </div>
        </div>
        <button onClick={handleSave} className="btn-primary text-sm flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Template'}
        </button>
      </div>

      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        {(['config', 'questions'] as const).map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
              activeSection === section ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            {section === 'config' ? 'Interview Config' : 'Questions'}
          </button>
        ))}
      </div>

      {activeSection === 'config' && (
        <div className="card p-6">
          <AIInterviewConfigPanel config={template.config} onChange={updateConfig} />
        </div>
      )}

      {activeSection === 'questions' && (
        <QuestionSourceTabs
          source={template.questionSource}
          onSourceChange={source => updateInterviewTemplate(template.id, { questionSource: source })}
          questions={template.questions}
          onQuestionsChange={updateQuestions}
          libraryQuestionIds={template.libraryQuestionIds}
          onLibraryIdsChange={ids => updateInterviewTemplate(template.id, { libraryQuestionIds: ids })}
          jobRole={template.aiGenerationParams?.jobRole}
          experienceLevel={template.aiGenerationParams?.experienceLevel}
          skills={template.skills}
        />
      )}
    </div>
  );
}
