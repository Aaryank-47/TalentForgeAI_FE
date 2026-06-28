export type CandidateAttemptStatus = 'pending' | 'in_progress' | 'submitted' | 'late' | 'rejected' | 'accepted' | 'expired';

export interface CandidateAttempt {
  id: string;
  assessmentId: string;
  assessmentName: string;
  candidateId: string;
  candidateName: string;
  status: CandidateAttemptStatus;
  score?: number;
  totalMarks: number;
  startedAt?: string;
  completedAt?: string;
  violations?: Array<{ type: string; timestamp: string; severity: 'low'|'medium'|'high' }>;
  answers?: Record<string, any>;
  timeSpent?: number;
}
