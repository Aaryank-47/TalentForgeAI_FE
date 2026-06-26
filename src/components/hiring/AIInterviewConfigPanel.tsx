import type { AIInterviewConfig } from '../../types/hiring';
import { FormField } from '../ui/FormField';
import { Toggle } from '../ui/Toggle';
import { DeadlineConfigPanel } from './DeadlineConfigPanel';

interface AIInterviewConfigPanelProps {
  config: AIInterviewConfig;
  onChange: (config: AIInterviewConfig) => void;
}

export function AIInterviewConfigPanel({ config, onChange }: AIInterviewConfigPanelProps) {
  const update = <K extends keyof AIInterviewConfig>(key: K, value: AIInterviewConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="AI Interview Configuration"
        subtitle="Configure how the AI interview stage behaves for candidates"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="Interview Name" required>
          <input
            className="input-field mt-1"
            value={config.name}
            onChange={e => update('name', e.target.value)}
            placeholder="e.g. Frontend Developer AI Interview"
          />
        </FormField>

        <FormField label="Interview Duration (minutes)" required>
          <input
            type="number"
            min={5}
            max={120}
            className="input-field mt-1"
            value={config.durationMinutes}
            onChange={e => update('durationMinutes', Number(e.target.value))}
          />
        </FormField>

        <FormField label="Number of Questions" required>
          <input
            type="number"
            min={1}
            max={50}
            className="input-field mt-1"
            value={config.questionCount}
            onChange={e => update('questionCount', Number(e.target.value))}
          />
        </FormField>

        <FormField label="Difficulty">
          <select
            className="input-field mt-1"
            value={config.difficulty}
            onChange={e => update('difficulty', e.target.value as AIInterviewConfig['difficulty'])}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </FormField>

        <FormField label="Passing Score (%)" hint="Minimum score to pass the interview">
          <input
            type="number"
            min={0}
            max={100}
            className="input-field mt-1"
            value={config.passingScore}
            onChange={e => update('passingScore', Number(e.target.value))}
          />
        </FormField>

        <FormField label="Maximum Attempts">
          <input
            type="number"
            min={1}
            max={5}
            className="input-field mt-1"
            value={config.maxAttempts}
            onChange={e => update('maxAttempts', Number(e.target.value))}
          />
        </FormField>

        <FormField label="Time Per Question (seconds)">
          <input
            type="number"
            min={30}
            max={600}
            className="input-field mt-1"
            value={config.timePerQuestionSeconds}
            onChange={e => update('timePerQuestionSeconds', Number(e.target.value))}
          />
        </FormField>
      </div>

      <div className="border-t border-[#E5E7EB] pt-6">
        <DeadlineConfigPanel
          value={config.deadline}
          onChange={deadline => update('deadline', deadline)}
        />
      </div>

      <div className="border-t border-[#E5E7EB] pt-6">
        <p className="text-sm font-semibold text-slate-700 mb-4">Requirements & Behavior</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle checked={config.cameraRequired} onChange={v => update('cameraRequired', v)} label="Camera Required" />
          <Toggle checked={config.microphoneRequired} onChange={v => update('microphoneRequired', v)} label="Microphone Required" />
          <Toggle checked={config.recordingRequired} onChange={v => update('recordingRequired', v)} label="Recording Required" />
          <Toggle checked={config.randomizeQuestions} onChange={v => update('randomizeQuestions', v)} label="Randomize Questions" />
          <Toggle checked={config.retakeAllowed} onChange={v => update('retakeAllowed', v)} label="Retake Allowed" />
          <Toggle checked={config.enableAiFollowUp} onChange={v => update('enableAiFollowUp', v)} label="Enable AI Follow-up Questions" description="AI asks clarifying follow-ups based on answers" />
        </div>
      </div>

      <FormField label="Candidate Instructions" hint="Shown to candidates before they start the interview">
        <textarea
          className="input-field mt-1 h-24 resize-none text-sm"
          value={config.candidateInstructions}
          onChange={e => update('candidateInstructions', e.target.value)}
          placeholder="Instructions for candidates..."
        />
      </FormField>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h3 className="text-base font-display font-bold text-[#0F172A]">{title}</h3>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}
