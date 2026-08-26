import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, ArrowLeft, Check, ShieldAlert, AlertCircle, Loader2 } from 'lucide-react';
import { InterviewStepper } from '../../components/interview/InterviewComponents';
import { SystemCheck } from '../../modules/shared/system-check/SystemCheck';
import { assessmentApi } from '../../services/api/assessment.api';
import { useAuth } from '../../context/AuthContext';

const STEPS = [
  { label: 'Details' },
  { label: 'Preparation' },
  { label: 'System Check' },
  { label: 'Consent' },
];

export default function AssessmentPreCheckPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [overallReady, setOverallReady] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Validate invitation token on entry
  const { data: invitationData, isLoading: isValidatingToken, isError: isTokenError, error: tokenError } = useQuery({
    queryKey: ['assessment', 'invitation-validate', token],
    queryFn: () => assessmentApi.validateInvitation(token),
    enabled: Boolean(token),
    retry: false,
  });

  if (token && isValidatingToken) {
    return (
      <div className="card p-16 max-w-xl mx-auto my-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 text-sm">Validating Assessment Invitation...</h3>
        <p className="text-xs text-slate-500 mt-1">Please wait while we verify your access token.</p>
      </div>
    );
  }

  if (token && isTokenError) {
    return (
      <div className="card p-12 max-w-xl mx-auto my-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Invalid or Expired Assessment Link</h2>
        <p className="text-xs text-slate-600">
          {(tokenError as any)?.response?.data?.message || 'This assessment invitation is either invalid, cancelled, or has already expired.'}
        </p>
        <button onClick={() => navigate('/candidate/assessments')} className="btn-primary text-xs mx-auto">
          Go to My Assessments
        </button>
      </div>
    );
  }

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
          onClick={() => {
            const search = window.location.search;
            navigate(`/candidate/assessments/${id}/take${search}`);
          }} 
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
