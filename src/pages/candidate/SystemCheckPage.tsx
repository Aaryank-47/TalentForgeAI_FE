import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { InterviewStepper } from '../../components/interview/InterviewComponents';
import SystemCheck from '../../modules/shared/system-check/SystemCheck';

const STEPS = [
  { label: 'Details' },
  { label: 'Preparation' },
  { label: 'System Check' },
  { label: 'Consent' },
  { label: 'Waiting Room' },
  { label: 'Interview' },
];

export default function SystemCheckPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [overallReady, setOverallReady] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Stepper */}
      <div className="card p-4">
        <InterviewStepper steps={STEPS} currentStep={2} />
      </div>

      <div>
        <h1 className="text-xl font-display font-bold text-slate-900">System Check</h1>
        <p className="text-sm text-slate-500 mt-1">Verifying your setup before the interview begins. All checks must pass.</p>
      </div>

      <SystemCheck 
        mode="ai-interview" 
        onReady={() => setOverallReady(true)} 
        onFailed={() => setOverallReady(false)} 
      />

      {/* Note about monitoring */}
      <div className="card p-4 border-amber-200 bg-amber-50">
        <p className="text-xs text-amber-700 font-semibold mb-1">📋 Monitoring Notice</p>
        <p className="text-xs text-amber-600">
          Tab switches, face visibility, and background noise are monitored throughout the interview.
          This data is shared with the recruiter. Final decisions remain with the recruiter.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button onClick={() => navigate(`/candidate/ai-interview/${id}/preparation`)} className="btn-secondary flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={() => navigate(`/candidate/ai-interview/${id}/consent`)}
          disabled={!overallReady}
          className={`btn-primary flex items-center gap-2 text-sm ${!overallReady ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Proceed to Consent <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
