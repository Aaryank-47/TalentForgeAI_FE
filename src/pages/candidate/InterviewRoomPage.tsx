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
import { Flag, Lightbulb, Monitor, Clock, Mic, MicOff, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

// ── Constants / Data ──────────────────────────────────────────
import { aiInterviewData, aiInterviewConfig } from '../../constants/candidate_mockData';

// ── Services ──────────────────────────────────────────────────
import { generateNextQuestion } from '../../services/ai/interviewAI.service';
import type { InterviewContext, TranscriptEntry } from '../../services/ai/interviewAI.service';

// ── Hooks ─────────────────────────────────────────────────────
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

// ── Existing Components ───────────────────────────────────────
import {
  QuestionCard,
  RecordingIndicator,
} from '../../components/interview/InterviewComponents';

// ── New Conversation Components ───────────────────────────────
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
  'Use the STAR method for behavioral questions.',
  'Look at the camera when answering.',
  "It's okay to pause before responding.",
  'Be specific — use real examples where possible.',
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
  const { id } = useParams();
  const navigate = useNavigate();

  // ── Config from mock data (never hardcoded here) ─────────────
  const { questions } = aiInterviewData;
  const totalQuestions = aiInterviewConfig.totalQuestions;
  const silenceTimeoutMs = aiInterviewConfig.silenceTimeoutMs;
  const textRenderDelayMs = aiInterviewConfig.textRenderDelayMs;

  // ── Media context ─────────────────────────────────────────────
  const { cameraStream, screenStream, deviceState, faceState, tabSwitches } = useMedia();

  // ── Speech hooks ──────────────────────────────────────────────
  const tts = useSpeechSynthesis();
  const stt = useSpeechRecognition({
    silenceTimeoutMs,
    onSilenceStop: () => handleSttSilenceStop(),
  });

  // ── Interview state ───────────────────────────────────────────
  const [aiState, setAiState] = useState<FullAIState>('loading');
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [answered, setAnswered] = useState<number[]>([]);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);

  // ── Conversation messages ──────────────────────────────────────
  const [messages, setMessages] = useState<ConversationMessageData[]>([]);
  // Live message: current question (AI) or current partial answer (candidate)
  const [liveMessage, setLiveMessage] = useState<ConversationMessageData | null>(null);
  const conversationBottomRef = useRef<HTMLDivElement | null>(null);

  // ── Current displayed question (for left panel) ───────────────
  const [displayedQuestion, setDisplayedQuestion] = useState('');
  const [currentCategory, setCurrentCategory] = useState(
    questions[0]?.category ?? 'Introduction'
  );

  // ── Transcript accumulation (for AI context) ──────────────────
  const transcriptHistoryRef = useRef<TranscriptEntry[]>([]);
  const previousQuestionsRef = useRef<string[]>([]);
  const currentQuestionRef = useRef<string>('');

  // ── State guards to prevent overlapping flows ─────────────────
  const flowLockRef = useRef(false);
  const isLastQuestion = currentQIdx >= totalQuestions - 1;

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
  // Core: generate + speak + listen flow
  // ─────────────────────────────────────────────────────────────
  const runQuestionFlow = useCallback(
    async (questionNumber: number) => {
      if (flowLockRef.current) return;
      flowLockRef.current = true;

      // ── Step 1: Generating ──────────────────────────────────
      setAiState('generating');
      setLiveMessage({
        id: makeId(),
        role: 'ai',
        text: '', // empty = skeleton dots
        timestamp: nowTimestamp(),
        status: 'generating',
        questionNumber,
      });

      // Build context from accumulated history
      const ctx: InterviewContext = {
        role: aiInterviewConfig.role,
        company: aiInterviewConfig.company,
        experience: aiInterviewConfig.experience,
        interviewType: aiInterviewConfig.interviewType,
        difficulty: aiInterviewConfig.difficulty,
        skills: aiInterviewConfig.skills,
        questionNumber,
        totalQuestions,
        previousQuestions: previousQuestionsRef.current,
        topicsCovered: previousQuestionsRef.current.map((_, i) =>
          questions[i]?.category ?? ''
        ).filter(Boolean),
        transcript: transcriptHistoryRef.current,
      };

      let generatedQ = '';
      let isFallback = false;

      try {
        const result = await generateNextQuestion(ctx);
        generatedQ = result.question;
        isFallback = result.isFallback;

        if (result.error) {
          const errorMessages = {
            timeout: '⏱ AI took too long — using a prepared question instead.',
            network: '🌐 Network issue — using a prepared question instead.',
            api: result.error.message.includes('No API key')
              ? '🔑 No OpenRouter API key set — using fallback questions. Add VITE_OPENROUTER_API_KEY to .env.local'
              : `⚠️ AI error — using a prepared question instead.`,
            empty: '⚠️ AI returned empty — using a prepared question instead.',
          };
          toast(errorMessages[result.error.type] ?? '⚠️ Using fallback question.', {
            icon: isFallback ? '📋' : '✅',
            duration: 4000,
          });
        }
      } catch {
        generatedQ = questions[questionNumber - 1]?.text ?? 'Tell me about yourself.';
        isFallback = true;
        toast.error('Failed to generate question. Using prepared fallback.');
      }

      currentQuestionRef.current = generatedQ;
      previousQuestionsRef.current = [...previousQuestionsRef.current, generatedQ];

      // ── Step 2: Start TTS immediately — show text after delay ──
      setAiState('speaking');

      // Show skeleton → real text after textRenderDelayMs
      const renderTimeout = setTimeout(() => {
        const category =
          questions[questionNumber - 1]?.category ??
          ['Introduction', 'Technical', 'Behavioral', 'Experience'][questionNumber % 4];

        setCurrentCategory(category);
        setDisplayedQuestion(generatedQ);

        setLiveMessage({
          id: makeId(),
          role: 'ai',
          text: generatedQ,
          timestamp: nowTimestamp(),
          status: 'speaking',
          questionNumber,
          isFallback,
        });
      }, textRenderDelayMs);

      // Speak (returns promise that resolves when done)
      if (tts.isSupported) {
        await tts.speak(generatedQ);
      } else {
        toast('🔇 Text-to-Speech is not supported in this browser. Read the question above.', {
          duration: 5000,
        });
        // Wait a moment for user to read
        await new Promise((r) => setTimeout(r, 3000));
      }

      clearTimeout(renderTimeout);

      // Finalize AI message in conversation list (move from live → messages)
      const finalAiMsg: ConversationMessageData = {
        id: makeId(),
        role: 'ai',
        text: generatedQ,
        timestamp: nowTimestamp(),
        status: 'pinned',
        questionNumber,
        isFallback,
      };
      setMessages((prev) => [...prev, finalAiMsg]);
      setLiveMessage(null);

      // ── Step 3: Waiting for candidate ─────────────────────────
      setAiState('waiting');
      flowLockRef.current = false;
    },
    [tts, questions, totalQuestions, textRenderDelayMs]
  );

  // ─────────────────────────────────────────────────────────────
  // Mount: start first question
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      runQuestionFlow(1);
    }, 800);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    }
  }, [stt.transcript, stt.isListening]);

  // ─────────────────────────────────────────────────────────────
  // STT finalized → process answer → generate next question
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!stt.isFinalized) return;
    handleAnswerFinalized(stt.finalTranscript);
  }, [stt.isFinalized]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswerFinalized = useCallback(
    async (answerText: string) => {
      if (flowLockRef.current) return;
      flowLockRef.current = true;

      // Add finalized candidate message to history
      const candidateMsg: ConversationMessageData = {
        id: makeId(),
        role: 'candidate',
        text: answerText || '[No response detected]',
        timestamp: nowTimestamp(),
        status: 'final',
      };
      setMessages((prev) => [...prev, candidateMsg]);
      setLiveMessage(null);

      // Accumulate transcript for AI context
      transcriptHistoryRef.current = [
        ...transcriptHistoryRef.current,
        {
          questionNumber: currentQIdx + 1,
          question: currentQuestionRef.current,
          answer: answerText,
        },
      ];

      // Mark question as answered
      const newAnswered = [...answered, currentQIdx];
      setAnswered(newAnswered);

      flowLockRef.current = false;

      if (isLastQuestion) {
        setAiState('loading');
        toast.success('Interview complete! Uploading your responses…');
        setTimeout(() => navigate(`/candidate/ai-interview/${id}/uploading`), 1500);
        return;
      }

      // ── Processing → Generate next ─────────────────────────
      setAiState('processing');
      await new Promise((r) => setTimeout(r, 800));

      const nextIdx = currentQIdx + 1;
      setCurrentQIdx(nextIdx);
      await runQuestionFlow(nextIdx + 1);
    },
    [currentQIdx, answered, isLastQuestion, id, navigate, runQuestionFlow]
  );

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
          <span>Q {currentQIdx + 1}/{totalQuestions}</span>
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
              text={displayedQuestion || '…'}
              category={currentCategory}
              isTyping={aiState === 'generating' || aiState === 'speaking'}
            />
          </div>

          {/* Question Navigator */}
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-2">Question Timeline</p>
            <div className="space-y-1.5">
              {Array.from({ length: totalQuestions }).map((_, i) => {
                const isAnswered = answered.includes(i);
                const isCurrent = i === currentQIdx;
                const isFuture = i > currentQIdx;
                const cat = questions[i]?.category ?? `Q${i + 1}`;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2.5 p-2 rounded-lg text-xs transition-all ${isCurrent ? 'bg-primary-50 border border-primary-200' : isAnswered ? 'bg-emerald-50 border border-emerald-200' : 'opacity-60 bg-slate-50 border border-slate-100'}`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${isCurrent ? 'bg-primary-600 text-white' : isAnswered ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      {isAnswered ? '✓' : i + 1}
                    </div>
                    <span className={`truncate ${isCurrent ? 'text-primary-800 font-semibold' : isAnswered ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {isFuture && !isCurrent ? '—' : cat}
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
              <span className="text-[10px] font-bold text-slate-600">{Math.round((answered.length / totalQuestions) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-primary-500 transition-all duration-700"
                style={{ width: `${(answered.length / totalQuestions) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-slate-500">
              <span>{answered.length} answered</span>
              <span>{totalQuestions - answered.length} remaining</span>
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
                <p className="text-sm font-medium">Starting your interview…</p>
              </div>
            )}
            <ConversationPanel
              messages={messages}
              liveMessage={liveMessage}
              bottomRef={conversationBottomRef}
            />
          </div>

          {/* Bottom controls — mic button */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-4">
              {/* Mic button */}
              {aiState === 'waiting' && (
                <button
                  onClick={handleStartListening}
                  className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm shadow-emerald-200 animate-fade-in-up"
                >
                  <Mic className="w-4 h-4" />
                  Start Speaking
                </button>
              )}
              {aiState === 'listening' && (
                <button
                  onClick={handleStopListening}
                  className="flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm shadow-red-200 animate-fade-in-up"
                >
                  <MicOff className="w-4 h-4" />
                  Done Speaking
                </button>
              )}
              {(aiState === 'generating' || aiState === 'speaking' || aiState === 'processing' || aiState === 'thinking') && (
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <div className="w-2 h-2 rounded-full bg-slate-300 animate-recording-pulse" />
                  {aiState === 'speaking' ? 'AI is speaking…' : 'Please wait…'}
                </div>
              )}

              <div className="flex-1" />

              {/* Live stats when listening */}
              {aiState === 'listening' && (
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="font-medium tabular-nums">
                    {stt.wordCount} words
                  </span>
                  <span className="font-medium tabular-nums">
                    {Math.floor(stt.speakingSeconds / 60)}:{String(stt.speakingSeconds % 60).padStart(2, '0')}
                  </span>
                  <MicLevelBar level={stt.micLevel} isActive={stt.isListening} />
                </div>
              )}
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

          {/* Notes (disabled) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Notes</p>
              <span className="text-[10px] text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full font-medium">Disabled</span>
            </div>
            <textarea
              disabled
              placeholder="Note-taking is disabled during AI interview"
              className="w-full bg-transparent text-xs text-slate-500 resize-none outline-none placeholder-slate-400 cursor-not-allowed"
              rows={3}
            />
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
              <span className="font-bold text-primary-600 tabular-nums">{answered.length}/{totalQuestions}</span>
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
