// ─────────────────────────────────────────────────────────────
// TalentForge AI — Interview Feedback Mock Data
// ─────────────────────────────────────────────────────────────
import type {
  CandidateFeedback,
  RecruiterEvaluation,
  FeedbackRating,
} from '../types/interview.types';

export const mockCandidateFeedbacks: CandidateFeedback[] = [
  {
    id: 'cfb_001',
    interviewId: 'liv_005',
    candidateId: 'cand_005',
    recruiterRating: 5 as FeedbackRating,
    companyRating: 4 as FeedbackRating,
    experienceRating: 5 as FeedbackRating,
    platformRating: 5 as FeedbackRating,
    overallRating: 5 as FeedbackRating,
    comments:
      'Excellent interview experience. The interviewers were very professional and made me feel comfortable throughout. Questions were relevant and well-structured.',
    wouldRecommend: true,
    submittedAt: '2026-06-20T13:30:00Z',
  },
  {
    id: 'cfb_002',
    interviewId: 'liv_006',
    candidateId: 'cand_006',
    recruiterRating: 4 as FeedbackRating,
    companyRating: 4 as FeedbackRating,
    experienceRating: 3 as FeedbackRating,
    platformRating: 4 as FeedbackRating,
    overallRating: 4 as FeedbackRating,
    comments:
      'Good overall experience. Interview was cut short due to time constraints. Would have appreciated more time for behavioural questions.',
    wouldRecommend: true,
    submittedAt: '2026-06-18T17:00:00Z',
  },
];

export const mockRecruiterEvaluations: RecruiterEvaluation[] = [
  {
    id: 'rev_001',
    interviewId: 'liv_005',
    recruiterId: 'rec_002',
    candidateId: 'cand_005',
    communication: 4 as FeedbackRating,
    technical: 5 as FeedbackRating,
    problemSolving: 4 as FeedbackRating,
    behaviour: 5 as FeedbackRating,
    cultureFit: 4 as FeedbackRating,
    overallScore: 86,
    recommendation: 'Hire',
    comments:
      'Vikram demonstrated exceptional React knowledge and strong understanding of browser performance. He explained his thought process clearly and handled follow-up questions well. Minor gaps in testing knowledge.',
    strengths: [
      'Deep React & hooks expertise',
      'Strong browser rendering knowledge',
      'Excellent communication',
      'Good problem decomposition',
    ],
    improvements: [
      'Testing practices could be stronger',
      'Limited experience with state management at scale',
    ],
    submittedAt: '2026-06-20T13:00:00Z',
  },
  {
    id: 'rev_002',
    interviewId: 'liv_006',
    recruiterId: 'rec_001',
    candidateId: 'cand_006',
    communication: 5 as FeedbackRating,
    technical: 3 as FeedbackRating,
    problemSolving: 4 as FeedbackRating,
    behaviour: 5 as FeedbackRating,
    cultureFit: 5 as FeedbackRating,
    overallScore: 78,
    recommendation: 'Consider',
    comments:
      'Sneha is an excellent communicator and clearly has strong leadership instincts. Her HR domain knowledge is solid but lacks some technical HR software exposure.',
    strengths: [
      'Outstanding communication skills',
      'Strong leadership examples',
      'Great cultural alignment',
      'Empathetic management style',
    ],
    improvements: [
      'Should strengthen HRIS tool knowledge',
      'More data-driven approach to HR metrics',
    ],
    submittedAt: '2026-06-18T16:45:00Z',
  },
];

// ─── Rating Labels ────────────────────────────────────────────
export const ratingLabels: Record<FeedbackRating, string> = {
  1: 'Poor',
  2: 'Below Average',
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
};

export const ratingEmojis: Record<FeedbackRating, string> = {
  1: '😞',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😄',
};

// ─── Evaluation dimension labels ─────────────────────────────
export const evaluationDimensions = [
  { key: 'communication', label: 'Communication', icon: '💬', color: 'bg-blue-500' },
  { key: 'technical', label: 'Technical Skills', icon: '⚙️', color: 'bg-violet-500' },
  { key: 'problemSolving', label: 'Problem Solving', icon: '🧠', color: 'bg-amber-500' },
  { key: 'behaviour', label: 'Behaviour', icon: '🤝', color: 'bg-emerald-500' },
  { key: 'cultureFit', label: 'Culture Fit', icon: '🌟', color: 'bg-pink-500' },
] as const;
