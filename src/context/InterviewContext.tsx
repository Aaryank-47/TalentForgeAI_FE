// ─────────────────────────────────────────────────────────────
// TalentForge AI — Live Interview Context
// Provides global state for an active live interview session
// ─────────────────────────────────────────────────────────────
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import type { LiveInterview, ConnectionStatus, ChatMessage, InterviewNote } from '../types/interview.types';
import type { RoomParticipant, CurrentUser } from '../types/participant.types';

// ─── State Shape ──────────────────────────────────────────────
interface InterviewContextState {
  // Current interview
  currentInterview: LiveInterview | null;
  setCurrentInterview: (iv: LiveInterview | null) => void;

  // Participants
  participants: RoomParticipant[];
  setParticipants: (p: RoomParticipant[]) => void;

  // Current user
  currentUser: CurrentUser | null;
  setCurrentUser: (u: CurrentUser | null) => void;

  // Media controls
  isMicOn: boolean;
  isCameraOn: boolean;
  isScreenSharing: boolean;
  toggleMic: () => void;
  toggleCamera: () => void;
  toggleScreenShare: () => void;

  // Room state
  connectionStatus: ConnectionStatus;
  isRecording: boolean;
  elapsedSeconds: number;

  // UI state
  activeSidebarTab: string;
  setActiveSidebarTab: (tab: string) => void;
  activePanel: 'chat' | 'participants' | 'notes' | 'settings' | null;
  setActivePanel: (panel: 'chat' | 'participants' | 'notes' | 'settings' | null) => void;
  isCinemaMode: boolean;
  toggleCinemaMode: () => void;

  // Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  unreadChatCount: number;

  // Notes
  notes: InterviewNote[];
  currentNoteContent: string;
  setCurrentNoteContent: (content: string) => void;
  saveNote: () => void;

  // Room lifecycle
  isRoomJoined: boolean;
  joinRoom: () => void;
  leaveRoom: () => void;
  endInterview: () => void;
}

const InterviewContext = createContext<InterviewContextState | null>(null);

// ─── Provider ─────────────────────────────────────────────────
interface InterviewProviderProps {
  children: ReactNode;
  interview?: LiveInterview | null;
  participants?: RoomParticipant[];
  currentUser?: CurrentUser | null;
}

export const InterviewProvider: React.FC<InterviewProviderProps> = ({
  children,
  interview = null,
  participants: initialParticipants = [],
  currentUser: initialUser = null,
}) => {
  const [currentInterview, setCurrentInterview] = useState<LiveInterview | null>(interview);
  const [participants, setParticipants] = useState<RoomParticipant[]>(initialParticipants);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(initialUser);

  // Media
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Room
  const [connectionStatus] = useState<ConnectionStatus>('excellent');
  const [isRecording] = useState(interview?.recordingEnabled ?? false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRoomJoined, setIsRoomJoined] = useState(false);

  // UI
  const [activeSidebarTab, setActiveSidebarTab] = useState('resume');
  const [activePanel, setActivePanel] = useState<'chat' | 'participants' | 'notes' | 'settings' | null>(null);
  const [isCinemaMode, setIsCinemaMode] = useState(false);

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'sys_001',
      senderId: 'system',
      senderName: 'System',
      senderInitials: 'SY',
      senderRole: 'recruiter',
      text: 'The interview has started. All participants are in the room.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: true,
    },
  ]);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  // Notes
  const [notes, setNotes] = useState<InterviewNote[]>([]);
  const [currentNoteContent, setCurrentNoteContent] = useState('');

  // Timer
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRoomJoined) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRoomJoined]);

  // Track unread chat when panel is closed
  useEffect(() => {
    if (activePanel !== 'chat') {
      setUnreadChatCount((prev) => prev);
    } else {
      setUnreadChatCount(0);
    }
  }, [activePanel]);

  const toggleMic = useCallback(() => setIsMicOn((prev) => !prev), []);
  const toggleCamera = useCallback(() => setIsCameraOn((prev) => !prev), []);
  const toggleScreenShare = useCallback(() => setIsScreenSharing((prev) => !prev), []);
  const toggleCinemaMode = useCallback(() => setIsCinemaMode((prev) => !prev), []);

  const joinRoom = useCallback(() => {
    setIsRoomJoined(true);
  }, []);

  const leaveRoom = useCallback(() => {
    setIsRoomJoined(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const endInterview = useCallback(() => {
    setIsRoomJoined(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const sendChatMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !currentUser) return;
      const msg: ChatMessage = {
        id: `msg_${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderInitials: currentUser.initials,
        senderRole: currentUser.role,
        text: text.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, msg]);
      if (activePanel !== 'chat') {
        setUnreadChatCount((prev) => prev + 1);
      }
    },
    [currentUser, activePanel]
  );

  const saveNote = useCallback(() => {
    if (!currentNoteContent.trim() || !currentUser || !currentInterview) return;
    const note: InterviewNote = {
      id: `note_${Date.now()}`,
      interviewId: currentInterview.id,
      authorId: currentUser.id,
      content: currentNoteContent.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [...prev, note]);
    setCurrentNoteContent('');
  }, [currentNoteContent, currentUser, currentInterview]);

  const value: InterviewContextState = {
    currentInterview,
    setCurrentInterview,
    participants,
    setParticipants,
    currentUser,
    setCurrentUser,
    isMicOn,
    isCameraOn,
    isScreenSharing,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    connectionStatus,
    isRecording,
    elapsedSeconds,
    activeSidebarTab,
    setActiveSidebarTab,
    activePanel,
    setActivePanel,
    isCinemaMode,
    toggleCinemaMode,
    chatMessages,
    sendChatMessage,
    unreadChatCount,
    notes,
    currentNoteContent,
    setCurrentNoteContent,
    saveNote,
    isRoomJoined,
    joinRoom,
    leaveRoom,
    endInterview,
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────
export const useInterview = (): InterviewContextState => {
  const ctx = useContext(InterviewContext);
  if (!ctx) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return ctx;
};

export default InterviewContext;
