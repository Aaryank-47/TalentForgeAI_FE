/**
 * TalentForge AI — Interview Prompt Templates
 *
 * ALL prompt strings live here. No prompt is ever written inside a React component.
 * When migrating to Express backend, these prompts move server-side without any
 * component changes.
 */

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface InterviewContext {
  /** e.g. "Senior Frontend Developer" */
  role: string;
  /** e.g. "Google" */
  company: string;
  /** e.g. "4+ years" */
  experience: string;
  /** e.g. "Conversational AI" */
  interviewType: string;
  /** "beginner" | "intermediate" | "advanced" */
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  /** e.g. ["React", "TypeScript", "Next.js"] */
  skills: string[];
  /** 1-based current question number */
  questionNumber: number;
  /** Total questions planned */
  totalQuestions: number;
  /** List of previous questions already asked */
  previousQuestions: string[];
  /** Topics already covered — derived from previousQuestions */
  topicsCovered: string[];
  /** Running transcript of candidate answers */
  transcript: TranscriptEntry[];
}

export interface TranscriptEntry {
  questionNumber: number;
  question: string;
  answer: string;
}

// ─────────────────────────────────────────────────────────────
// System Prompt
// ─────────────────────────────────────────────────────────────

export function buildSystemPrompt(ctx: InterviewContext): string {
  return `You are a professional AI interviewer conducting a ${ctx.interviewType} interview for the role of ${ctx.role} at ${ctx.company}.

CANDIDATE PROFILE:
- Role applying for: ${ctx.role}
- Relevant experience level: ${ctx.experience}
- Skills: ${ctx.skills.join(', ')}
- Interview type: ${ctx.interviewType}
- Difficulty level: ${ctx.difficulty}

INTERVIEW RULES (STRICTLY FOLLOW):
1. Ask ONLY ONE question per response. Never ask multiple questions in a single response.
2. Never reveal or hint at the expected answer.
3. Increase difficulty gradually as the interview progresses (question ${ctx.questionNumber} of ${ctx.totalQuestions}).
4. Avoid repeating topics already covered: ${ctx.topicsCovered.length > 0 ? ctx.topicsCovered.join(', ') : 'none yet'}.
5. Be professional, encouraging, and concise — like a real senior interviewer.
6. Your response must contain ONLY the interview question — no preamble, no "Sure!", no "Great answer!", no explanation.
7. The question must be complete and self-contained.
8. Do NOT start the question with "Question:" or any numbering.
9. Keep the question under 60 words.
10. Use the STAR method or situational framing for behavioral questions.

QUESTION PROGRESSION GUIDE:
- Question 1: Introduction / background
- Questions 2–3: Experience and past projects  
- Questions 4–5: Technical depth relevant to ${ctx.skills.slice(0, 3).join(', ')}
- Questions 6–7: Behavioral / situational / collaboration
- Question ${ctx.totalQuestions}: Closing — candidate questions or reflections`.trim();
}

// ─────────────────────────────────────────────────────────────
// User Prompt (per-turn)
// ─────────────────────────────────────────────────────────────

export function buildUserPrompt(ctx: InterviewContext): string {
  const previousBlock =
    ctx.transcript.length > 0
      ? `PREVIOUS Q&A TRANSCRIPT:\n${ctx.transcript
          .map(
            (t) =>
              `Q${t.questionNumber}: ${t.question}\nCandidate: ${t.answer || '[no answer provided]'}`
          )
          .join('\n\n')}\n\n`
      : '';

  const alreadyAsked =
    ctx.previousQuestions.length > 0
      ? `QUESTIONS ALREADY ASKED (do not repeat similar topics):\n${ctx.previousQuestions
          .map((q, i) => `${i + 1}. ${q}`)
          .join('\n')}\n\n`
      : '';

  return `${previousBlock}${alreadyAsked}Now generate question number ${ctx.questionNumber} of ${ctx.totalQuestions} for this interview. Return ONLY the question text.`;
}

// ─────────────────────────────────────────────────────────────
// Fallback questions — used when OpenRouter is unavailable
// ─────────────────────────────────────────────────────────────

export const FALLBACK_QUESTIONS: Record<number, string> = {
  1: 'Tell me about yourself — your background, experience, and what brought you to apply for this role.',
  2: 'Can you walk me through your most significant project? What was your role and what impact did it have?',
  3: 'How do you approach optimizing the performance of a React application?',
  4: 'Describe a situation where you disagreed with a technical decision made by your team. How did you handle it?',
  5: 'How do you stay up-to-date with the latest trends and best practices in frontend development?',
  6: 'Tell me about a time you worked under a tight deadline in a cross-functional team. What was your strategy?',
  7: 'What do you consider your greatest professional strength, and how has it contributed to your success?',
  8: 'Do you have any questions for us about the role, the team, or the culture here?',
};

export function getFallbackQuestion(questionNumber: number): string {
  return (
    FALLBACK_QUESTIONS[questionNumber] ||
    `Tell me more about your experience with ${['React', 'TypeScript', 'system design', 'teamwork'][questionNumber % 4]}.`
  );
}
