import type { DeadlineConfig } from '../../types/hiring';
import { DEADLINE_OPTIONS } from '../../constants/hiring_mockData';
import { FormField } from '../ui/FormField';

interface DeadlineConfigPanelProps {
  value: DeadlineConfig;
  onChange: (config: DeadlineConfig) => void;
}

export function DeadlineConfigPanel({ value, onChange }: DeadlineConfigPanelProps) {
  return (
    <div className="space-y-4">
      <FormField label="Complete Within" hint="Deadline for candidates to finish the interview">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
          {DEADLINE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...value, duration: opt.value })}
              className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                value.duration === opt.value
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : 'bg-white border-[#E5E7EB] text-slate-600 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FormField>

      {value.duration === 'custom' && (
        <FormField label="Custom Duration (hours)">
          <input
            type="number"
            min={1}
            className="input-field mt-1"
            value={value.customHours ?? 72}
            onChange={e => onChange({ ...value, customHours: Number(e.target.value) })}
          />
        </FormField>
      )}

      <FormField
        label="When Deadline Expires"
        hint="What happens if the candidate doesn't complete the interview in time"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          <button
            type="button"
            onClick={() => onChange({ ...value, expiryAction: 'reject' })}
            className={`p-4 rounded-xl border text-left transition-colors ${
              value.expiryAction === 'reject'
                ? 'bg-red-50 border-red-200 ring-2 ring-red-100'
                : 'bg-white border-[#E5E7EB] hover:bg-slate-50'
            }`}
          >
            <p className="text-sm font-semibold text-slate-900">Move to Rejected</p>
            <p className="text-xs text-slate-500 mt-1">Automatically reject the candidate when the deadline passes.</p>
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...value, expiryAction: 'recruiter_review' })}
            className={`p-4 rounded-xl border text-left transition-colors ${
              value.expiryAction === 'recruiter_review'
                ? 'bg-amber-50 border-amber-200 ring-2 ring-amber-100'
                : 'bg-white border-[#E5E7EB] hover:bg-slate-50'
            }`}
          >
            <p className="text-sm font-semibold text-slate-900">Return to Recruiter Review</p>
            <p className="text-xs text-slate-500 mt-1">Flag for manual review instead of auto-rejecting.</p>
          </button>
        </div>
      </FormField>
    </div>
  );
}
