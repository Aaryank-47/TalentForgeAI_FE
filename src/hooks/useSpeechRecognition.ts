/**
 * TalentForge AI — useSpeechRecognition Hook
 *
 * React abstraction over the Speech Recognition service.
 * Provides live transcript, word count, silence detection, and mic level visualization.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  startRecognition,
  stopRecognition,
  abortRecognition,
  isSpeechRecognitionSupported,
  getSpeechRecognitionErrorMessage,
  type SpeechRecognitionErrorType,
} from '../services/speech/speechRecognition.service';

export interface UseSpeechRecognitionOptions {
  /** Milliseconds of silence before auto-stopping. Default: 3000 */
  silenceTimeoutMs?: number;
  /** BCP 47 language. Default: 'en-US' */
  lang?: string;
  /** Called when silence auto-stop fires */
  onSilenceStop?: () => void;
}

export interface UseSpeechRecognitionReturn {
  /** Whether browser supports speech recognition */
  isSupported: boolean;
  /** Whether currently listening */
  isListening: boolean;
  /** Live transcript (partial + confirmed) */
  transcript: string;
  /** The finalized transcript after recognition ends */
  finalTranscript: string;
  /** Whether the transcript has been finalized */
  isFinalized: boolean;
  /** Number of words spoken so far */
  wordCount: number;
  /** Seconds elapsed since listening started */
  speakingSeconds: number;
  /** Microphone audio level 0–100 (requires getUserMedia stream) */
  micLevel: number;
  /** Start listening */
  start: () => void;
  /** Gracefully stop (fires onFinal callback) */
  stop: () => void;
  /** Hard reset without firing onFinal */
  abort: () => void;
  /** Clear transcript and reset state */
  reset: () => void;
  /** Human-readable error message, if any */
  errorMessage: string | null;
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const { silenceTimeoutMs = 3000, lang = 'en-US', onSilenceStop } = options;

  const isSupported = isSpeechRecognitionSupported();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [isFinalized, setIsFinalized] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [speakingSeconds, setSpeakingSeconds] = useState(0);
  const [micLevel, setMicLevel] = useState(0);

  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micAnimFrameRef = useRef<number | null>(null);
  const lastTranscriptRef = useRef('');

  // Word count derived from live transcript
  const wordCount = transcript.trim()
    ? transcript.trim().split(/\s+/).filter(Boolean).length
    : 0;

  // Reset silence timer on every new transcript
  const resetSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      stopRecognition();
      onSilenceStop?.();
    }, silenceTimeoutMs);
  }, [silenceTimeoutMs, onSilenceStop]);

  // Mic level visualization via Web Audio API
  const startMicLevel = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      const src = ctx.createMediaStreamSource(stream);
      src.connect(analyser);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setMicLevel(Math.min(100, Math.round((avg / 128) * 100)));
        micAnimFrameRef.current = requestAnimationFrame(tick);
      };
      micAnimFrameRef.current = requestAnimationFrame(tick);
    } catch {
      // Mic level is non-critical — silently ignore
    }
  }, []);

  const stopMicLevel = useCallback(() => {
    if (micAnimFrameRef.current) cancelAnimationFrame(micAnimFrameRef.current);
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setMicLevel(0);
  }, []);

  const start = useCallback(() => {
    if (!isSupported) {
      setErrorMessage(getSpeechRecognitionErrorMessage('not-supported'));
      return;
    }

    setIsListening(true);
    setIsFinalized(false);
    setErrorMessage(null);
    setTranscript('');
    setFinalTranscript('');
    lastTranscriptRef.current = '';
    setSpeakingSeconds(0);

    // Speaking timer
    if (tickerRef.current) clearInterval(tickerRef.current);
    tickerRef.current = setInterval(() => {
      setSpeakingSeconds((s) => s + 1);
    }, 1000);

    // Start mic level
    startMicLevel();

    // Reset silence timer
    resetSilenceTimer();

    startRecognition(
      {
        onPartial: (t) => {
          lastTranscriptRef.current = t;
          setTranscript(t);
          resetSilenceTimer();
        },
        onFinal: (t) => {
          setFinalTranscript(t);
          setTranscript(t);
          setIsFinalized(true);
        },
        onEnd: () => {
          setIsListening(false);
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          if (tickerRef.current) clearInterval(tickerRef.current);
          stopMicLevel();
        },
        onError: (err: SpeechRecognitionErrorType) => {
          setErrorMessage(getSpeechRecognitionErrorMessage(err));
          setIsListening(false);
          if (tickerRef.current) clearInterval(tickerRef.current);
          stopMicLevel();
        },
      },
      lang
    );
  }, [isSupported, lang, resetSilenceTimer, startMicLevel, stopMicLevel]);

  const stop = useCallback(() => {
    stopRecognition();
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
  }, []);

  const abort = useCallback(() => {
    abortRecognition();
    setIsListening(false);
    setTranscript('');
    setFinalTranscript('');
    setIsFinalized(false);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (tickerRef.current) clearInterval(tickerRef.current);
    stopMicLevel();
  }, [stopMicLevel]);

  const reset = useCallback(() => {
    abort();
    setSpeakingSeconds(0);
    setErrorMessage(null);
  }, [abort]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRecognition();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (tickerRef.current) clearInterval(tickerRef.current);
      stopMicLevel();
    };
  }, [stopMicLevel]);

  return {
    isSupported,
    isListening,
    transcript,
    finalTranscript,
    isFinalized,
    wordCount,
    speakingSeconds,
    micLevel,
    start,
    stop,
    abort,
    reset,
    errorMessage,
  };
}
