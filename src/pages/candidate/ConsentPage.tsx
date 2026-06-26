import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Shield, Check } from 'lucide-react';
import { InterviewStepper } from '../../components/interview/InterviewComponents';

const STEPS = [
  { label: 'Details' },
  { label: 'Preparation' },
  { label: 'System Check' },
  { label: 'Consent' },
  { label: 'Waiting Room' },
  { label: 'Interview' },
];

const CONSENT_ITEMS = [
  {
    id: 'recording',
    title: 'Recording Consent',
    text: 'I consent to my interview session being recorded, including audio and video. The recording will be used solely for evaluation purposes by the hiring organization.',
  },
  {
    id: 'monitoring',
    title: 'Monitoring Consent',
    text: 'I acknowledge that tab activity, face visibility, and background noise will be monitored during this interview. A summary report will be shared with the recruiter.',
  },
  {
    id: 'ai',
    title: 'AI Evaluation Consent',
    text: 'I consent to my responses being analyzed by TalentForge AI to generate an evaluation report. Final hiring decisions remain with the human recruiter.',
  },
  {
    id: 'data',
    title: 'Data Usage Agreement',
    text: 'I agree that my interview data (audio, transcript, and evaluation scores) will be stored securely for up to 12 months as per TalentForge\'s data retention policy.',
  },
];

export default function ConsentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consents, setConsents] = useState<Record<string, boolean>>({});

  const toggleConsent = (key: string) => setConsents(prev => ({ ...prev, [key]: !prev[key] }));
  const allConsented = CONSENT_ITEMS.every(item => consents[item.id]);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Stepper */}
      <div className="card p-4">
        <InterviewStepper steps={STEPS} currentStep={3} />
      </div>

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Shield className="w-6 h-6 text-violet-600" />
        </div>
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900">Consent & Terms</h1>
          <p className="text-sm text-slate-500 mt-1">
            Please read and accept the following before proceeding.
          </p>
        </div>
      </div>

      {/* Consent Items */}
      <div className="space-y-3">
        {CONSENT_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => toggleConsent(item.id)}
            className={`w-full text-left card p-4 flex items-start gap-4 transition-all hover:shadow-sm ${consents[item.id] ? 'border-emerald-200 bg-emerald-50/50' : 'hover:border-primary-200'}`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${consents[item.id] ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
              {consents[item.id] && <Check className="w-3.5 h-3.5 text-white" />}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 mb-1">{item.title}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{item.text}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Legal Note */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <p className="text-xs text-slate-500 leading-relaxed">
          By proceeding, you acknowledge that you have read and understood all consent terms above.
          Your privacy is important to us. Data is processed in accordance with applicable data protection laws.
          For questions, contact <span className="text-primary-600 font-medium">privacy@talentforge.ai</span>.
        </p>
      </div>

      {/* Summary */}
      <div className={`card p-4 flex items-center gap-3 border-2 transition-all ${allConsented ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200'}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${allConsented ? 'bg-emerald-500' : 'bg-slate-200'}`}>
          {allConsented ? <Check className="w-5 h-5 text-white" /> : <Shield className="w-5 h-5 text-slate-400" />}
        </div>
        <div>
          <p className={`text-sm font-bold ${allConsented ? 'text-emerald-800' : 'text-slate-700'}`}>
            {allConsented ? 'All consent given — Ready to proceed' : `${Object.values(consents).filter(Boolean).length} of ${CONSENT_ITEMS.length} items accepted`}
          </p>
          <p className="text-xs text-slate-500">You must accept all items to continue</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(`/candidate/ai-interview/${id}/system-check`)} className="btn-secondary flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={() => navigate(`/candidate/ai-interview/${id}/waiting-room`)}
          disabled={!allConsented}
          className={`btn-primary flex items-center gap-2 text-sm ${!allConsented ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Enter Waiting Room <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
