import type {
  DefaultStageDefinition,
  HiringWorkflowTemplate,
  InterviewTemplate,
  QuestionLibraryItem,
  WorkflowStage,
} from '../types/hiring';

export const DEFAULT_STAGE_DEFINITIONS: DefaultStageDefinition[] = [
  { type: 'resume_screening', label: 'Resume Screening', description: 'Review and shortlist candidate resumes', icon: 'FileSearch', color: 'blue' },
  { type: 'ai_interview', label: 'AI Interview', description: 'Automated AI-powered video interview', icon: 'Bot', color: 'violet' },
  { type: 'assessment', label: 'Assessment', description: 'Technical or aptitude assessment', icon: 'ClipboardList', color: 'purple' },
  { type: 'technical_interview', label: 'Technical Interview', description: 'Live technical interview with engineers', icon: 'Code', color: 'indigo' },
  { type: 'hr_interview', label: 'HR Interview', description: 'HR round for culture and fit', icon: 'Users', color: 'pink' },
  { type: 'manager_interview', label: 'Manager Interview', description: 'Interview with hiring manager', icon: 'UserCheck', color: 'cyan' },
  { type: 'offer', label: 'Offer', description: 'Extend and negotiate offer', icon: 'FileText', color: 'emerald' },
  { type: 'background_verification', label: 'Background Verification', description: 'Verify employment and credentials', icon: 'Shield', color: 'slate' },
  { type: 'document_verification', label: 'Document Verification', description: 'Verify identity and documents', icon: 'FileCheck', color: 'slate' },
  { type: 'joining', label: 'Joining', description: 'Onboarding and joining formalities', icon: 'LogIn', color: 'teal' },
  { type: 'hired', label: 'Hired', description: 'Candidate successfully hired', icon: 'CheckCircle', color: 'green' },
  { type: 'rejected', label: 'Rejected', description: 'Candidate rejected from pipeline', icon: 'XCircle', color: 'red' },
];

export const CUSTOM_STAGE_SUGGESTIONS = [
  'Culture Fit',
  'VP Round',
  'Founder Round',
  'Client Interview',
  'Panel Interview',
  'Case Study',
];

export const QUESTION_CATEGORIES = [
  { value: 'technical' as const, label: 'Technical' },
  { value: 'behavioral' as const, label: 'Behavioral' },
  { value: 'communication' as const, label: 'Communication' },
  { value: 'leadership' as const, label: 'Leadership' },
  { value: 'problem_solving' as const, label: 'Problem Solving' },
  { value: 'culture_fit' as const, label: 'Culture Fit' },
];

export const DEADLINE_OPTIONS = [
  { value: '24h' as const, label: '24 Hours' },
  { value: '48h' as const, label: '48 Hours' },
  { value: '3d' as const, label: '3 Days' },
  { value: '7d' as const, label: '7 Days' },
  { value: 'custom' as const, label: 'Custom' },
];

export const DEFAULT_AI_INTERVIEW_CONFIG = {
  name: 'AI Interview',
  durationMinutes: 25,
  questionCount: 15,
  difficulty: 'medium' as const,
  passingScore: 70,
  deadline: { duration: '48h' as const, expiryAction: 'reject' as const },
  maxAttempts: 2,
  cameraRequired: true,
  microphoneRequired: true,
  recordingRequired: true,
  randomizeQuestions: true,
  timePerQuestionSeconds: 120,
  retakeAllowed: false,
  enableAiFollowUp: true,
  candidateInstructions: 'Please ensure you are in a quiet environment with good lighting. You will have a limited time to answer each question.',
};

