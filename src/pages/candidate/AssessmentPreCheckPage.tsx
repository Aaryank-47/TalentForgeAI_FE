import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Check, ShieldAlert } from 'lucide-react';
import { InterviewStepper } from '../../components/interview/InterviewComponents';
import { SystemCheck } from '../../modules/shared/system-check/SystemCheck';

const STEPS = [
  { label: 'Details' },
  { label: 'Preparation' },
  { label: 'System Check' },
  { label: 'Consent' },
];

export default function AssessmentPreCheckPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [overallReady, setOverallReady] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Preparation Step
  const renderPreparation = () => (
    <div className="card p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Assessment Rules & Prep</h2>
      <ul className="space-y-3 mb-6">
        <li className="flex gap-2 text-sm text-slate-600">
          <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          Ensure you are in a quiet room with good lighting.
        </li>
        <li className="flex gap-2 text-sm text-slate-600">
          <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          Close any unnecessary browser tabs and applications.
        </li>
        <li className="flex gap-2 text-sm text-slate-600">
          <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          Make sure your laptop is plugged in or fully charged.
        </li>
      </ul>
      <div className="flex justify-between">
        <button onClick={() => navigate('/candidate/assessments')} className="btn-secondary text-sm">Cancel</button>
        <button onClick={() => setCurrentStep(2)} className="btn-primary flex items-center gap-2 text-sm">
          Proceed to System Check <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // System Check Step
  const renderSystemCheck = () => (
    <div>
      <SystemCheck 
        mode="assessment" 
        onReady={() => setOverallReady(true)} 
        onFailed={() => setOverallReady(false)} 
        settings={{ cameraRequired: true, microphoneRequired: true, fullscreenRequired: true, screenSharingRequired: true }}
      />
      <div className="flex justify-between mt-6">
        <button onClick={() => setCurrentStep(1)} className="btn-secondary flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={() => setCurrentStep(3)} disabled={!overallReady} className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50">
          Proceed to Consent <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Consent Step
  const renderConsent = () => (
    <div className="card p-6 max-w-2xl mx-auto text-center">
      <ShieldAlert className="w-12 h-12 text-blue-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-slate-900 mb-2">Consent to Proctoring</h2>
      <p className="text-sm text-slate-600 mb-6">
        By proceeding, you agree to have your webcam, microphone, and screen activity monitored during the assessment to ensure academic integrity.
      </p>
      
      <label className="flex items-center justify-center gap-3 mb-6 p-4 bg-slate-50 rounded-xl cursor-pointer">
        <input 
          type="checkbox" 
          checked={agreed} 
          onChange={e => setAgreed(e.target.checked)} 
          className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500" 
        />
        <span className="text-sm font-semibold text-slate-800">I agree to the terms and conditions</span>
      </label>

      <div className="flex justify-between">
        <button onClick={() => setCurrentStep(2)} className="btn-secondary flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button 
          onClick={() => navigate(`/candidate/assessments/${id}/take`)} 
          disabled={!agreed} 
          className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50"
        >
          Start Assessment <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8">
      {/* Stepper */}
      <div className="card p-4">
        <InterviewStepper steps={STEPS} currentStep={currentStep} />
      </div>

      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900">Pre-Assessment Setup</h1>
        <p className="text-sm text-slate-500 mt-1">Please complete these checks before starting your assessment.</p>
      </div>

      {currentStep === 1 && renderPreparation()}
      {currentStep === 2 && renderSystemCheck()}
      {currentStep === 3 && renderConsent()}
    </div>
  );
}
