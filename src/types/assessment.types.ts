import type { ProctoringSettings, ExamBehaviorSettings } from './systemCheck.types';

export type AssessmentType = 'mcq' | 'dsa' | 'coding' | 'machine_coding' | 'descriptive' | 'logical_reasoning' | 'behavioral' | 'case_study' | 'project' | 'mixed';
export type AssessmentStatus = 'draft' | 'active' | 'archived' | 'scheduled';
export type SubmissionType = 'github' | 'live_url' | 'zip' | 'documentation' | 'video' | 'notes';

export interface SharedAssessmentSettings extends ExamBehaviorSettings, ProctoringSettings {
  passingPercentage: number;
  totalMarks: number;
  totalQuestions: number;
  duration: number;
}

export interface Assessment {
  id: string;
  name: string;
  description: string;
  type: AssessmentType;
  instructions: string;
  status: AssessmentStatus;
  createdAt: string;
  createdBy: string;
  maxAttempts?: number;
  settings?: SharedAssessmentSettings;
  projectConfig?: {
    title: string;
    description: string;
    requirements: string;
    techStack: string[];
    difficulty: string;
    maximumMarks: number;
    deadlineDays: number;
    submissionTypes: SubmissionType[];
  };
  mcqConfig?: {
    totalQuestions: number;
    marksPerQuestion: number;
    negativeMarking: number;
    passingScore: number;
    timeLimit: number;
    selectedQuestionIds: string[];
  };
  dsaConfig?: {
    totalProblems: number;
    marksPerQuestion: number;
    selectedProblemIds: string[];
  };
}
