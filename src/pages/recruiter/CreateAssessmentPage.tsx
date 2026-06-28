import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Send, ClipboardList, Calendar, Info } from 'lucide-react';

import AssessmentTypeSelector from '../../components/assessment/AssessmentTypeSelector';
import AssessmentBuilderStepper from '../../components/assessment/AssessmentBuilderStepper';
import SharedAssessmentSettings from '../../components/assessment/SharedAssessmentSettings';
import MCQBuilder from '../../components/assessment/MCQBuilder';
import DSABuilder from '../../components/assessment/DSABuilder';
import MixedAssessmentBuilder from '../../components/assessment/MixedAssessmentBuilder';
import MachineCodingBuilder from '../../components/assessment/MachineCodingBuilder';
import ProjectAssessmentBuilder from '../../components/assessment/ProjectAssessmentBuilder';

import type {
  AssessmentType, MCQConfig, DSAConfig, MixedConfig,
  MachineCodingConfig, ProjectConfig, SharedAssessmentSettings as SettingsType,
} from '../../types/assessment';

// ─── Default configs ───────────────────────────────────────────
const defaultMCQConfig: MCQConfig = {
  totalQuestions: 30, marksPerQuestion: 3, negativeMarking: 0,
  passingScore: 70, timeLimit: 45, selectedQuestionIds: [],
};
const defaultDSAConfig: DSAConfig = {
  numberOfQuestions: 3, totalDuration: 90, passingScore: 60,
  marksPerQuestion: 20, selectedProblemIds: [],
};
const defaultMixedConfig: MixedConfig = {
  mcq: defaultMCQConfig,
  dsa: defaultDSAConfig,
};
const defaultMachineCodingConfig: MachineCodingConfig = {
  topic: '', instructions: '', sharedNotes: '', duration: 60,
  supportedLanguages: ['javascript', 'python'],
};
const defaultProjectConfig: ProjectConfig = {
  title: '', description: '', requirements: '', techStack: [],
  difficulty: 'Medium', maximumMarks: 100, deadlineDays: 3,
  submissionTypes: ['github', 'live_url'],
};
const defaultSettings: SettingsType = {
  passingPercentage: 70, totalMarks: 100, totalQuestions: 30, duration: 60,
  shuffleQuestions: true, shuffleOptions: true, allowNavigation: true,
  autoSubmit: true, calculatorAllowed: false, fullscreenRequired: true,
  cameraRequired: true, screenSharingRequired: false,
};

// ─── Steps ─────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Basic Details', description: 'Name & Type' },
  { id: 2, label: 'Configure', description: 'Questions & Rules' },
  { id: 3, label: 'Settings', description: 'Proctoring & Limits' },
  { id: 4, label: 'Review', description: 'Publish' },
];

// ─── Type Labels ───────────────────────────────────────────────
const TYPE_LABELS: Record<AssessmentType, string> = {
  mcq: 'MCQ Assessment',
  dsa: 'DSA Assessment',
  mixed: 'MCQ + DSA Assessment',
  live_machine_coding: 'Live Machine Coding',
  project: 'Coding Task / Project',
  coding: 'Coding Assessment',
  descriptive: 'Descriptive Exam',
  logical_reasoning: 'Logical Reasoning',
  behavioral: 'Behavioral Test',
  case_study: 'Case Study',
};

const CreateAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 - Basic Details
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState<AssessmentType | null>(null);
  const [instructions, setInstructions] = useState('');
  const [passingScore, setPassingScore] = useState(70);
  const [duration, setDuration] = useState(60);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxAttempts, setMaxAttempts] = useState(1);

  // Step 2 - Type-specific configs
  const [mcqConfig, setMcqConfig] = useState<MCQConfig>(defaultMCQConfig);
  const [dsaConfig, setDsaConfig] = useState<DSAConfig>(defaultDSAConfig);
  const [mixedConfig, setMixedConfig] = useState<MixedConfig>(defaultMixedConfig);
  const [machineCodingConfig, setMachineCodingConfig] = useState<MachineCodingConfig>(defaultMachineCodingConfig);
  const [projectConfig, setProjectConfig] = useState<ProjectConfig>(defaultProjectConfig);

  // Step 3 - Settings
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);

  const [published, setPublished] = useState(false);

  const canProceed = () => {
    if (currentStep === 1) return name.trim() !== '' && selectedType !== null;
    if (currentStep === 2) return true;
    if (currentStep === 3) return true;
    return true;
  };

  const handlePublish = () => {
    setPublished(true);
    setTimeout(() => navigate('/recruiter/assessments'), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/recruiter/assessments')}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Create Assessment</h1>
          <p className="text-sm text-slate-500 mt-0.5">Build a professional assessment in 4 steps</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="card p-5">
        <AssessmentBuilderStepper steps={STEPS} currentStep={currentStep} />
      </div>

      {/* ─── Step 1: Basic Details ─── */}
      {currentStep === 1 && (
        <div className="space-y-5">
          <div className="card p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Basic Details</h2>
                <p className="text-xs text-slate-500">Provide general information about this assessment</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Assessment Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Frontend Developer Technical Assessment"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="What will candidates be evaluated on?"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Total Duration (min)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={e => setDuration(Number(e.target.value))}
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Passing Score (%)</label>
                <input
                  type="number"
                  min={0} max={100}
                  value={passingScore}
                  onChange={e => setPassingScore(Number(e.target.value))}
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Start Date
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> End Date
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Maximum Attempts</label>
                <input
                  type="number"
                  min={1} max={5}
                  value={maxAttempts}
                  onChange={e => setMaxAttempts(Number(e.target.value))}
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Instructions for Candidates</label>
                <textarea
                  rows={3}
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  placeholder="What should candidates know before starting this assessment?"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Assessment Type */}
          <div className="card p-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
              <h2 className="text-base font-bold text-slate-900">Select Assessment Type *</h2>
            </div>
            <AssessmentTypeSelector value={selectedType} onChange={setSelectedType} />
          </div>
        </div>
      )}

      {/* ─── Step 2: Configure ─── */}
      {currentStep === 2 && selectedType && (
        <div>
          <div className="mb-5 flex items-center gap-3">
            <div className="px-3 py-1.5 bg-primary-50 rounded-lg border border-primary-100">
              <span className="text-xs font-bold text-primary-700">{TYPE_LABELS[selectedType]}</span>
            </div>
            <p className="text-sm text-slate-500">Configure your assessment content</p>
          </div>

          {selectedType === 'mcq' && (
            <MCQBuilder config={mcqConfig} onChange={setMcqConfig} />
          )}
          {selectedType === 'dsa' && (
            <DSABuilder config={dsaConfig} onChange={setDsaConfig} />
          )}
          {selectedType === 'mixed' && (
            <MixedAssessmentBuilder config={mixedConfig} onChange={setMixedConfig} />
          )}
          {selectedType === 'live_machine_coding' && (
            <MachineCodingBuilder config={machineCodingConfig} onChange={setMachineCodingConfig} />
          )}
          {selectedType === 'project' && (
            <ProjectAssessmentBuilder config={projectConfig} onChange={setProjectConfig} />
          )}
          {['coding', 'descriptive', 'logical_reasoning', 'behavioral', 'case_study'].includes(selectedType) && (
            <div className="card p-6 flex flex-col items-center justify-center text-center">
              <Info className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Standard Configuration</h3>
              <p className="text-sm text-slate-500 max-w-md">
                This assessment type uses a standard text-based response format for candidates. You can proceed directly to the Settings tab to configure proctoring and time limits.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── Step 3: Settings ─── */}
      {currentStep === 3 && (
        <div>
          <div className="mb-5">
            <h2 className="text-base font-bold text-slate-900">Assessment Settings</h2>
            <p className="text-sm text-slate-500 mt-1">Configure proctoring, behavior, and scoring rules</p>
          </div>
          <SharedAssessmentSettings settings={settings} onChange={setSettings} />
        </div>
      )}

      {/* ─── Step 4: Review ─── */}
      {currentStep === 4 && !published && (
        <div className="space-y-5">
          <div className="card p-6">
            <h2 className="text-base font-bold text-slate-900 mb-5">Review & Publish</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Name', value: name || '—' },
                { label: 'Type', value: selectedType ? TYPE_LABELS[selectedType] : '—' },
                { label: 'Duration', value: `${duration} min` },
                { label: 'Passing Score', value: `${passingScore}%` },
                { label: 'Max Attempts', value: maxAttempts },
                { label: 'Proctoring', value: settings.cameraRequired ? 'Required' : 'Optional' },
              ].map(item => (
                <div key={item.label} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200 mb-5">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                Once published, this assessment will be available to candidates based on your configured availability window.
                You can archive it at any time from the Assessments page.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { /* save as draft */ navigate('/recruiter/assessments'); }}
                className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-700 font-medium text-sm rounded-xl hover:bg-slate-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save as Draft
              </button>
              <button
                onClick={handlePublish}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
                Publish Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Published Success */}
      {published && (
        <div className="card p-10 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <ClipboardList className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Assessment Published!</h3>
            <p className="text-sm text-slate-500 mt-1">Redirecting you back to assessments…</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      {!published && (
        <div className="flex items-center justify-between card p-4">
          <button
            onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <span className="text-xs text-slate-400">Step {currentStep} of {STEPS.length}</span>

          {currentStep < STEPS.length && (
            <button
              onClick={() => setCurrentStep(s => Math.min(STEPS.length, s + 1))}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateAssessmentPage;
