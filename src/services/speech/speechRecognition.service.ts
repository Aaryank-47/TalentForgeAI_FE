/**
 * TalentForge AI — Speech Recognition Service
 *
 * Wraps browser SpeechRecognition / webkitSpeechRecognition.
 * Provides start/stop with callbacks for partial results, final results, and errors.
 */

// ─────────────────────────────────────────────────────────────
// Web Speech API types (not always present in TypeScript's DOM lib)
// ─────────────────────────────────────────────────────────────

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface SpeechRecognitionCallbacks {
  /** Called repeatedly with partial (interim) transcript as user speaks */
  onPartial: (transcript: string) => void;
  /** Called once with the final transcript when speech ends */
  onFinal: (transcript: string) => void;
  /** Called when recognition ends (user stopped, silence, or error) */
  onEnd: () => void;
  /** Called on recoverable errors */
  onError: (error: SpeechRecognitionErrorType) => void;
}

export type SpeechRecognitionErrorType =
  | 'not-supported'
  | 'permission-denied'
  | 'no-speech'
  | 'audio-capture'
  | 'network'
  | 'aborted'
  | 'unknown';

// ─────────────────────────────────────────────────────────────
// Browser API detection
// ─────────────────────────────────────────────────────────────

// Use unknown cast since SpeechRecognition may not be in all TS DOM lib configs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConstructor = new () => SpeechRecognition;

function getSpeechRecognitionCtor(): AnyConstructor | null {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getSpeechRecognitionCtor() !== null;
}

// ─────────────────────────────────────────────────────────────
// Recognition instance management
// ─────────────────────────────────────────────────────────────

let _recognition: SpeechRecognition | null = null;
let _isRunning = false;
let _accumulatedFinal = '';

/**
 * Start speech recognition.
 * Automatically stops any existing session before starting a new one.
 *
 * @param callbacks - Callbacks for partial/final results and errors
 * @param lang      - BCP 47 language tag (default: 'en-US')
 */
export function startRecognition(
  callbacks: SpeechRecognitionCallbacks,
  lang = 'en-US'
): void {
  const Ctor = getSpeechRecognitionCtor();
  if (!Ctor) {
    callbacks.onError('not-supported');
    return;
  }

  // Stop any existing session
  stopRecognition();

  _accumulatedFinal = '';
  const recognition = new Ctor();
  _recognition = recognition;
  _isRunning = true;

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.lang = lang;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const text = result[0].transcript;
      if (result.isFinal) {
        finalTranscript += text;
      } else {
        interimTranscript += text;
      }
    }

    if (finalTranscript) {
      _accumulatedFinal += (finalTranscript.endsWith(' ') ? '' : ' ') + finalTranscript;
      _accumulatedFinal = _accumulatedFinal.trim();
    }

    // Partial: accumulated final + current interim
    const partial = (_accumulatedFinal + (interimTranscript ? ' ' + interimTranscript : '')).trim();
    callbacks.onPartial(partial);
  };

  recognition.onend = () => {
    _isRunning = false;
    callbacks.onFinal(_accumulatedFinal.trim());
    callbacks.onEnd();
    _recognition = null;
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    const errMap: Record<string, SpeechRecognitionErrorType> = {
      'not-allowed': 'permission-denied',
      'permission-denied': 'permission-denied',
      'no-speech': 'no-speech',
      'audio-capture': 'audio-capture',
      'network': 'network',
      'aborted': 'aborted',
    };
    const mapped: SpeechRecognitionErrorType = errMap[event.error] || 'unknown';
    if (mapped !== 'aborted' && mapped !== 'no-speech') {
      callbacks.onError(mapped);
    }
  };

  try {
    recognition.start();
  } catch (e) {
    console.warn('[SpeechRecognition] Failed to start:', e);
    callbacks.onError('unknown');
    _isRunning = false;
    _recognition = null;
  }
}

/**
 * Gracefully stop speech recognition.
 * The `onend` callback will still fire with the accumulated transcript.
 */
export function stopRecognition(): void {
  if (_recognition && _isRunning) {
    _isRunning = false;
    try {
      _recognition.stop();
    } catch {
      // Ignore errors on stop
    }
  }
}

/**
 * Abort recognition without triggering onend with accumulated results.
 */
export function abortRecognition(): void {
  if (_recognition) {
    _isRunning = false;
    try {
      _recognition.abort();
    } catch {
      // Ignore
    }
    _recognition = null;
    _accumulatedFinal = '';
  }
}

export function isRecognitionRunning(): boolean {
  return _isRunning;
}

// ─────────────────────────────────────────────────────────────
// User-friendly error messages
// ─────────────────────────────────────────────────────────────

export function getSpeechRecognitionErrorMessage(error: SpeechRecognitionErrorType): string {
  const messages: Record<SpeechRecognitionErrorType, string> = {
    'not-supported': 'Speech recognition is not supported in this browser. Try Chrome or Edge.',
    'permission-denied': 'Microphone access was denied. Please allow microphone access and try again.',
    'no-speech': 'No speech was detected. Please speak louder or check your microphone.',
    'audio-capture': 'Cannot access microphone. Check if another app is using it.',
    'network': 'Network error during speech recognition. Check your connection.',
    'aborted': 'Speech recognition was stopped.',
    'unknown': 'An unknown speech recognition error occurred.',
  };
  return messages[error];
}
