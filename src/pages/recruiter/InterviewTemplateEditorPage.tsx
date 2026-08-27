import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { interviewApi } from '../../services/api/interview.api';
import { useHiring } from '../../context/HiringContext';
import { AIInterviewConfigPanel } from '../../components/hiring/AIInterviewConfigPanel';
import type { AIInterviewConfig } from '../../types/hiring';
import { ChevronLeft, Save, Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InterviewTemplateEditorPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentWorkspace, user } = useAuth();
  const companyId = currentWorkspace?.id || user?.companyId || user?.companies?.[0]?.companyId;

  const { getInterviewTemplate, updateInterviewTemplate } = useHiring();
  const fallbackTemplate = templateId ? getInterviewTemplate(templateId) : undefined;

  // Query backend for real interview template
  const { data: apiInterview, isLoading } = useQuery({
    queryKey: ['interview-template-detail', companyId, templateId],
    queryFn: async () => {
      if (!companyId || !templateId) return null;
      try {
        const res: any = await interviewApi.getInterviewById(companyId, templateId);
        return res?.data || res;
      } catch {
        return null;
      }
    },
    enabled: Boolean(companyId && templateId),
  });

  const interviewData = apiInterview || (fallbackTemplate ? {
    id: fallbackTemplate.id,
    title: fallbackTemplate.name,
    type: 'AI',
    mode: 'INDIVIDUAL',
    durationMinutes: fallbackTemplate.config.durationMinutes,
    aiConfiguration: {
      difficulty: fallbackTemplate.config.difficulty.toUpperCase(),
      totalQuestions: fallbackTemplate.config.questionCount,
      skills: fallbackTemplate.skills,
    },
  } : null);

  const [configState, setConfigState] = useState<AIInterviewConfig>({
    name: 'AI Interview Template',
    difficulty: 'medium',
    questionCount: 5,
    durationMinutes: 25,
    passingScore: 70,
    deadline: {
      duration: '48h',
      expiryAction: 'recruiter_review',
    },
    maxAttempts: 1,
    cameraRequired: true,
    microphoneRequired: true,
    recordingRequired: true,
    randomizeQuestions: false,
    timePerQuestionSeconds: 120,
    retakeAllowed: false,
    enableAiFollowUp: true,
    candidateInstructions: 'Answer each question clearly. You will be evaluated on technical depth and communication.',
  });

  // Sync initial loaded interview data into local form state
  useEffect(() => {
    if (interviewData) {
      const aiConfig = interviewData.aiConfiguration || {};
      const evalMetrics = aiConfig.evaluationMetrics || {};

      setConfigState(prev => ({
        ...prev,
        name: interviewData.title || fallbackTemplate?.name || prev.name,
        difficulty: ((aiConfig.difficulty || evalMetrics.difficulty || fallbackTemplate?.config?.difficulty || 'medium') as string).toLowerCase() as any,
        questionCount: aiConfig.totalQuestions || evalMetrics.questionCount || fallbackTemplate?.config?.questionCount || 5,
        durationMinutes: interviewData.durationMinutes || fallbackTemplate?.config?.durationMinutes || 25,
        passingScore: evalMetrics.passingScore || prev.passingScore,
        deadline: evalMetrics.deadline || prev.deadline,
        maxAttempts: evalMetrics.maxAttempts || prev.maxAttempts,
        cameraRequired: evalMetrics.cameraRequired ?? prev.cameraRequired,
        microphoneRequired: evalMetrics.microphoneRequired ?? prev.microphoneRequired,
        recordingRequired: evalMetrics.recordingRequired ?? prev.recordingRequired,
        randomizeQuestions: evalMetrics.randomizeQuestions ?? prev.randomizeQuestions,
        timePerQuestionSeconds: evalMetrics.timePerQuestionSeconds ?? prev.timePerQuestionSeconds,
        retakeAllowed: evalMetrics.retakeAllowed ?? prev.retakeAllowed,
        enableAiFollowUp: evalMetrics.enableAiFollowUp ?? prev.enableAiFollowUp,
        candidateInstructions: interviewData.instructions || fallbackTemplate?.config?.candidateInstructions || prev.candidateInstructions,
      }));
    }
  }, [interviewData, fallbackTemplate]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!companyId || !templateId) throw new Error('Missing company or template ID');
      return await interviewApi.updateInterview(companyId, templateId, {
        title: configState.name,
        status: 'ACTIVE',
        durationMinutes: configState.durationMinutes,
        instructions: configState.candidateInstructions,
        aiConfiguration: {
          difficulty: configState.difficulty.toUpperCase() as any,
          questionCount: configState.questionCount,
          allowFollowUps: configState.enableAiFollowUp,
          systemPrompt: `Conduct a professional AI interview with ${configState.questionCount} questions. Difficulty: ${configState.difficulty.toUpperCase()}.`,
          evaluationMetrics: {
            passingScore: configState.passingScore,
            questionCount: configState.questionCount,
            difficulty: configState.difficulty.toUpperCase(),
            maxAttempts: configState.maxAttempts,
            timePerQuestionSeconds: configState.timePerQuestionSeconds,
            cameraRequired: configState.cameraRequired,
            microphoneRequired: configState.microphoneRequired,
            recordingRequired: configState.recordingRequired,
            randomizeQuestions: configState.randomizeQuestions,
            retakeAllowed: configState.retakeAllowed,
            enableAiFollowUp: configState.enableAiFollowUp,
            deadline: configState.deadline,
          },
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview-template-detail', companyId, templateId] });
      queryClient.invalidateQueries({ queryKey: ['company-interviews', companyId] });
      if (fallbackTemplate && templateId) {
        updateInterviewTemplate(templateId, { config: configState, name: configState.name });
      }
      toast.success('AI Interview template configuration saved!');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to save configuration');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!companyId || !templateId) throw new Error('Missing company or template ID');
      return await interviewApi.deleteInterview(companyId, templateId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-interviews', companyId] });
      toast.success('AI Interview template deleted successfully');
      navigate('/recruiter/interview-templates');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to delete template');
    },
  });

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${configState.name}"? This action cannot be undone.`)) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!interviewData && !fallbackTemplate) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-600">Interview template not found.</p>
        <button onClick={() => navigate('/recruiter/interview-templates')} className="btn-primary text-sm mt-4">
          Back to Templates
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate('/recruiter/interview-templates')}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 mt-1"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-display font-bold text-[#0F172A]">{configState.name}</h1>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                interviewData?.status === 'ACTIVE'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {interviewData?.status === 'ACTIVE' ? 'Active / Published' : 'Draft'}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Configure parameters sent to the backend AI interview engine for live OpenRouter question generation.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending || saveMutation.isPending}
            className="border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete Template
          </button>
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || deleteMutation.isPending}
            className="btn-primary text-sm flex items-center gap-2"
          >
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saveMutation.isPending ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      {/* Main Configuration Card */}
      <div className="card p-6">
        <AIInterviewConfigPanel
          config={configState}
          onChange={(newConfig) => setConfigState(newConfig)}
        />
      </div>
    </div>
  );
}
