export type QuestionCategory = 'technical' | 'behavioral' | 'communication' | 'leadership' | 'problem_solving' | 'culture_fit' | 'system_design';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionSource = 'manual' | 'library' | 'ai_generated';

export interface BaseQuestion {
  id: string;
  category: QuestionCategory | string;
  difficulty: Difficulty | string;
  tags: string[];
  folders?: string[];
}

export interface AIInterviewQuestion extends BaseQuestion {
  text: string;
  expectedTimeMinutes?: number;
  skills?: string[];
  source?: QuestionSource;
  isFavorite?: boolean;
}

export interface MCQQuestion extends BaseQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
  negativeMarks?: number;
  timeLimit?: number;
  explanation?: string;
}

export interface DSAQuestion extends BaseQuestion {
  title: string;
  problemStatement: string;
  constraints: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  hiddenTestCases: Array<{ input: string; output: string }>;
  visibleTestCases: Array<{ input: string; output: string }>;
  memoryLimit?: string;
  timeLimit?: string;
  expectedComplexity?: string;
  starterCode?: Record<string, string>;
  supportedLanguages?: string[];
}
