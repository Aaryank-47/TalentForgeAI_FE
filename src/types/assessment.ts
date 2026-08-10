// ─────────────────────────────────────────────────────────────
// TalentForge AI — Assessment Module Types
// ─────────────────────────────────────────────────────────────

export type AssessmentType =
  | 'mcq'
  | 'dsa'
  | 'mixed'
  | 'live_machine_coding'
  | 'project';

export type AssessmentStatus = 'draft' | 'active' | 'archived' | 'scheduled';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type SubmissionType =
  | 'github'
  | 'live_url'
  | 'zip'
  | 'documentation'
  | 'video'
  | 'notes';

// ─── Backend-aligned: AttemptStatus mirrors backend status enum ──────────────
// Backend enum values: PENDING, ONGOING, SUBMITTED, EVALUATED, EXPIRED, FAILED
export type AttemptStatus =
  | 'PENDING'      // Not yet started
  | 'ONGOING'      // In progress
  | 'SUBMITTED'    // Completed and waiting evaluation
  | 'EVALUATED'    // Score assigned
  | 'EXPIRED'      // Time ran out
  | 'FAILED';      // Failed attempt

/**
 * @deprecated Use AttemptStatus (backend-aligned, SCREAMING_SNAKE_CASE) instead.
 * Kept for backwards compatibility with existing UI components.
 */
export type CandidateAttemptStatus =
  | 'pending'
  | 'in_progress'
  | 'submitted'
  | 'late'
  | 'rejected'
  | 'accepted'
  | 'expired';

// ─── MCQ ───────────────────────────────────────────────────────
export interface MCQQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: Difficulty;
  marks: number;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
  tags?: string[];
}

// ─── DSA ───────────────────────────────────────────────────────
export interface TestCase {
  input: string;
  output: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface StarterCode {
  [language: string]: string;
}

export interface DSAProblem {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  timeLimit: string; // e.g. "30 min"
  memoryLimit?: string;
  statement: string;
  constraints: string[];
  examples: TestCase[];
  hiddenTestCases: TestCase[];
  starterCode: StarterCode;
  supportedLanguages: string[];
  tags?: string[];
  points: number;
}

// ─── Assessment Config ─────────────────────────────────────────
export interface MCQConfig {
  totalQuestions: number;
  marksPerQuestion: number;
  negativeMarking: number; // 0 means disabled
  passingScore: number;
  timeLimit: number; // minutes
  selectedQuestionIds: string[];
}

export interface DSAConfig {
  numberOfQuestions: number;
  totalDuration: number; // minutes
  passingScore: number;
  marksPerQuestion: number;
  selectedProblemIds: string[];
}

export interface MixedConfig {
  mcq: MCQConfig;
  dsa: DSAConfig;
}

export interface MachineCodingConfig {
  topic: string;
  instructions: string;
  sharedNotes: string;
  duration: number; // minutes
  supportedLanguages: string[];
}

export interface ProjectConfig {
  title: string;
  description: string;
  requirements: string; // rich text / markdown
  techStack: string[];
  difficulty: Difficulty;
  maximumMarks: number;
  deadlineDays: number;
  submissionTypes: SubmissionType[];
  attachmentUrls?: string[];
  pdfUrl?: string;
}

export interface SharedAssessmentSettings {
  passingPercentage: number;
  totalMarks: number;
  totalQuestions: number;
  duration: number; // minutes
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  allowNavigation: boolean;
  autoSubmit: boolean;
  calculatorAllowed: boolean;
  fullscreenRequired: boolean;
  cameraRequired: boolean;
  screenSharingRequired: boolean;
}

export interface Assessment {
  id: string;
  name: string;
  description: string;
  type: AssessmentType;
  instructions: string;
  status: AssessmentStatus;
  createdBy: string;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  maxAttempts: number;
  settings: SharedAssessmentSettings;
  mcqConfig?: MCQConfig;
  dsaConfig?: DSAConfig;
  mixedConfig?: MixedConfig;
  machineCodingConfig?: MachineCodingConfig;
  projectConfig?: ProjectConfig;
}

// ─── Proctoring ────────────────────────────────────────────────
export interface ProctoringViolation {
  type: 'tab_switch' | 'fullscreen_exit' | 'multiple_faces' | 'noise' | 'copy_paste';
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

// ─── Backend-aligned: AssessmentAttempt ────────────────────────────────────────
/**
 * Backend-aligned assessment attempt type.
 * Maps to Prisma AssessmentAttempt model.
 * Use this for all new integration work (API calls, state from server).
 */
export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  candidateId: string;
  status: AttemptStatus;
  startedAt?: string;
  submittedAt?: string;
  score?: number;
  totalMarks: number;
  violations: ProctoringViolation[];
  /** Map of questionId -> answer value */
  answers: Record<string, string | number>;
  /** Time spent in seconds (backend: timeSpentSeconds) */
  timeSpentSeconds?: number;
}

/**
 * @deprecated Use AssessmentAttempt instead (backend-aligned).
 * Kept to avoid breaking existing UI components during migration.
 * Includes UI-specific fields (assessmentName, candidateName) not in backend model.
 */
export interface CandidateAttempt {
  id: string;
  assessmentId: string;
  assessmentName: string;
  candidateId: string;
  candidateName: string;
  status: CandidateAttemptStatus;
  startedAt?: string;
  submittedAt?: string;
  score?: number;
  totalMarks: number;
  violations: ProctoringViolation[];
  answers: Record<string, string | number>;
  timeSpent?: number; // seconds
}

// ─── Backend-aligned: AssessmentAnswer ────────────────────────────────────────
/**
 * Backend-aligned answer type for assessment question answers.
 * Maps to Prisma AssessmentAnswer model.
 * Note: Backend uses singular submissionUrl + meta JSON (not plural url arrays).
 */
export interface AssessmentAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  selectedOption?: number;        // MCQ: 0-based index of selected option
  codeAnswer?: string;            // DSA / Machine Coding: code submission
  submissionUrl?: string;         // Project: primary URL (github or live url)
  meta?: Record<string, unknown>; // Project: additional urls, notes, etc.
  isCorrect?: boolean;
  marksAwarded?: number;
}

/**
 * @deprecated Use AssessmentAnswer instead (backend-aligned).
 * ProjectSubmission had plural url fields which don't match backend schema.
 * Backend uses: submissionUrl (singular) + meta JSON object.
 */
export interface ProjectSubmission {
  id: string;
  attemptId: string;
  githubUrl?: string;
  liveUrl?: string;
  zipFileUrl?: string;
  documentationUrl?: string;
  videoUrl?: string;
  notes?: string;
  submittedAt?: string;
  status: CandidateAttemptStatus;
}

// ─── Assessment Template ───────────────────────────────────────
export interface AssessmentTemplate {
  id: string;
  name: string;
  type: AssessmentType;
  description: string;
  icon: string;
  tags: string[];
  estimatedDuration: string;
  questionCount: number;
  difficulty: Difficulty;
}

// ─── Builder Step ──────────────────────────────────────────────
export interface BuilderStep {
  id: number;
  label: string;
  description: string;
}

// ─── Code Execution (BACKEND DEPENDENCY) ──────────────────────
// NOTE: Real code execution requires a sandboxed backend service (Judge0 or Docker).
// This type is used for mock results during development.
export interface MockExecutionResult {
  type: 'success' | 'error';
  message: string;
  detail: string;
  passedCount: number;
  totalCount: number;
  runtimeMs: number;
  memoryMb: number;
}
