// ─────────────────────────────────────────────────────────────
// TalentForge AI — Create Interview Modal (Phase 6)
// Recruiter schedules interview sessions using assignments
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar, Clock, Check, AlertTriangle, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interviewApi } from '../../services/api/interview.api';
import type { Interview, CompanyMember } from '../../types/interviewSession.types';
import toast from 'react-hot-toast';
import { companyApi } from '../../services/api/company.api';
import type { CompanyMemberItem } from '../../services/api/company.api';
import { useAuth } from '../../context/AuthContext';

interface CreateInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const CreateInterviewModal: React.FC<CreateInterviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Database lists
  const [interviewers, setInterviewers] = useState<CompanyMember[]>([]);

  // Form State
  const [selectedInterviewId, setSelectedInterviewId] = useState('');
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [selectedInterviewerIds, setSelectedInterviewerIds] = useState<string[]>([]);
  const [mode, setMode] = useState<'INDIVIDUAL' | 'GROUP'>('INDIVIDUAL');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Load backend data on open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      // Reset state
      setSelectedInterviewId('');
      setSelectedCandidateIds([]);
      setSelectedInterviewerIds([]);
      setDate('');
      setTime('');

      // Fetch company members dynamically if user belongs to a company
      const companyId = user?.companyId || user?.companies?.[0]?.companyId;
      if (companyId) {
        companyApi.listCompanyMembers(companyId)
          .then((res) => {
            const memberItems: CompanyMemberItem[] = Array.isArray(res) ? res : (res as any)?.data || [];
            const mappedMembers: CompanyMember[] = memberItems.map((m) => {
              const name = m.user?.employer?.fullName || m.user?.candidate?.fullName || m.user?.email.split('@')[0] || 'Team Member';
              const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'TM';
              return {
                id: m.id || m.userId,
                userId: m.userId,
                companyId: m.companyId,
                name,
                role: m.role,
                avatar: initials,
                department: m.role === 'OWNER' || m.role === 'ADMIN' ? 'Management' : 'Recruitment',
                email: m.user?.email || '',
                initials,
                avatarColor: 'from-blue-500 to-blue-700',
                status: m.status === 'ACTIVE' ? 'ACTIVE' : 'INVITED'
              };
            });
            if (mappedMembers.length > 0) {
              setInterviewers(mappedMembers);
            } else {
              setInterviewers([]);
            }
          })
          .catch(() => {
            setInterviewers([]);
          });
      } else {
        setInterviewers([]);
      }
    }
  }, [isOpen, user]);

  const queryClient = useQueryClient();
  const companyId = user?.companyId || user?.companies?.[0]?.companyId;

  const { data: interviewsResponse } = useQuery({
    queryKey: ['company-interviews', companyId],
    queryFn: () => interviewApi.getCompanyInterviews(companyId as string, { limit: 50 }),
    enabled: !!companyId && isOpen,
  });
  
  const interviewsData = (interviewsResponse as any)?.data || interviewsResponse;
  const interviews = useMemo(() => {
    const rawInterviews: Interview[] = Array.isArray(interviewsData) 
      ? interviewsData 
      : interviewsData?.items || interviewsData?.interviews || [];
    return rawInterviews.filter(interview => interview.type === 'NORMAL');
  }, [interviewsData]);

  const { data: eligibleCandidatesResponse } = useQuery({
    queryKey: ['eligible-candidates', companyId],
    queryFn: () => interviewApi.getEligibleCandidates(companyId as string),
    enabled: !!companyId && isOpen,
  });
  const assignedCandidates = useMemo(() => {
    const eligibleCandidatesData = (eligibleCandidatesResponse as any)?.data || eligibleCandidatesResponse || [];
    return (Array.isArray(eligibleCandidatesData) ? eligibleCandidatesData : eligibleCandidatesData?.items || []).map((app: any) => ({
      id: app.id,
      candidate: {
        name: app.candidate?.fullName || 'Unknown Candidate',
        title: app.job?.title || 'Unknown Job',
        experience: app.candidate?.user?.email || '',
        avatarColor: 'from-blue-400 to-blue-600',
        initials: (app.candidate?.fullName || 'U').charAt(0).toUpperCase()
      }
    }));
  }, [eligibleCandidatesResponse]);

  // Default the mode based on the interview definition
  useEffect(() => {
    if (selectedInterviewId) {
      setSelectedCandidateIds([]);
      const selectedInt = interviews.find(i => i.id === selectedInterviewId);
      if (selectedInt) {
        setMode(selectedInt.mode);
      }
    }
  }, [selectedInterviewId, interviews]);



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

  const createSessionMutation = useMutation({
    mutationFn: (payload: any) => interviewApi.createSession(companyId as string, selectedInterviewId, payload),
    onSuccess: () => {
      toast.success('Interview session scheduled successfully!');
      queryClient.invalidateQueries({ queryKey: ['sessions', companyId] });
      onSubmit();
      onClose();
    },
    onError: () => toast.error('Failed to schedule session.')
  });

  const handleSchedule = () => {
    if (!date || !time) {
      toast.error('Please fill in the date and time.');
      return;
    }

    const scheduledISO = new Date(`${date}T${time}`).toISOString();

    if (mode === 'GROUP') {
      // Group mode: all selected candidates join one session
      createSessionMutation.mutate({
        scheduledAt: scheduledISO,
        applicationIds: selectedCandidateIds,
        companyMemberIds: selectedInterviewerIds,
      });
    } else {
      // Individual mode: create a separate session for each candidate
      selectedCandidateIds.forEach((candId) => {
        createSessionMutation.mutate({
          scheduledAt: scheduledISO,
          applicationIds: [candId],
          companyMemberIds: selectedInterviewerIds,
        });
      });
    }
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
