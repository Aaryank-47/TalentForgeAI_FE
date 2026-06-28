// ─────────────────────────────────────────────────────────────
// TalentForge AI — Create Interview Modal
// Recruiter creates a new live interview session
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { X, Calendar, Clock, User, Briefcase, Video, ChevronDown } from 'lucide-react';
import type { CreateInterviewFormData, InterviewType, InterviewDuration, MeetingType } from '../../types/interview.types';
import { mockCandidates } from '../../constants/participants.mock';

interface CreateInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInterviewFormData) => void;
}

const INTERVIEW_TYPES: InterviewType[] = [
  'Technical', 'HR Round', 'Final Round', 'Behavioural',
  'System Design', 'Culture Fit', 'Managerial',
];
const DURATIONS: InterviewDuration[] = ['30 min', '45 min', '60 min', '90 min', '120 min'];
const MEETING_TYPES: { value: MeetingType; label: string; icon: string }[] = [
  { value: 'video', label: 'Video Call', icon: '🎥' },
  { value: 'audio-only', label: 'Audio Only', icon: '🎙️' },
  { value: 'in-person', label: 'In Person', icon: '🏢' },
];
const TIMEZONES = ['IST (UTC+5:30)', 'UTC', 'EST (UTC-5)', 'PST (UTC-8)', 'GMT'];

const mockJobs = [
  { id: 'job_1', title: 'Senior Frontend Developer' },
  { id: 'job_2', title: 'Product Designer' },
  { id: 'job_3', title: 'Backend Developer (Node.js)' },
  { id: 'job_4', title: 'HR Operations Manager' },
];

const defaultForm: CreateInterviewFormData = {
  title: '',
  candidateId: '',
  jobId: '',
  type: 'Technical',
  date: '',
  timeStart: '',
  duration: '60 min',
  timezone: 'IST (UTC+5:30)',
  meetingType: 'video',
  instructions: '',
  allowCamera: true,
  allowMicrophone: true,
  allowScreenShare: true,
  recordingEnabled: true,
};

export const CreateInterviewModal: React.FC<CreateInterviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<CreateInterviewFormData>(defaultForm);
  const [step, setStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const update = <K extends keyof CreateInterviewFormData>(key: K, value: CreateInterviewFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm(defaultForm);
    setStep(1);
    onClose();
  };

  const isStep1Valid =
    form.title.trim() && form.candidateId && form.jobId && form.type && form.date && form.timeStart;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] flex-shrink-0">
          <div>
            <h2 className="text-lg font-display font-bold text-slate-900">Schedule Interview</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Step {step} of 2 — {step === 1 ? 'Basic Details' : 'Settings & Instructions'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-6 py-3 border-b border-[#E5E7EB] flex-shrink-0">
          <div className="flex items-center gap-3">
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step >= s
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {s}
                </div>
                {s < 2 && (
                  <div className={`flex-1 h-0.5 rounded-full ${step > s ? 'bg-primary-600' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          {step === 1 && (
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Interview Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="e.g. Frontend Engineer — Technical Round"
                  className="input-field text-sm"
                  required
                />
              </div>

              {/* Candidate */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  <User className="w-3.5 h-3.5 inline mr-1" />
                  Candidate <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={form.candidateId}
                    onChange={(e) => update('candidateId', e.target.value)}
                    className="input-field text-sm appearance-none pr-8"
                    required
                  >
                    <option value="">Select candidate…</option>
                    {mockCandidates.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} — {c.jobTitle}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Job */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  <Briefcase className="w-3.5 h-3.5 inline mr-1" />
                  Job <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={form.jobId}
                    onChange={(e) => update('jobId', e.target.value)}
                    className="input-field text-sm appearance-none pr-8"
                    required
                  >
                    <option value="">Select job…</option>
                    {mockJobs.map((j) => (
                      <option key={j.id} value={j.id}>{j.title}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Interview Type */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Interview Type <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTERVIEW_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => update('type', t)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        form.type === t
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-slate-600 border-[#E5E7EB] hover:border-primary-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => update('date', e.target.value)}
                    className="input-field text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    <Clock className="w-3.5 h-3.5 inline mr-1" />
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={form.timeStart}
                    onChange={(e) => update('timeStart', e.target.value)}
                    className="input-field text-sm"
                    required
                  />
                </div>
              </div>

              {/* Duration & Timezone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Duration</label>
                  <div className="relative">
                    <select
                      value={form.duration}
                      onChange={(e) => update('duration', e.target.value as InterviewDuration)}
                      className="input-field text-sm appearance-none pr-8"
                    >
                      {DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Timezone</label>
                  <div className="relative">
                    <select
                      value={form.timezone}
                      onChange={(e) => update('timezone', e.target.value)}
                      className="input-field text-sm appearance-none pr-8"
                    >
                      {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-6 space-y-4">
              {/* Meeting Type */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  <Video className="w-3.5 h-3.5 inline mr-1" />
                  Meeting Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {MEETING_TYPES.map(({ value, label, icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => update('meetingType', value)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-colors ${
                        form.meetingType === value
                          ? 'bg-primary-50 border-primary-300 text-primary-700'
                          : 'bg-white border-[#E5E7EB] text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xl">{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">Permissions</label>
                <div className="space-y-2">
                  {[
                    { key: 'allowCamera', label: 'Allow Camera' },
                    { key: 'allowMicrophone', label: 'Allow Microphone' },
                    { key: 'allowScreenShare', label: 'Allow Screen Share' },
                    { key: 'recordingEnabled', label: 'Enable Recording' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={form[key as keyof CreateInterviewFormData] as boolean}
                        onChange={(e) => update(key as keyof CreateInterviewFormData, e.target.checked as never)}
                        className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-700 font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Interview Instructions
                </label>
                <textarea
                  value={form.instructions}
                  onChange={(e) => update('instructions', e.target.value)}
                  placeholder="Add instructions that will be visible to the candidate before joining..."
                  rows={4}
                  className="input-field text-sm resize-none"
                />
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB] bg-slate-50/60 flex-shrink-0">
          <button
            type="button"
            onClick={step === 1 ? onClose : () => setStep(1)}
            className="btn-secondary text-sm"
          >
            {step === 1 ? 'Cancel' : '← Back'}
          </button>
          {step === 1 ? (
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!isStep1Valid}
              className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit as unknown as React.MouseEventHandler}
              className="btn-primary text-sm"
            >
              Schedule Interview
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateInterviewModal;
