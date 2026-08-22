// ─────────────────────────────────────────────────────────────
// TalentForge AI — Create Interview Modal (Phase 6)
// Recruiter schedules interview sessions using assignments
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Briefcase, Video, ChevronDown, Check, AlertTriangle, Users } from 'lucide-react';
import {
  getInterviews,
  getInterviewAssignments,
  createInterviewSession
} from '../../services/interviewSession.service';
import { mockCompanyMembers } from '../../constants/interview/scheduleMockData';
import type { Interview, InterviewAssignment, CompanyMember } from '../../types/interviewSession.types';
import toast from 'react-hot-toast';

interface CreateInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const DURATIONS = ['30 min', '45 min', '60 min', '90 min', '120 min'];
const TIMEZONES = ['IST (UTC+5:30)', 'UTC', 'EST (UTC-5)', 'PST (UTC-8)', 'GMT'];

export const CreateInterviewModal: React.FC<CreateInterviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Database lists
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [assignedCandidates, setAssignedCandidates] = useState<InterviewAssignment[]>([]);
  const [interviewers] = useState<CompanyMember[]>(mockCompanyMembers);

  // Form State
  const [selectedInterviewId, setSelectedInterviewId] = useState('');
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [selectedInterviewerIds, setSelectedInterviewerIds] = useState<string[]>([]);
  const [mode, setMode] = useState<'INDIVIDUAL' | 'GROUP'>('INDIVIDUAL');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60 min');
  const [timezone, setTimezone] = useState('IST (UTC+5:30)');

  // Load interviews on open
  useEffect(() => {
    if (isOpen) {
      setInterviews(getInterviews());
      setStep(1);
      // Reset state
      setSelectedInterviewId('');
      setSelectedCandidateIds([]);
      setSelectedInterviewerIds([]);
      setDate('');
      setTime('');
    }
  }, [isOpen]);

  // Load assigned candidates when interview selection changes
  useEffect(() => {
    if (selectedInterviewId) {
      const candidates = getInterviewAssignments(selectedInterviewId);
      setAssignedCandidates(candidates);
      setSelectedCandidateIds([]);
      // Default the mode based on the interview definition
      const selectedInt = interviews.find(i => i.id === selectedInterviewId);
      if (selectedInt) {
        setMode(selectedInt.mode);
      }
    } else {
      setAssignedCandidates([]);
    }
  }, [selectedInterviewId, interviews]);

  if (!isOpen) return null;

  const selectedInterview = interviews.find((i) => i.id === selectedInterviewId);

  const handleNext = () => {
    if (step === 1 && !selectedInterviewId) {
      toast.error('Please select an interview template.');
      return;
    }
    if (step === 2 && selectedCandidateIds.length === 0) {
      toast.error('Please select at least one candidate.');
      return;
    }
    if (step === 3 && selectedInterviewerIds.length === 0) {
      toast.error('Please select at least one interviewer.');
      return;
    }
    setStep((prev) => (prev + 1) as never);
  };

  const handleBack = () => {
    setStep((prev) => (prev - 1) as never);
  };

  const handleSchedule = () => {
    if (!date || !time) {
      toast.error('Please fill in the date and time.');
      return;
    }

    const scheduledISO = new Date(`${date}T${time}`).toISOString();

    const participants = [
      ...selectedInterviewerIds.map((id) => ({ type: 'INTERVIEWER' as const, id })),
    ];

    if (mode === 'GROUP') {
      // Group mode: all selected candidates join one session
      createInterviewSession({
        interviewId: selectedInterviewId,
        scheduledAt: scheduledISO,
        participantIds: [
          ...selectedCandidateIds.map((id) => ({ type: 'CANDIDATE' as const, id })),
          ...participants,
        ],
      });
      toast.success('Group interview session scheduled successfully!');
    } else {
      // Individual mode: create a separate session for each candidate
      selectedCandidateIds.forEach((candId) => {
        createInterviewSession({
          interviewId: selectedInterviewId,
          scheduledAt: scheduledISO,
          participantIds: [
            { type: 'CANDIDATE', id: candId },
            ...participants,
          ],
        });
      });
      toast.success(
        selectedCandidateIds.length > 1
          ? `Scheduled ${selectedCandidateIds.length} separate interview sessions!`
          : 'Interview session scheduled successfully!'
      );
    }

    onSubmit();
    onClose();
  };

  const toggleCandidate = (id: string) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleInterviewer = (id: string) => {
    setSelectedInterviewerIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] flex-shrink-0">
          <div>
            <h2 className="text-lg font-display font-bold text-slate-900">Schedule Interview Session</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Step {step} of 4 — {
                step === 1 ? 'Select Template' :
                step === 2 ? 'Select Candidates' :
                step === 3 ? 'Select Interviewers' :
                'Date, Time & Review'
              }
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 border-b border-[#E5E7EB] flex-shrink-0 bg-slate-50">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step >= s ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-0.5 rounded-full ${step > s ? 'bg-primary-600' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Step 1: Select Interview Template */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 block">Select Interview Template</label>
              <div className="grid grid-cols-1 gap-3">
                {interviews.map((iv) => (
                  <button
                    key={iv.id}
                    type="button"
                    onClick={() => setSelectedInterviewId(iv.id)}
                    className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
                      selectedInterviewId === iv.id
                        ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                        : 'border-[#E5E7EB] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="font-bold text-slate-900 text-sm">{iv.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        iv.type === 'AI' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {iv.type} Interview
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{iv.description}</p>
                    <div className="flex gap-4 mt-3 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      <span>Duration: {iv.durationMinutes} min</span>
                      <span>Mode: {iv.mode}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Candidates */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Assign Candidates</label>
                {selectedInterview && (
                  <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">
                    {selectedInterview.mode} Mode Configured
                  </span>
                )}
              </div>

              {assignedCandidates.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No candidates assigned</p>
                  <p className="text-xs text-slate-400 mt-0.5">No candidates are currently assigned to this interview template.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {assignedCandidates.map((asg) => {
                    const isSelected = selectedCandidateIds.includes(asg.id);
                    return (
                      <button
                        key={asg.id}
                        type="button"
                        onClick={() => toggleCandidate(asg.id)}
                        className={`flex items-center gap-3 p-3 w-full text-left rounded-xl border transition-all ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-[#E5E7EB] hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${asg.candidate.avatarColor} flex items-center justify-center text-white text-xs font-bold`}>
                          {asg.candidate.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{asg.candidate.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{asg.candidate.title} · {asg.candidate.experience}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Select Interviewers */}
          {step === 3 && (
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 block">Select Interview Panel members</label>
              <div className="space-y-2">
                {interviewers.map((cm) => {
                  const isSelected = selectedInterviewerIds.includes(cm.id);
                  return (
                    <button
                      key={cm.id}
                      type="button"
                      onClick={() => toggleInterviewer(cm.id)}
                      className={`flex items-center gap-3 p-3 w-full text-left rounded-xl border transition-all ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-[#E5E7EB] hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${cm.avatarColor || 'from-slate-400 to-slate-600'} flex items-center justify-center text-white text-xs font-bold`}>
                        {cm.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{cm.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{cm.role} · {cm.department}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Schedule, Mode Review, Date/Time */}
          {step === 4 && (
            <div className="space-y-5">
              
              {/* Date / Time Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    <Calendar className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-field text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    <Clock className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                    Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="input-field text-sm"
                    required
                  />
                </div>
              </div>

              {/* Mode Confirmation & Warning */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600 uppercase">Scheduling Mode</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMode('INDIVIDUAL')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${
                        mode === 'INDIVIDUAL' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      Individual
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('GROUP')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${
                        mode === 'GROUP' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      Group
                    </button>
                  </div>
                </div>

                {mode === 'INDIVIDUAL' && selectedCandidateIds.length > 1 && (
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-800 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Separate Sessions:</strong> You selected multiple candidates in Individual mode. This will schedule <strong>{selectedCandidateIds.length} separate</strong> 1-on-1 interview slots at the selected time.
                    </p>
                  </div>
                )}

                {mode === 'GROUP' && (
                  <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 p-3 rounded-lg text-blue-800 text-xs">
                    <Users className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Single Group Session:</strong> All selected candidates ({selectedCandidateIds.length}) and interviewers will be scheduled in a single shared interview session.
                    </p>
                  </div>
                )}
              </div>

              {/* Review Summary */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Review Session Details</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Interview:</span>
                    <span className="font-semibold text-slate-900">{selectedInterview?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Candidates Selected:</span>
                    <span className="font-semibold text-slate-900">{selectedCandidateIds.length} candidates</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Interviewers Selected:</span>
                    <span className="font-semibold text-slate-900">{selectedInterviewerIds.length} team members</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date / Time:</span>
                    <span className="font-semibold text-slate-900">{date || 'Not set'} @ {time || 'Not set'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB] bg-slate-50 flex-shrink-0">
          <button
            type="button"
            onClick={step === 1 ? onClose : handleBack}
            className="btn-secondary text-sm font-semibold"
          >
            {step === 1 ? 'Cancel' : '← Back'}
          </button>
          
          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary text-sm font-semibold"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSchedule}
              className="btn-primary text-sm font-semibold"
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
