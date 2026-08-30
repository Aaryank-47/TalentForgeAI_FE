// ─────────────────────────────────────────────────────────────
// TalentForge AI — Candidate Live Interview Room
// Fullscreen: header, video grid, control bar, candidate sidebar
// ─────────────────────────────────────────────────────────────
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import toast from 'react-hot-toast';

import { InterviewProvider, useInterview } from '../../../context/InterviewContext';
import { InterviewTimer, RecordingBadge, ConnectionIndicator } from '../../../components/live-interview/LiveInterviewTimer';
import { ParticipantGrid } from '../../../components/live-interview/ParticipantGrid';
import { ControlBar } from '../../../components/live-interview/ControlBar';
import { CandidateSidebar } from '../../../components/live-interview/CandidateSidebar';
import { ChatPanel } from '../../../components/live-interview/ChatPanel';
import type { LiveInterview } from '../../../types/interview.types';

// ─── Inner room ───────────────────────────────────────────────
const CandidateRoomInner: React.FC<{
  interview: LiveInterview;
}> = ({ interview }) => {
  const navigate = useNavigate();
  const {
    elapsedSeconds,
    isRecording,
    connectionStatus,
    isRoomJoined,
    joinRoom,
    leaveRoom,
    activePanel,
    isCinemaMode,
    participants,
    currentUser,
    currentInterview,
    isMicOn: localIsMicOn,
    isCameraOn: localIsCameraOn,
    isScreenSharing: localIsScreenSharing,
  } = useInterview();

  const allParticipants = React.useMemo(() => {
    const list = [...participants];
    if (currentUser && !list.some(p => p.id === currentUser.id)) {
      list.unshift({
        id: currentUser.id,
        name: currentUser.name,
        initials: currentUser.initials,
        role: currentUser.role,
        title: currentUser.title || 'User',
        email: '',
        avatarColor: currentUser.avatarColor || 'bg-blue-500',
        isMicOn: localIsMicOn,
        isCameraOn: localIsCameraOn,
        isSpeaking: false,
        isScreenSharing: localIsScreenSharing,
        connectionStatus: 'excellent'
      });
    } else if (currentUser) {
      return list.map(p => p.id === currentUser.id ? {
        ...p,
        isMicOn: localIsMicOn,
        isCameraOn: localIsCameraOn,
        isScreenSharing: localIsScreenSharing
      } : p);
    }
    return list;
  }, [participants, currentUser, localIsMicOn, localIsCameraOn, localIsScreenSharing]);

  useEffect(() => {
    const t = setTimeout(() => {
      joinRoom();
      toast.success('You joined the interview.', { duration: 2000 });
    }, 500);
    return () => clearTimeout(t);
  }, [joinRoom]);

  useEffect(() => {
    if (currentInterview?.status === 'Completed') {
      toast.success('The interview has ended. Redirecting to feedback...', { duration: 3000 });
      // add a small delay so they can read the toast
      const t = setTimeout(() => {
        handleLeave();
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [currentInterview?.status]);

  const handleLeave = () => {
    leaveRoom();
    toast('You left the interview.', { icon: '👋' });
    navigate(`/candidate/live-interviews/${interview.id}/feedback`);
  };

  return (
    <div className="h-screen w-screen bg-slate-100 flex flex-col overflow-hidden font-sans">
      {/* ── Header ────────────────────────────────────────────── */}
      {!isCinemaMode && (
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0 z-10">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-7 h-7 rounded-lg ${interview.companyColor} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}
            >
              {interview.companyLogo}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate max-w-[200px] hidden sm:block">
                {interview.title}
              </p>
              <p className="text-[10px] text-slate-500 hidden md:block">{interview.type} Interview</p>
            </div>
          </div>

          {/* Center */}
          <div className="flex items-center gap-3">
            {isRoomJoined && (
              <InterviewTimer
                elapsedSeconds={elapsedSeconds}
                scheduledDuration={interview.duration}
              />
            )}
            <RecordingBadge isRecording={isRecording} />
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <ConnectionIndicator status={connectionStatus} showLabel className="hidden md:flex" />
            <div className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
              <Shield className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-700 font-semibold">Encrypted</span>
            </div>
          </div>
        </header>
      )}

      {/* ── Body ──────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 p-3 overflow-hidden">
            <ParticipantGrid
              participants={allParticipants}
              localUserId={currentUser?.id || ''}
              className="w-full h-full"
            />
          </div>

          {/* Chat overlay for mobile */}
          {activePanel === 'chat' && (
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-slate-200 flex flex-col z-30 xl:hidden shadow-xl">
              <ChatPanel />
            </div>
          )}
        </div>

        {/* Right Sidebar (Conditionally visible) */}
        {!isCinemaMode && (
          <div
            className={`transition-all duration-300 ease-in-out border-l border-slate-200 bg-white z-10 flex-shrink-0 ${activePanel ? 'w-80 translate-x-0' : 'w-0 translate-x-full border-l-0'
              }`}
          >
            {activePanel && (
              <div className="h-full w-80">
                <CandidateSidebar interview={interview} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Control Bar ───────────────────────────────────────── */}
      {!isCinemaMode && (
        <ControlBar
          mode="candidate"
          onLeave={handleLeave}
        />
      )}
    </div>
  );
};

// ─── Outer ───────────────────────────────────────────────────
import { useQuery } from '@tanstack/react-query';
import { interviewApi } from '../../../services/api/interview.api';

const CandidateLiveRoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: sessionResponse, isLoading } = useQuery({
    queryKey: ['candidateSession', id],
    queryFn: () => interviewApi.getCandidateSessionDetails(id as string),
    enabled: !!id,
  });

  const toCandidateLiveInterview = (dto: any): LiveInterview => ({
    id: dto.sessionId || dto.id,
    title: dto.interviewTitle || dto.interview?.title || dto.role || 'Interview',
    type: dto.interviewType?.includes('AI') ? 'Technical' : 'Technical',
    status: dto.status === 'EXPIRED' ? 'Missed' : dto.status === 'COMPLETED' ? 'Completed' : dto.status === 'IN_PROGRESS' ? 'Live' : 'Scheduled',
    meetingType: 'video',
    jobId: dto.id,
    jobTitle: dto.role || dto.interviewTitle || 'Software Developer',
    company: dto.company || 'Company',
    companyLogo: dto.companyLogo || 'C',
    companyColor: dto.companyColor || 'bg-primary-600',
    candidateId: 'me',
    candidateName: 'Me',
    candidateInitials: 'ME',
    candidateAvatarColor: 'from-blue-500 to-blue-700',
    candidateEmail: '',
    recruiterIds: [],
    date: dto.assignedDate || new Date().toLocaleDateString(),
    dateISO: new Date().toISOString(),
    timeStart: '10:00 AM',
    timeEnd: '11:00 AM',
    duration: `${dto.durationMinutes || 45} min` as any,
    timezone: 'IST',
    settings: {
      allowCamera: true,
      allowMicrophone: true,
      allowScreenShare: true,
      instructions: ''
    },
    createdAt: new Date().toISOString(),
    createdBy: '',
    recordingEnabled: true,
    roomId: dto.sessionId,
    aiScore: dto.aiScore || null,
    recommendation: dto.recommendation,
  });

  const session = (sessionResponse as any)?.data || sessionResponse;
  const interview = session ? toCandidateLiveInterview(session) : null;

  if (isLoading) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading interview...</p>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-900 font-semibold mb-3">Interview not found.</p>
          <button onClick={() => navigate('/candidate/live-interviews')} className="text-sm text-primary-600 underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  if (interview.status !== 'Live') {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            ⏳
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Interview Not Started</h3>
          <p className="text-sm text-slate-600 mb-6">
            Interview has not started by the interviewer. Please wait until the interviewer starts the session.
          </p>
          <button
            onClick={() => navigate(`/candidate/live-interviews/${interview.id}`)}
            className="btn-primary text-sm w-full py-2.5"
          >
            Back to Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <InterviewProvider
      interview={interview}
    >
      <CandidateRoomInner interview={interview} />
    </InterviewProvider>
  );
};

export default CandidateLiveRoomPage;
