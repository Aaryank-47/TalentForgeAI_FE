import React from 'react';
import { Clock } from 'lucide-react';

interface AssessmentTimerProps {
  secondsLeft: number;
  totalSeconds: number;
  compact?: boolean;
}

const AssessmentTimer: React.FC<AssessmentTimerProps> = ({
  secondsLeft,
  totalSeconds,
  compact = false,
}) => {
  // Format seconds to HH:MM:SS
  const formatTime = (secs: number) => {
    if (secs < 0) return '00:00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    
    const hStr = h > 0 ? `${h.toString().padStart(2, '0')}:` : '';
    const mStr = m.toString().padStart(2, '0');
    const sStr = s.toString().padStart(2, '0');
    
    return `${hStr}${mStr}:${sStr}`;
  };

  const percentage = Math.min(100, Math.max(0, (secondsLeft / totalSeconds) * 100));
  
  // Statuses: safe, warning (less than 15%), critical (less than 5% or 2 mins)
  const isCritical = secondsLeft < 120 || percentage < 5;
  const isWarning = secondsLeft < 300 || percentage < 15;

  let timerColorClass = 'text-primary-600 bg-primary-50 border-primary-100';
  let progressColorClass = 'bg-primary-600';
  
  if (isCritical) {
    timerColorClass = 'text-rose-600 bg-rose-50 border-rose-100 animate-pulse';
    progressColorClass = 'bg-rose-500';
  } else if (isWarning) {
    timerColorClass = 'text-amber-600 bg-amber-50 border-amber-100';
    progressColorClass = 'bg-amber-500';
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold font-mono tracking-wider shadow-sm ${timerColorClass}`}>
        <Clock className="w-4 h-4 flex-shrink-0" />
        <span>{formatTime(secondsLeft)}</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          Time Remaining
        </span>
        <span className={`text-sm font-bold font-mono ${isCritical ? 'text-rose-600 animate-pulse' : isWarning ? 'text-amber-600' : 'text-slate-800'}`}>
          {formatTime(secondsLeft)}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${progressColorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default AssessmentTimer;
