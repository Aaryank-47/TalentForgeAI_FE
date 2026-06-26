/**
 * TalentForge AI Interview — Shared Reusable Components
 * All components are mock/simulation UI — no real camera/mic/AI
 */
import React from 'react';
import { Check, Clock, AlertTriangle, Shield, Volume2, Eye, Monitor } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// InterviewStepper
// ─────────────────────────────────────────────────────────────
interface Step { label: string; icon?: string }
interface InterviewStepperProps { steps: Step[]; currentStep: number }

export const InterviewStepper: React.FC<InterviewStepperProps> = ({ steps, currentStep }) => (
  <div className="flex items-center gap-0 overflow-x-auto pb-1">
    {steps.map((step, i) => {
      const done = i < currentStep;
      const active = i === currentStep;
      return (
        <React.Fragment key={step.label}>
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              done ? 'bg-emerald-500 text-white' : active ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30' : 'bg-slate-200 text-slate-500'
            }`}>
              {done ? <Check className="w-4 h-4" /> : <span>{i + 1}</span>}
            </div>
            <span className={`text-[10px] font-medium whitespace-nowrap ${active ? 'text-primary-700' : done ? 'text-emerald-600' : 'text-slate-400'}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 min-w-[20px] rounded-full transition-all ${done ? 'bg-emerald-400' : 'bg-slate-200'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────────────────────
// CountdownTimer
// ─────────────────────────────────────────────────────────────
interface CountdownTimerProps { secondsLeft: number; totalSeconds: number; size?: 'sm' | 'lg' }

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ secondsLeft, totalSeconds, size = 'sm' }) => {
  const pct = secondsLeft / totalSeconds;
  const isUrgent = pct < 0.25;
  const r = size === 'lg' ? 44 : 28;
  const circ = 2 * Math.PI * r;
  const stroke = (pct) * circ;
  const wh = size === 'lg' ? 104 : 68;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  return (
    <div className="relative flex items-center justify-center" style={{ width: wh, height: wh }}>
      <svg width={wh} height={wh} viewBox={`0 0 ${wh} ${wh}`}>
        <circle cx={wh / 2} cy={wh / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={size === 'lg' ? 6 : 4} />
        <circle
          cx={wh / 2} cy={wh / 2} r={r} fill="none"
          stroke={isUrgent ? '#ef4444' : '#2563eb'} strokeWidth={size === 'lg' ? 6 : 4}
          strokeLinecap="round"
          strokeDasharray={`${stroke} ${circ}`}
          transform={`rotate(-90 ${wh / 2} ${wh / 2})`}
          style={{ transition: 'stroke-dasharray 1s linear, stroke 0.5s ease' }}
        />
      </svg>
      <div className="absolute text-center">
        <span className={`font-bold tabular-nums ${size === 'lg' ? 'text-xl' : 'text-sm'} ${isUrgent ? 'text-red-600' : 'text-slate-800'}`}>
          {mins}:{secs.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// InterviewStatusBadge
// ─────────────────────────────────────────────────────────────
export const InterviewStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    'pending': 'bg-amber-50 text-amber-700 border-amber-200',
    'in-progress': 'bg-blue-50 text-blue-700 border-blue-200',
    'submitted': 'bg-violet-50 text-violet-700 border-violet-200',
    'completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'expired': 'bg-red-50 text-red-700 border-red-200',
    'Under AI Evaluation': 'bg-violet-50 text-violet-700 border-violet-200',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border capitalize ${styles[status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {status}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────
// QuestionCard — displays the current interview question
// ─────────────────────────────────────────────────────────────
interface QuestionCardProps {
  order: number;
  total: number;
  text: string;
  category: string;
  isTyping?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ order, total, text, category, isTyping }) => (
  <div className="bg-white rounded-2xl border border-primary-100 shadow-sm p-5 animate-fade-in-up">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100">{category}</span>
      <span className="text-[10px] text-slate-400 font-medium">Question {order} of {total}</span>
    </div>
    <p className="text-slate-800 text-sm font-medium leading-relaxed">
      {text}
      {isTyping && <span className="animate-blink-cursor ml-0.5 text-primary-500">|</span>}
    </p>
  </div>
);

// ─────────────────────────────────────────────────────────────
// RecordingIndicator
// ─────────────────────────────────────────────────────────────
export const RecordingIndicator: React.FC<{ active?: boolean }> = ({ active = true }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
    active ? 'bg-red-500/10 text-red-600 border border-red-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
  }`}>
    <div className={`w-2 h-2 rounded-full ${active ? 'bg-red-500 animate-recording-pulse' : 'bg-slate-400'}`} />
    {active ? 'Recording' : 'Not Recording'}
  </div>
);

// ─────────────────────────────────────────────────────────────
// SpeakingIndicator — AI is speaking animation
// ─────────────────────────────────────────────────────────────
export const SpeakingIndicator: React.FC<{ label?: string }> = ({ label = 'AI Speaking' }) => (
  <div className="flex items-center gap-2">
    <div className="flex items-end gap-0.5 h-5">
      <div className="w-1 rounded-full bg-primary-500 animate-speaking-bar" />
      <div className="w-1 rounded-full bg-primary-500 animate-speaking-bar-2" />
      <div className="w-1 rounded-full bg-primary-500 animate-speaking-bar-3" />
      <div className="w-1 rounded-full bg-primary-500 animate-speaking-bar-4" />
      <div className="w-1 rounded-full bg-primary-500 animate-speaking-bar-5" />
    </div>
    <span className="text-xs text-primary-600 font-medium">{label}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────
// ListeningIndicator — candidate is responding animation
// ─────────────────────────────────────────────────────────────
export const ListeningIndicator: React.FC<{ label?: string }> = ({ label = 'Listening…' }) => (
  <div className="flex items-center gap-2">
    <div className="relative">
      <Volume2 className="w-4 h-4 text-emerald-500" />
      <div className="absolute -inset-1 rounded-full bg-emerald-400 opacity-30 animate-mic-pulse" />
    </div>
    <div className="flex items-end gap-0.5 h-5">
      <div className="w-1 rounded-full bg-emerald-500 animate-waveform" style={{ animationDelay: '0s' }} />
      <div className="w-1 rounded-full bg-emerald-500 animate-waveform" style={{ animationDelay: '0.2s' }} />
      <div className="w-1 rounded-full bg-emerald-500 animate-waveform" style={{ animationDelay: '0.1s' }} />
      <div className="w-1 rounded-full bg-emerald-500 animate-waveform" style={{ animationDelay: '0.3s' }} />
    </div>
    <span className="text-xs text-emerald-600 font-medium">{label}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────
// AIInterviewerCard — the AI avatar panel with state
// ─────────────────────────────────────────────────────────────
type AIState = 'speaking' | 'listening' | 'thinking' | 'waiting' | 'loading';

interface AIInterviewerCardProps {
  state: AIState;
  name?: string;
  compact?: boolean;
}

const AI_STATES: Record<AIState, { label: string; color: string; bg: string }> = {
  speaking: { label: 'Speaking', color: 'text-primary-600', bg: 'bg-primary-50 border-primary-200' },
  listening: { label: 'Listening', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  thinking: { label: 'Thinking…', color: 'text-violet-600', bg: 'bg-violet-50 border-violet-200' },
  waiting: { label: 'Waiting', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  loading: { label: 'Connecting…', color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' },
};

export const AIInterviewerCard: React.FC<AIInterviewerCardProps> = ({ state, name = 'TalentForge AI', compact = false }) => {
  const info = AI_STATES[state];
  return (
    <div className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 text-white ${compact ? 'p-3' : 'p-5'}`}>
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3 mb-4">
        <div className="relative">
          <div className={`${compact ? 'w-14 h-14' : 'w-20 h-20'} rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-900/40`}>
            <span className={compact ? 'text-2xl' : 'text-3xl'}>🤖</span>
          </div>
          {/* State pulse ring */}
          {(state === 'speaking') && (
            <div className="absolute -inset-1.5 rounded-2xl border-2 border-primary-400 animate-mic-pulse opacity-60" />
          )}
          {state === 'listening' && (
            <div className="absolute -inset-1.5 rounded-2xl border-2 border-emerald-400 animate-mic-pulse opacity-60" />
          )}
        </div>
        {!compact && <p className="text-sm font-semibold text-white">{name}</p>}
      </div>

      {/* Status badge */}
      <div className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${info.bg} ${info.color}`}>
        {state === 'speaking' && <SpeakingIndicator label="" />}
        {state === 'listening' && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-recording-pulse" />}
        {state === 'thinking' && (
          <div className="flex gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ai-dot" />
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ai-dot-2" />
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ai-dot-3" />
          </div>
        )}
        {state === 'waiting' && <Clock className="w-3 h-3" />}
        {state === 'loading' && <div className="w-3 h-3 rounded-full border-2 border-slate-400 border-t-transparent animate-gentle-spin" />}
        <span>{info.label}</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// ProgressBar — generic labeled progress bar
// ─────────────────────────────────────────────────────────────

export const ProgressBar: React.FC<{ value: number; label?: string; color?: string; height?: string }> = ({
  value, label, color = 'bg-primary-600', height = 'h-2',
}) => (
  <div>
    {label && (
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-600">{label}</span>
        <span className="text-xs font-bold text-slate-800">{value}%</span>
      </div>
    )}
    <div className={`w-full bg-slate-200 rounded-full ${height} overflow-hidden`}>
      <div className={`${height} rounded-full ${color} animate-score-fill`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// ScoreCard — a single evaluation score display
// ─────────────────────────────────────────────────────────────
export const ScoreCard: React.FC<{ label: string; score: number; icon: string; color: string }> = ({ label, score, icon, color }) => (
  <div className="card p-4 flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <span className="text-xs text-slate-600 font-medium">{label}</span>
    </div>
    <div className="flex items-end gap-2">
      <span className="text-2xl font-display font-black text-slate-900">{score}</span>
      <span className="text-xs text-slate-400 mb-0.5">/100</span>
    </div>
    <ProgressBar value={score} color={color} />
  </div>
);

// ─────────────────────────────────────────────────────────────
// EvaluationCard — recommendation badge
// ─────────────────────────────────────────────────────────────
const REC_STYLES: Record<string, string> = {
  'Strong Hire': 'bg-emerald-500 text-white',
  'Hire': 'bg-blue-500 text-white',
  'Consider': 'bg-amber-500 text-white',
  'Reject': 'bg-red-500 text-white',
};

export const EvaluationCard: React.FC<{ recommendation: string; score: number }> = ({ recommendation, score }) => (
  <div className="card p-5 flex flex-col items-center gap-3 text-center">
    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">AI Recommendation</p>
    <div className="relative">
      <svg width={90} height={90} viewBox="0 0 90 90">
        <circle cx={45} cy={45} r={38} fill="none" stroke="#e5e7eb" strokeWidth={7} />
        <circle
          cx={45} cy={45} r={38} fill="none"
          stroke="#2563eb" strokeWidth={7} strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 2 * Math.PI * 38} ${2 * Math.PI * 38}`}
          transform="rotate(-90 45 45)"
          style={{ transition: 'stroke-dasharray 1.5s ease' }}
        />
        <text x={45} y={49} textAnchor="middle" fontSize={20} fontWeight={800} fill="#0f172a" fontFamily="system-ui">{score}</text>
      </svg>
    </div>
    <span className={`px-5 py-2 rounded-full text-sm font-bold ${REC_STYLES[recommendation] || 'bg-slate-200 text-slate-700'}`}>
      {recommendation}
    </span>
  </div>
);

// ─────────────────────────────────────────────────────────────
// TranscriptCard — Q&A pair with confidence
// ─────────────────────────────────────────────────────────────
export const TranscriptCard: React.FC<{
  order: number;
  question: string;
  answer: string;
  timestamp: string;
  duration: string;
  confidence: number;
  category: string;
}> = ({ order, question, answer, timestamp, duration, confidence, category }) => {
  const confColor = confidence >= 85 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : confidence >= 70 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-red-600 bg-red-50 border-red-200';
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-xl bg-primary-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{order}</div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{category}</span>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">{question}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${confColor}`}>{confidence}% Confidence</span>
          <span className="text-[10px] text-slate-400">{timestamp} • {duration}</span>
        </div>
      </div>
      <div className="ml-10 bg-slate-50 rounded-xl p-3 border border-slate-200 text-sm text-slate-700 leading-relaxed">
        {answer}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// TimelineCard — status timeline item
// ─────────────────────────────────────────────────────────────
type TimelineStatus = 'done' | 'active' | 'pending';
export const TimelineCard: React.FC<{
  label: string;
  detail: string;
  status: TimelineStatus;
  icon: string;
  isLast?: boolean;
}> = ({ label, detail, status, icon, isLast }) => {
  const dotStyle = status === 'done' ? 'bg-emerald-500 border-emerald-200' : status === 'active' ? 'bg-primary-600 border-primary-200 animate-mic-pulse' : 'bg-slate-300 border-slate-200';
  const lineStyle = status === 'done' ? 'bg-emerald-200' : 'bg-slate-200';
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-base flex-shrink-0 ${dotStyle} ${status !== 'pending' ? 'shadow-sm' : ''}`}>
          {icon}
        </div>
        {!isLast && <div className={`w-0.5 flex-1 min-h-[24px] mt-1 ${lineStyle}`} />}
      </div>
      <div className="pb-6">
        <p className={`text-sm font-semibold ${status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>{label}</p>
        <p className={`text-xs mt-0.5 ${status === 'active' ? 'text-primary-600 font-medium' : 'text-slate-500'}`}>{detail}</p>
        {status === 'active' && (
          <div className="mt-2 flex items-center gap-1.5">
            <div className="flex gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-ai-dot" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-ai-dot-2" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-ai-dot-3" />
            </div>
            <span className="text-[10px] text-primary-600 font-medium">In progress</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// UploaderCard — individual upload step
// ─────────────────────────────────────────────────────────────
type UploadStatus = 'pending' | 'uploading' | 'done' | 'error';
export const UploaderCard: React.FC<{
  icon: string;
  label: string;
  detail: string;
  status: UploadStatus;
  progress?: number;
}> = ({ icon, label, detail, status, progress = 0 }) => {
  const statusBadge: Record<UploadStatus, { text: string; color: string }> = {
    pending: { text: 'Waiting', color: 'text-slate-400' },
    uploading: { text: 'Uploading…', color: 'text-primary-600' },
    done: { text: 'Complete', color: 'text-emerald-600' },
    error: { text: 'Error', color: 'text-red-600' },
  };
  const s = statusBadge[status];
  return (
    <div className={`card p-4 transition-all ${status === 'done' ? 'border-emerald-200 bg-emerald-50/50' : status === 'uploading' ? 'border-primary-200 bg-primary-50/50' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="text-2xl flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-slate-800">{label}</p>
            <div className="flex items-center gap-1.5">
              {status === 'uploading' && <div className="w-3 h-3 rounded-full border-2 border-primary-500 border-t-transparent animate-gentle-spin" />}
              {status === 'done' && <Check className="w-3.5 h-3.5 text-emerald-500" />}
              <span className={`text-xs font-medium ${s.color}`}>{s.text}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-2">{detail}</p>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            {status === 'uploading' ? (
              <div className="h-1.5 rounded-full bg-primary-500 animate-progress-bar" />
            ) : status === 'done' ? (
              <div className="h-1.5 rounded-full bg-emerald-500 w-full" />
            ) : (
              <div className="h-1.5 rounded-full bg-slate-300" style={{ width: `${progress}%` }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// ─────────────────────────────────────────────────────────────
// InterviewSummaryCard — mini summary shown in waiting room
// ─────────────────────────────────────────────────────────────
export const InterviewSummaryCard: React.FC<{
  company: string;
  role: string;
  questions: number;
  duration: string;
  companyColor: string;
  companyLogo: string;
}> = ({ company, role, questions, duration, companyColor, companyLogo }) => (
  <div className="card p-4 flex items-center gap-4">
    <div className={`w-12 h-12 ${companyColor} rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
      {companyLogo}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-slate-900">{role}</p>
      <p className="text-xs text-slate-500">{company}</p>
    </div>
    <div className="text-right flex-shrink-0">
      <p className="text-xs font-bold text-slate-900">{questions} Qs</p>
      <p className="text-[10px] text-slate-500">{duration}</p>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// RiskBadge — for integrity section
// ─────────────────────────────────────────────────────────────
export const RiskBadge: React.FC<{ level: string }> = ({ level }) => {
  const styles: Record<string, string> = {
    None: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Low: 'bg-blue-100 text-blue-700 border-blue-200',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200',
    High: 'bg-red-100 text-red-700 border-red-200',
  };
  const icons: Record<string, React.ReactNode> = {
    None: <Shield className="w-3 h-3" />,
    Low: <Shield className="w-3 h-3" />,
    Medium: <AlertTriangle className="w-3 h-3" />,
    High: <AlertTriangle className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${styles[level] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {icons[level]}
      {level} Risk
    </span>
  );
};
