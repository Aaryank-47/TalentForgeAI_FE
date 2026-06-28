// ─────────────────────────────────────────────────────────────
// TalentForge AI — Candidate Interview Room Sidebar
// Tabs: Instructions | Resume | Job | Chat
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { Info, CheckCircle } from 'lucide-react';
import type { LiveInterview } from '../../types/interview.types';
import { useInterview } from '../../context/InterviewContext';
import { ResumePanel } from './ResumePanel';
import { JobPanel } from './JobPanel';
import { ChatPanel } from './ChatPanel';

interface CandidateSidebarProps {
  interview: LiveInterview;
}

const TABS = [
  { key: 'instructions', label: 'Instructions' },
  { key: 'resume', label: 'My Resume' },
  { key: 'job', label: 'Job' },
  { key: 'chat', label: 'Chat' },
] as const;

type TabKey = typeof TABS[number]['key'];

const InstructionsPanel: React.FC<{ interview: LiveInterview }> = ({ interview }) => {
  const instructions = interview.settings.instructions;
  const bullets = instructions.split('. ').filter(Boolean);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4">
      {/* Interview info */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-7 h-7 rounded-lg ${interview.companyColor} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}
          >
            {interview.companyLogo}
          </div>
          <div>
            <p className="text-xs font-bold text-white">{interview.title}</p>
            <p className="text-[10px] text-slate-400">{interview.company}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div>
            <p className="text-slate-500">Date</p>
            <p className="text-slate-700 font-medium">{interview.date}</p>
          </div>
          <div>
            <p className="text-slate-500">Time</p>
            <p className="text-slate-700 font-medium">{interview.timeStart}</p>
          </div>
          <div>
            <p className="text-slate-500">Duration</p>
            <p className="text-slate-700 font-medium">{interview.duration}</p>
          </div>
          <div>
            <p className="text-slate-500">Type</p>
            <p className="text-slate-700 font-medium">{interview.type}</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-primary-600" />
          <p className="text-xs font-bold text-slate-900">Instructions</p>
        </div>
        <div className="space-y-2">
          {bullets.map((bullet, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
              <CheckCircle className="w-3.5 h-3.5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{bullet.replace(/\.$/, '')}.</span>
            </div>
          ))}
        </div>
      </div>

      {/* Allowed */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Permissions
        </p>
        <div className="space-y-1.5 text-[10px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Camera</span>
            <span className={interview.settings.allowCamera ? 'text-emerald-600 font-semibold' : 'text-red-500'}>
              {interview.settings.allowCamera ? 'Required' : 'Not required'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Microphone</span>
            <span className={interview.settings.allowMicrophone ? 'text-emerald-600 font-semibold' : 'text-red-500'}>
              {interview.settings.allowMicrophone ? 'Required' : 'Not required'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Screen Share</span>
            <span className={interview.settings.allowScreenShare ? 'text-emerald-600 font-semibold' : 'text-slate-500'}>
              {interview.settings.allowScreenShare ? 'Allowed' : 'Not required'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CandidateSidebar: React.FC<CandidateSidebarProps> = ({ interview }) => {
  const { activeSidebarTab, setActiveSidebarTab, unreadChatCount } = useInterview();

  const renderContent = () => {
    switch (activeSidebarTab as TabKey) {
      case 'instructions':
        return <InstructionsPanel interview={interview} />;
      case 'resume':
        return <ResumePanel candidateId={interview.candidateId} />;
      case 'job':
        return <JobPanel interview={interview} />;
      case 'chat':
        return <ChatPanel />;
      default:
        return <InstructionsPanel interview={interview} />;
    }
  };

  return (
    <div className="w-72 flex-shrink-0 bg-white border-l border-slate-200 flex flex-col h-full shadow-lg">
      {/* Tab bar */}
      <div className="flex border-b border-slate-200 flex-shrink-0">
        {TABS.map(({ key, label }) => {
          const isActive = activeSidebarTab === key;
          const hasBadge = key === 'chat' && unreadChatCount > 0;
          return (
            <button
              key={key}
              id={`candidate-sidebar-${key}`}
              onClick={() => setActiveSidebarTab(key)}
              className={`relative flex-1 py-2.5 text-[10px] font-semibold whitespace-nowrap transition-colors border-b-2 ${
                isActive
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
              {hasBadge && (
                <span className="absolute top-1.5 right-1 w-3.5 h-3.5 bg-primary-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {unreadChatCount > 9 ? '9+' : unreadChatCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">{renderContent()}</div>
    </div>
  );
};

export default CandidateSidebar;
