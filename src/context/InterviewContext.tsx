// ─────────────────────────────────────────────────────────────
// TalentForge AI — Live Interview Context (Phase 7 WebRTC)
// Provides global state and peer-to-peer WebRTC connections
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
import { io, Socket } from 'socket.io-client';
import type { LiveInterview, ConnectionStatus, ChatMessage, InterviewNote } from '../types/interview.types';
import type { RoomParticipant, CurrentUser } from '../types/participant.types';
import { tokenStorage } from '../services/api/apiClient';
import toast from 'react-hot-toast';

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

  // Media Streams
  localStream: MediaStream | null;
  remoteStreams: Record<string, MediaStream>;

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

  // Media States
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});

  // Room States
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [isRecording] = useState(interview?.recordingEnabled ?? false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRoomJoined, setIsRoomJoined] = useState(false);

  // UI States
  const [activeSidebarTab, setActiveSidebarTab] = useState('resume');
  const [activePanel, setActivePanel] = useState<'chat' | 'participants' | 'notes' | 'settings' | null>(null);
  const [isCinemaMode, setIsCinemaMode] = useState(false);

  // Chat States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'sys_001',
      senderId: 'system',
      senderName: 'System',
      senderInitials: 'SY',
      senderRole: 'recruiter',
      text: 'Establishing connection to session...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: true,
    },
  ]);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  // Notes States
  const [notes, setNotes] = useState<InterviewNote[]>([]);
  const [currentNoteContent, setCurrentNoteContent] = useState('');

  // Refs for WebRTC & WebSocket
  const socketRef = useRef<Socket | null>(null);
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch real authenticated user from backend on mount if token is present
  useEffect(() => {
    const fetchMe = async () => {
      const token = tokenStorage.getAccessToken();
      if (!token) return;
      try {
        const baseUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/v1/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return;
        const body = await res.json();
        const user = body.data?.user || body.user;
        if (user) {
          setCurrentUser({
            id: user.id,
            name: user.fullName || user.name || 'User',
            initials: (user.fullName || user.name || 'U').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
            role: user.role.toLowerCase() === 'employer' ? 'recruiter' : 'candidate',
            title: user.role,
            avatarColor: 'from-blue-500 to-blue-700',
            isMicOn: true,
            isCameraOn: true,
            isScreenSharing: false
          });
        }
      } catch (err) {
        console.error('Failed to fetch authenticated user details:', err);
      }
    };
    fetchMe();
  }, []);

  // Timer Effect
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

  // Unread chat notification count
  useEffect(() => {
    if (activePanel === 'chat') {
      setUnreadChatCount(0);
    }
  }, [activePanel]);

  // ─── WebRTC Connection Management ─────────────────────────────
  
  const createPeerConnection = useCallback((peerId: string, isInitiator: boolean, channel?: BroadcastChannel) => {
    if (peersRef.current.has(peerId)) {
      return peersRef.current.get(peerId)!;
    }

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    peersRef.current.set(peerId, pc);

    // Add local tracks to outgoing connection
    const currentLocal = localStreamRef.current;
    if (currentLocal) {
      currentLocal.getTracks().forEach((track) => {
        pc.addTrack(track, currentLocal);
      });
    }

    // Handle incoming remote tracks
    pc.ontrack = (event) => {
      const stream = event.streams[0];
      setRemoteStreams((prev) => ({
        ...prev,
        [peerId]: stream
      }));

      // Update participant media status in the room
      setParticipants((prev) =>
        prev.map((p) => {
          if (p.id === peerId) {
            return {
              ...p,
              connectionStatus: 'excellent',
              joinedAt: new Date().toLocaleTimeString()
            };
          }
          return p;
        })
      );
    };

    // Handle ICE Candidates generated locally
    pc.onicecandidate = (event) => {
      if (event.candidate && currentInterview) {
        if (channel) {
          channel.postMessage({
            type: 'webrtc-candidate',
            from: currentUser?.id,
            to: peerId,
            candidate: event.candidate
          });
        } else if (socketRef.current) {
          socketRef.current.emit('webrtc-candidate', {
            sessionId: currentInterview.id,
            to: peerId,
            candidate: event.candidate
          });
        }
      }
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      setConnectionStatus(state === 'connected' ? 'excellent' : 'good');
      if (state === 'failed' || state === 'disconnected') {
        toast.error(`Video connection lost with participant.`);
      }
    };

    // Trigger offer generation (initiator only)
    pc.onnegotiationneeded = async () => {
      if (isInitiator && currentInterview) {
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          if (channel) {
            channel.postMessage({
              type: 'webrtc-offer',
              from: currentUser?.id,
              to: peerId,
              offer
            });
          } else if (socketRef.current) {
            socketRef.current.emit('webrtc-offer', {
              sessionId: currentInterview.id,
              to: peerId,
              offer
            });
          }
        } catch (err) {
          console.error('Failed to create WebRTC offer:', err);
        }
      }
    };

    return pc;
  }, [currentInterview, currentUser]);

  const cleanPeers = useCallback(() => {
    peersRef.current.forEach((pc) => {
      pc.close();
    });
    peersRef.current.clear();
    setRemoteStreams({});
  }, []);

  const cleanMedia = useCallback(() => {
    const currentLocal = localStreamRef.current;
    if (currentLocal) {
      currentLocal.getTracks().forEach((t) => t.stop());
    }
    setLocalStream(null);
    localStreamRef.current = null;
    setIsMicOn(false);
    setIsCameraOn(false);
    setIsScreenSharing(false);
  }, []);

  // ─── Socket & Media Initializer ────────────────────────────────

  const joinRoom = useCallback(async () => {
    if (!currentInterview) return;
    
    try {
      // 1. Get Local Media Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setLocalStream(stream);
      localStreamRef.current = stream;
      setIsMicOn(true);
      setIsCameraOn(true);

      // 2. Establish Socket Connection
      const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
      const token = tokenStorage.getAccessToken();
      
      const socket = io(`${wsUrl}/interviews`, {
        auth: { token },
        withCredentials: true,
        transports: ['polling', 'websocket'],
        query: { sessionId: currentInterview.id }
      });
      socketRef.current = socket;

      // Force a 2-second timeout to transition to BroadcastChannel if connection hangs or fails
      const fallbackTimeout = setTimeout(() => {
        if (!socket.connected) {
          console.warn('Socket connection timed out. Falling back to BroadcastChannel signaling.');
          socket.disconnect();
          triggerBroadcastChannelFallback();
        }
      }, 2000);

      const triggerBroadcastChannelFallback = () => {
        setConnectionStatus('good');
        setIsRoomJoined(true);
        console.log('Initializing BroadcastChannel signaling room:', `tf-room-${currentInterview.id}`);
        
        // Initialize BroadcastChannel for same-origin signaling between recruiter and candidate tabs
        const channel = new BroadcastChannel(`tf-room-${currentInterview.id}`);
        
        channel.onmessage = async (event) => {
          const { type, from, to, offer, answer, candidate } = event.data;
          
          // Only handle messages meant for us
          if (to && to !== currentUser?.id) return;
          
          console.log(`[BroadcastChannel Receive] Event: ${type} | From: ${from} | To: ${to}`);
          
          switch (type) {
            case 'ping':
              // Send pong back
              channel.postMessage({ type: 'pong', from: currentUser?.id, to: from });
              
              // Add peer to participants list
              setParticipants((prev) => {
                if (prev.some((p) => p.id === from)) return prev;
                return [
                  ...prev,
                  {
                    id: from,
                    name: from.includes('rec') ? 'Lamine Yamal' : 'Aaryan Singh',
                    initials: from.includes('rec') ? 'LY' : 'AS',
                    role: from.includes('rec') ? 'recruiter' : 'candidate',
                    avatarColor: from.includes('rec') ? 'from-blue-500 to-blue-700' : 'from-purple-500 to-purple-700',
                    title: from.includes('rec') ? 'Recruiter' : 'Candidate',
                    email: '',
                    isMicOn: true,
                    isCameraOn: true,
                    isSpeaking: false,
                    isScreenSharing: false,
                    connectionStatus: 'good'
                  }
                ];
              });
              break;

            case 'pong':
              // Discovered peer replied to our ping, add and start connection
              setParticipants((prev) => {
                if (prev.some((p) => p.id === from)) return prev;
                return [
                  ...prev,
                  {
                    id: from,
                    name: from.includes('rec') ? 'Lamine Yamal' : 'Aaryan Singh',
                    initials: from.includes('rec') ? 'LY' : 'AS',
                    role: from.includes('rec') ? 'recruiter' : 'candidate',
                    avatarColor: from.includes('rec') ? 'from-blue-500 to-blue-700' : 'from-purple-500 to-purple-700',
                    title: from.includes('rec') ? 'Recruiter' : 'Candidate',
                    email: '',
                    isMicOn: true,
                    isCameraOn: true,
                    isSpeaking: false,
                    isScreenSharing: false,
                    connectionStatus: 'good'
                  }
                ];
              });

              // Initiate peer connection
              createPeerConnection(from, true, channel);
              break;

            case 'join-room':
              // Tell the new peer we are here
              console.log(`[BroadcastChannel Send] room-users to ${from}`);
              channel.postMessage({ type: 'room-users', from: currentUser?.id, to: from });
              
              // We are the initiator of the connection
              createPeerConnection(from, true, channel);
              break;
              
            case 'room-users':
              // Existing peer discovered
              setParticipants((prev) => {
                if (prev.some((p) => p.id === from)) return prev;
                return [
                  ...prev,
                  {
                    id: from,
                    name: from.includes('rec') ? 'Lamine Yamal' : 'Aaryan Singh',
                    initials: from.includes('rec') ? 'LY' : 'AS',
                    role: from.includes('rec') ? 'recruiter' : 'candidate',
                    avatarColor: from.includes('rec') ? 'from-blue-500 to-blue-700' : 'from-purple-500 to-purple-700',
                    title: from.includes('rec') ? 'Recruiter' : 'Candidate',
                    email: '',
                    isMicOn: true,
                    isCameraOn: true,
                    isSpeaking: false,
                    isScreenSharing: false,
                    connectionStatus: 'good'
                  }
                ];
              });
              // We wait for the existing peer to offer
              createPeerConnection(from, false, channel);
              break;
              
            case 'webrtc-offer':
              console.log(`[BroadcastChannel Receive] WebRTC Offer from ${from}`);
              const pcOffer = createPeerConnection(from, false, channel);
              try {
                await pcOffer.setRemoteDescription(new RTCSessionDescription(offer));
                const localAnswer = await pcOffer.createAnswer();
                await pcOffer.setLocalDescription(localAnswer);
                console.log(`[BroadcastChannel Send] WebRTC Answer to ${from}`);
                channel.postMessage({ type: 'webrtc-answer', from: currentUser?.id, to: from, answer: localAnswer });
              } catch (err) {
                console.error('Error handling WebRTC offer:', err);
              }
              break;
              
            case 'webrtc-answer':
              console.log(`[BroadcastChannel Receive] WebRTC Answer from ${from}`);
              const pcAnswer = peersRef.current.get(from);
              if (pcAnswer) {
                try {
                  await pcAnswer.setRemoteDescription(new RTCSessionDescription(answer));
                } catch (err) {
                  console.error('Error setting WebRTC answer:', err);
                }
              }
              break;
              
            case 'webrtc-candidate':
              const pcCand = peersRef.current.get(from);
              if (pcCand) {
                try {
                  await pcCand.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (err) {
                  console.error('Error adding ICE candidate:', err);
                }
              }
              break;
              
            case 'chat-message':
              // Avoid duplicate local message rendering
              if (from !== currentUser?.id) {
                setChatMessages((prev) => [...prev, event.data.message]);
              }
              break;
          }
        };
        
        // Start continuous discovery pings every 1 second
        const pingInterval = setInterval(() => {
          if (currentUser?.id) {
            console.log(`[BroadcastChannel Send] ping from ${currentUser?.id}`);
            channel.postMessage({ type: 'ping', from: currentUser?.id });
          }
        }, 1000);
        
        // Wrap channel methods to pretend it is the socket connection
        (socketRef as any).current = {
          connected: true,
          emit: (event: string, payload: any) => {
            if (event === 'send-message') {
              console.log(`[BroadcastChannel Send] chat-message:`, payload.message.text);
              channel.postMessage({ type: 'chat-message', from: currentUser?.id, message: payload.message });
              setChatMessages((prev) => [...prev, payload.message]);
            }
          },
          disconnect: () => {
            clearInterval(pingInterval);
            channel.close();
          }
        };

        toast.success('Connected to WebRTC local peer network!', { duration: 4000 });
      };

      // 3. Listen to Signaling & Presence Events
      socket.on('connect', () => {
        clearTimeout(fallbackTimeout);
        setConnectionStatus('good');
        socket.emit('join-room', { sessionId: currentInterview.id });
      });

      socket.on('connect_error', () => {
        clearTimeout(fallbackTimeout);
        console.warn('Socket authentication failed. Falling back to Browser BroadcastChannel Signaling Mode.');
        triggerBroadcastChannelFallback();
      });

      socket.on('room-users', (users: { id: string; name: string; role: string; initials: string; avatarColor: string }[]) => {
        // Hydrate participant list from backend presence
        const roomPeers = users
          .filter((u) => u.id !== currentUser?.id)
          .map((u) => ({
            id: u.id,
            name: u.name,
            initials: u.initials,
            role: (u.role.toLowerCase() === 'recruiter' ? 'recruiter' : 'candidate') as any,
            avatarColor: u.avatarColor || 'from-indigo-500 to-indigo-700',
            title: u.role,
            email: '',
            isMicOn: true,
            isCameraOn: true,
            isSpeaking: false,
            isScreenSharing: false,
            connectionStatus: 'good' as const
          }));

        setParticipants(roomPeers);

        // Initiate Peer Connections to existing users
        roomPeers.forEach((p) => {
          createPeerConnection(p.id, true);
        });

        setChatMessages((prev) => [
          ...prev,
          {
            id: `join_${Date.now()}`,
            senderId: 'system',
            senderName: 'System',
            senderInitials: 'SY',
            senderRole: 'recruiter',
            text: 'Successfully joined the secure interview room.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSystem: true,
          }
        ]);
      });

      socket.on('user-joined', (user: { id: string; name: string; role: string; initials: string; avatarColor: string }) => {
        if (user.id === currentUser?.id) return;
        
        toast.success(`${user.name} joined the room.`);
        
        // Add user to participants list
        setParticipants((prev) => {
          if (prev.some((p) => p.id === user.id)) return prev;
          return [
            ...prev,
            {
              id: user.id,
              name: user.name,
              initials: user.initials,
              role: (user.role.toLowerCase() === 'recruiter' ? 'recruiter' : 'candidate') as any,
              avatarColor: user.avatarColor || 'from-slate-500 to-slate-700',
              title: user.role,
              email: '',
              isMicOn: true,
              isCameraOn: true,
              isSpeaking: false,
              isScreenSharing: false,
              connectionStatus: 'good' as const
            }
          ];
        });

        // Instantiate peer connection (wait for negotiation)
        createPeerConnection(user.id, false);
      });

      socket.on('user-left', (peerId: string) => {
        // Clean up connection
        const pc = peersRef.current.get(peerId);
        if (pc) {
          pc.close();
          peersRef.current.delete(peerId);
        }
        
        setRemoteStreams((prev) => {
          const updated = { ...prev };
          delete updated[peerId];
          return updated;
        });

        setParticipants((prev) => prev.filter((p) => p.id !== peerId));
        toast(`${peerId} left the interview.`, { icon: '👋' });
      });

      // signaling events
      socket.on('webrtc-offer', async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
        const pc = createPeerConnection(from, false);
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('webrtc-answer', {
            sessionId: currentInterview.id,
            to: from,
            answer
          });
        } catch (err) {
          console.error('Error handling WebRTC offer:', err);
        }
      });

      socket.on('webrtc-answer', async ({ from, answer }: { from: string; answer: RTCSessionDescriptionInit }) => {
        const pc = peersRef.current.get(from);
        if (pc) {
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
          } catch (err) {
            console.error('Error setting WebRTC answer:', err);
          }
        }
      });

      socket.on('webrtc-candidate', async ({ from, candidate }: { from: string; candidate: RTCIceCandidateInit }) => {
        const pc = peersRef.current.get(from);
        if (pc) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.error('Error adding ICE candidate:', err);
          }
        }
      });

      socket.on('new-message', (msg: ChatMessage) => {
        setChatMessages((prev) => [...prev, msg]);
        if (activePanel !== 'chat') {
          setUnreadChatCount((c) => c + 1);
        }
      });

      setIsRoomJoined(true);
    } catch (err: any) {
      toast.error('Could not access microphone and camera. Check your permissions.');
      console.error('Media permission denied:', err);
    }
  }, [currentInterview, currentUser, createPeerConnection, activePanel]);

  const leaveRoom = useCallback(() => {
    setIsRoomJoined(false);
    cleanPeers();
    cleanMedia();
    
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    if (timerRef.current) clearInterval(timerRef.current);
    setConnectionStatus('disconnected');
  }, [cleanPeers, cleanMedia]);

  const endInterview = useCallback(() => {
    if (socketRef.current && currentInterview) {
      socketRef.current.emit('end-interview', { sessionId: currentInterview.id });
    }
    leaveRoom();
  }, [currentInterview, leaveRoom]);

  // Clean up component on unmount
  useEffect(() => {
    return () => {
      leaveRoom();
    };
  }, [leaveRoom]);

  // ─── Track Control Handlers ───────────────────────────────────

  const toggleMic = useCallback(() => {
    const stream = localStreamRef.current;
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
        
        // Notify others
        if (socketRef.current && currentInterview) {
          socketRef.current.emit('toggle-audio', {
            sessionId: currentInterview.id,
            enabled: audioTrack.enabled
          });
        }
      }
    }
  }, [currentInterview]);

  const toggleCamera = useCallback(() => {
    const stream = localStreamRef.current;
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
        
        // Notify others
        if (socketRef.current && currentInterview) {
          socketRef.current.emit('toggle-video', {
            sessionId: currentInterview.id,
            enabled: videoTrack.enabled
          });
        }
      }
    }
  }, [currentInterview]);

  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      // Restore camera video track
      const stream = localStreamRef.current;
      if (stream) {
        const cameraTrack = stream.getVideoTracks()[0];
        peersRef.current.forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
          if (sender && cameraTrack) {
            sender.replaceTrack(cameraTrack);
          }
        });
      }
      setIsScreenSharing(false);
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        
        peersRef.current.forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        });

        screenTrack.onended = () => {
          // Fallback when user stops sharing via browser bar
          const stream = localStreamRef.current;
          const cameraTrack = stream?.getVideoTracks()[0];
          peersRef.current.forEach((pc) => {
            const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
            if (sender && cameraTrack) {
              sender.replaceTrack(cameraTrack);
            }
          });
          setIsScreenSharing(false);
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.error('Screen sharing canceled or failed:', err);
      }
    }
  }, [isScreenSharing]);

  const sendChatMessage = useCallback((text: string) => {
    if (!text.trim() || !currentUser || !currentInterview) return;
    
    const msg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderInitials: currentUser.initials,
      senderRole: currentUser.role,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('send-message', {
        sessionId: currentInterview.id,
        message: msg
      });
    } else {
      // Local mock mode: append user message immediately
      setChatMessages((prev) => [...prev, msg]);
      
      // Simulate recruiter response in 1.5s
      setTimeout(() => {
        const replies = [
          "Great point. Let's look at the implementation details.",
          "Could you tell us more about how you handle ICE connection failures?",
          "That aligns perfectly with our stack. Thank you.",
          "Perfect, let's proceed with the coding portion of the session."
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const mockReply: ChatMessage = {
          id: `reply_${Date.now()}`,
          senderId: 'rec_001',
          senderName: 'Lamine Yamal',
          senderInitials: 'LY',
          senderRole: 'recruiter',
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev, mockReply]);
      }, 1500);
    }
  }, [currentUser, currentInterview]);

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

  const toggleCinemaMode = useCallback(() => {
    setIsCinemaMode((prev) => !prev);
  }, []);

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
    localStream,
    remoteStreams,
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
