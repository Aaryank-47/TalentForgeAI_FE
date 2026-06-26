/** Core hiring workflow domain types — backend-agnostic, API-ready */

export type DefaultStageType =
  | 'resume_screening'
  | 'ai_interview'
  | 'assessment'
  | 'technical_interview'
  | 'hr_interview'
  | 'manager_interview'
  | 'offer'
  | 'background_verification'
  | 'document_verification'
  | 'joining'
  | 'hired'
  | 'rejected';

export type QuestionCategory =
  | 'technical'
  | 'behavioral'
  | 'communication'
  | 'leadership'
  | 'problem_solving'
  | 'culture_fit';

export type QuestionSource = 'manual' | 'library' | 'ai_generated';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ExperienceLevel =
  | 'entry'
  | 'junior'
  | 'mid'
  | 'senior'
  | 'lead'
  | 'executive';

export type DeadlineDuration = '24h' | '48h' | '3d' | '7d' | 'custom';

export type DeadlineExpiryAction = 'reject' | 'recruiter_review';

export interface DefaultStageDefinition {
  type: DefaultStageType;
  label: string;
  description: string;
  icon: string;
  color: string;
}

export interface WorkflowStage {
  id: string;
  type: DefaultStageType | 'custom';
  label: string;
  enabled: boolean;
  order: number;
  /** Links to AI Interview Template when type is ai_interview */
  interviewTemplateId?: string;
  /** Custom stage name when type is custom */
  customLabel?: string;
}

export interface HiringWorkflowTemplate {
  id: string;
  name: string;
  description: string;
  stages: WorkflowStage[];
  isDefault: boolean;
  isArchived: boolean;
  jobCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeadlineConfig {
  duration: DeadlineDuration;
  customHours?: number;
  expiryAction: DeadlineExpiryAction;
}

export interface AIInterviewConfig {
  name: string;
  durationMinutes: number;
  questionCount: number;
  difficulty: Difficulty;
  passingScore: number;
  deadline: DeadlineConfig;
  maxAttempts: number;
  cameraRequired: boolean;
  microphoneRequired: boolean;
  recordingRequired: boolean;
  randomizeQuestions: boolean;
  timePerQuestionSeconds: number;
  retakeAllowed: boolean;
  enableAiFollowUp: boolean;
  candidateInstructions: string;
}

export interface InterviewQuestion {
  id: string;
  text: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  timeLimitSeconds?: number;
  order: number;
}

export interface AIQuestionGenerationParams {
  jobRole: string;
  experienceLevel: ExperienceLevel;
  requiredSkills: string[];
  difficulty: Difficulty;
  questionCount: number;
  durationMinutes: number;
}

export interface InterviewTemplate {
  id: string;
  name: string;
  config: AIInterviewConfig;
  questionSource: QuestionSource;
  questions: InterviewQuestion[];
  /** Selected library question IDs when source is library */
  libraryQuestionIds: string[];
  aiGenerationParams?: AIQuestionGenerationParams;
  skills: string[];
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

export interface QuestionLibraryItem {
  id: string;
  text: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  tags: string[];
  usageCount: number;
  createdAt: string;
}

export interface JobWorkflowReference {
  workflowTemplateId: string;
  /** Snapshot at publish time — future backend concern */
  workflowName: string;
  stageCount: number;
}
