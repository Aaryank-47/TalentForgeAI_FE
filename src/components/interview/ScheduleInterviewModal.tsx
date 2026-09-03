import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, Calendar, Clock, Briefcase, Check
} from 'lucide-react';
import { 
  mockJobs, 
  mockApplications, 
  mockInterviews, 
  mockJobInterviews, 
  mockCompanyMembers,
  mockInterviewAssignments
} from '../../constants/interview/scheduleMockData';
import type { InterviewSession } from '../../types/interviewSession.types';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (session: InterviewSession) => void;
}

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({ isOpen, onClose, onSchedule }) => {
  // Form State
  const [jobId, setJobId] = useState<string>('');
  const [interviewId, setInterviewId] = useState<string>('');
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [selectedInterviewerIds, setSelectedInterviewerIds] = useState<string[]>([]);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');

  // Derived Data
  const selectedJob = useMemo(() => mockJobs.find(j => j.id === jobId), [jobId]);
  
  const availableInterviews = useMemo(() => {
    if (!jobId) return [];
    const relations = mockJobInterviews.filter(ji => ji.jobId === jobId);
    return relations.map(r => mockInterviews.find(i => i.id === r.interviewId)!).filter(Boolean);
  }, [jobId]);

  const selectedInterview = useMemo(() => mockInterviews.find(i => i.id === interviewId), [interviewId]);

  const availableCandidates = useMemo(() => {
    if (!jobId) return [];
    return mockApplications.filter(a => a.jobId === jobId);
  }, [jobId]);

  const isGroup = selectedInterview?.mode === 'GROUP';

  // Calculate End Time
  const endTime = useMemo(() => {
    if (!date || !time || !selectedInterview) return '';
    try {
      const start = new Date(`${date}T${time}`);
      if (isNaN(start.getTime())) return '';
      const end = new Date(start.getTime() + selectedInterview.durationMinutes * 60000);
      return end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  }, [date, time, selectedInterview]);

  // Reset dependent fields when parent fields change
  useEffect(() => {
    setInterviewId('');
    setSelectedCandidateIds([]);
  }, [jobId]);

  useEffect(() => {
    if (!isGroup) {
      if (selectedCandidateIds.length > 1) {
        setSelectedCandidateIds([selectedCandidateIds[0]]);
      }
    }
  }, [interviewId, isGroup]);

  // Validation
  const isValid = useMemo(() => {
    if (!jobId || !interviewId || !date || !time) return false;
    if (selectedCandidateIds.length === 0) return false;
    if (isGroup && selectedCandidateIds.length < 2) return false;
    if (!isGroup && selectedCandidateIds.length !== 1) return false;
    if (selectedInterview?.type === 'NORMAL' && selectedInterviewerIds.length === 0) return false;
    return true;
  }, [jobId, interviewId, selectedCandidateIds, selectedInterviewerIds, date, time, isGroup, selectedInterview]);

  const handleSchedule = () => {
    if (!isValid || !selectedJob || !selectedInterview) return;

    const sessionId = `session-${Date.now()}`;

    const candidates = selectedCandidateIds.map(id => {
      const app = mockApplications.find(a => a.id === id)!;
      return {
        id: app.candidateId,
        name: app.candidateName,
        avatar: app.avatar,
        applicationId: app.id
      };
    });

    const interviewers = selectedInterviewerIds.map(id => mockCompanyMembers.find(cm => cm.id === id)!);

    // Create participants list
    const candidateParticipants = selectedCandidateIds.map(appId => {
      const app = mockApplications.find(a => a.id === appId)!;
      const assignment = mockInterviewAssignments.find(
        a => a.interviewId === selectedInterview.id && a.applicationId === appId
      );
      const assignmentId = assignment ? assignment.id : `asg-${Date.now()}-${appId}`;
      return {
        id: `part-${Date.now()}-can-${appId}`,
        sessionId,
        participantType: 'CANDIDATE' as const,
        assignmentId
      };
    });

    const interviewerParticipants = selectedInterviewerIds.map(interviewerId => {
      return {
        id: `part-${Date.now()}-int-${interviewerId}`,
        sessionId,
        participantType: 'INTERVIEWER' as const,
        companyMemberId: interviewerId
      };
    });

    const participants = [...candidateParticipants, ...interviewerParticipants];

    const newSession: InterviewSession = {
      id: sessionId,
      assignmentId: candidateParticipants[0]?.assignmentId || `assignment-${Date.now()}`,
      interviewId: selectedInterview.id,
      jobId: selectedJob.id,
      applicationId: candidates[0]?.applicationId || '', // For individual fallback
      candidates,
      job: { id: selectedJob.id, title: selectedJob.title },
      interview: {
        id: selectedInterview.id,
        title: selectedInterview.title,
        type: selectedInterview.type,
        mode: selectedInterview.mode,
        durationMinutes: selectedInterview.durationMinutes
      },  
      interviewers,
      participants,
      scheduledAt: `${date}T${time}:00`,
      startedAt: null,
      endedAt: null,
      status: 'Upcoming',
      aiScore: null
    };

    onSchedule(newSession);
    
    // Reset form
    setJobId('');
    setInterviewId('');
    setSelectedCandidateIds([]);
    setSelectedInterviewerIds([]);
    setDate('');
    setTime('');
  };

  const toggleCandidate = (appId: string) => {
    if (isGroup) {
      setSelectedCandidateIds(prev => 
        prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
      );
    } else {
      setSelectedCandidateIds([appId]);
    }
  };

  const toggleInterviewer = (cmId: string) => {
    setSelectedInterviewerIds(prev => 
      prev.includes(cmId) ? prev.filter(id => id !== cmId) : [...prev, cmId]
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Schedule Interview</h2>
            <p className="text-sm text-slate-500 mt-1">Schedule an interview session with a candidate.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Step 1: Job Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs">1</span>
              Select Job
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select 
                value={jobId}
                onChange={e => setJobId(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
              >
                <option value="">Select a job...</option>
                {mockJobs.map(job => (
                  <option key={job.id} value={job.id}>{job.title} ({job.department})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 2: Interview Selection */}
          {jobId && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs">2</span>
                Select Interview
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableInterviews.map(interview => (
                  <div 
                    key={interview.id}
                    onClick={() => setInterviewId(interview.id)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all ${
                      interviewId === interview.id 
                        ? 'border-primary-500 bg-primary-50/50 shadow-sm ring-1 ring-primary-500' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm text-slate-900">{interview.title}</h4>
                      {interviewId === interview.id && <Check className="w-4 h-4 text-primary-600" />}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        interview.type === 'AI' ? 'bg-violet-50 text-violet-700 border-violet-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {interview.type}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-slate-50 text-slate-600 border-slate-200">
                        {interview.mode === 'GROUP' ? 'Group' : 'Individual'}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-slate-50 text-slate-600 border-slate-200 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {interview.durationMinutes}m
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Candidate Selection */}
          {interviewId && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs">3</span>
                {isGroup ? 'Select Candidates' : 'Select Candidate'}
              </label>
              
              {isGroup && (
                <p className="text-xs text-slate-500 mb-2">Select multiple candidates for this group session.</p>
              )}

              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {availableCandidates.map(app => {
                  const isSelected = selectedCandidateIds.includes(app.id);
                  return (
                    <div 
                      key={app.id}
                      onClick={() => toggleCandidate(app.id)}
                      className={`cursor-pointer p-3 rounded-lg border transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'border-primary-500 bg-primary-50/30' 
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                          {app.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{app.candidateName}</p>
                          <p className="text-xs text-slate-500">Stage: {app.stage}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'bg-primary-500 border-primary-500 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Interviewers */}
          {interviewId && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs">4</span>
                Select Interviewer(s)
              </label>
              {selectedInterview?.type === 'AI' && (
                <p className="text-xs text-slate-500 mb-2">Human interviewers are optional for AI interviews.</p>
              )}
              
              <div className="flex flex-wrap gap-2">
                {mockCompanyMembers.map(member => {
                  const isSelected = selectedInterviewerIds.includes(member.id);
                  return (
                    <button
                      key={member.id}
                      onClick={() => toggleInterviewer(member.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                        isSelected 
                          ? 'bg-slate-800 text-white border-slate-800' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {member.name}
                      {isSelected && <X className="w-3 h-3 opacity-70" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Date & Time */}
          {interviewId && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs">5</span>
                Date & Time
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {endTime && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-2">
                  <Clock className="w-3.5 h-3.5" />
                  Session ends at {endTime} ({selectedInterview?.durationMinutes} mins)
                </p>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-500">
            {isValid ? (
              <span className="text-emerald-600 font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Ready to schedule
              </span>
            ) : (
              'Please complete all required fields.'
            )}
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSchedule}
              disabled={!isValid}
              className="flex-1 sm:flex-none btn-primary px-6 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Schedule Interview
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
