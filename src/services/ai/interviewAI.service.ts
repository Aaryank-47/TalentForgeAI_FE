/**
 * TalentForge AI — Interview AI Service
 *
 * All AI-related operations are abstracted here.
 * React components NEVER call OpenRouter directly.
 * When migrating to Express backend:
 *   - Replace openRouterClient calls with fetch('/api/interview/...')
 *   - Components remain completely untouched.
 */
import { openRouterClient, INTERVIEW_MODEL } from './models';
import {
  buildSystemPrompt,
  buildUserPrompt,
  getFallbackQuestion,
  type InterviewContext,
} from './prompts';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type { InterviewContext, TranscriptEntry } from './prompts';

export type AIRequestError =
  | { type: 'network'; message: string }
  | { type: 'timeout'; message: string }
  | { type: 'api'; message: string; status?: number }
  | { type: 'empty'; message: string };

export interface GenerateQuestionResult {
  question: string;
  /** true if the question came from the fallback list (no API call succeeded) */
  isFallback: boolean;
  error?: AIRequestError;
}

// ─────────────────────────────────────────────────────────────
// Core: generateNextQuestion
// ─────────────────────────────────────────────────────────────

const TIMEOUT_MS = 15_000;

/**
 * Generate the next interview question using AI.
 *
 * @param ctx - Full interview context (role, experience, transcript, etc.)
 * @returns The generated question string + metadata
 *
 * FUTURE BACKEND MIGRATION:
 * Replace this implementation with:
 *   const res = await fetch('/api/interview/generate-question', {
 *     method: 'POST',
 *     body: JSON.stringify(ctx),
 *   });
 *   const data = await res.json();
 *   return { question: data.question, isFallback: false };
 */
export async function generateNextQuestion(
  ctx: InterviewContext
): Promise<GenerateQuestionResult> {
  // Check if API key is configured
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string;
  if (!apiKey) {
    console.warn('[InterviewAI] No API key — using fallback question');
    return {
      question: getFallbackQuestion(ctx.questionNumber),
      isFallback: true,
      error: { type: 'api', message: 'No API key configured in .env.local' },
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await openRouterClient.chat.completions.create(
      {
        model: INTERVIEW_MODEL,
        messages: [
          { role: 'system', content: buildSystemPrompt(ctx) },
          { role: 'user', content: buildUserPrompt(ctx) },
        ],
        max_tokens: 150,
        temperature: 0.7,
        top_p: 0.9,
      },
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    const raw = response.choices?.[0]?.message?.content?.trim();

    if (!raw) {
      return {
        question: getFallbackQuestion(ctx.questionNumber),
        isFallback: true,
        error: { type: 'empty', message: 'AI returned empty response' },
      };
    }

    // Sanitize: strip leading "Question:", numbers, quotes
    const cleaned = raw
      .replace(/^(Question\s*\d*:?\s*|Q\d+:?\s*|"\s*|'\s*)/i, '')
      .replace(/(\s*"|\s*')$/, '')
      .trim();

    return { question: cleaned, isFallback: false };
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        return {
          question: getFallbackQuestion(ctx.questionNumber),
          isFallback: true,
          error: { type: 'timeout', message: `Request timed out after ${TIMEOUT_MS / 1000}s` },
        };
      }
      if (err.message.includes('fetch') || err.message.includes('network')) {
        return {
          question: getFallbackQuestion(ctx.questionNumber),
          isFallback: true,
          error: { type: 'network', message: err.message },
        };
      }
    }

    return {
      question: getFallbackQuestion(ctx.questionNumber),
      isFallback: true,
      error: { type: 'api', message: err instanceof Error ? err.message : 'Unknown error' },
    };
  }
}
