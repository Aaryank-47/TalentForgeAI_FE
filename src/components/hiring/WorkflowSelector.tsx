import { useHiring } from '../../context/HiringContext';
import { getStageLabel } from '../../constants/hiring_mockData';
import { Badge } from '../ui/Badge';
import { GitBranch, Star, Check } from 'lucide-react';

interface WorkflowSelectorProps {
  selectedId: string | null;
  onSelect: (workflowId: string) => void;
  showArchived?: boolean;
}

export function WorkflowSelector({ selectedId, onSelect, showArchived = false }: WorkflowSelectorProps) {
  const { workflows } = useHiring();
  const visible = workflows.filter(w => showArchived || !w.isArchived);

  if (visible.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-slate-500">
        No workflow templates available. Create one first.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visible.map(workflow => {
        const enabledStages = workflow.stages.filter(s => s.enabled);
        const selected = selectedId === workflow.id;

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
                    {workflow.isArchived && <Badge variant="warning">Archived</Badge>}
                  </div>
                  {workflow.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{workflow.description}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {enabledStages.slice(0, 6).map(stage => (
                      <span key={stage.id} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                        {getStageLabel(stage)}
                      </span>
                    ))}
                    {enabledStages.length > 6 && (
                      <span className="text-[10px] text-slate-400">+{enabledStages.length - 6} more</span>
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
              {enabledStages.length} stages · Used by {workflow.jobCount} job{workflow.jobCount !== 1 ? 's' : ''}
            </p>
          </button>
        );
      })}
    </div>
  );
}
