export type CheckStatus = 'checking' | 'ok' | 'error' | 'warning' | 'active';

export interface SystemCheckProps {
  mode: 'ai-interview' | 'assessment' | 'live-interview';
  onReady?: () => void;
  onFailed?: (reason: string) => void;
}

export interface FaceState {
  detected: boolean;
  status: 'checking' | 'Excellent' | 'Good' | 'Poor' | 'Not Visible' | 'Multiple Faces';
  score: number;
}

export interface AudioState {
  volume: number;
  noiseLevel: 'Low' | 'Medium' | 'High';
  isMuted: boolean;
}

export interface MediaDeviceState {
  hasVideo: boolean;
  hasAudio: boolean;
  hasScreen: boolean;
  videoError?: string;
  audioError?: string;
  screenError?: string;
}
