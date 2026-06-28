// ─────────────────────────────────────────────────────────────
// TalentForge AI — Live Interview Room Header Components
// InterviewTimer + ConnectionIndicator + RecordingBadge
// (Kept together as tightly related UI pieces per Rule 6)
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { Wifi, WifiOff, Signal } from 'lucide-react';
import type { ConnectionStatus } from '../../types/interview.types';

// ─── Elapsed Timer ────────────────────────────────────────────
interface InterviewTimerProps {
  elapsedSeconds: number;
  scheduledDuration: string;
  className?: string;
}

export const InterviewTimer: React.FC<InterviewTimerProps> = ({
  elapsedSeconds,
  scheduledDuration,
  className = '',
}) => {
  const hrs = Math.floor(elapsedSeconds / 3600);
  const mins = Math.floor((elapsedSeconds % 3600) / 60);
  const secs = elapsedSeconds % 60;

  const formatted = hrs > 0
    ? `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="text-xs text-slate-400 font-medium">Elapsed</div>
      <div className="bg-slate-800 text-white font-mono font-bold text-sm px-3 py-1.5 rounded-lg tabular-nums min-w-[72px] text-center">
        {formatted}
      </div>
      <div className="text-xs text-slate-400">/ {scheduledDuration}</div>
    </div>
  );
};

// ─── Connection Indicator ─────────────────────────────────────
interface ConnectionIndicatorProps {
  status: ConnectionStatus;
  showLabel?: boolean;
  className?: string;
}

const CONNECTION_CONFIG: Record<ConnectionStatus, { color: string; label: string; Icon: React.ElementType; bars: number }> = {
  excellent: { color: 'text-emerald-500', label: 'Excellent', Icon: Wifi, bars: 3 },
  good: { color: 'text-blue-500', label: 'Good', Icon: Signal, bars: 2 },
  poor: { color: 'text-amber-500', label: 'Poor', Icon: Signal, bars: 1 },
  disconnected: { color: 'text-red-500', label: 'Disconnected', Icon: WifiOff, bars: 0 },
};

export const ConnectionIndicator: React.FC<ConnectionIndicatorProps> = ({
  status,
  showLabel = false,
  className = '',
}) => {
  const cfg = CONNECTION_CONFIG[status];
  const Icon = cfg.Icon;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Icon className={`w-4 h-4 ${cfg.color}`} />
      {showLabel && (
        <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
      )}
    </div>
  );
};

// ─── Recording Badge ─────────────────────────────────────────
interface RecordingBadgeProps {
  isRecording: boolean;
  className?: string;
}

export const RecordingBadge: React.FC<RecordingBadgeProps> = ({
  isRecording,
  className = '',
}) => {
  if (!isRecording) return null;

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1.5 bg-red-500/10 border border-red-200 rounded-full ${className}`}
    >
      <span className="w-2 h-2 rounded-full bg-red-500 animate-recording-pulse flex-shrink-0" />
      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">REC</span>
    </div>
  );
};
