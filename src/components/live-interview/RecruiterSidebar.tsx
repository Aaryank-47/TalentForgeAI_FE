import MonacoEditorWrapper from '../assessment/MonacoEditorWrapper';
// ─────────────────────────────────────────────────────────────
// TalentForge AI — Recruiter Interview Room Sidebar
// Tabs: Resume | Notes | Job | Evaluation | Participants | Chat
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { X } from 'lucide-react';
import type { LiveInterview } from '../../types/interview.types';
import type { RoomParticipant } from '../../types/participant.types';
import { useInterview } from '../../context/InterviewContext';
import { ResumePanel } from './ResumePanel';
import { NotesPanel } from './NotesPanel';
import { JobPanel } from './JobPanel';
import { EvaluationPanel } from './EvaluationPanel';
import { ParticipantList } from './ParticipantList';
import { ChatPanel } from './ChatPanel';

interface RecruiterSidebarProps {
  interview: LiveInterview;
  participants: RoomParticipant[];
  localUserId: string;
}

const TABS = [
  { key: 'resume', label: 'Resume' },
  { key: 'notes', label: 'Notes' },
  { key: 'job', label: 'JD' },
  { key: 'code', label: 'Code' },
  { key: 'evaluation', label: 'Eval' },
  { key: 'participants', label: 'People' },
  { key: 'chat', label: 'Chat' },
] as const;

type TabKey = typeof TABS[number]['key'];

const CodePanel: React.FC = () => {
  const { code, language, sendCodeChange, sendLanguageChange } = useInterview();
  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="px-3 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
        <span className="text-xs font-bold text-slate-300">Collaborative Code Editor</span>
        <select
          value={language}
          onChange={(e) => sendLanguageChange(e.target.value)}
          className="bg-slate-700 text-xs text-white rounded px-2 py-1 border border-slate-600 focus:outline-none"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>
      <div className="flex-1 overflow-hidden">
        <MonacoEditorWrapper
          language={language}
          value={code}
          onChange={(v) => sendCodeChange(v)}
        />
      </div>
    </div>
  );
};


export const RecruiterSidebar: React.FC<RecruiterSidebarProps> = ({
  interview,
  participants,
  localUserId,
}) => {
  const { activeSidebarTab, setActiveSidebarTab, activePanel, setActivePanel, unreadChatCount } =
    useInterview();

  // When activePanel (from control bar) is set, sync it with sidebar tab
  React.useEffect(() => {
    if (activePanel === 'chat') setActiveSidebarTab('chat');
    if (activePanel === 'participants') setActiveSidebarTab('participants');
    if (activePanel === 'notes') setActiveSidebarTab('notes');
  }, [activePanel, setActiveSidebarTab]);

  const renderContent = () => {
    switch (activeSidebarTab as TabKey) {
      case 'resume':
        return <ResumePanel candidateId={interview.candidateId} />;
      case 'notes':
        return <NotesPanel />;
      case 'job':
        return <JobPanel interview={interview} />;
      case 'code':
        return <CodePanel />;
      case 'evaluation':
        return <EvaluationPanel />;
      case 'participants':
        return <ParticipantList participants={participants} localUserId={localUserId} />;
      case 'chat':
        return <ChatPanel />;
      default:
        return <ResumePanel candidateId={interview.candidateId} />;
    }
  };

  return (
    <div className="w-72 flex-shrink-0 bg-white border-l border-slate-200 flex flex-col h-full shadow-lg">
      {/* Tab bar */}
      <div className="flex border-b border-slate-200 flex-shrink-0 overflow-x-auto">
        {TABS.map(({ key, label }) => {
          const isActive = activeSidebarTab === key;
          const hasBadge = key === 'chat' && unreadChatCount > 0;
          return (
            <button
              key={key}
              id={`sidebar-tab-${key}`}
              onClick={() => {
                setActiveSidebarTab(key);
                if (key === 'chat' || key === 'participants' || key === 'notes') {
                  setActivePanel(key as 'chat' | 'participants' | 'notes');
                } else {
                  setActivePanel(null);
                }
              }}
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

export default RecruiterSidebar;
