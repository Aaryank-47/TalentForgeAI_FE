/**
 * TalentForge AI — OpenRouter Client Configuration
 *
 * Uses the `openai` SDK configured against OpenRouter's OpenAI-compatible endpoint.
 * This is the ONLY file that knows about OpenRouter.
 * When migrating to Express backend, only this file changes.
 */
import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string;
const model = import.meta.env.VITE_OPENROUTER_MODEL as string;

if (!apiKey) {
  console.warn(
    '[TalentForge AI] VITE_OPENROUTER_API_KEY is not set. ' +
      'AI question generation will fail. Add it to .env.local'
  );
}

/**
 * OpenAI-compatible client configured for OpenRouter.
 * Do NOT import this directly from React components.
 * Use interviewAI.service.ts instead.
 */
export const openRouterClient = new OpenAI({
  apiKey: apiKey || 'no-key-configured',
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://talentforge.ai',
    'X-Title': 'TalentForge AI Interview',
  },
  // Required for browser usage — key is intentionally exposed during dev only
  dangerouslyAllowBrowser: true,
});

console.log('api key : ',apiKey)
console.log('model : ',model)
console.log("openRouterClient",openRouterClient)

/**
 * The model to use for all AI interview requests.
 * Sourced from environment variables — never hardcoded.
 */
export const INTERVIEW_MODEL = model || 'meta-llama/llama-3.1-8b-instruct:free';
