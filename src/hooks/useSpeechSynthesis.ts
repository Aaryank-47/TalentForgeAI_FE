/**
 * TalentForge AI — useSpeechSynthesis Hook
 *
 * React abstraction over the Speech Synthesis service.
 * Manages speaking state, voice list, selection, and persistence.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  speak as servicespeak,
  cancelSpeech,
  getVoices,
  onVoicesChanged,
  saveSelectedVoice,
  getSavedVoice,
  isSpeechSynthesisSupported,
} from '../services/speech/speechSynthesis.service';

export interface UseSpeechSynthesisReturn {
  /** Whether the browser supports TTS */
  isSupported: boolean;
  /** Whether TTS is currently speaking */
  isSpeaking: boolean;
  /** Available voices from the browser */
  voices: SpeechSynthesisVoice[];
  /** Currently selected voice URI (null = system default) */
  selectedVoiceURI: string | null;
  /** Change the selected voice (also persists to localStorage) */
  setSelectedVoice: (voiceURI: string) => void;
  /**
   * Speak the given text.
   * Returns a promise that resolves when speech finishes.
   * Automatically cancels any in-progress speech.
   */
  speak: (text: string) => Promise<void>;
  /** Immediately stop all speech */
  cancel: () => void;
  /** Replay the last spoken text */
  replay: () => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const isSupported = isSpeechSynthesisSupported();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() => getVoices());
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(getSavedVoice);
  const lastTextRef = useRef<string>('');

  // Load voices (Chrome loads them async after 'voiceschanged')
  useEffect(() => {
    const initial = getVoices();
    if (initial.length) setVoices(initial);

    const unsubscribe = onVoicesChanged((v) => {
      setVoices(v);
    });
    return unsubscribe;
  }, []);

  const speak = useCallback(
    async (text: string): Promise<void> => {
      if (!isSupported || !text.trim()) return;
      lastTextRef.current = text;
      setIsSpeaking(true);
      try {
        await servicespeak(text, selectedVoiceURI);
      } finally {
        setIsSpeaking(false);
      }
    },
    [isSupported, selectedVoiceURI]
  );

  const cancel = useCallback(() => {
    cancelSpeech();
    setIsSpeaking(false);
  }, []);

  const replay = useCallback(() => {
    if (lastTextRef.current) {
      speak(lastTextRef.current);
    }
  }, [speak]);

  const setSelectedVoice = useCallback((voiceURI: string) => {
    setSelectedVoiceURI(voiceURI);
    saveSelectedVoice(voiceURI);
  }, []);

  return {
    isSupported,
    isSpeaking,
    voices,
    selectedVoiceURI,
    setSelectedVoice,
    speak,
    cancel,
    replay,
  };
}
