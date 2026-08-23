import { io, Socket } from 'socket.io-client';
import { tokenStorage } from '../api/apiClient';

export type ResumeProcessingStage =
  | 'QUEUED'
  | 'FETCHING_FILE'
  | 'EXTRACTION'
  | 'AI_PARSING'
  | 'NORMALIZATION'
  | 'PERSISTENCE'
  | 'COMPLETED'
  | 'FAILED';

export interface ResumeStagePayload {
  stage: ResumeProcessingStage;
  message: string;
  meta: {
    resumeId: string;
    candidateId?: string;
    jobId?: string;
    timestamp?: string;
    [key: string]: any;
  };
}

export interface ResumeCompletedPayload {
  resumeId: string;
  candidateId?: string;
  jobId?: string;
  status: 'COMPLETED';
  message: string;
  timestamp?: string;
}

export interface ResumeFailedPayload {
  resumeId: string;
  candidateId?: string;
  jobId?: string;
  status: 'FAILED';
  error: string;
  timestamp?: string;
}

const SOCKET_SERVER_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
const RESUME_NAMESPACE = '/resume-processing';

let resumeSocket: Socket | null = null;

export function getResumeSocket(): Socket {
  if (!resumeSocket || !resumeSocket.connected) {
    const token = tokenStorage.getAccessToken();

    resumeSocket = io(`${SOCKET_SERVER_URL}${RESUME_NAMESPACE}`, {
      withCredentials: true,
      auth: {
        token: token ? `Bearer ${token}` : undefined,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
  }

  return resumeSocket;
}

export function subscribeToResumeProgress(
  resumeId: string,
  callbacks: {
    onStageChange?: (payload: ResumeStagePayload) => void;
    onCompleted?: (payload: ResumeCompletedPayload) => void;
    onFailed?: (payload: ResumeFailedPayload) => void;
    onError?: (err: any) => void;
  }
): () => void {
  const socket = getResumeSocket();

  const handleSubscribe = () => {
    socket.emit('resume:subscribe', { resumeId });
  };

  if (socket.connected) {
    handleSubscribe();
  }
  socket.on('connect', handleSubscribe);

  const stageHandler = (data: ResumeStagePayload) => {
    if (data.meta?.resumeId === resumeId) {
      callbacks.onStageChange?.(data);
    }
  };

  const completedHandler = (data: ResumeCompletedPayload) => {
    if (data.resumeId === resumeId) {
      callbacks.onCompleted?.(data);
    }
  };

  const failedHandler = (data: ResumeFailedPayload) => {
    if (data.resumeId === resumeId) {
      callbacks.onFailed?.(data);
    }
  };

  const errorHandler = (err: any) => {
    callbacks.onError?.(err);
  };

  socket.on('resume:stage', stageHandler);
  socket.on('resume:completed', completedHandler);
  socket.on('resume:failed', failedHandler);
  socket.on('resume:error', errorHandler);

  return () => {
    socket.off('connect', handleSubscribe);
    socket.emit('resume:unsubscribe', { resumeId });
    socket.off('resume:stage', stageHandler);
    socket.off('resume:completed', completedHandler);
    socket.off('resume:failed', failedHandler);
    socket.off('resume:error', errorHandler);
  };
}
