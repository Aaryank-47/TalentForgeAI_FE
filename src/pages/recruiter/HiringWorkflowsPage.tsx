import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { workflowApi } from '../../services/api/workflow.api';
import { workflowKeys } from '../../constants/queryKeys';
import { Badge } from '../../components/ui/Badge';
import {
  Plus, GitBranch, Search, Loader2, Trash2, Star, MoreVertical, Pencil,
} from 'lucide-react';
import toast from 'react-hot-toast';

const tabs = ['Active', 'All'] as const;

export default function HiringWorkflowsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const companyId = user?.companyId || user?.companies?.[0]?.companyId;

  const [tab, setTab] = useState<(typeof tabs)[number]>('Active');
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [stageInputs, setStageInputs] = useState<string[]>(['Resume Screening', 'Technical Interview', 'HR Interview', 'Offer']);
  const [newStageInput, setNewStageInput] = useState('');

  const {
    data: workflows = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: workflowKeys.list(companyId || '', tab === 'Active' ? 'ACTIVE' : undefined),
    queryFn: () => workflowApi.getWorkflows(companyId as string, tab === 'Active' ? 'ACTIVE' : undefined),
    enabled: !!companyId,
  });

  const createMutation = useMutation({
    mutationFn: (payload: { name: string; description?: string; stages: string[] }) => {
      if (!companyId) throw new Error('Company not found');
      return workflowApi.createWorkflow(companyId, {
        name: payload.name,
        description: payload.description,
        stages: payload.stages
      });
    },
    onSuccess: (createdWorkflow) => {
      toast.success('Hiring workflow created successfully!');
      queryClient.invalidateQueries({ queryKey: workflowKeys.all });
      setShowCreateModal(false);
      setNewName('');
      setNewDescription('');
      setStageInputs(['Resume Screening', 'Technical Interview', 'HR Interview', 'Offer']);
      navigate(`/recruiter/workflows/${createdWorkflow.id}`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create workflow');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (workflowId: string) => {
      if (!companyId) throw new Error('Company not found');
      return workflowApi.deleteWorkflow(companyId, workflowId);
    },
    onSuccess: () => {
      toast.success('Workflow deleted successfully');
      queryClient.invalidateQueries({ queryKey: workflowKeys.all });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete workflow');
    }
  });

  const setDefaultMutation = useMutation({
    mutationFn: (workflowId: string) => {
      if (!companyId) throw new Error('Company not found');
      return workflowApi.setDefaultWorkflow(companyId, workflowId);
    },
    onSuccess: () => {
      toast.success('Default workflow updated!');
      queryClient.invalidateQueries({ queryKey: workflowKeys.all });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update default workflow');
    }
  });

  const filtered = workflows.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handleAddStage = () => {
    if (!newStageInput.trim()) return;
    if (stageInputs.includes(newStageInput.trim())) {
      toast.error('Stage already added');
      return;
    }
    setStageInputs(prev => [...prev, newStageInput.trim()]);
    setNewStageInput('');
  };

  const handleRemoveStage = (index: number) => {
    if (stageInputs.length <= 1) {
      toast.error('Workflow must have at least one stage');
      return;
    }
    setStageInputs(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    if (!newName.trim()) {
      toast.error('Workflow name is required');
      return;
    }
    if (stageInputs.length === 0) {
      toast.error('At least one stage is required');
      return;
    }
    createMutation.mutate({
      name: newName.trim(),
      description: newDescription.trim() || undefined,
      stages: stageInputs
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Hiring Workflows</h1>
          <p className="text-sm text-slate-500 mt-1">
            Create reusable hiring pipeline templates. Every job inherits a selected workflow.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={!companyId}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Workflow
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input-field pl-9 text-sm"
            placeholder="Search workflows..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="card p-12 text-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600 mb-3" />
          <p className="text-sm font-medium">Loading workflows...</p>
        </div>
      ) : isError ? (
        <div className="card p-8 text-center text-red-500 border-red-200 bg-red-50/50">
          <p className="text-sm font-semibold">Failed to load hiring workflows</p>
          <p className="text-xs text-red-400 mt-1">{(error as any)?.message || 'Please check your connection and try again.'}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <GitBranch className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">No workflows found</p>
          <p className="text-sm text-slate-500 mt-1">Create your first hiring workflow template to get started.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary text-sm mt-4 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Workflow
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(workflow => {
            const stagesCount = workflow.stages?.length || 0;
            return (
              <div key={workflow.id} className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 bg-primary-50 rounded-xl flex-shrink-0">
                      <GitBranch className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-900 text-sm">{workflow.name}</h3>
                        {workflow.isDefault && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Default
                          </span>
                        )}
                        <Badge variant={workflow.status === 'ACTIVE' ? 'success' : 'default'}>
                          {workflow.status}
                        </Badge>
                      </div>
                      {workflow.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{workflow.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                        <span>{stagesCount} stages</span>
                        {workflow._count?.jobs !== undefined && (
                          <span>Used in {workflow._count.jobs} jobs</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === workflow.id ? null : workflow.id)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {menuOpen === workflow.id && (
                      <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-10 text-xs">
                        <button
                          onClick={() => {
                            setMenuOpen(null);
                            navigate(`/recruiter/workflows/${workflow.id}`);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit Stages
                        </button>
                        {!workflow.isDefault && (
                          <button
                            onClick={() => {
                              setMenuOpen(null);
                              setDefaultMutation.mutate(workflow.id);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                          >
                            <Star className="w-3.5 h-3.5" /> Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setMenuOpen(null);
                            if (window.confirm(`Are you sure you want to delete "${workflow.name}"?`)) {
                              deleteMutation.mutate(workflow.id);
                            }
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-red-600 border-t border-slate-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {workflow.stages && workflow.stages.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
                    {workflow.stages.map((st, idx) => (
                      <React.Fragment key={st.id}>
                        <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {st.stageLibrary?.name || `Stage ${idx + 1}`}
                        </span>
                        {idx < (workflow.stages?.length || 0) - 1 && (
                          <span className="text-slate-300 text-xs">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display font-bold text-slate-900 text-base">Create Hiring Workflow</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Workflow Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="input-field text-sm"
                  placeholder="e.g., Engineering Standard Pipeline"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  className="input-field text-sm h-16 resize-none"
                  placeholder="Describe when to use this workflow..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Stages ({stageInputs.length})
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {stageInputs.map((stage, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200"
                    >
                      <span className="text-[10px] text-slate-400 font-mono">{idx + 1}.</span>
                      {stage}
                      <button
                        type="button"
                        onClick={() => handleRemoveStage(idx)}
                        className="text-slate-400 hover:text-red-500 ml-0.5"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <input
                    className="input-field text-xs flex-1 py-1.5"
                    placeholder="Add custom stage (e.g. Assessment)..."
                    value={newStageInput}
                    onChange={e => setNewStageInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddStage();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddStage}
                    disabled={!newStageInput.trim()}
                    className="btn-secondary text-xs px-3 py-1.5"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={createMutation.isPending || !newName.trim()}
                className="btn-primary text-xs flex items-center gap-1.5 px-4 py-2"
              >
                {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Create & Configure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}