import { useState } from 'react';
import type { WorkflowStage } from '../../types/hiring';
import { DEFAULT_STAGE_DEFINITIONS, CUSTOM_STAGE_SUGGESTIONS, generateId, getStageLabel } from '../../constants/hiring_mockData';
import { useHiring } from '../../context/HiringContext';
import { Badge } from '../ui/Badge';
import { Toggle } from '../ui/Toggle';
import { cn } from '../../lib/cn';
import {
  GripVertical, Plus, Trash2, ChevronDown, ChevronUp, Bot, Settings2,
  FileSearch, ClipboardList, Code, Users, UserCheck, FileText,
  Shield, FileCheck, LogIn, CheckCircle, XCircle, Circle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const STAGE_ICONS: Record<string, React.ElementType> = {
  FileSearch, Bot, ClipboardList, Code, Users, UserCheck, FileText,
  Shield, FileCheck, LogIn, CheckCircle, XCircle,
};

interface WorkflowBuilderProps {
  stages: WorkflowStage[];
  onChange: (stages: WorkflowStage[]) => void;
}

export function WorkflowBuilder({ stages, onChange }: WorkflowBuilderProps) {
  const { interviewTemplates, getInterviewTemplate } = useHiring();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [customStageName, setCustomStageName] = useState('');

  const sortedStages = [...stages].sort((a, b) => a.order - b.order);

  const reorder = (from: number, to: number) => {
    const items = [...sortedStages];
    const [moved] = items.splice(from, 1);
    items.splice(to, 0, moved);
    onChange(items.map((s, i) => ({ ...s, order: i })));
  };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) reorder(dragIndex, index);
    setDragIndex(index);
  };
  const handleDragEnd = () => setDragIndex(null);

  const addStage = (type: WorkflowStage['type'], label: string, customLabel?: string) => {
    const newStage: WorkflowStage = {
      id: generateId('st'),
      type,
      label,
      customLabel,
      enabled: true,
      order: stages.length,
      interviewTemplateId: type === 'ai_interview' ? interviewTemplates[0]?.id : undefined,
    };
    onChange([...stages, newStage]);
    setShowAddPanel(false);
    setCustomStageName('');
    if (type === 'ai_interview') setExpandedStageId(newStage.id);
  };

  const removeStage = (id: string) => onChange(stages.filter(s => s.id !== id));

  const toggleStage = (id: string) =>
    onChange(stages.map(s => (s.id === id ? { ...s, enabled: !s.enabled } : s)));

  const updateStage = (id: string, updates: Partial<WorkflowStage>) =>
    onChange(stages.map(s => (s.id === id ? { ...s, ...updates } : s)));

  const getIcon = (iconName: string) => STAGE_ICONS[iconName] ?? Circle;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {sortedStages.map((stage, index) => {
          const def = stage.type !== 'custom' ? DEFAULT_STAGE_DEFINITIONS.find(d => d.type === stage.type) : null;
          const isExpanded = expandedStageId === stage.id;
          const template = stage.interviewTemplateId ? getInterviewTemplate(stage.interviewTemplateId) : null;

          return (
            <div
              key={stage.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={e => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                'card overflow-hidden transition-opacity',
                !stage.enabled && 'opacity-60',
                dragIndex === index && 'ring-2 ring-primary-300',
              )}
            >
              <div className="flex items-center gap-3 p-4">
                <button type="button" className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600">
                  <GripVertical className="w-5 h-5" />
                </button>

                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                  stage.type === 'ai_interview' ? 'bg-violet-100' : 'bg-slate-100',
                )}>
                  {def ? (
                    (() => { const Icon = getIcon(def.icon); return <Icon className="w-4 h-4 text-slate-600" />; })()
                  ) : (
                    <Settings2 className="w-4 h-4 text-slate-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-slate-900">{getStageLabel(stage)}</p>
                    {stage.type === 'ai_interview' && <Badge variant="purple">AI</Badge>}
                    {stage.type === 'custom' && <Badge variant="info">Custom</Badge>}
                    {!stage.enabled && <Badge variant="warning">Disabled</Badge>}
                  </div>
                  {template && (
                    <p className="text-xs text-slate-500 mt-0.5">Template: {template.name}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Toggle checked={stage.enabled} onChange={() => toggleStage(stage.id)} />
                  {stage.type === 'ai_interview' && (
                    <button
                      type="button"
                      onClick={() => setExpandedStageId(isExpanded ? null : stage.id)}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeStage(stage.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isExpanded && stage.type === 'ai_interview' && (
                <div className="border-t border-[#E5E7EB] p-5 bg-slate-50/50 space-y-4">
                  <FormFieldInline label="Interview Template">
                    <select
                      className="input-field mt-1"
                      value={stage.interviewTemplateId ?? ''}
                      onChange={e => updateStage(stage.id, { interviewTemplateId: e.target.value || undefined })}
                    >
                      <option value="">Select template...</option>
                      {interviewTemplates.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </FormFieldInline>
                  {template && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Bot className="w-4 h-4" />
                      {template.config.questionCount} questions · {template.config.durationMinutes} min · {template.config.difficulty}
                    </div>
                  )}
                  <Link
                    to={`/recruiter/interview-templates/${stage.interviewTemplateId ?? 'new'}`}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    onClick={e => {
                      if (!stage.interviewTemplateId) e.preventDefault();
                    }}
                  >
                    Edit interview template →
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Connector visual */}
      {sortedStages.length > 0 && (
        <div className="flex justify-center">
          <div className="w-px h-6 bg-slate-200" />
        </div>
      )}

      {/* Add stage */}
      {!showAddPanel ? (
        <button
          type="button"
          onClick={() => setShowAddPanel(true)}
          className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/30 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Stage
        </button>
      ) : (
        <div className="card p-5 space-y-4">
          <p className="text-sm font-semibold text-slate-900">Add a Stage</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DEFAULT_STAGE_DEFINITIONS.filter(
              d => !sortedStages.some(s => s.type === d.type),
            ).map(def => {
              const Icon = getIcon(def.icon);
              return (
                <button
                  key={def.type}
                  type="button"
                  onClick={() => addStage(def.type, def.label)}
                  className="flex items-center gap-2 p-3 rounded-lg border border-[#E5E7EB] hover:border-primary-300 hover:bg-primary-50/30 text-left transition-colors"
                >
                  <Icon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-700">{def.label}</span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-[#E5E7EB] pt-4">
            <p className="text-xs font-semibold text-slate-500 mb-2">Custom Stage</p>
            <div className="flex gap-2">
              <input
                className="input-field flex-1"
                value={customStageName}
                onChange={e => setCustomStageName(e.target.value)}
                placeholder="e.g. Culture Fit, VP Round..."
                list="custom-suggestions"
              />
              <datalist id="custom-suggestions">
                {CUSTOM_STAGE_SUGGESTIONS.map(s => <option key={s} value={s} />)}
              </datalist>
              <button
                type="button"
                disabled={!customStageName.trim()}
                onClick={() => addStage('custom', customStageName.trim(), customStageName.trim())}
                className="btn-primary text-sm disabled:opacity-40"
              >
                Add
              </button>
            </div>
          </div>

          <button type="button" onClick={() => setShowAddPanel(false)} className="text-xs text-slate-500 hover:text-slate-700">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function FormFieldInline({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600">{label}</label>
      {children}
    </div>
  );
}
