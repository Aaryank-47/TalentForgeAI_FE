import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Flag, Lightbulb, Monitor, Clock } from 'lucide-react';
import { aiInterviewData } from '../../constants/candidate_mockData';
import {
  QuestionCard,
  CountdownTimer,
  AIInterviewerCard,
  RecordingIndicator,
  SpeakingIndicator,
  ListeningIndicator,
} from '../../components/interview/InterviewComponents';
import { CameraPreview, ScreenPreview, TabSwitchIndicator } from '../../modules/shared/system-check/SystemCheck';
import { useMedia } from '../../context/MediaProvider';


type AIState = 'speaking' | 'listening' | 'thinking' | 'waiting' | 'loading';

const INTERVIEW_TIPS = [
  'Speak clearly and at a natural pace.',
  'Use the STAR method for behavioral questions.',
  'Look at the camera when answering.',
  'It\'s okay to pause before responding.',
  'Be specific — use real examples where possible.',
];

const QUESTION_DURATION = 180; // 3 minutes per question (mock)

export default function InterviewRoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const questions = aiInterviewData.questions;

  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [aiState, setAiState] = useState<AIState>('loading');
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_DURATION);
  const [responded, setResponded] = useState(false);
  const [answered, setAnswered] = useState<number[]>([]);
  const { cameraStream, screenStream, deviceState, faceState, tabSwitches } = useMedia();

  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);

  const currentQ = questions[currentQIdx];
  const isLast = currentQIdx === questions.length - 1;

  // Simulate AI asking question (typewriter + state sequence)
  const startQuestion = useCallback((qText: string) => {
    setAiState('speaking');
    setIsTyping(true);
    setDisplayedText('');
    setResponded(false);
    setSecondsLeft(QUESTION_DURATION);

    let i = 0;
    const speed = 35; // ms per char
    const interval = setInterval(() => {
      i++;
      setDisplayedText(qText.slice(0, i));
      if (i >= qText.length) {
        clearInterval(interval);
        setIsTyping(false);
        setAiState('listening');
      }
    }, speed);
    return () => clearInterval(interval);
  }, []);

  // Start first question
  useEffect(() => {
    const t = setTimeout(() => startQuestion(currentQ.text), 1200);
    return () => clearTimeout(t);
  }, [currentQIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown timer
  useEffect(() => {
    if (aiState !== 'listening') return;
    if (secondsLeft <= 0) {
      handleMoveNext();
      return;
    }
    const t = setTimeout(() => setSecondsLeft(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, aiState]); // eslint-disable-line react-hooks/exhaustive-deps

  // Simulate response after some time
  useEffect(() => {
    if (aiState !== 'listening') return;
    const t = setTimeout(() => setResponded(true), 6000);
    return () => clearTimeout(t);
  }, [aiState]);

  // Rotate tips
  useEffect(() => {
    const t = setInterval(() => setTipIdx(prev => (prev + 1) % INTERVIEW_TIPS.length), 7000);
    return () => clearInterval(t);
  }, []);

  const handleMoveNext = () => {
    setAnswered(prev => [...prev, currentQIdx]);
    if (isLast) {
      navigate(`/candidate/ai-interview/${id}/uploading`);
    } else {
      setAiState('thinking');
      setTimeout(() => {
        setCurrentQIdx(prev => prev + 1);
      }, 1500);
    }
  };

  const handleFinishInterview = () => {
    setAnswered(prev => prev.includes(currentQIdx) ? prev : [...prev, currentQIdx]);
    navigate(`/candidate/ai-interview/${id}/uploading`);
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* Top Bar */}
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
          <span>Q {currentQIdx + 1}/{questions.length}</span>
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

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT PANEL: Question + Progress */}
        <div className="w-72 bg-white border-r border-slate-200 flex flex-col p-4 gap-4 overflow-y-auto flex-shrink-0 z-0">
          {/* Current Question */}
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-2">Current Question</p>
            <QuestionCard
              order={currentQIdx + 1}
              total={questions.length}
              text={displayedText || '…'}
              category={currentQ.category}
              isTyping={isTyping}
            />
          </div>

          {/* Question Navigator */}
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-2">Question Timeline</p>
            <div className="space-y-1.5">
              {questions.map((q, i) => {
                const isAnswered = answered.includes(i);
                const isCurrent = i === currentQIdx;
                const isFuture = i > currentQIdx;
                return (
                  <div
                    key={q.id}
                    className={`flex items-center gap-2.5 p-2 rounded-lg text-xs transition-all ${isCurrent ? 'bg-primary-50 border border-primary-200' : isAnswered ? 'bg-emerald-50 border border-emerald-200' : 'opacity-60 bg-slate-50 border border-slate-100'}`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${isCurrent ? 'bg-primary-600 text-white' : isAnswered ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      {isAnswered ? '✓' : i + 1}
                    </div>
                    <span className={`truncate ${isCurrent ? 'text-primary-800 font-semibold' : isAnswered ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {isFuture && !isCurrent ? '—' : q.category}
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
              <span className="text-[10px] font-bold text-slate-600">{Math.round((answered.length / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-primary-500 transition-all duration-700"
                style={{ width: `${(answered.length / questions.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-slate-500">
              <span>{answered.length} answered</span>
              <span>{questions.length - answered.length} remaining</span>
            </div>
          </div>
        </div>

        {/* CENTER: AI Interaction */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 bg-slate-50/50">
          <div className="transform scale-125">
            <AIInterviewerCard state={aiState} name="TalentForge AI" />
          </div>

          {/* Status + Timer */}
          <div className="flex flex-col items-center gap-6 mt-8">
            <CountdownTimer secondsLeft={secondsLeft} totalSeconds={QUESTION_DURATION} size="lg" />
            <div className="text-slate-800 bg-white shadow-sm border border-slate-200 px-6 py-3 rounded-full flex items-center justify-center min-w-[240px]">
              {aiState === 'speaking' && <SpeakingIndicator label="AI Asking Question" />}
              {aiState === 'listening' && <ListeningIndicator label="Your turn — speak now" />}
              {aiState === 'thinking' && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-ai-dot" />
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-ai-dot-2" />
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-ai-dot-3" />
                  </div>
                  <span className="text-sm text-violet-600 font-bold">AI Thinking…</span>
                </div>
              )}
            </div>
          </div>

          {/* Next button — only after response simulation */}
          {responded && aiState === 'listening' && (
            <button
              onClick={handleMoveNext}
              className="btn-primary px-8 py-3 text-sm animate-fade-in-up"
            >
              {isLast ? 'Finish Interview' : 'Next Question →'}
            </button>
          )}
        </div>

        {/* RIGHT PANEL: Previews + Tips */}
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
              <span className="font-bold text-primary-600 tabular-nums">{answered.length}/{questions.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
