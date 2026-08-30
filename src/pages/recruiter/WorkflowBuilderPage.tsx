import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import {
  workflowApi,
  stageLibraryApi,
  type WorkflowStageView,
  type StageLibraryItem,
} from '../../services/api/workflow.api';
import { workflowKeys, stageLibraryKeys } from '../../constants/queryKeys';
import { ChevronLeft, Save, Star, Loader2, Trash2, ArrowUp, ArrowDown, Plus, Layers, X } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export default function WorkflowBuilderPage() {
  const { workflowId } = useParams<{ workflowId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const companyId = user?.companyId || user?.companies?.[0]?.companyId;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stages, setStages] = useState<WorkflowStageView[]>([]);
  const [showAddStageModal, setShowAddStageModal] = useState(false);
  const [customStageName, setCustomStageName] = useState('');
  const [customStageType, setCustomStageType] = useState('CUSTOM');

  // Fetch Workflow Details
  const {
    data: workflow,
    isLoading: isLoadingWorkflow,
    isError,
    error,
  } = useQuery({
    queryKey: workflowKeys.detail(companyId || '', workflowId || ''),
    queryFn: () => workflowApi.getWorkflowDetails(companyId as string, workflowId as string),
    enabled: !!companyId && !!workflowId,
  });

  // Fetch System and Custom Stages from Stage Library
  const {
    data: libraryStages = [],
    isLoading: isLoadingLibrary,
  } = useQuery({
    queryKey: stageLibraryKeys.list(companyId || ''),
    queryFn: () => stageLibraryApi.getStages(companyId as string),
    enabled: !!companyId,
  });

  useEffect(() => {
    if (workflow) {
      setName(workflow.name);
      setDescription(workflow.description || '');
      setStages(workflow.stages || []);
    }
  }, [workflow]);

  // Update Workflow Mutation
  const updateMutation = useMutation({
    mutationFn: (payload: {
      name: string;
      description?: string;
      isDefault?: boolean;
      stages: { stageLibraryId: string; order: number; assessmentId?: string | null }[];
    }) => {
      if (!companyId || !workflowId) throw new Error('Company or workflow not found');
      return workflowApi.updateWorkflow(companyId, workflowId, payload);
    },
    onSuccess: () => {
      toast.success('Workflow saved successfully!');
      queryClient.invalidateQueries({ queryKey: workflowKeys.all });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update workflow');
    },
  });

  // Set Default Mutation
  const setDefaultMutation = useMutation({
    mutationFn: () => {
      if (!companyId || !workflowId) throw new Error('Company or workflow not found');
      return workflowApi.setDefaultWorkflow(companyId, workflowId);
    },
    onSuccess: () => {
      toast.success('Workflow set as default!');
      queryClient.invalidateQueries({ queryKey: workflowKeys.all });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to set default workflow');
    },
  });

  // Create Custom Stage Mutation
  const createCustomStageMutation = useMutation({
    mutationFn: (payload: { name: string; type?: string }) => {
      if (!companyId) throw new Error('Company not found');
      return stageLibraryApi.createCustomStage(companyId, payload);
    },
    onSuccess: (newStage) => {
      toast.success(`Custom stage "${newStage.name}" created!`);
      queryClient.invalidateQueries({ queryKey: stageLibraryKeys.all });
      // Automatically append to current stages list
      handleAddStageToWorkflow(newStage);
      setCustomStageName('');
      setShowAddStageModal(false);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create custom stage');
    },
  });

  if (isLoadingWorkflow) {
    return (
      <div className="text-center py-24 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600 mb-3" />
        <p className="text-sm font-medium">Loading workflow...</p>
      </div>
    );
  }

  if (isError || !workflow) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-600 font-semibold">Workflow not found or access denied.</p>
        <p className="text-xs text-slate-400 mt-1">{(error as any)?.message}</p>
        <button onClick={() => navigate('/recruiter/workflows')} className="btn-primary text-sm mt-4">
          Back to Workflows
        </button>
      </div>
    );
  }

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Workflow name cannot be empty');
      return;
    }

    if (stages.length === 0) {
      toast.error('Workflow must contain at least one stage');
      return;
    }

    updateMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      isDefault: workflow.isDefault,
      stages: stages.map((st, index) => ({
        stageLibraryId: st.stageLibraryId,
        order: index,
        assessmentId: st.assessmentId ?? null,
      })),
    });
  };

  const moveStage = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= stages.length) return;
    const reordered = [...stages];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    setStages(reordered);
  };

  const removeStage = (idx: number) => {
    if (stages.length <= 1) {
      toast.error('Workflow must have at least one stage');
      return;
    }
    setStages(stages.filter((_, i) => i !== idx));
  };

  const handleAddStageToWorkflow = (stageLib: StageLibraryItem) => {
    const isAlreadyAdded = stages.some(s => s.stageLibraryId === stageLib.id);
    if (isAlreadyAdded) {
      toast.error(`"${stageLib.name}" is already in this pipeline`);
      return;
    }

    const newWorkflowStage: WorkflowStageView = {
      id: `temp-${Date.now()}`,
      workflowId: workflow.id,
      stageLibraryId: stageLib.id,
      order: stages.length,
      stageLibrary: {
        id: stageLib.id,
        name: stageLib.name,
        type: stageLib.type,
        description: stageLib.description,
        isActive: stageLib.isActive,
      },
    };

    setStages(prev => [...prev, newWorkflowStage]);
    setShowAddStageModal(false);
  };

  const handleCreateCustomStage = () => {
    if (!customStageName.trim()) {
      toast.error('Stage name is required');
      return;
    }
    createCustomStageMutation.mutate({
      name: customStageName.trim(),
      type: customStageType,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate('/recruiter/workflows')}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 mt-1 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-display font-bold text-[#0F172A]">Configure Workflow</h1>
              {workflow.isDefault && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Default
                </span>
              )}
              <Badge variant={workflow.status === 'ACTIVE' ? 'success' : 'default'}>
                {workflow.status}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">Add, remove, and reorder hiring pipeline stages</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="btn-primary text-sm flex items-center gap-2 px-5 py-2.5 shadow-xs cursor-pointer"
        >
          {updateMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Basic Details */}
        <div className="lg:col-span-1 space-y-5">
          <div className="card p-5 space-y-4">
            <h2 className="font-bold text-sm text-slate-900">General Settings</h2>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Workflow Name <span className="text-red-500">*</span>
              </label>
              <input
                className="input-field text-sm"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                className="input-field h-24 resize-none text-sm"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Workflow details..."
              />
            </div>

            {!workflow.isDefault && (
              <button
                type="button"
                onClick={() => setDefaultMutation.mutate()}
                disabled={setDefaultMutation.isPending}
                className="w-full btn-secondary text-xs flex items-center justify-center gap-1.5 py-2 cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 text-amber-500" />
                Set as Default Workflow
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Pipeline Stages */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm text-slate-900">Pipeline Stages ({stages.length})</h2>
                <p className="text-xs text-slate-500 mt-0.5">Candidates move sequentially through these stages</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStageModal(true)}
                className="btn-secondary text-xs flex items-center gap-1.5 px-3 py-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Stage
              </button>
            </div>

            <div className="space-y-2.5">
              {stages.map((stage, idx) => (
                <div
                  key={stage.id || `${stage.stageLibraryId}-${idx}`}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {stage.stageLibrary?.name || `Stage ${idx + 1}`}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Type: <span className="capitalize">{stage.stageLibrary?.type?.toLowerCase() || 'Standard'}</span>
                        {stage.assessment && ` · Assessment: ${stage.assessment.title}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveStage(idx, idx - 1)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === stages.length - 1}
                      onClick={() => moveStage(idx, idx + 1)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeStage(idx)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                      title="Remove Stage"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Stage from Library / Create Custom Stage Modal */}
      {showAddStageModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary-600" /> Stage Library
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Select a library stage or create a new custom stage</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStageModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Add Existing Library Stages */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Available Stages</label>
              {isLoadingLibrary ? (
                <div className="py-6 text-center text-slate-400 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin mx-auto mb-1 text-primary-600" /> Loading stage library...
                </div>
              ) : libraryStages.length === 0 ? (
                <p className="text-xs text-slate-400 py-3">No stage library items found.</p>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {libraryStages.map((libStage) => {
                    const isAdded = stages.some(s => s.stageLibraryId === libStage.id);
                    return (
                      <div
                        key={libStage.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{libStage.name}</p>
                          <span className="text-[10px] text-slate-400 capitalize">{libStage.type?.toLowerCase() || 'Standard'}</span>
                        </div>
                        <button
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddStageToWorkflow(libStage)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                            isAdded
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-primary-600 hover:bg-primary-700 text-white cursor-pointer'
                          }`}
                        >
                          {isAdded ? 'Added' : '+ Add'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Create Brand-New Custom Stage */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Or Create New Custom Stage</label>
              <div className="flex gap-2">
                <input
                  className="input-field text-xs flex-1"
                  placeholder="e.g. Executive Interview, Take-Home Assignment"
                  value={customStageName}
                  onChange={e => setCustomStageName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCreateCustomStage();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleCreateCustomStage}
                  disabled={createCustomStageMutation.isPending || !customStageName.trim()}
                  className="btn-primary text-xs px-4 flex items-center gap-1.5 cursor-pointer"
                >
                  {createCustomStageMutation.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                  Create
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowAddStageModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
