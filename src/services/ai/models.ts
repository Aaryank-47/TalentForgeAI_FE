/**
 * TalentForge AI — OpenRouter Client Configuration
 *
 * ⚠️  SECURITY WARNING ⚠️
 * This file configures a direct browser-to-OpenRouter connection.
 * This is a TEMPORARY development configuration ONLY.
 *
 * DO NOT deploy this to production with a real API key.
 *
 * MIGRATION PATH:
 *   When the backend AI proxy endpoint is implemented:
 *   - Remove this file (or replace openRouterClient with a fetch('/api/ai/...'))
 *   - The interviewAI.service.ts abstraction layer means NO component changes are needed.
 *   - Remove VITE_OPENROUTER_API_KEY from .env.local
 *   - Remove the `openai` npm dependency
 *
 * See interviewAI.service.ts for usage.
 */
import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string;
const model = import.meta.env.VITE_OPENROUTER_MODEL as string;

// API key presence check (no value logged for security)
if (!apiKey) {
  console.warn(
    '[TalentForge AI] VITE_OPENROUTER_API_KEY is not set. ' +
      'AI question generation will use fallback questions. Add it to .env.local'
  );
}

/**
 * OpenAI-compatible client configured for OpenRouter.
 * Do NOT import this directly from React components.
 * Use interviewAI.service.ts instead.
 *
 * TEMPORARY: dangerouslyAllowBrowser is required until the backend AI proxy is implemented.
 * See MIGRATION PATH above.
 */
export const openRouterClient = new OpenAI({
  apiKey: apiKey || 'no-key-configured',
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://talentforge.ai',
    'X-Title': 'TalentForge AI Interview',
  },
  dangerouslyAllowBrowser: true, // TEMPORARY — remove when backend proxy is ready
});

/**
 * The model to use for all AI interview requests.
 * Sourced from environment variables — never hardcoded.
 */
export const INTERVIEW_MODEL = model || 'meta-llama/llama-3.1-8b-instruct:free';
