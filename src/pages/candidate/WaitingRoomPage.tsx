import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Play, Clock, Wifi, Shield } from 'lucide-react';
import { aiInterviewData } from '../../constants/candidate_mockData';
import { InterviewStepper, AIInterviewerCard, InterviewSummaryCard } from '../../components/interview/InterviewComponents';
import { CameraPreview, ScreenPreview } from '../../modules/shared/system-check/SystemCheck';
import { useMedia } from '../../context/MediaProvider';


const STEPS = [
  { label: 'Details' },
  { label: 'Preparation' },
  { label: 'System Check' },
  { label: 'Consent' },
  { label: 'Waiting Room' },
  { label: 'Interview' },
];

const TIPS_CAROUSEL = [
  { icon: '🎤', title: 'Speak Clearly', body: 'Speak at a natural, comfortable pace. You have 2–3 minutes per question — there\'s no need to rush.' },
  { icon: '👀', title: 'Look at the Camera', body: 'Position yourself so your face is centered. Look at the camera to create natural eye contact.' },
  { icon: '🧠', title: 'Think Before You Speak', body: 'It\'s okay to pause briefly. Taking a moment to structure your thought leads to better answers.' },
  { icon: '📖', title: 'Use the STAR Method', body: 'For behavioral questions: Situation → Task → Action → Result. Keep answers focused and concrete.' },
];

export default function WaitingRoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pendingInterviews } = aiInterviewData;
  const pending = pendingInterviews.find(iv => iv.id === id) || pendingInterviews[0];

  const { cameraStream, screenStream, deviceState } = useMedia();

  const [tipIdx, setTipIdx] = useState(0);
  const [countdown, setCountdown] = useState(10);
  const [ready, setReady] = useState(false);

  // Auto-rotate tips
  useEffect(() => {
    const t = setInterval(() => setTipIdx(prev => (prev + 1) % TIPS_CAROUSEL.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Countdown
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setReady(true);
    }
  }, [countdown]);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Stepper */}
      <div className="card p-4">
        <InterviewStepper steps={STEPS} currentStep={4} />
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-display font-bold text-slate-900">Waiting Room</h1>
        <p className="text-slate-500 mt-1">Your interview is about to begin. Get comfortable.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left: Camera + Summary */}
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-2xl overflow-hidden" style={{ height: 200 }}>
            <CameraPreview stream={cameraStream} label="Your Camera" />
          </div>

          {deviceState.hasScreen && (
            <div className="rounded-2xl overflow-hidden" style={{ height: 200 }}>
              <ScreenPreview stream={screenStream} label="Your Screen" />
            </div>
          )}

          <InterviewSummaryCard
            company={pending.company}
            role={pending.role}
            questions={pending.questionCount}
            duration={pending.estimatedDuration}
            companyColor={pending.companyColor}
            companyLogo={pending.companyLogo}
          />

          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <Wifi className="w-3.5 h-3.5" />, label: 'Connection', value: 'Strong' },
              { icon: <Shield className="w-3.5 h-3.5" />, label: 'Monitoring', value: 'Active' },
              { icon: <Clock className="w-3.5 h-3.5" />, label: 'Duration', value: pending.estimatedDuration },
            ].map(stat => (
              <div key={stat.label} className="card p-2.5 text-center">
                <div className="text-slate-400 flex justify-center mb-1">{stat.icon}</div>
                <p className="text-[10px] text-slate-500">{stat.label}</p>
                <p className="text-xs font-bold text-slate-800">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI Card + Countdown + Tips */}
        <div className="lg:col-span-3 space-y-4">
          {/* AI Interviewer */}
          <AIInterviewerCard state="waiting" name="TalentForge AI" />

          {/* Countdown / Join button */}
          <div className="card p-5 text-center">
            {!ready ? (
              <>
                <p className="text-sm text-slate-500 mb-2">Interview starts in</p>
                <div className="flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-4 border-primary-200 bg-primary-50 flex items-center justify-center">
                    <span className="text-3xl font-black text-primary-600 tabular-nums">{countdown}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3">You can join early once the button becomes active</p>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-emerald-700 mb-3">✅ Ready to begin!</p>
                <button
                  onClick={() => navigate(`/candidate/ai-interview/${id}/room`)}
                  className="btn-primary w-full text-base py-3 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Join Interview Now
                </button>
              </>
            )}
          </div>

          {/* Rotating Tips */}
          <div className="card p-5 overflow-hidden relative" style={{ minHeight: 130 }}>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-3">Quick Tip</p>
            <div key={tipIdx} className="animate-fade-in-up">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{TIPS_CAROUSEL[tipIdx].icon}</span>
                <div>
                  <p className="text-sm font-bold text-slate-800 mb-1">{TIPS_CAROUSEL[tipIdx].title}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{TIPS_CAROUSEL[tipIdx].body}</p>
                </div>
              </div>
            </div>
            {/* Dot indicators */}
            <div className="flex gap-1 mt-4 justify-center">
              {TIPS_CAROUSEL.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTipIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === tipIdx ? 'bg-primary-600 w-4' : 'bg-slate-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
