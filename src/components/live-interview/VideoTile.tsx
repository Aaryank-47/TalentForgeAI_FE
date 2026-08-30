// ─────────────────────────────────────────────────────────────
// TalentForge AI — Video Tile (Phase 7 WebRTC)
// Single participant tile: renders local/remote video streams
// ─────────────────────────────────────────────────────────────
import React, { useRef, useEffect } from 'react';
import { MicOff, Pin, Hand, Monitor } from 'lucide-react';
import type { RoomParticipant } from '../../types/participant.types';
import { ConnectionIndicator } from './LiveInterviewTimer';
import { useInterview } from '../../context/InterviewContext';

interface VideoTileProps {
  participant: RoomParticipant;
  isLocal?: boolean;
  size?: 'large' | 'medium' | 'small';
  className?: string;
  isPinned?: boolean;
  onTogglePin?: () => void;
  isScreenShareView?: boolean;
}

const ROLE_LABELS: Record<string, string> = {
  recruiter: 'Recruiter',
  interviewer: 'Interviewer',
  candidate: 'Candidate',
};

const VideoStreamPlayer: React.FC<{ stream: MediaStream; muted?: boolean }> = ({ stream, muted = false }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      if (videoRef.current.srcObject !== stream) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => {
          console.warn('Video autoplay block or error:', err);
        });
      }
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted}
      className="absolute inset-0 w-full h-full object-cover z-0"
    />
  );
};

export const VideoTile: React.FC<VideoTileProps> = ({
  participant,
  isLocal = false,
  size = 'medium',
  className = '',
  isPinned = false,
  onTogglePin,
  isScreenShareView = false,
}) => {
  const { localStream, remoteStreams, isCameraOn: localCameraOn, isMicOn: localMicOn } = useInterview();

  const activeStream = isLocal ? localStream : remoteStreams[participant?.id];
  const isCameraActive = isLocal ? localCameraOn : participant?.isCameraOn;
  const isMicActive = isLocal ? localMicOn : participant?.isMicOn;
  const hasVideoFeed = (isCameraActive || isScreenShareView) && !!activeStream;

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
      className={`group relative bg-slate-900 overflow-hidden flex items-center justify-center ${sizeClasses} ${className} ${
        participant?.isSpeaking ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900' : ''
      }`}
    >
      {/* Video stream rendering */}
      {hasVideoFeed ? (
        <VideoStreamPlayer stream={activeStream} muted={isLocal} />
      ) : (
        /* Avatar fallback when camera is off */
        <div className="flex flex-col items-center gap-2 z-10">
          <div
            className={`rounded-full bg-gradient-to-br ${participant?.avatarColor || 'from-blue-500 to-blue-700'} flex items-center justify-center text-white font-bold flex-shrink-0 ${avatarSize}`}
          >
            {participant?.initials}
          </div>
          <p className={`text-slate-300 font-medium ${nameSize}`}>{participant?.name}</p>
        </div>
      )}

      {/* Speaking indicator overlay */}
      {participant && participant.isSpeaking && (
        <div className="absolute top-2 right-2 flex items-end gap-0.5 h-4 z-10">
          <div className="w-1 rounded-full bg-emerald-400 animate-speaking-bar" />
          <div className="w-1 rounded-full bg-emerald-400 animate-speaking-bar-2" />
          <div className="w-1 rounded-full bg-emerald-400 animate-speaking-bar-3" />
          <div className="w-1 rounded-full bg-emerald-400 animate-speaking-bar-4" />
        </div>
      )}

      {/* Badges container (Top Left) */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 z-20">
        {/* Screen sharing badge */}
        {(participant?.isScreenSharing || isScreenShareView) && (
          <div className="flex items-center gap-1 bg-blue-600/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
            <Monitor className="w-3 h-3" />
            <span>{isScreenShareView ? 'Screen Share' : 'Sharing'}</span>
          </div>
        )}

        {/* Hand raised */}
        {participant?.isHandRaised && (
          <div className="bg-amber-500 text-white p-1 rounded-full shadow">
            <Hand className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Pin / Unpin interactive button (Top Right) */}
      {onTogglePin && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin();
          }}
          title={isPinned ? 'Unpin from main view' : 'Pin to enlarge'}
          className={`absolute top-2 right-2 p-1.5 rounded-lg text-xs font-semibold backdrop-blur-md transition-all z-20 flex items-center gap-1 ${
            isPinned
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-black/50 hover:bg-black/80 text-white/80 hover:text-white opacity-0 group-hover:opacity-100'
          }`}
        >
          <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
          {isPinned && <span className="text-[10px] pr-0.5 hidden sm:inline">Pinned</span>}
        </button>
      )}

      {/* Bottom overlay bar */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 py-2 z-10 pointer-events-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`text-white font-semibold truncate ${nameSize}`}>
              {participant && participant.name}
              {isLocal && <span className="text-white/60 ml-1">(You)</span>}
              {isScreenShareView && <span className="text-blue-300 ml-1 text-[10px]">· Shared Screen</span>}
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`text-[9px] text-white/60 hidden sm:block`}>
              {participant && ROLE_LABELS[participant.role]}
            </span>
            <ConnectionIndicator status={participant?.connectionStatus} className="opacity-80" />
            {!isMicActive && !isScreenShareView && (
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
