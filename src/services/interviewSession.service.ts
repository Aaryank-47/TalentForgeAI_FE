// ─────────────────────────────────────────────────────────────
// TalentForge AI — Interview Session Service Layer (Phase 6)
// Handles session logic, hydration, and CRUD mockup
// ─────────────────────────────────────────────────────────────
import type { LiveInterview, InterviewStatus, InterviewType as FEInterviewType } from '../types/interview.types';
import type {
  Interview,
  InterviewAssignment,
  InterviewSession,
  CompanyMember,
  SessionStatus,
  InterviewType
} from '../types/interviewSession.types';

// Helper to hydrate session with computed fields
export const hydrateSession = (session: InterviewSession): InterviewSession => {
  const candidates: InterviewSession['candidates'] = [];
  const interviewers: CompanyMember[] = [];
  
  let jobId = 'job-1';
  let jobTitle = 'Senior Frontend Developer';

  if (session.participants) {
    session.participants.forEach(p => {
      if (p.participantType === 'CANDIDATE' && p.assignmentId) {
        // Use backend hydrated data if available
        if (p.assignment?.application?.candidate) {
          const candidate = p.assignment.application.candidate;
          candidates.push({
            id: candidate.id,
            name: candidate.fullName,
            avatar: candidate.fullName.substring(0, 2).toUpperCase(),
            applicationId: p.assignment.application.id,
            email: candidate.user.email
          });
          jobId = p.assignment.application.jobId;
          jobTitle = p.assignment.application.job.title;
        }
      } else if (p.participantType === 'INTERVIEWER') {
        const u = p.companyMember?.user;
        const emp = u?.employer;
        const adm = u?.admin;
        const interviewerName = emp?.fullName || adm?.fullName || u?.email?.split('@')[0] || 'Interviewer';
        const department = emp?.department || adm?.department || 'Recruitment';
        const designation = emp?.designation || adm?.designation || p.companyMember?.role || 'Interviewer';
        
        interviewers.push({
          id: p.id,
          name: interviewerName,
          role: designation,
          department: department,
          email: u?.email || '',
          avatar: interviewerName.substring(0, 2).toUpperCase(),
          initials: interviewerName.substring(0, 2).toUpperCase(),
          avatarColor: 'from-slate-500 to-slate-700'
        });
      }
    });
  }

  return {
    ...session,
    interview: session.interview ? {
      id: session.interview.id,
      title: session.interview.title,
      type: session.interview.type,
      mode: session.interview.mode,
      durationMinutes: session.interview.durationMinutes
    } : undefined,
    job: {
      id: jobId,
      title: jobTitle
    },
    candidates,
    interviewers,
    assignmentId: session.participants?.find(p => p.participantType === 'CANDIDATE')?.assignmentId || '',
    jobId,
    applicationId: candidates[0]?.applicationId || '',
    aiScore: null
  };
};

// Adapter function to convert InterviewSession into FE LiveInterview shape
export const toLiveInterview = (session: InterviewSession): LiveInterview => {
  const hydrated = hydrateSession(session);
  const candName = hydrated.candidates?.map(c => c.name).join(', ') || 'No Candidate';
  const firstCand = hydrated.candidates?.[0];
  const dateObj = new Date(session.scheduledAt);
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  const statusMap: Record<SessionStatus, InterviewStatus> = {
    SCHEDULED: 'Scheduled',
    IN_PROGRESS: 'Live',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    EXPIRED: 'Missed',
    Upcoming: 'Upcoming',
    Live: 'Live',
    Today: 'Today'
  };

  const typeMap: Record<InterviewType, FEInterviewType> = {
    AI: 'Technical',
    NORMAL: 'Technical'
  };

  return {
    id: hydrated.id,
    title: hydrated.interview?.title || 'Interview Session',
    type: hydrated.interview?.type ? typeMap[hydrated.interview.type] : 'Technical',
    status: statusMap[hydrated.status] || 'Scheduled',
    meetingType: 'video',
    jobId: hydrated.jobId || 'job-1',
    jobTitle: hydrated.job?.title || 'Senior Frontend Developer',
    company: 'TalentForge Client',
    companyLogo: 'TF',
    companyColor: 'bg-primary-600',
    candidateId: firstCand?.id || 'can-1',
    candidateName: candName,
    candidateInitials: firstCand?.avatar || 'TF',
    candidateAvatarColor: 'from-primary-500 to-primary-700',
    candidateEmail: firstCand?.email || 'candidate@email.com',
    recruiterIds: hydrated.interviewers?.map(i => i.id) || [],
    date: formattedDate,
    dateISO: session.scheduledAt.split('T')[0],
    timeStart: formattedTime,
    timeEnd: new Date(dateObj.getTime() + (hydrated.interview?.durationMinutes || 45) * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    duration: `${hydrated.interview?.durationMinutes || 45} min` as any,
    timezone: 'IST (UTC+5:30)',
    settings: {
      allowCamera: true,
      allowMicrophone: true,
      allowScreenShare: true,
      instructions: 'Please join the session on time.'
    },
    createdAt: new Date().toISOString(),
    createdBy: 'cm-1',
    recordingEnabled: true,
    roomId: `room_${hydrated.id}`
  };
};

export const getInterviews = (): Interview[] => {
  return [];
};

export const getInterviewAssignments = (): InterviewAssignment[] => {
  return [];
};

export const getInterviewSessions = (): InterviewSession[] => {
  return [];
};

export const getInterviewSessionById = (): InterviewSession | undefined => {
  return undefined;
};

export const createInterviewSession = (): InterviewSession | undefined => {
  return undefined;
};

export const cancelInterviewSession = (sessionId: string): boolean => {
  return true;
};

export const rescheduleInterviewSession = (sessionId: string, scheduledAt: string): boolean => {
  return true;
};
