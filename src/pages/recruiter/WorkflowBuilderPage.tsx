import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHiring } from '../../context/HiringContext';
import { WorkflowBuilder } from '../../components/hiring/WorkflowBuilder';
import { getStageLabel } from '../../constants/hiring_mockData';
import { ChevronLeft, Save, Star } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export default function WorkflowBuilderPage() {
  const { workflowId } = useParams<{ workflowId: string }>();
  const navigate = useNavigate();
  const { getWorkflow, updateWorkflow, updateWorkflowStages, setDefaultWorkflow } = useHiring();

  const workflow = workflowId ? getWorkflow(workflowId) : undefined;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (workflow) {
      setName(workflow.name);
      setDescription(workflow.description);
    }
  }, [workflow]);

  if (!workflow) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-600">Workflow not found.</p>
        <button onClick={() => navigate('/recruiter/workflows')} className="btn-primary text-sm mt-4">
          Back to Workflows
        </button>
      </div>
    );
  }

  const handleSave = () => {
    updateWorkflow(workflow.id, { name, description });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const enabledStages = workflow.stages.filter(s => s.enabled);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <button onClick={() => navigate('/recruiter/workflows')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 mt-1">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-display font-bold text-[#0F172A]">Configure Workflow</h1>
              {workflow.isDefault && <Badge variant="info"><Star className="w-3 h-3 mr-0.5 inline" />Default</Badge>}
              {workflow.isArchived && <Badge variant="warning">Archived</Badge>}
            </div>
            <p className="text-sm text-slate-500 mt-1">Add, remove, reorder, and configure hiring stages</p>
          </div>
        </div>
        <button onClick={handleSave} className="btn-primary text-sm flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Workflow'}
        </button>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        <div className="flex-1 space-y-5">
          <div className="card p-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Workflow Name</label>
              <input
                className="input-field"
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={handleSave}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                className="input-field h-20 resize-none text-sm"
                value={description}
                onChange={e => setDescription(e.target.value)}
                onBlur={handleSave}
              />
            </div>
            {!workflow.isDefault && !workflow.isArchived && (
              <button
                onClick={() => setDefaultWorkflow(workflow.id)}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                <Star className="w-3.5 h-3.5" /> Set as Default Workflow
              </button>
            )}
          </div>

          <div className="card p-5">
            <h2 className="text-base font-display font-bold text-slate-900 mb-4">Pipeline Stages</h2>
            <WorkflowBuilder
              stages={workflow.stages}
              onChange={stages => updateWorkflowStages(workflow.id, stages)}
            />
          </div>
        </div>

        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="card p-5 sticky top-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-display">Pipeline Preview</h3>
            <div className="space-y-0">
              {enabledStages.map((stage, i) => (
                <div key={stage.id} className="flex flex-col items-center">
                  <div className={`w-full px-3 py-2 rounded-lg text-xs font-medium text-center border ${
                    stage.type === 'ai_interview'
                      ? 'bg-violet-50 border-violet-200 text-violet-700'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    {getStageLabel(stage)}
                  </div>
                  {i < enabledStages.length - 1 && (
                    <div className="w-px h-4 bg-slate-200 my-0.5" />
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-[#E5E7EB] pt-3 text-xs text-slate-400 space-y-1">
              <p>{enabledStages.length} active stages</p>
              <p>{workflow.jobCount} jobs using this workflow</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
