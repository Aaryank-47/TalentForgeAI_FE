import { io, Socket } from 'socket.io-client';
import { tokenStorage } from '../api/apiClient';

export interface AIQuestionPayload {
  sessionId: string;
  questionId: string;
  sequence: number;
  question: string;
  topic?: string;
  skill?: string;
  difficulty?: string;
  expectedAreas?: string[];
}

export interface AIAnswerSubmitPayload {
  sessionId: string;
  questionId: string;
  answerText: string;
  recordingUrl?: string | null;
}

export interface AIAnswerReceivedPayload {
  submittedQuestionId: string;
  answerSubmitted: boolean;
  answerId: string;
  submittedAt: string;
}

export interface AIInterviewCompletedPayload {
  sessionId: string;
  completed: boolean;
  message: string;
}

export interface AIInterviewTimeoutPayload {
  sessionId: string;
  completed: boolean;
  reason: string;
}

export interface AIInterviewErrorPayload {
  code: string;
  message: string;
}

const SOCKET_SERVER_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
const AI_INTERVIEW_NAMESPACE = '/interviews/ai';

class AIInterviewSocketService {
  private socket: Socket | null = null;
  private currentSessionId: string | null = null;

  public connect(sessionId: string): Socket {
    this.currentSessionId = sessionId;

    if (this.socket && this.socket.connected) {
      this.socket.emit('ai-interview-resume', { sessionId });
      return this.socket;
    }

    if (this.socket) {
      this.socket.disconnect();
    }

    const token = tokenStorage.getAccessToken();

    this.socket = io(`${SOCKET_SERVER_URL}${AI_INTERVIEW_NAMESPACE}`, {
      withCredentials: true,
      auth: {
        token: token ? `Bearer ${token}` : undefined,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => {
      console.log('[AIInterviewSocket] Connected:', this.socket?.id);
      if (this.currentSessionId) {
        this.socket?.emit('ai-interview-start', { sessionId: this.currentSessionId });
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('[AIInterviewSocket] Reconnected after attempts:', attemptNumber);
      if (this.currentSessionId) {
        this.socket?.emit('ai-interview-resume', { sessionId: this.currentSessionId });
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('[AIInterviewSocket] Disconnected:', reason);
      if (reason === 'io server disconnect') {
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('[AIInterviewSocket] Connection Error:', error.message);
    });

    return this.socket;
  }

  public submitAnswer(payload: AIAnswerSubmitPayload): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('ai-answer-submit', payload);
    } else {
      console.error('[AIInterviewSocket] Cannot submit answer: Socket is disconnected');
    }
  }

  public endInterview(sessionId: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('ai-interview-end', { sessionId });
    }
  }

  public onQuestion(callback: (question: AIQuestionPayload) => void): () => void {
    if (!this.socket) return () => {};
    this.socket.on('ai-question', callback);
    return () => this.socket?.off('ai-question', callback);
  }

  public onAnswerReceived(callback: (data: AIAnswerReceivedPayload) => void): () => void {
    if (!this.socket) return () => {};
    this.socket.on('ai-answer-received', callback);
    return () => this.socket?.off('ai-answer-received', callback);
  }

  public onCompleted(callback: (data: AIInterviewCompletedPayload) => void): () => void {
    if (!this.socket) return () => {};
    this.socket.on('ai-interview-completed', callback);
    return () => this.socket?.off('ai-interview-completed', callback);
  }

  public onTimeout(callback: (data: AIInterviewTimeoutPayload) => void): () => void {
    if (!this.socket) return () => {};
    this.socket.on('ai-interview-timeout', callback);
    return () => this.socket?.off('ai-interview-timeout', callback);
  }

  public onError(callback: (error: AIInterviewErrorPayload) => void): () => void {
    if (!this.socket) return () => {};
    this.socket.on('ai-interview-error', callback);
    return () => this.socket?.off('ai-interview-error', callback);
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.currentSessionId = null;
    }
  }
}

export const aiInterviewSocketService = new AIInterviewSocketService();
