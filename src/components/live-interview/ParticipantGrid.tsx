// ─────────────────────────────────────────────────────────────
// TalentForge AI — Participant Grid & Pinning Feature
// Supports:
// 1. Auto-pinning & enlarging the latest shared screen for all participants
// 2. Manual Pin / Unpin controls on any video or screen share tile
// 3. Multi-screenshare switcher when multiple candidates/interviewers share screens
// 4. Smooth fallback to equal responsive grid (1, 2, 3, 4, 5+ layouts)
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect, useMemo } from 'react';
import { Maximize, Minimize, Pin, Monitor, Grid, Users } from 'lucide-react';
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

  // User-selected manual pinned participant ID (or null for auto / grid)
  const [userPinnedId, setUserPinnedId] = useState<string | null>(null);

  // Track active screen shares
  const sharingParticipants = useMemo(
    () => participants.filter((p) => p.isScreenSharing),
    [participants]
  );

  // Auto-pin the latest screen share whenever a new one starts
  const [latestShareId, setLatestShareId] = useState<string | null>(null);

  useEffect(() => {
    if (sharingParticipants.length > 0) {
      // Pick the last participant who started sharing
      const newest = sharingParticipants[sharingParticipants.length - 1];
      if (newest && newest.id !== latestShareId) {
        setLatestShareId(newest.id);
        // Automatically pin the latest screen share unless user pinned another user explicitly
        if (!userPinnedId) {
          setUserPinnedId(null);
        }
      }
    } else {
      setLatestShareId(null);
    }
  }, [sharingParticipants, latestShareId, userPinnedId]);

  // Determine active pinned participant
  // 1. User manual pin takes priority
  // 2. Otherwise if screen shares exist, default to the latest screen share
  const activePinnedId = useMemo(() => {
    if (userPinnedId) {
      // Verify userPinnedId still exists in participants
      if (participants.some((p) => p.id === userPinnedId)) {
        return userPinnedId;
      }
    }
    if (sharingParticipants.length > 0) {
      // Find latest share or first share
      if (latestShareId && sharingParticipants.some((p) => p.id === latestShareId)) {
        return latestShareId;
      }
      return sharingParticipants[0].id;
    }
    return null;
  }, [userPinnedId, sharingParticipants, latestShareId, participants]);

  const handleTogglePin = (id: string) => {
    if (activePinnedId === id) {
      // If user unpins the currently pinned item
      setUserPinnedId(null);
      setLatestShareId(null);
    } else {
      // User explicitly pins this participant
      setUserPinnedId(id);
    }
  };

  const localParticipant = participants.find((p) => p.id === localUserId);
  const remoteParticipants = participants.filter((p) => p.id !== localUserId);
  const total = participants.length;

  // ── 1. PINNED / ENLARGED VIEW (Active Pin or Screen Share) ───
  if (activePinnedId) {
    const pinnedParticipant = participants.find((p) => p.id === activePinnedId);
    if (pinnedParticipant) {
      const isPinnedScreenShare = pinnedParticipant.isScreenSharing;
      const otherParticipants = participants.filter((p) => p.id !== pinnedParticipant.id);

      return (
        <div className={`w-full h-full flex flex-col gap-2 ${className}`}>
          {/* Multi-screen share navigation bar if multiple members share screen */}
          {sharingParticipants.length > 1 && (
            <div className="flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/50 flex-shrink-0 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-blue-400 animate-pulse" />
                <span className="font-semibold text-white">Multiple Screen Shares Active:</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {sharingParticipants.map((sp) => {
                  const isActive = sp.id === activePinnedId;
                  return (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => {
                        setUserPinnedId(sp.id);
                        setLatestShareId(sp.id);
                      }}
                      className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <Monitor className="w-3 h-3" />
                      <span>{sp.name} {sp.id === localUserId ? '(You)' : ''}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main Stage & Side Thumbnails */}
          <div className="flex-1 flex gap-2 min-h-0 relative">
            {/* Main enlarged stage */}
            <div className="flex-1 relative bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80 group" id="main-stage-container">
              <VideoTile
                participant={pinnedParticipant}
                isLocal={pinnedParticipant.id === localUserId}
                size="large"
                isPinned
                onTogglePin={() => handleTogglePin(pinnedParticipant.id)}
                isScreenShareView={isPinnedScreenShare}
                className="w-full h-full object-contain"
              />

              {/* Stage Overlay Controls (Top Right) */}
              <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                <button
                  type="button"
                  onClick={() => handleTogglePin(pinnedParticipant.id)}
                  title="Unpin and return to grid"
                  className="p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg backdrop-blur-md transition-all flex items-center gap-1 text-xs font-semibold shadow-lg border border-slate-700/50"
                >
                  <Pin className="w-3.5 h-3.5 fill-current text-primary-400" />
                  <span>Unpin</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('main-stage-container');
                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                    } else if (el) {
                      el.requestFullscreen();
                    }
                  }}
                  title="Toggle Fullscreen"
                  className="p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg backdrop-blur-md transition-all shadow-lg border border-slate-700/50"
                >
                  {document.fullscreenElement ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </div>

              {/* Pinned Label (Top Left) */}
              <div className="absolute top-3 left-3 flex items-center gap-2 z-20 pointer-events-none">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white text-xs font-semibold shadow">
                  {isPinnedScreenShare ? (
                    <>
                      <Monitor className="w-3.5 h-3.5 text-blue-400" />
                      <span>{pinnedParticipant.name}'s Shared Screen</span>
                    </>
                  ) : (
                    <>
                      <Pin className="w-3.5 h-3.5 text-amber-400 fill-current" />
                      <span>Pinned: {pinnedParticipant.name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Side Strip of Participant Thumbnails */}
            {!isCinemaMode && (
              <div className="w-48 flex flex-col gap-2 overflow-y-auto pr-0.5 flex-shrink-0">
                {/* If the pinned item is a screenshare, also show that participant's camera in the strip */}
                {isPinnedScreenShare && (
                  <VideoTile
                    participant={{ ...pinnedParticipant, isScreenSharing: false }}
                    isLocal={pinnedParticipant.id === localUserId}
                    size="small"
                    onTogglePin={() => handleTogglePin(pinnedParticipant.id)}
                    className="w-full h-32 flex-shrink-0"
                  />
                )}

                {otherParticipants.map((p) => (
                  <VideoTile
                    key={p.id}
                    participant={p}
                    isLocal={p.id === localUserId}
                    size="small"
                    isPinned={false}
                    onTogglePin={() => handleTogglePin(p.id)}
                    className="w-full h-32 flex-shrink-0"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  // ── 2. STANDARD EQUAL GRID VIEW (No Pin Active) ─────────────
  if (total === 1 && localParticipant) {
    return (
      <div className={`w-full h-full ${className}`}>
        <VideoTile
          participant={localParticipant}
          isLocal
          size="large"
          onTogglePin={() => handleTogglePin(localParticipant.id)}
          className="w-full h-full"
        />
      </div>
    );
  }

  if (total === 2) {
    return (
      <div className={`w-full h-full grid grid-cols-2 gap-2 ${className}`}>
        {participants.map((p) => (
          <VideoTile
            key={p.id}
            participant={p}
            isLocal={p.id === localUserId}
            size="large"
            onTogglePin={() => handleTogglePin(p.id)}
            className="w-full h-full"
          />
        ))}
      </div>
    );
  }

  if (total === 3) {
    return (
      <div className={`w-full h-full flex flex-col gap-2 ${className}`}>
        <div className="flex-1 grid grid-cols-2 gap-2">
          {remoteParticipants.map((p) => (
            <VideoTile
              key={p.id}
              participant={p}
              isLocal={p.id === localUserId}
              size="medium"
              onTogglePin={() => handleTogglePin(p.id)}
              className="w-full h-full"
            />
          ))}
        </div>
        {localParticipant && (
          <div className="h-40 flex justify-center">
            <VideoTile
              participant={localParticipant}
              isLocal
              size="medium"
              onTogglePin={() => handleTogglePin(localParticipant.id)}
              className="w-80 h-full"
            />
          </div>
        )}
      </div>
    );
  }

  if (total === 4) {
    return (
      <div className={`w-full h-full grid grid-cols-2 grid-rows-2 gap-2 ${className}`}>
        {participants.map((p) => (
          <VideoTile
            key={p.id}
            participant={p}
            isLocal={p.id === localUserId}
            size="medium"
            onTogglePin={() => handleTogglePin(p.id)}
            className="w-full h-full"
          />
        ))}
      </div>
    );
  }

  // 5+ participants: 2x3 or responsive grid
  return (
    <div className={`w-full h-full grid grid-cols-3 gap-2 overflow-y-auto ${className}`}>
      {participants.map((p) => (
        <VideoTile
          key={p.id}
          participant={p}
          isLocal={p.id === localUserId}
          size="medium"
          onTogglePin={() => handleTogglePin(p.id)}
          className="w-full h-48"
        />
      ))}
    </div>
  );
};

export default ParticipantGrid;
