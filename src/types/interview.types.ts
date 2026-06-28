export type DeadlineDuration = '24h' | '48h' | '3d' | '7d' | 'custom';
export type DeadlineExpiryAction = 'reject' | 'recruiter_review';

export interface InterviewTemplate {
  id: string;
  name: string;
  durationMinutes: number;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  passingScore: number;
  deadline: {
    duration: DeadlineDuration;
    customDate?: string;
    expiryAction: DeadlineExpiryAction;
  };
  maxAttempts: number;
  
  // Proctoring
  cameraRequired: boolean;
  microphoneRequired: boolean;
  recordingRequired: boolean;
  screenSharingRequired?: boolean;
  fullscreenRequired?: boolean;
  faceDetection?: boolean;
  noiseDetection?: boolean;
  tabMonitoring?: boolean;

  welcomeVideoUrl?: string;
  createdAt: string;
  updatedAt: string;
}
