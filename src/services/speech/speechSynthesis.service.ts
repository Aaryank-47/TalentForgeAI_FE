/**
 * TalentForge AI — Speech Synthesis Service
 *
 * Wraps the browser's SpeechSynthesis API.
 * Provides promise-based speaking, voice management, and localStorage persistence.
 */

const VOICE_STORAGE_KEY = 'talentforge_tts_voice';

// ─────────────────────────────────────────────────────────────
// Availability
// ─────────────────────────────────────────────────────────────

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// ─────────────────────────────────────────────────────────────
// Voice Management
// ─────────────────────────────────────────────────────────────

/**
 * Returns available voices. On some browsers voices load asynchronously.
 * Call this after the `voiceschanged` event fires for a full list.
 */
export function getVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSynthesisSupported()) return [];
  return window.speechSynthesis.getVoices();
}

/**
 * Subscribe to voice list changes (fires once voices are loaded on Chrome/Edge).
 * Returns an unsubscribe function.
 */
export function onVoicesChanged(cb: (voices: SpeechSynthesisVoice[]) => void): () => void {
  if (!isSpeechSynthesisSupported()) return () => {};
  const handler = () => cb(window.speechSynthesis.getVoices());
  window.speechSynthesis.addEventListener('voiceschanged', handler);
  return () => window.speechSynthesis.removeEventListener('voiceschanged', handler);
}

// ─────────────────────────────────────────────────────────────
// Persistence
// ─────────────────────────────────────────────────────────────

export function saveSelectedVoice(voiceURI: string): void {
  try {
    localStorage.setItem(VOICE_STORAGE_KEY, voiceURI);
  } catch {
    // localStorage may be unavailable in some contexts
  }
}

export function getSavedVoice(): string | null {
  try {
    return localStorage.getItem(VOICE_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Find a voice by URI from the available voices list.
 * Falls back to the first English voice if the saved one is no longer available.
 */
export function resolveVoice(voiceURI: string | null): SpeechSynthesisVoice | null {
  const voices = getVoices();
  if (!voices.length) return null;
  if (voiceURI) {
    const match = voices.find((v) => v.voiceURI === voiceURI);
    if (match) return match;
  }
  // Fallback: prefer English voices
  return voices.find((v) => v.lang.startsWith('en')) || voices[0] || null;
}

// ─────────────────────────────────────────────────────────────
// Speaking
// ─────────────────────────────────────────────────────────────

let _resolveCurrentSpeech: (() => void) | null = null;

/**
 * Stop any currently running speech immediately.
 */
export function cancelSpeech(): void {
  if (!isSpeechSynthesisSupported()) return;
  window.speechSynthesis.cancel();
  _resolveCurrentSpeech?.();
  _resolveCurrentSpeech = null;
}

/**
 * Speak text using SpeechSynthesis.
 * Cancels any existing speech before starting.
 *
 * @param text     - The text to speak
 * @param voiceURI - Optional voice URI (uses saved or default if omitted)
 * @param rate     - Speech rate (0.5–2.0, default 0.95)
 * @param pitch    - Pitch (0–2, default 1.0)
 * @returns        A promise that resolves when speech ends (or on cancel)
 */
export function speak(
  text: string,
  voiceURI?: string | null,
  rate = 0.95,
  pitch = 1.0
): Promise<void> {
  return new Promise((resolve) => {
    if (!isSpeechSynthesisSupported()) {
      resolve();
      return;
    }

    // Cancel previous speech
    cancelSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1.0;

    // Resolve voice
    const uri = voiceURI ?? getSavedVoice();
    const voice = resolveVoice(uri);
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      _resolveCurrentSpeech = null;
      resolve();
    };

    utterance.onerror = (e) => {
      // 'interrupted' fires when we cancel — that's expected, not an error
      _resolveCurrentSpeech = null;
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('[SpeechSynthesis] Error:', e.error);
      }
      resolve();
    };

    _resolveCurrentSpeech = resolve;

    // Workaround for Chrome bug: speechSynthesis can stall if paused
    window.speechSynthesis.cancel();
    requestAnimationFrame(() => {
      window.speechSynthesis.speak(utterance);
    });
  });
}

/**
 * Check if the browser is currently speaking.
 */
export function isSpeaking(): boolean {
  if (!isSpeechSynthesisSupported()) return false;
  return window.speechSynthesis.speaking;
}
