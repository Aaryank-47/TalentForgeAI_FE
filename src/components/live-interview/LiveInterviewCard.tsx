// ─────────────────────────────────────────────────────────────
// TalentForge AI — Live Interview Card
// Used in list views (recruiter & candidate)
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { Calendar, Clock, Users, Video, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { LiveInterview } from '../../types/interview.types';
import { LiveInterviewStatusBadge } from './LiveInterviewStatusBadge';
import { getRecruitersByIds } from '../../constants/participants.mock';

interface LiveInterviewCardProps {
  interview: LiveInterview;
  mode: 'recruiter' | 'candidate';
  onStartClick?: (id: string) => void;
  onJoinClick?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  isSelected?: boolean;
  compact?: boolean;
}

export const LiveInterviewCard: React.FC<LiveInterviewCardProps> = ({
  interview,
  mode,
  onStartClick,
  onJoinClick,
  onViewDetails,
  isSelected = false,
  compact = false,
}) => {
  const navigate = useNavigate();
  const recruiters = getRecruitersByIds(interview.recruiterIds);
  const isLive = interview.status === 'Live';
  const isJoinable = ['Live', 'Waiting', 'Today', 'Upcoming'].includes(interview.status);

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    const roomPath =
      mode === 'recruiter'
        ? `/recruiter/live-interviews/${interview.id}/room`
        : `/candidate/live-interviews/${interview.id}/room`;
    if (onJoinClick) {
      onJoinClick(interview.id);
    } else {
      navigate(roomPath);
    }
  };

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const roomPath = `/recruiter/live-interviews/${interview.id}/room`;
    if (onStartClick) {
      onStartClick(interview.id);
    } else {
      navigate(roomPath);
    }
  };

  const handleCardClick = () => {
    const detailPath =
      mode === 'recruiter'
        ? `/recruiter/live-interviews/${interview.id}`
        : `/candidate/live-interviews/${interview.id}`;
    if (onViewDetails) {
      onViewDetails(interview.id);
    } else {
      navigate(detailPath);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`card p-4 cursor-pointer transition-all duration-150 hover:shadow-md hover:border-primary-200 group ${
        isSelected ? 'border-primary-300 bg-primary-50/30 shadow-sm' : ''
      } ${isLive ? 'border-emerald-200 bg-emerald-50/20' : ''}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Company logo */}
          <div
            className={`w-10 h-10 rounded-xl ${interview.companyColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}
          >
            {interview.companyLogo}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{interview.title}</p>
            <p className="text-xs text-slate-500 truncate">
              {interview.company} · {interview.jobTitle}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <LiveInterviewStatusBadge status={interview.status} />
        </div>
      </div>

      {/* Meta row */}
      {!compact && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{interview.date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>
              {interview.timeStart} – {interview.timeEnd} · {interview.duration}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Video className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="capitalize">{interview.meetingType.replace('-', ' ')}</span>
          </div>
        </div>
      )}

      {/* Candidate row (for recruiter view) */}
      {mode === 'recruiter' && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full bg-gradient-to-br ${interview.candidateAvatarColor} flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0`}
            >
              {interview.candidateInitials}
            </div>
            <span className="text-xs text-slate-600 font-medium">{interview.candidateName}</span>
            <span className="text-[10px] text-slate-400 border border-slate-200 rounded-full px-2 py-0.5">
              {interview.type}
            </span>
          </div>

          {/* Interviewers */}
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex -space-x-1.5">
              {recruiters.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  title={r.name}
                  className={`w-5 h-5 rounded-full bg-gradient-to-br ${r.avatarColor} flex items-center justify-center text-white text-[8px] font-bold border border-white`}
                >
                  {r.initials.charAt(0)}
                </div>
              ))}
              {recruiters.length > 3 && (
                <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600 border border-white">
                  +{recruiters.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recruiter info (for candidate view) */}
      {mode === 'candidate' && (
        <div className="flex items-center gap-2">
          {recruiters.slice(0, 1).map((r) => (
            <div key={r.id} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full bg-gradient-to-br ${r.avatarColor} flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0`}
              >
                {r.initials}
              </div>
              <span className="text-xs text-slate-600 font-medium">{r.name}</span>
              <span className="text-[10px] text-slate-400">· {r.title}</span>
            </div>
          ))}
          {recruiters.length > 1 && (
            <span className="text-[10px] text-slate-400">+{recruiters.length - 1} more</span>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E5E7EB]">
        {mode === 'recruiter' && isLive && (
          <button
            onClick={handleStart}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-recording-pulse" />
            Join Live
          </button>
        )}
        {mode === 'recruiter' && !isLive && isJoinable && (
          <button
            onClick={handleStart}
            className="btn-primary text-xs py-1.5 px-3"
          >
            Start Interview
          </button>
        )}
        {mode === 'candidate' && isJoinable && (
          <button
            onClick={handleJoin}
            className={`flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-lg transition-colors ${
              isLive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'btn-primary'
            }`}
          >
            {isLive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-recording-pulse" />}
            {isLive ? 'Join Now' : 'Join Interview'}
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className="ml-auto flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-semibold"
        >
          View Details <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default LiveInterviewCard;
