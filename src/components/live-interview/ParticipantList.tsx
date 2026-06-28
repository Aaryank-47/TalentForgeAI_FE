// ─────────────────────────────────────────────────────────────
// TalentForge AI — Participant List Panel
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { Mic, MicOff, Camera, CameraOff, Monitor, Crown } from 'lucide-react';
import type { RoomParticipant } from '../../types/participant.types';
import { ConnectionIndicator } from './LiveInterviewTimer';

interface ParticipantListProps {
  participants: RoomParticipant[];
  localUserId: string;
}

const ROLE_BADGE: Record<string, string> = {
  recruiter: 'bg-primary-50 text-primary-700 border-primary-200',
  interviewer: 'bg-violet-50 text-violet-700 border-violet-200',
  candidate: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  localUserId,
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2 flex-shrink-0">
        <span className="text-sm font-bold text-slate-900">Participants</span>
        <span className="ml-1 text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
          {participants.length}
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {participants.map((p) => {
          const isLocal = p.id === localUserId;
          const isHost = p.role === 'recruiter';

          return (
            <div
              key={p.id}
              className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${p.avatarColor} flex items-center justify-center text-white text-xs font-bold`}
                >
                  {p.initials}
                </div>
                {/* Speaking ring */}
                {p.isSpeaking && (
                  <span className="absolute -inset-0.5 rounded-full border-2 border-emerald-400 animate-mic-pulse" />
                )}
              </div>

              {/* Name & role */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-semibold text-slate-900 truncate">{p.name}</span>
                  {isLocal && <span className="text-[9px] text-slate-500">(You)</span>}
                  {isHost && <Crown className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border capitalize ${ROLE_BADGE[p.role]}`}
                  >
                    {p.role}
                  </span>
                  {p.joinedAt && (
                    <span className="text-[9px] text-slate-500">Joined {p.joinedAt}</span>
                  )}
                </div>
              </div>

              {/* Media state icons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <ConnectionIndicator status={p.connectionStatus} />
                {p.isMicOn ? (
                  <Mic className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <MicOff className="w-3.5 h-3.5 text-red-400" />
                )}
                {p.isCameraOn ? (
                  <Camera className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <CameraOff className="w-3.5 h-3.5 text-red-400" />
                )}
                {p.isScreenSharing && (
                  <Monitor className="w-3.5 h-3.5 text-blue-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParticipantList;
