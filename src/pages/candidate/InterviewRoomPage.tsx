/**
 * TalentForge AI — Interview Room Page
 *
 * Phase 2 & 3: Full AI conversation flow with:
 * - OpenRouter question generation via interviewAI.service.ts
 * - Browser TTS (SpeechSynthesis) via useSpeechSynthesis hook
 * - Browser STT (SpeechRecognition) via useSpeechRecognition hook
 * - Live conversation chat panel in center
 * - Mic level, voice selector, word counter in right panel
 * - Enterprise error handling via react-hot-toast
 *
 * LAYOUT PRESERVED: Left panel, top bar, right panel structure unchanged.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Flag, Lightbulb, Monitor, Clock, Mic, MicOff, RotateCcw, Volume2, VolumeX, Send, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

// ── Services & Sockets ─────────────────────────────────────────
import {
  aiInterviewSocketService,
  type AIQuestionPayload,
  type AIInterviewErrorPayload
} from '../../services/websocket/interviewSocket.service';

// ── Hooks ─────────────────────────────────────────────────────
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

// ── Existing Components ───────────────────────────────────────
import {
  QuestionCard,
  RecordingIndicator,
} from '../../components/interview/InterviewComponents';

// ── Conversation Components ───────────────────────────────────
import {
  ConversationPanel,
  AIInterviewerCard,
  VoiceSelector,
  MicLevelBar,
  AIStatePanel,
  type ConversationMessageData,
  type FullAIState,
} from '../../components/interview/InterviewComponents';

// ── Media / Screen ────────────────────────────────────────────
import { CameraPreview, ScreenPreview, TabSwitchIndicator } from '../../modules/shared/system-check/SystemCheck';
import { useMedia } from '../../context/MediaProvider';

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
const INTERVIEW_TIPS = [
  'Speak clearly and at a natural pace.',
  'Use the STAR method for behavioral and scenario questions.',
  'Look at the camera when answering.',
  "It's okay to pause briefly before responding.",
  'Be specific — mention concrete architecture, tools, and tradeoffs.',
];

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function nowTimestamp(): string {
  return format(new Date(), 'h:mm a');
}

function makeId(): string {
  return Math.random().toString(36).slice(2);
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
export default function InterviewRoomPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ── Media context ─────────────────────────────────────────────
  const { cameraStream, screenStream, deviceState, faceState, tabSwitches } = useMedia();

  // ── Speech hooks ──────────────────────────────────────────────
  const tts = useSpeechSynthesis();
  const stt = useSpeechRecognition({
    silenceTimeoutMs: 5000,
    onSilenceStop: () => {
      // Auto-stop when silence is detected
    },
  });

  // ── Interview state ───────────────────────────────────────────
  const [aiState, setAiState] = useState<FullAIState>('loading');
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);

  // ── Text response input for candidate ─────────────────────────
  const [manualTextAnswer, setManualTextAnswer] = useState('');

  // ── Conversation messages ──────────────────────────────────────
  const [messages, setMessages] = useState<ConversationMessageData[]>([]);
  const [liveMessage, setLiveMessage] = useState<ConversationMessageData | null>(null);
  const conversationBottomRef = useRef<HTMLDivElement | null>(null);

  // ── Current displayed question (for left panel) ───────────────
  const [displayedQuestion, setDisplayedQuestion] = useState('');
  const [currentCategory, setCurrentCategory] = useState('Technical Question');

  const currentQuestionRef = useRef<string>('');
  const flowLockRef = useRef(false);

  // ─────────────────────────────────────────────────────────────
  // Scroll to bottom whenever messages change
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    conversationBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, liveMessage]);

  // ─────────────────────────────────────────────────────────────
  // Rotate tips
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setTipIdx((prev) => (prev + 1) % INTERVIEW_TIPS.length), 7000);
    return () => clearInterval(t);
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Connect AI Interview Socket on Mount
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) {
      toast.error('Session ID is missing');
      navigate('/candidate/interviews');
      return;
    }

    setAiState('loading');
    aiInterviewSocketService.connect(id);

    const unsubQuestion = aiInterviewSocketService.onQuestion(async (q: AIQuestionPayload) => {
      console.log('[InterviewRoom] Received ai-question:', q);
      flowLockRef.current = false;
      setCurrentQuestionId(q.questionId);
      setCurrentQIdx(q.sequence - 1);
      setDisplayedQuestion(q.question);
      setCurrentCategory(q.topic || q.skill || 'AI Technical Question');
      currentQuestionRef.current = q.question;
      setManualTextAnswer('');

      // Add AI Question to messages
      const newAiMsg: ConversationMessageData = {
        id: q.questionId || makeId(),
        role: 'ai',
        text: q.question,
        timestamp: nowTimestamp(),
        status: 'pinned',
        questionNumber: q.sequence,
        isFallback: false,
      };
      setMessages((prev) => [...prev, newAiMsg]);

      // Speak question via TTS
      setAiState('speaking');
      if (tts.isSupported) {
        try {
          await tts.speak(q.question);
        } catch {
          // Ignore TTS interruption
        }
      }
      setAiState('waiting');
    });

    const unsubAnswerReceived = aiInterviewSocketService.onAnswerReceived((data) => {
      console.log('[InterviewRoom] Answer confirmed by backend:', data);
    });

    const unsubCompleted = aiInterviewSocketService.onCompleted((data) => {
      console.log('[InterviewRoom] Interview completed:', data);
      tts.cancel();
      stt.abort();
      setAiState('loading');
      toast.success(data.message || 'Interview completed successfully!');
      setTimeout(() => {
        navigate(`/candidate/ai-interview/${id}/submitted`);
      }, 1200);
    });

    const unsubTimeout = aiInterviewSocketService.onTimeout((data) => {
      console.log('[InterviewRoom] Interview timed out:', data);
      tts.cancel();
      stt.abort();
      toast.error('Interview time limit reached.');
      navigate(`/candidate/ai-interview/${id}/submitted`);
    });

    const unsubError = aiInterviewSocketService.onError((err: AIInterviewErrorPayload) => {
      console.error('[InterviewRoom] Socket error:', err);
      toast.error(err.message || 'Error communicating with AI interviewer.');
      flowLockRef.current = false;
      setAiState('waiting');
    });

    return () => {
      unsubQuestion();
      unsubAnswerReceived();
      unsubCompleted();
      unsubTimeout();
      unsubError();
      aiInterviewSocketService.disconnect();
    };
  }, [id, navigate]);

  // ─────────────────────────────────────────────────────────────
  // STT: live transcript → update live candidate bubble
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!stt.isListening) return;

    if (stt.transcript) {
      setLiveMessage({
        id: 'candidate-live',
        role: 'candidate',
        text: stt.transcript,
        timestamp: nowTimestamp(),
        status: 'partial',
      });
      setManualTextAnswer(stt.transcript);
    }
  }, [stt.transcript, stt.isListening]);

  // ─────────────────────────────────────────────────────────────
  // Submit Answer to Backend Socket
  // ─────────────────────────────────────────────────────────────
  const handleSubmitAnswer = useCallback(
    (answerTextToSubmit?: string) => {
      const finalAnswer = (answerTextToSubmit ?? manualTextAnswer ?? stt.transcript ?? '').trim();
      if (!finalAnswer) {
        toast.error('Please speak or type your answer before submitting.');
        return;
      }

      if (!id || !currentQuestionId) {
        toast.error('Session or Question ID is missing.');
        return;
      }

      if (flowLockRef.current) return;
      flowLockRef.current = true;

      // Stop speech recognition
      stt.stop();
      tts.cancel();

      // Add finalized candidate message to conversation
      const candidateMsg: ConversationMessageData = {
        id: makeId(),
        role: 'candidate',
        text: finalAnswer,
        timestamp: nowTimestamp(),
        status: 'final',
      };
      setMessages((prev) => [...prev, candidateMsg]);
      setLiveMessage(null);
      setManualTextAnswer('');
      setAnsweredCount((prev) => prev + 1);

      // Set UI to processing/evaluating
      setAiState('processing');

      // Submit to backend via Socket.IO
      aiInterviewSocketService.submitAnswer({
        sessionId: id,
        questionId: currentQuestionId,
        answerText: finalAnswer,
        recordingUrl: null,
      });
    },
    [id, currentQuestionId, manualTextAnswer, stt, tts]
  );

  // ─────────────────────────────────────────────────────────────
  // STT finalized callback
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (stt.isFinalized && stt.finalTranscript) {
      setManualTextAnswer(stt.finalTranscript);
    }
  }, [stt.isFinalized, stt.finalTranscript]);

  // ─────────────────────────────────────────────────────────────
  // Silence auto-stop handler
  // ─────────────────────────────────────────────────────────────
  const handleSttSilenceStop = useCallback(() => {
    // STT service already stopped; the isFinalized effect handles the rest
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Manual STT controls
  // ─────────────────────────────────────────────────────────────
  const handleStartListening = useCallback(() => {
    if (aiState !== 'waiting') return;
    if (!stt.isSupported) {
      toast.error(
        '🎙 Speech recognition is not supported in this browser. Try Chrome or Edge.',
        { duration: 6000 }
      );
      return;
    }
    // Cancel any ongoing TTS first
    tts.cancel();
    setAiState('listening');
    stt.reset();
    stt.start();
  }, [aiState, stt, tts]);

  const handleStopListening = useCallback(() => {
    stt.stop();
  }, [stt]);

  // ─────────────────────────────────────────────────────────────
  // Replay last question
  // ─────────────────────────────────────────────────────────────
  const handleReplay = useCallback(() => {
    if (aiState !== 'waiting' || !currentQuestionRef.current) return;
    tts.replay();
  }, [aiState, tts]);

  // ─────────────────────────────────────────────────────────────
  // Finish interview early
  // ─────────────────────────────────────────────────────────────
  const handleFinishInterview = useCallback(() => {
    tts.cancel();
    stt.abort();
    if (id) {
      aiInterviewSocketService.endInterview(id);
    }
    navigate(`/candidate/ai-interview/${id}/uploading`);
  }, [id, navigate, tts, stt]);

  // ─────────────────────────────────────────────────────────────
  // Map FullAIState → existing AIInterviewerCard state
  // ─────────────────────────────────────────────────────────────
  type LegacyAIState = 'speaking' | 'listening' | 'thinking' | 'waiting' | 'loading';
  const legacyState: LegacyAIState = (() => {
    const map: Record<FullAIState, LegacyAIState> = {
      loading: 'loading',
      generating: 'thinking',
      speaking: 'speaking',
      waiting: 'waiting',
      listening: 'listening',
      processing: 'thinking',
      thinking: 'thinking',
      error: 'waiting',
    };
    return map[aiState];
  })();

  // ─────────────────────────────────────────────────────────────
  // STT error handling via toast
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (stt.errorMessage) {
      toast.error(stt.errorMessage, { duration: 5000 });
      if (aiState === 'listening') {
        setAiState('waiting');
      }
    }
  }, [stt.errorMessage]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">

      {/* ── Top Bar ───────────────────────────────────────────── */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 flex-shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center text-white text-xs font-black">TF</div>
          <span className="text-slate-900 font-bold text-sm">TalentForge AI Interview</span>
        </div>
        <div className="flex-1" />
        <RecordingIndicator active />
        <TabSwitchIndicator count={tabSwitches} />
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>Question {currentQIdx + 1}</span>
        </div>
        {showFinishConfirm ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-600 font-medium">Finish interview?</span>
            <button onClick={handleFinishInterview} className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-700">Yes, Finish</button>
            <button onClick={() => setShowFinishConfirm(false)} className="text-xs bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-slate-300">Cancel</button>
          </div>
        ) : (
          <button
            onClick={() => setShowFinishConfirm(true)}
            className="text-xs border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors bg-white"
          >
            <Flag className="w-3.5 h-3.5" />
            Finish Interview
          </button>
        )}
      </div>

      {/* ── Main Content ──────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT PANEL: Question + Progress ──────────────────── */}
        <div className="w-72 bg-white border-r border-slate-200 flex flex-col p-4 gap-4 overflow-y-auto flex-shrink-0 z-0">
          {/* Current Question */}
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-2">Current Question</p>
            <QuestionCard
              order={currentQIdx + 1}
              total={totalQuestions}
              text={displayedQuestion || 'Connecting to AI Interviewer…'}
              category={currentCategory}
              isTyping={aiState === 'generating' || aiState === 'speaking'}
            />
          </div>

          {/* Question Navigator */}
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-2">Interview Progression</p>
            <div className="space-y-1.5">
              {Array.from({ length: Math.max(totalQuestions, currentQIdx + 1) }).map((_, i) => {
                const isAnswered = i < answeredCount;
                const isCurrent = i === currentQIdx;
                const isFuture = i > currentQIdx;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2.5 p-2 rounded-lg text-xs transition-all ${isCurrent ? 'bg-primary-50 border border-primary-200' : isAnswered ? 'bg-emerald-50 border border-emerald-200' : 'opacity-60 bg-slate-50 border border-slate-100'}`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${isCurrent ? 'bg-primary-600 text-white' : isAnswered ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      {isAnswered ? '✓' : i + 1}
                    </div>
                    <span className={`truncate ${isCurrent ? 'text-primary-800 font-semibold' : isAnswered ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {isCurrent ? currentCategory : isAnswered ? `Question ${i + 1} (Submitted)` : `Question ${i + 1}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Progress</p>
              <span className="text-[10px] font-bold text-slate-600">{Math.round((answeredCount / totalQuestions) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-primary-500 transition-all duration-700"
                style={{ width: `${Math.min((answeredCount / totalQuestions) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-slate-500">
              <span>{answeredCount} answered</span>
              <span>{Math.max(totalQuestions - answeredCount, 0)} remaining</span>
            </div>
          </div>
        </div>

        {/* ── CENTER PANEL: AI + Conversation ──────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">

          {/* AI Interviewer compact header */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 pt-4 pb-3 border-b border-slate-200 bg-white">
            <div className="flex items-center gap-4">
              <div className="transform scale-75 origin-left">
                <AIInterviewerCard state={legacyState} name="TalentForge AI" compact />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-slate-900">TalentForge AI Interviewer</span>
                <AIStatePanel state={aiState} />
              </div>
            </div>

            {/* TTS controls */}
            <div className="flex items-center gap-2">
              {/* Replay */}
              <button
                onClick={handleReplay}
                disabled={aiState !== 'waiting' || !currentQuestionRef.current}
                title="Replay last question"
                className="p-2 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-slate-500 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              {/* Stop TTS */}
              <button
                onClick={tts.cancel}
                disabled={!tts.isSpeaking}
                title="Stop speaking"
                className="p-2 rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50 transition-colors text-slate-500 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {tts.isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Conversation Chat */}
          <div className="flex-1 flex flex-col overflow-hidden px-6 pt-4">
            {messages.length === 0 && !liveMessage && (
              <div className="flex flex-col items-center justify-center flex-1 gap-3 text-slate-400">
                <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-2xl animate-gentle-spin">
                  🤖
                </div>
                <p className="text-sm font-medium">Connecting to AI Interview room…</p>
              </div>
            )}
            <ConversationPanel
              messages={messages}
              liveMessage={liveMessage}
              bottomRef={conversationBottomRef}
            />
          </div>

          {/* Bottom controls — candidate response */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-white">
            <div className="space-y-3">
              {/* Text / Live transcript edit box */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={manualTextAnswer}
                  onChange={(e) => setManualTextAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && aiState === 'waiting') {
                      e.preventDefault();
                      handleSubmitAnswer();
                    }
                  }}
                  disabled={aiState !== 'waiting' && aiState !== 'listening'}
                  placeholder={stt.isListening ? 'Listening… (or type here)' : 'Type your answer or use voice mic to speak…'}
                  className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50 focus:bg-white transition-all disabled:opacity-60"
                />

                {/* Submit button */}
                <button
                  onClick={() => handleSubmitAnswer()}
                  disabled={aiState !== 'waiting' && aiState !== 'listening'}
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm shadow-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Submit Answer
                </button>
              </div>

              <div className="flex items-center gap-4">
                {/* Voice Mic button */}
                {aiState === 'waiting' && (
                  <button
                    onClick={handleStartListening}
                    className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold text-xs transition-all shadow-sm shadow-emerald-200 animate-fade-in-up"
                  >
                    <Mic className="w-4 h-4" />
                    Start Speaking (Mic)
                  </button>
                )}
                {aiState === 'listening' && (
                  <button
                    onClick={handleStopListening}
                    className="flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold text-xs transition-all shadow-sm shadow-red-200 animate-fade-in-up"
                  >
                    <MicOff className="w-4 h-4" />
                    Stop Mic
                  </button>
                )}

                {(aiState === 'generating' || aiState === 'speaking' || aiState === 'processing' || aiState === 'thinking') && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-recording-pulse" />
                    {aiState === 'speaking' ? 'AI Interviewer is speaking…' : 'AI is evaluating your response…'}
                  </div>
                )}

                <div className="flex-1" />

                {/* Live stats when listening */}
                {aiState === 'listening' && (
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="font-medium tabular-nums">{stt.wordCount} words</span>
                    <span className="font-medium tabular-nums">
                      {Math.floor(stt.speakingSeconds / 60)}:{String(stt.speakingSeconds % 60).padStart(2, '0')}
                    </span>
                    <MicLevelBar level={stt.micLevel} isActive={stt.isListening} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: Previews + Tips + Voice ─────────────── */}
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col p-4 gap-4 overflow-y-auto flex-shrink-0 z-0">

          {/* Real-time Previews */}
          <div className="space-y-3">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Monitoring Feeds</p>
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200" style={{ height: 160 }}>
              <CameraPreview stream={cameraStream} faceState={faceState} label="Your Camera" />
            </div>
            {deviceState.hasScreen && (
              <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200" style={{ height: 160 }}>
                <ScreenPreview stream={screenStream} label="Your Screen" />
              </div>
            )}
          </div>

          {/* Voice Selector */}
          {tts.isSupported && (
            <VoiceSelector
              voices={tts.voices}
              selectedVoiceURI={tts.selectedVoiceURI}
              onChange={tts.setSelectedVoice}
              disabled={tts.isSpeaking}
            />
          )}

          {/* Interview Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <p className="text-xs text-amber-700 font-bold">Interview Tip</p>
            </div>
            <div key={tipIdx} className="animate-fade-in-up">
              <p className="text-sm text-amber-900 leading-relaxed">{INTERVIEW_TIPS[tipIdx]}</p>
            </div>
          </div>

          {/* Monitoring status */}
          <div className="space-y-2 mt-auto">
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5" />
                <span>Tab Switches</span>
              </div>
              <span className={`font-bold tabular-nums ${tabSwitches > 0 ? 'text-red-500' : 'text-emerald-600'}`}>{tabSwitches}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>Questions Answered</span>
              <span className="font-bold text-primary-600 tabular-nums">{answeredCount}</span>
            </div>
            {stt.isListening && (
              <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>Mic Level</span>
                <MicLevelBar level={stt.micLevel} isActive={stt.isListening} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
