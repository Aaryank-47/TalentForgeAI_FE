// ─────────────────────────────────────────────────────────────
// TalentForge AI — Video Tile
// Single participant tile in the video grid
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { MicOff, Pin, Hand, Monitor } from 'lucide-react';
import type { RoomParticipant } from '../../types/participant.types';
import { ConnectionIndicator } from './LiveInterviewTimer';
import { useMedia } from '../../context/MediaProvider';
import { CameraPreview, ScreenPreview } from '../../modules/shared/system-check/SystemCheck';

interface VideoTileProps {
  participant: RoomParticipant;
  isLocal?: boolean;
  size?: 'large' | 'medium' | 'small';
  className?: string;
}

const ROLE_LABELS: Record<string, string> = {
  recruiter: 'Recruiter',
  interviewer: 'Interviewer',
  candidate: 'Candidate',
};

export const VideoTile: React.FC<VideoTileProps> = ({
  participant,
  isLocal = false,
  size = 'medium',
  className = '',
}) => {
  let media: any = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    media = useMedia();
  } catch (e) {
    // ignore if not in MediaProvider
  }

  const sizeClasses = {
    large: 'rounded-2xl',
    medium: 'rounded-xl',
    small: 'rounded-lg',
  }[size];

  const avatarSize = {
    large: 'w-20 h-20 text-3xl',
    medium: 'w-14 h-14 text-xl',
    small: 'w-10 h-10 text-sm',
  }[size];

  const nameSize = {
    large: 'text-sm',
    medium: 'text-xs',
    small: 'text-[10px]',
  }[size];

  return (
    <div
      className={`relative bg-slate-800 overflow-hidden flex items-center justify-center ${sizeClasses} ${className} ${
        participant.isSpeaking ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-50' : ''
      }`}
    >
      {/* Camera off: show avatar */}
      {!participant.isCameraOn && (
        <div className="flex flex-col items-center gap-2">
          <div
            className={`rounded-full bg-gradient-to-br ${participant.avatarColor} flex items-center justify-center text-white font-bold flex-shrink-0 ${avatarSize}`}
          >
            {participant.initials}
          </div>
          <p className={`text-slate-300 font-medium ${nameSize}`}>{participant.name}</p>
        </div>
      )}

      {/* Camera on: show preview or mock gradient */}
      {participant.isCameraOn && (
        <>
          {isLocal && media?.cameraStream ? (
            <div className="absolute inset-0">
              <CameraPreview stream={media.cameraStream} faceState={media.faceState} label="" compact={true} />
            </div>
          ) : (
            <>
              <div
                className={`absolute inset-0 bg-gradient-to-br ${participant.avatarColor} opacity-30`}
              />
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div
                  className={`rounded-full bg-gradient-to-br ${participant.avatarColor} flex items-center justify-center text-white font-bold ring-4 ring-white/20 ${avatarSize}`}
                >
                  {participant.initials}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Screen share overrides camera if active */}
      {participant.isScreenSharing && isLocal && media?.screenStream && (
        <div className="absolute inset-0 z-20 bg-slate-900">
          <ScreenPreview stream={media.screenStream} label="" compact={false} />
        </div>
      )}

      {/* Speaking indicator overlay */}
      {participant.isSpeaking && (
        <div className="absolute top-2 right-2 flex items-end gap-0.5 h-4">
          <div className="w-1 rounded-full bg-emerald-400 animate-speaking-bar" />
          <div className="w-1 rounded-full bg-emerald-400 animate-speaking-bar-2" />
          <div className="w-1 rounded-full bg-emerald-400 animate-speaking-bar-3" />
          <div className="w-1 rounded-full bg-emerald-400 animate-speaking-bar-4" />
        </div>
      )}

      {/* Screen sharing badge */}
      {participant.isScreenSharing && (
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-blue-600 text-white text-[9px] font-bold px-2 py-1 rounded-full">
          <Monitor className="w-3 h-3" />
          Sharing
        </div>
      )}

      {/* Pin badge */}
      {participant.isPinned && (
        <div className="absolute top-2 left-2 bg-white/20 text-white p-1 rounded-full">
          <Pin className="w-3 h-3" />
        </div>
      )}

      {/* Hand raised */}
      {participant.isHandRaised && (
        <div className="absolute top-2 right-10 bg-amber-500 text-white p-1 rounded-full">
          <Hand className="w-3 h-3" />
        </div>
      )}

      {/* Bottom bar */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`text-white font-semibold truncate ${nameSize}`}>
              {participant.name}
              {isLocal && <span className="text-white/60 ml-1">(You)</span>}
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`text-[9px] text-white/60 hidden sm:block`}>
              {ROLE_LABELS[participant.role]}
            </span>
            <ConnectionIndicator status={participant.connectionStatus} className="opacity-80" />
            {!participant.isMicOn && (
              <div className="bg-red-500 p-0.5 rounded-full">
                <MicOff className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTile;
