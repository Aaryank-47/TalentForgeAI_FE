import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { interviewApi, type CreateInterviewPayload } from '../../services/api/interview.api';
import { Badge } from '../../components/ui/Badge';
import { Plus, Bot, Clock, HelpCircle, Pencil, Trash2, Loader2, X, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InterviewTemplatesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentWorkspace, user } = useAuth();
  const companyId = currentWorkspace?.id || user?.companyId || user?.companies?.[0]?.companyId;

  const [isCreating, setIsCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState<{ title: string; type: 'AI' | 'NORMAL'; durationMinutes: number }>({
    title: '',
    type: 'AI',
    durationMinutes: 45
  });

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
      toast.success('Interview template created successfully!');
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
      setShowCreateModal(false);
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
      toast.success('Interview template deleted successfully');
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

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) {
      toast.error('Please select a company workspace first');
      return;
    }
    if (!newTemplate.title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    setIsCreating(true);
    
    const payload: CreateInterviewPayload = {
      title: newTemplate.title,
      description: newTemplate.type === 'AI' ? 'Comprehensive AI screening' : 'Technical or Behavioral Interview',
      instructions: newTemplate.type === 'AI' 
        ? 'Answer each question clearly. You will be evaluated on technical depth and communication.' 
        : 'Please join the meeting on time.',
      type: newTemplate.type,
      mode: 'INDIVIDUAL',
      status: 'ACTIVE',
      durationMinutes: newTemplate.durationMinutes,
    };

    if (newTemplate.type === 'AI') {
      payload.aiConfiguration = {
        difficulty: 'MEDIUM',
        questionCount: 5,
        totalQuestions: 5,
        skills: ['General'],
        roleTitle: newTemplate.title,
      };
    }

    createMutation.mutate(payload);
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
            Interview Templates
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Reusable interview configurations for AI and Live Interviews.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
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
            onClick={() => setShowCreateModal(true)}
            className="btn-primary mx-auto mt-6"
          >
            Create your first template
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
                    <div className={`p-2.5 rounded-xl transition-colors ${template.type === 'AI' ? 'bg-violet-50 text-violet-600 group-hover:bg-violet-100' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`}>
                      {template.type === 'AI' ? <Bot className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${template.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                      {template.status === 'ACTIVE' ? 'Active' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                  {template.type === 'AI' && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <HelpCircle className="w-3.5 h-3.5" /> {aiConfig.questionCount || aiConfig.totalQuestions || 5} questions
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" /> {template.durationMinutes || 25} min
                  </span>
                  {template.type === 'AI' && (
                    <Badge variant={aiConfig.difficulty === 'HARD' ? 'danger' : aiConfig.difficulty === 'MEDIUM' ? 'warning' : 'default'}>
                      {(aiConfig.difficulty || 'MEDIUM').toLowerCase()}
                    </Badge>
                  )}
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

      {/* CREATE TEMPLATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Create Template</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Template Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer Interview"
                  className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  value={newTemplate.title}
                  onChange={e => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setNewTemplate(prev => ({ ...prev, type: 'AI' }))}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-center ${
                    newTemplate.type === 'AI' ? 'border-primary-600 bg-primary-50' : 'border-[#E5E7EB] hover:border-primary-200'
                  }`}
                >
                  <Bot className={`w-6 h-6 ${newTemplate.type === 'AI' ? 'text-primary-600' : 'text-slate-400'}`} />
                  <span className={`text-sm font-bold ${newTemplate.type === 'AI' ? 'text-primary-700' : 'text-slate-600'}`}>AI Interview</span>
                </div>
                
                <div
                  onClick={() => setNewTemplate(prev => ({ ...prev, type: 'NORMAL' }))}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-center ${
                    newTemplate.type === 'NORMAL' ? 'border-primary-600 bg-primary-50' : 'border-[#E5E7EB] hover:border-primary-200'
                  }`}
                >
                  <Users className={`w-6 h-6 ${newTemplate.type === 'NORMAL' ? 'text-primary-600' : 'text-slate-400'}`} />
                  <span className={`text-sm font-bold ${newTemplate.type === 'NORMAL' ? 'text-primary-700' : 'text-slate-600'}`}>Live Interview</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Duration (minutes)</label>
                <select
                  className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  value={newTemplate.durationMinutes}
                  onChange={e => setNewTemplate(prev => ({ ...prev, durationMinutes: parseInt(e.target.value) }))}
                >
                  <option value={15}>15 minutes</option>
                  <option value={25}>25 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="btn-primary py-2 px-6"
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
