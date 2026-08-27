import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { interviewApi, type CreateInterviewPayload } from '../../services/api/interview.api';
import { Badge } from '../../components/ui/Badge';
import { Plus, Bot, Clock, HelpCircle, Pencil, Trash2, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InterviewTemplatesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentWorkspace, user } = useAuth();
  const companyId = currentWorkspace?.id || user?.companyId || user?.companies?.[0]?.companyId;

  const [isCreating, setIsCreating] = useState(false);

  // 1. Fetch real interviews from backend
  const { data: interviewData, isLoading } = useQuery({
    queryKey: ['company-interviews', companyId],
    queryFn: async () => {
      if (!companyId) return { items: [], total: 0 };
      const res: any = await interviewApi.getCompanyInterviews(companyId, { limit: 50 });
      return res?.data || res || { items: [], total: 0 };
    },
    enabled: Boolean(companyId),
  });

  // 2. Create Interview Mutation
  const createMutation = useMutation({
    mutationFn: async (payload: CreateInterviewPayload) => {
      if (!companyId) throw new Error('Company ID is missing');
      return await interviewApi.createInterview(companyId, payload);
    },
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['company-interviews', companyId] });
      toast.success('AI Interview template created successfully!');
      const newId = res?.data?.id || res?.id;
      if (newId) {
        navigate(`/recruiter/interview-templates/${newId}`);
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to create interview template');
    },
    onSettled: () => {
      setIsCreating(false);
    },
  });

  // 3. Delete Interview Mutation
  const deleteMutation = useMutation({
    mutationFn: async (interviewId: string) => {
      if (!companyId) throw new Error('Company ID is missing');
      return await interviewApi.deleteInterview(companyId, interviewId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-interviews', companyId] });
      toast.success('AI Interview template deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to delete template');
    },
  });

  const handleDelete = (e: React.MouseEvent, templateId: string, title: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      deleteMutation.mutate(templateId);
    }
  };

  const handleCreate = () => {
    if (!companyId) {
      toast.error('Please select a company workspace first');
      return;
    }
    setIsCreating(true);
    createMutation.mutate({
      title: 'Full Stack Engineer AI Interview',
      description: 'Comprehensive AI technical and behavioral screening',
      instructions: 'Answer each question clearly. You will be evaluated on technical depth and communication.',
      type: 'AI',
      mode: 'INDIVIDUAL',
      status: 'ACTIVE',
      durationMinutes: 25,
      aiConfiguration: {
        difficulty: 'MEDIUM',
        questionCount: 5,
        totalQuestions: 5,
        skills: ['React', 'Node.js', 'System Design', 'TypeScript'],
        roleTitle: 'Full Stack Engineer',
      },
    });
  };

  const interviewsList: any[] =
    interviewData?.items ||
    interviewData?.interviews ||
    (Array.isArray(interviewData) ? interviewData : []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-600" />
            AI Interview Templates
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Reusable interview configurations linked to AI Interview workflow stages and candidate pipelines.
          </p>
        </div>
        <button
          onClick={handleCreate}
          disabled={isCreating || createMutation.isPending}
          className="btn-primary text-sm flex items-center gap-2"
        >
          {isCreating || createMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Create Template
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : interviewsList.length === 0 ? (
        <div className="card p-12 text-center">
          <Bot className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">No interview templates yet</p>
          <p className="text-xs text-slate-400 mt-1">Create your first AI or Technical interview template to invite candidates.</p>
          <button
            onClick={handleCreate}
            disabled={isCreating || createMutation.isPending}
            className="btn-primary text-sm mt-4 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {interviewsList.map((template: any) => {
            const aiConfig = template.aiConfiguration || {};
            const skills: string[] = aiConfig.skills || [];
            return (
              <div
                key={template.id}
                onClick={() => navigate(`/recruiter/interview-templates/${template.id}`)}
                className="card p-5 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2.5 bg-violet-50 rounded-xl group-hover:bg-violet-100 transition-colors">
                      <Bot className="w-5 h-5 text-violet-600" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      template.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {template.status === 'ACTIVE' ? 'Active' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/recruiter/interview-templates/${template.id}`);
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary-600"
                      title="Edit template"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, template.id, template.title || template.name || 'this template')}
                      disabled={deleteMutation.isPending}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-slate-900 mt-3">{template.title || template.name}</h3>
                {template.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{template.description}</p>
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <HelpCircle className="w-3.5 h-3.5" /> {aiConfig.questionCount || aiConfig.totalQuestions || 5} questions
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" /> {template.durationMinutes || 25} min
                  </span>
                  <Badge variant={aiConfig.difficulty === 'HARD' ? 'danger' : aiConfig.difficulty === 'MEDIUM' ? 'warning' : 'default'}>
                    {(aiConfig.difficulty || 'MEDIUM').toLowerCase()}
                  </Badge>
                </div>

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {skills.map((s: string) => (
                      <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-slate-400">
                  <span>Type: <strong className="text-slate-600">{template.type}</strong></span>
                  <Badge variant="purple">{template.mode || 'INDIVIDUAL'}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
