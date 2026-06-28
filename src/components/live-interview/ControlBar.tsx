// ─────────────────────────────────────────────────────────────
// TalentForge AI — Interview Room Control Bar
// Bottom controls: mic, camera, screen share, chat, notes,
// participants, settings, leave, end interview
// ─────────────────────────────────────────────────────────────
import React from 'react';
import {
  Mic, MicOff, Camera, CameraOff, Monitor, MonitorOff,
  Users, MessageSquare, FileText, Settings, PhoneOff,
  Square,
} from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';
import { useMedia } from '../../context/MediaProvider';

interface ControlBarProps {
  mode: 'recruiter' | 'candidate';
  onLeave?: () => void;
  onEnd?: () => void;
}

interface ControlButtonProps {
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  label: string;
  isActive?: boolean;
  isDestructive?: boolean;
  badge?: number;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  id: string;
}

const ControlButton: React.FC<ControlButtonProps> = ({
  icon,
  activeIcon,
  label,
  isActive = true,
  isDestructive = false,
  badge,
  onClick,
  disabled = false,
  className = '',
  id,
}) => {
  const base =
    'relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-150 group disabled:opacity-40 disabled:cursor-not-allowed';
  const colors = isDestructive
    ? 'bg-red-500 hover:bg-red-600 text-white'
    : isActive
    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
    : 'bg-red-50 hover:bg-red-100 text-red-600';

  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`${base} ${colors} ${className}`}
    >
      <span className="w-5 h-5 flex items-center justify-center">
        {!isActive && activeIcon ? activeIcon : icon}
      </span>
      <span className="text-[10px] font-medium hidden sm:block opacity-80">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  );
};

export const ControlBar: React.FC<ControlBarProps> = ({ mode, onLeave, onEnd }) => {
  const {
    isMicOn,
    isCameraOn,
    isScreenSharing,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    activePanel,
    setActivePanel,
    unreadChatCount,
  } = useInterview();

  const togglePanel = (panel: 'chat' | 'participants' | 'notes' | 'settings') => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  let media: any = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    media = useMedia();
  } catch (e) {
    // ignore
  }

  const handleToggleCamera = () => {
    if (!isCameraOn) {
      media?.requestCamera();
    }
    toggleCamera();
  };

  const handleToggleScreenShare = () => {
    if (!isScreenSharing) {
      media?.requestScreen();
    }
    toggleScreenShare();
  };

  return (
    <div className="h-[72px] bg-white border-t border-slate-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      {/* Left: Interview info hint */}
      <div className="hidden md:flex items-center gap-3 w-48">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-recording-pulse" />
        <span className="text-xs text-slate-500 font-medium">Interview In Progress</span>
      </div>

      {/* Center: Primary controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        <ControlButton
          id="ctrl-mic"
          icon={<Mic className="w-5 h-5" />}
          activeIcon={<MicOff className="w-5 h-5" />}
          label={isMicOn ? 'Mute' : 'Unmute'}
          isActive={isMicOn}
          onClick={toggleMic}
        />
        <ControlButton
          id="ctrl-cam"
          icon={<Camera className="w-5 h-5" />}
          activeIcon={<CameraOff className="w-5 h-5" />}
          label={isCameraOn ? 'Stop Video' : 'Start Video'}
          isActive={isCameraOn}
          onClick={handleToggleCamera}
        />
        <ControlButton
          id="ctrl-screen"
          icon={<Monitor className="w-5 h-5" />}
          activeIcon={<MonitorOff className="w-5 h-5" />}
          label={isScreenSharing ? 'Stop Share' : 'Share Screen'}
          isActive={!isScreenSharing}
          onClick={handleToggleScreenShare}
        />

        {/* Separator */}
        <div className="w-px h-8 bg-slate-200 mx-1 hidden sm:block" />

        <ControlButton
          id="ctrl-participants"
          icon={<Users className="w-5 h-5" />}
          label="Participants"
          isActive={activePanel !== 'participants'}
          onClick={() => togglePanel('participants')}
        />
        <ControlButton
          id="ctrl-chat"
          icon={<MessageSquare className="w-5 h-5" />}
          label="Chat"
          isActive={activePanel !== 'chat'}
          badge={unreadChatCount}
          onClick={() => togglePanel('chat')}
        />
        {mode === 'recruiter' && (
          <ControlButton
            id="ctrl-notes"
            icon={<FileText className="w-5 h-5" />}
            label="Notes"
            isActive={activePanel !== 'notes'}
            onClick={() => togglePanel('notes')}
          />
        )}
        <ControlButton
          id="ctrl-settings"
          icon={<Settings className="w-5 h-5" />}
          label="Settings"
          isActive={activePanel !== 'settings'}
          onClick={() => togglePanel('settings')}
        />
      </div>

      {/* Right: Leave / End */}
      <div className="flex items-center gap-2 w-48 justify-end">
        <button
          id="ctrl-leave"
          onClick={onLeave}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-colors"
          aria-label="Leave interview"
        >
          <PhoneOff className="w-4 h-4" />
          <span className="hidden sm:block">Leave</span>
        </button>
        {mode === 'recruiter' && (
          <button
            id="ctrl-end"
            onClick={onEnd}
            className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl transition-colors"
            aria-label="End interview for all"
          >
            <Square className="w-4 h-4 fill-white" />
            <span className="hidden sm:block">End</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ControlBar;
