// ─────────────────────────────────────────────────────────────
// TalentForge AI — Participant Grid
// Responsive video grid: supports 1+1, 2+1, 3+1 layouts
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { Maximize, Minimize } from 'lucide-react';
import type { RoomParticipant } from '../../types/participant.types';
import { VideoTile } from './VideoTile';
import { useInterview } from '../../context/InterviewContext';

interface ParticipantGridProps {
  participants: RoomParticipant[];
  localUserId: string;
  className?: string;
}

export const ParticipantGrid: React.FC<ParticipantGridProps> = ({
  participants,
  localUserId,
  className = '',
}) => {
  const { isCinemaMode, toggleCinemaMode } = useInterview();

  const total = participants.length;
  const localParticipant = participants.find((p) => p.id === localUserId);
  const remoteParticipants = participants.filter((p) => p.id !== localUserId);
  const sharingParticipant = participants.find((p) => p.isScreenSharing);

  // ── Screen Share Layout ─────────────────────────────────────
  if (sharingParticipant) {
    const others = participants.filter((p) => p.id !== sharingParticipant.id);
    return (
      <div className={`w-full h-full flex ${isCinemaMode ? '' : 'gap-2'} ${className}`}>
        {/* Main large tile for screen share */}
        <div className="flex-1 relative bg-slate-900 rounded-2xl overflow-hidden group">
          <VideoTile
            participant={sharingParticipant}
            isLocal={sharingParticipant.id === localUserId}
            size="large"
            className="w-full h-full"
          />
          <button
            onClick={toggleCinemaMode}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-30"
          >
            {isCinemaMode ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Side strip for cameras (hidden in cinema mode) */}
        {!isCinemaMode && (
          <div className="w-40 flex flex-col gap-2 overflow-y-auto">
            <VideoTile
              participant={{ ...sharingParticipant, isScreenSharing: false }}
              isLocal={sharingParticipant.id === localUserId}
              size="small"
              className="w-full h-28 flex-shrink-0"
            />
            {others.map((p) => (
              <VideoTile
                key={p.id}
                participant={p}
                isLocal={p.id === localUserId}
                size="small"
                className="w-full h-28 flex-shrink-0"
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── 1 participant (self only — unlikely but handle it) ──────
  if (total === 1 && localParticipant) {
    return (
      <div className={`w-full h-full ${className}`}>
        <VideoTile
          participant={localParticipant}
          isLocal
          size="large"
          className="w-full h-full"
        />
      </div>
    );
  }

  // ── 2 participants (1 recruiter + 1 candidate) ──────────────
  if (total === 2) {
    return (
      <div className={`w-full h-full grid grid-cols-2 gap-2 ${className}`}>
        {participants.map((p) => (
          <VideoTile
            key={p.id}
            participant={p}
            isLocal={p.id === localUserId}
            size="large"
            className="w-full h-full"
          />
        ))}
      </div>
    );
  }

  // ── 3 participants (2 recruiters + 1 candidate) ─────────────
  if (total === 3) {
    return (
      <div className={`w-full h-full flex flex-col gap-2 ${className}`}>
        {/* Top: 2 remote participants */}
        <div className="flex-1 grid grid-cols-2 gap-2">
          {remoteParticipants.map((p) => (
            <VideoTile
              key={p.id}
              participant={p}
              isLocal={p.id === localUserId}
              size="medium"
              className="w-full h-full"
            />
          ))}
        </div>
        {/* Bottom: local participant smaller */}
        {localParticipant && (
          <div className="h-40 flex justify-center">
            <VideoTile
              participant={localParticipant}
              isLocal
              size="medium"
              className="w-80 h-full"
            />
          </div>
        )}
      </div>
    );
  }

  // ── 4 participants (3 recruiters + 1 candidate) ─────────────
  if (total === 4) {
    return (
      <div className={`w-full h-full grid grid-cols-2 grid-rows-2 gap-2 ${className}`}>
        {participants.map((p) => (
          <VideoTile
            key={p.id}
            participant={p}
            isLocal={p.id === localUserId}
            size="medium"
            className="w-full h-full"
          />
        ))}
      </div>
    );
  }

  // ── 5+ participants: prominent main view + sidebar strip ────
  const [mainParticipant, ...rest] = participants;
  return (
    <div className={`w-full h-full flex gap-2 ${className}`}>
      {/* Main large tile */}
      <div className="flex-1">
        <VideoTile
          participant={mainParticipant}
          isLocal={mainParticipant.id === localUserId}
          size="large"
          className="w-full h-full"
        />
      </div>
      {/* Side strip */}
      <div className="w-40 flex flex-col gap-2 overflow-y-auto">
        {rest.map((p) => (
          <VideoTile
            key={p.id}
            participant={p}
            isLocal={p.id === localUserId}
            size="small"
            className="w-full h-28 flex-shrink-0"
          />
        ))}
      </div>
    </div>
  );
};

export default ParticipantGrid;
