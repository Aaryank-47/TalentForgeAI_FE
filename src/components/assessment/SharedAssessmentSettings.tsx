import React from 'react';
import type { SharedAssessmentSettings as Settings } from '../../types/assessment';

interface SharedAssessmentSettingsProps {
  settings: Settings;
  onChange: (updated: Settings) => void;
}

interface ToggleRowProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ label, description, value, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
    <div>
      <p className="text-sm font-medium text-slate-800">{label}</p>
      {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
        value ? 'bg-primary-600' : 'bg-slate-300'
      }`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}

const NumberField: React.FC<NumberFieldProps> = ({ label, value, onChange, min = 0, max, suffix }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
    <p className="text-sm font-medium text-slate-800">{label}</p>
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={e => onChange(Number(e.target.value))}
        className="w-20 text-sm text-right border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      {suffix && <span className="text-xs text-slate-500">{suffix}</span>}
    </div>
  </div>
);

const SharedAssessmentSettings: React.FC<SharedAssessmentSettingsProps> = ({ settings, onChange }) => {
  const set = <K extends keyof Settings>(key: K, val: Settings[K]) =>
    onChange({ ...settings, [key]: val });

  return (
    <div className="space-y-6">
      {/* Scoring */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">S</span>
          Scoring & Limits
        </h3>
        <NumberField label="Passing Percentage" value={settings.passingPercentage} onChange={v => set('passingPercentage', v)} min={0} max={100} suffix="%" />
        <NumberField label="Total Marks" value={settings.totalMarks} onChange={v => set('totalMarks', v)} min={0} />
        <NumberField label="Total Questions" value={settings.totalQuestions} onChange={v => set('totalQuestions', v)} min={0} />
        <NumberField label="Duration" value={settings.duration} onChange={v => set('duration', v)} min={1} suffix="min" />
      </div>

      {/* Behavior */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold">B</span>
          Exam Behavior
        </h3>
        <ToggleRow label="Shuffle Questions" description="Randomize question order for each candidate" value={settings.shuffleQuestions} onChange={v => set('shuffleQuestions', v)} />
        <ToggleRow label="Shuffle Options" description="Randomize MCQ option order" value={settings.shuffleOptions} onChange={v => set('shuffleOptions', v)} />
        <ToggleRow label="Allow Navigation" description="Candidates can revisit previous questions" value={settings.allowNavigation} onChange={v => set('allowNavigation', v)} />
        <ToggleRow label="Auto Submit" description="Automatically submit when time expires" value={settings.autoSubmit} onChange={v => set('autoSubmit', v)} />
        <ToggleRow label="Calculator Allowed" description="Show an on-screen calculator" value={settings.calculatorAllowed} onChange={v => set('calculatorAllowed', v)} />
      </div>

      {/* Proctoring */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold">P</span>
          Proctoring Requirements
        </h3>
        <ToggleRow label="Fullscreen Required" description="Candidate must remain fullscreen during the exam" value={settings.fullscreenRequired} onChange={v => set('fullscreenRequired', v)} />
        <ToggleRow label="Camera Required" description="Enable AI face detection monitoring" value={settings.cameraRequired} onChange={v => set('cameraRequired', v)} />
        <ToggleRow label="Microphone Required" description="Enable audio recording and noise detection" value={settings.microphoneRequired} onChange={v => set('microphoneRequired', v)} />
        <ToggleRow label="Screen Sharing Required" description="Capture candidate's screen activity" value={settings.screenSharingRequired} onChange={v => set('screenSharingRequired', v)} />
        <ToggleRow label="Session Recording" description="Record the entire assessment session" value={settings.recordingEnabled} onChange={v => set('recordingEnabled', v)} />
        <ToggleRow label="Tab Monitoring" description="Detect and report if the candidate leaves the exam tab" value={settings.tabMonitoring} onChange={v => set('tabMonitoring', v)} />
        <ToggleRow label="Face Detection" description="Use AI to ensure face is visible at all times" value={settings.faceDetection} onChange={v => set('faceDetection', v)} />
        <ToggleRow label="Background Noise Detection" description="Detect suspicious background audio activity" value={settings.noiseDetection} onChange={v => set('noiseDetection', v)} />
      </div>
    </div>
  );
};

export default SharedAssessmentSettings;
