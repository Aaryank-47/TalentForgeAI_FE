// ─────────────────────────────────────────────────────────────
// TalentForge AI — Recruiter Live Interview Room
// Fullscreen: header, video grid, control bar, right sidebar
// ─────────────────────────────────────────────────────────────
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

import { getInterviewById } from '../../../constants/interview.mock';
import { mockRoomParticipants, mockCurrentUserRecruiter } from '../../../constants/participants.mock';
import { InterviewProvider, useInterview } from '../../../context/InterviewContext';
import { InterviewTimer, RecordingBadge, ConnectionIndicator } from '../../../components/live-interview/LiveInterviewTimer';
import { ParticipantGrid } from '../../../components/live-interview/ParticipantGrid';
import { ControlBar } from '../../../components/live-interview/ControlBar';
import { RecruiterSidebar } from '../../../components/live-interview/RecruiterSidebar';
import { ChatPanel } from '../../../components/live-interview/ChatPanel';
import { ParticipantList } from '../../../components/live-interview/ParticipantList';
import { NotesPanel } from '../../../components/live-interview/NotesPanel';
import type { LiveInterview } from '../../../types/interview.types';
import type { RoomParticipant } from '../../../types/participant.types';

// ─── Inner room (needs InterviewProvider) ─────────────────────
const RoomInner: React.FC<{
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
    endInterview,
    leaveRoom,
    activePanel,
    setActivePanel,
    isCinemaMode,
  } = useInterview();

  useEffect(() => {
    // Auto-join on mount with a brief delay for UX
    const t = setTimeout(() => {
      joinRoom();
      toast.success('You joined the interview room.', { duration: 2000 });
    }, 500);
    return () => clearTimeout(t);
  }, [joinRoom]);

  const handleLeave = () => {
    leaveRoom();
    toast('You left the interview.', { icon: '👋' });
    navigate(`/recruiter/live-interviews/${interview.id}`);
  };

  const handleEnd = () => {
    endInterview();
    toast.success('Interview ended for all participants.');
    navigate(`/recruiter/live-interviews/${interview.id}/feedback`);
  };

  return (
    <div className="h-screen w-screen bg-slate-100 flex flex-col overflow-hidden font-sans">
      {/* ── Header ────────────────────────────────────────────── */}
      {!isCinemaMode && (
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0 z-10">
          {/* Left: interview info */}
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

          {/* Center: timer + recording */}
          <div className="flex items-center gap-3">
            {isRoomJoined && (
              <InterviewTimer
                elapsedSeconds={elapsedSeconds}
                scheduledDuration={interview.duration}
              />
            )}
            <RecordingBadge isRecording={isRecording} />
          </div>

          {/* Right: connection + settings */}
          <div className="flex items-center gap-3">
            <ConnectionIndicator status={connectionStatus} showLabel className="hidden md:flex" />
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <Shield className="w-3 h-3 text-emerald-500" />
              <span className="font-semibold">Encrypted</span>
            </div>
            <button
              onClick={() => setActivePanel(activePanel === 'settings' ? null : 'settings')}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* ── Body ──────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-3 overflow-hidden">
            <ParticipantGrid
              participants={participants}
              localUserId={mockCurrentUserRecruiter.id}
              className="w-full h-full"
            />
          </div>

          {/* Overlay panels (chat / participants / notes when sidebar hidden on small screens) */}
          {activePanel && (
            <div className="absolute right-0 top-14 bottom-[72px] w-80 bg-white border-l border-slate-200 flex flex-col z-30 xl:hidden shadow-xl">
              {activePanel === 'chat' && <ChatPanel />}
              {activePanel === 'participants' && (
                <ParticipantList
                  participants={participants}
                  localUserId={mockCurrentUserRecruiter.id}
                />
              )}
              {activePanel === 'notes' && <NotesPanel />}
            </div>
          )}
        </div>

        {/* Right Sidebar (Conditionally visible) */}
        {!isCinemaMode && (
          <div className="hidden xl:flex">
            <RecruiterSidebar
              interview={interview}
              participants={participants}
              localUserId={mockCurrentUserRecruiter.id}
            />
          </div>
        )}
      </div>

      {/* ── Control Bar ───────────────────────────────────────── */}
      {!isCinemaMode && (
        <ControlBar
          mode="recruiter"
          onLeave={handleLeave}
          onEnd={handleEnd}
        />
      )}
    </div>
  );
};

// ─── Outer: loads interview data, wraps with provider ─────────
const RecruiterLiveRoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const interview = getInterviewById(id ?? '');

  if (!interview) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-900 font-semibold mb-3">Interview not found.</p>
          <button
            onClick={() => navigate('/recruiter/live-interviews')}
            className="text-sm text-primary-600 underline"
          >
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
      currentUser={mockCurrentUserRecruiter}
    >
      <RoomInner interview={interview} participants={mockRoomParticipants} />
    </InterviewProvider>
  );
};

export default RecruiterLiveRoomPage;
