// ─────────────────────────────────────────────────────────────
// TalentForge AI — Candidate Live Interview Room
// Fullscreen: header, video grid, control bar, candidate sidebar
// ─────────────────────────────────────────────────────────────
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import toast from 'react-hot-toast';

import { getInterviewById } from '../../../constants/interview.mock';
import { mockRoomParticipants, mockCurrentUserCandidate } from '../../../constants/participants.mock';
import { InterviewProvider, useInterview } from '../../../context/InterviewContext';
import { InterviewTimer, RecordingBadge, ConnectionIndicator } from '../../../components/live-interview/LiveInterviewTimer';
import { ParticipantGrid } from '../../../components/live-interview/ParticipantGrid';
import { ControlBar } from '../../../components/live-interview/ControlBar';
import { CandidateSidebar } from '../../../components/live-interview/CandidateSidebar';
import { ChatPanel } from '../../../components/live-interview/ChatPanel';
import type { LiveInterview } from '../../../types/interview.types';
import type { RoomParticipant } from '../../../types/participant.types';

// ─── Inner room ───────────────────────────────────────────────
const CandidateRoomInner: React.FC<{
  interview: LiveInterview;
  participants: RoomParticipant[];
}> = ({ interview, participants }) => {
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
  } = useInterview();

  useEffect(() => {
    const t = setTimeout(() => {
      joinRoom();
      toast.success('You joined the interview.', { duration: 2000 });
    }, 500);
    return () => clearTimeout(t);
  }, [joinRoom]);

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
              participants={participants}
              localUserId={mockCurrentUserCandidate.id}
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
            className={`transition-all duration-300 ease-in-out border-l border-slate-200 bg-white z-10 flex-shrink-0 ${
              activePanel ? 'w-80 translate-x-0' : 'w-0 translate-x-full border-l-0'
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
const CandidateLiveRoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const interview = getInterviewById(id ?? '');

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

  return (
    <InterviewProvider
      interview={interview}
      participants={mockRoomParticipants}
      currentUser={mockCurrentUserCandidate}
    >
      <CandidateRoomInner interview={interview} participants={mockRoomParticipants} />
    </InterviewProvider>
  );
};

export default CandidateLiveRoomPage;
