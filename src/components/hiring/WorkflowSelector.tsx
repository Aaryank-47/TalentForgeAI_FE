import type { WorkflowItem } from '../../services/api/workflow.api';
import { Badge } from '../ui/Badge';
import { GitBranch, Star, Check, Loader2 } from 'lucide-react';

interface WorkflowSelectorProps {
  selectedId: string | null;
  onSelect: (workflowId: string) => void;
  workflows: WorkflowItem[];
  isLoading?: boolean;
}

export function WorkflowSelector({ selectedId, onSelect, workflows, isLoading = false }: WorkflowSelectorProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 text-slate-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
        <span className="text-sm font-medium">Loading workflows...</span>
      </div>
    );
  }

  if (!workflows || workflows.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        No active workflow templates found for this company. Create one first.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {workflows.map(workflow => {
        const stages = workflow.stages || [];
        const selected = selectedId === workflow.id;
        const jobCount = workflow._count?.jobs ?? 0;

        return (
          <button
            key={workflow.id}
            type="button"
            onClick={() => onSelect(workflow.id)}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              selected
                ? 'border-primary-400 bg-primary-50/50 ring-2 ring-primary-100'
                : 'border-[#E5E7EB] bg-white hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className={`p-2 rounded-lg flex-shrink-0 ${selected ? 'bg-primary-100' : 'bg-slate-100'}`}>
                  <GitBranch className={`w-5 h-5 ${selected ? 'text-primary-600' : 'text-slate-500'}`} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-900 text-sm">{workflow.name}</p>
                    {workflow.isDefault && (
                      <Badge variant="info">
                        <Star className="w-3 h-3 mr-1 inline" />
                        Default
                      </Badge>
                    )}
                    {workflow.status === 'INACTIVE' && <Badge variant="warning">Inactive</Badge>}
                  </div>
                  {workflow.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{workflow.description}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {stages.slice(0, 6).map(stage => (
                      <span key={stage.id} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                        {stage.stageLibrary?.name || 'Stage'}
                      </span>
                    ))}
                    {stages.length > 6 && (
                      <span className="text-[10px] text-slate-400">+{stages.length - 6} more</span>
                    )}
                  </div>
                </div>
              </div>
              {selected && (
                <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 ml-11">
              {stages.length} stages · Used by {jobCount} job{jobCount !== 1 ? 's' : ''}
            </p>
          </button>
        );
      })}
    </div>
  );
}
