import { useNavigate } from 'react-router-dom';
import { useHiring } from '../../context/HiringContext';
import { Badge } from '../../components/ui/Badge';
import { Plus, Bot, Clock, HelpCircle, Pencil, Trash2 } from 'lucide-react';

export default function InterviewTemplatesPage() {
  const navigate = useNavigate();
  const { interviewTemplates, createInterviewTemplate, deleteInterviewTemplate } = useHiring();

  const handleCreate = () => {
    const template = createInterviewTemplate('New AI Interview Template');
    navigate(`/recruiter/interview-templates/${template.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">AI Interview Templates</h1>
          <p className="text-sm text-slate-500 mt-1">
            Reusable interview configurations linked to AI Interview workflow stages.
          </p>
        </div>
        <button onClick={handleCreate} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Template
        </button>
      </div>

      {interviewTemplates.length === 0 ? (
        <div className="card p-12 text-center">
          <Bot className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">No interview templates yet</p>
          <button onClick={handleCreate} className="btn-primary text-sm mt-4 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {interviewTemplates.map(template => (
            <div key={template.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="p-2.5 bg-violet-50 rounded-xl">
                  <Bot className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => navigate(`/recruiter/interview-templates/${template.id}`)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary-600"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteInterviewTemplate(template.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-slate-900 mt-3">{template.name}</h3>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <HelpCircle className="w-3.5 h-3.5" /> {template.config.questionCount} questions
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" /> {template.config.durationMinutes} min
                </span>
                <Badge variant={template.config.difficulty === 'hard' ? 'danger' : template.config.difficulty === 'medium' ? 'warning' : 'default'}>
                  {template.config.difficulty}
                </Badge>
              </div>

              {template.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {template.skills.map(s => (
                    <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">{s}</span>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-slate-400">
                <span>Used in {template.usageCount} workflows</span>
                <Badge variant="purple">{template.questionSource.replace('_', ' ')}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