const frontendInterviewTemplate: InterviewTemplate = {
  id: 'it-1',
  name: 'Frontend Developer AI Interview',
  config: {
    ...DEFAULT_AI_INTERVIEW_CONFIG,
    name: 'Frontend Developer AI Interview',
    questionCount: 15,
    durationMinutes: 25,
  },
  questionSource: 'ai_generated',
  questions: [
    { id: 'q1', text: 'Explain the React virtual DOM and how it improves performance.', category: 'technical', difficulty: 'medium', order: 1, timeLimitSeconds: 120 },
    { id: 'q2', text: 'Describe a challenging bug you fixed in a React application.', category: 'behavioral', difficulty: 'medium', order: 2, timeLimitSeconds: 120 },
    { id: 'q3', text: 'How do you optimize bundle size in a JavaScript application?', category: 'technical', difficulty: 'hard', order: 3, timeLimitSeconds: 120 },
    { id: 'q4', text: 'Explain the difference between useMemo and useCallback.', category: 'technical', difficulty: 'medium', order: 4, timeLimitSeconds: 90 },
    { id: 'q5', text: 'How do you handle state management in large React apps?', category: 'technical', difficulty: 'medium', order: 5, timeLimitSeconds: 120 },
  ],
  libraryQuestionIds: [],
  aiGenerationParams: {
    jobRole: 'Frontend Developer',
    experienceLevel: 'mid',
    requiredSkills: ['React', 'JavaScript', 'Node.js', 'TypeScript'],
    difficulty: 'medium',
    questionCount: 15,
    durationMinutes: 25,
  },
  skills: ['React', 'JavaScript', 'Node.js', 'Communication'],
  createdAt: '2024-05-01',
  updatedAt: '2024-06-10',
  usageCount: 8,
};

const backendInterviewTemplate: InterviewTemplate = {
  id: 'it-2',
  name: 'Backend Engineer AI Interview',
  config: {
    ...DEFAULT_AI_INTERVIEW_CONFIG,
    name: 'Backend Engineer AI Interview',
    questionCount: 12,
    durationMinutes: 30,
    difficulty: 'hard',
    passingScore: 75,
  },
  questionSource: 'library',
  questions: [],
  libraryQuestionIds: ['ql-1', 'ql-3', 'ql-5', 'ql-7'],
  skills: ['Node.js', 'PostgreSQL', 'System Design'],
  createdAt: '2024-05-15',
  updatedAt: '2024-06-01',
  usageCount: 4,
};

export const initialInterviewTemplates: InterviewTemplate[] = [
  frontendInterviewTemplate,
  backendInterviewTemplate,
];

function makeStage(
  id: string,
  type: WorkflowStage['type'],
  label: string,
  order: number,
  enabled = true,
  interviewTemplateId?: string,
): WorkflowStage {
  return { id, type, label, enabled, order, interviewTemplateId };
}

export const initialWorkflowTemplates: HiringWorkflowTemplate[] = [
  {
    id: 'wf-1',
    name: 'Software Engineer Hiring Pipeline',
    description: 'Full engineering pipeline with AI interview, assessment, and multiple interview rounds.',
    isDefault: true,
    isArchived: false,
    jobCount: 5,
    createdAt: '2024-04-01',
    updatedAt: '2024-06-15',
    stages: [
      makeStage('s1', 'resume_screening', 'Resume Screening', 0),
      makeStage('s2', 'ai_interview', 'AI Interview', 1, true, 'it-1'),
      makeStage('s3', 'assessment', 'Technical Assessment', 2),
      makeStage('s4', 'technical_interview', 'Technical Interview', 3),
      makeStage('s5', 'hr_interview', 'HR Interview', 4),
      makeStage('s6', 'offer', 'Offer', 5),
      makeStage('s7', 'hired', 'Hired', 6),
      makeStage('s8', 'rejected', 'Rejected', 7, false),
    ],
  },
  {
    id: 'wf-2',
    name: 'Fast Track Engineering',
    description: 'Streamlined pipeline without AI interview — assessment and technical only.',
    isDefault: false,
    isArchived: false,
    jobCount: 2,
    createdAt: '2024-05-10',
    updatedAt: '2024-05-20',
    stages: [
      makeStage('s1', 'resume_screening', 'Resume Screening', 0),
      makeStage('s2', 'assessment', 'Technical Assessment', 1),
      makeStage('s3', 'technical_interview', 'Technical Interview', 2),
      makeStage('s4', 'offer', 'Offer', 3),
      makeStage('s5', 'hired', 'Hired', 4),
      makeStage('s6', 'rejected', 'Rejected', 5, false),
    ],
  },
  {
    id: 'wf-3',
    name: 'Design & Product Pipeline',
    description: 'AI interview followed by HR round for design and product roles.',
    isDefault: false,
    isArchived: false,
    jobCount: 1,
    createdAt: '2024-06-01',
    updatedAt: '2024-06-05',
    stages: [
      makeStage('s1', 'resume_screening', 'Resume Screening', 0),
      makeStage('s2', 'ai_interview', 'AI Interview', 1, true, 'it-1'),
      makeStage('s3', 'hr_interview', 'HR Interview', 2),
      makeStage('s4', 'offer', 'Offer', 3),
      makeStage('s5', 'hired', 'Hired', 4),
      makeStage('s6', 'rejected', 'Rejected', 5, false),
    ],
  },
  {
    id: 'wf-4',
    name: 'Legacy Full Pipeline',
    description: 'Archived workflow from previous hiring season.',
    isDefault: false,
    isArchived: true,
    jobCount: 0,
    createdAt: '2023-12-01',
    updatedAt: '2024-03-01',
    stages: [
      makeStage('s1', 'resume_screening', 'Resume Screening', 0),
      makeStage('s2', 'assessment', 'Assessment', 1),
      makeStage('s3', 'hr_interview', 'HR Interview', 2),
      makeStage('s4', 'offer', 'Offer', 3),
    ],
  },
];

export const initialQuestionLibrary: QuestionLibraryItem[] = [
  { id: 'ql-1', text: 'Explain RESTful API design principles and best practices.', category: 'technical', difficulty: 'medium', tags: ['API', 'Backend'], usageCount: 24, createdAt: '2024-03-01' },
  { id: 'ql-2', text: 'Tell me about a time you had to meet a tight deadline.', category: 'behavioral', difficulty: 'easy', tags: ['Deadline', 'Pressure'], usageCount: 45, createdAt: '2024-03-01' },
  { id: 'ql-3', text: 'How would you design a URL shortening service like bit.ly?', category: 'problem_solving', difficulty: 'hard', tags: ['System Design'], usageCount: 18, createdAt: '2024-03-15' },
  { id: 'ql-4', text: 'Describe your approach to giving constructive feedback to team members.', category: 'leadership', difficulty: 'medium', tags: ['Feedback', 'Team'], usageCount: 12, createdAt: '2024-04-01' },
  { id: 'ql-5', text: 'What is the difference between SQL and NoSQL databases?', category: 'technical', difficulty: 'easy', tags: ['Database'], usageCount: 32, createdAt: '2024-04-01' },
  { id: 'ql-6', text: 'How do you ensure clear communication in remote teams?', category: 'communication', difficulty: 'medium', tags: ['Remote', 'Communication'], usageCount: 20, createdAt: '2024-04-10' },
  { id: 'ql-7', text: 'Explain event-driven architecture and when to use it.', category: 'technical', difficulty: 'hard', tags: ['Architecture', 'Events'], usageCount: 9, createdAt: '2024-05-01' },
  { id: 'ql-8', text: 'What company values resonate most with you and why?', category: 'culture_fit', difficulty: 'easy', tags: ['Values', 'Culture'], usageCount: 38, createdAt: '2024-05-01' },
  { id: 'ql-9', text: 'Walk through how you would debug a production outage.', category: 'problem_solving', difficulty: 'hard', tags: ['Debugging', 'Production'], usageCount: 15, createdAt: '2024-05-15' },
  { id: 'ql-10', text: 'How do you stay updated with industry trends?', category: 'behavioral', difficulty: 'easy', tags: ['Learning', 'Growth'], usageCount: 28, createdAt: '2024-06-01' },
];

/** Mock AI-generated questions for the generator UI */
export const MOCK_AI_GENERATED_QUESTIONS = [
  { text: 'Explain how React hooks changed functional component capabilities.', category: 'technical' as const, difficulty: 'medium' as const },
  { text: 'Describe your experience building responsive web applications.', category: 'behavioral' as const, difficulty: 'easy' as const },
  { text: 'How would you implement lazy loading for a large list?', category: 'technical' as const, difficulty: 'medium' as const },
  { text: 'What strategies do you use for cross-browser compatibility?', category: 'technical' as const, difficulty: 'medium' as const },
  { text: 'Tell me about a project where you improved application performance.', category: 'behavioral' as const, difficulty: 'medium' as const },
];

export function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getStageDefinition(type: WorkflowStage['type']) {
  if (type === 'custom') return null;
  return DEFAULT_STAGE_DEFINITIONS.find(d => d.type === type);
}

export function getStageLabel(stage: WorkflowStage) {
  if (stage.type === 'custom') return stage.customLabel ?? stage.label;
  return getStageDefinition(stage.type)?.label ?? stage.label;
}
