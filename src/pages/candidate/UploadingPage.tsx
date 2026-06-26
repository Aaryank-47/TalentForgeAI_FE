import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { aiInterviewData } from '../../constants/candidate_mockData';
import { UploaderCard } from '../../components/interview/InterviewComponents';

type UploadStatus = 'pending' | 'uploading' | 'done' | 'error';

interface UploadStep {
  id: string;
  label: string;
  icon: string;
  detail: string;
  status: UploadStatus;
}

export default function UploadingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { uploadSteps, submission } = aiInterviewData;

  const [steps, setSteps] = useState<UploadStep[]>(
    uploadSteps.map(s => ({ ...s, status: 'pending' as UploadStatus }))
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);
  // Mock integrity summary from session storage or defaults
  const tabSwitches = 2;
  const noiseFlagsCount = 0;
  const faceStatus = 'Good';

  useEffect(() => {
    const STEP_DURATION = 2800;
    if (currentStep < steps.length) {
      // Start uploading current step
      setSteps(prev => prev.map((s, i) => i === currentStep ? { ...s, status: 'uploading' } : s));
      const t = setTimeout(() => {
        setSteps(prev => prev.map((s, i) => i === currentStep ? { ...s, status: 'done' } : s));
        setCurrentStep(prev => prev + 1);
      }, STEP_DURATION);
      return () => clearTimeout(t);
    } else if (currentStep === steps.length) {
      const t = setTimeout(() => setDone(true), 600);
      return () => clearTimeout(t);
    }
  }, [currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200">
            <span className="text-4xl">🤖</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900">
            {done ? 'Processing Complete!' : 'Submitting Your Interview'}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {done ? 'All data has been securely uploaded and analyzed.' : 'Please wait while we process and upload your responses…'}
          </p>
        </div>

        {/* Upload Steps */}
        <div className="space-y-3 mb-6">
          {steps.map(step => (
            <UploaderCard
              key={step.id}
              icon={step.icon}
              label={step.label}
              detail={step.detail}
              status={step.status}
            />
          ))}
        </div>

        {/* Overall progress */}
        <div className="card p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">Overall Progress</span>
            <span className="text-sm font-bold text-primary-600">
              {Math.min(Math.round((currentStep / steps.length) * 100), 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full bg-primary-600 transition-all duration-700"
              style={{ width: `${Math.min((currentStep / steps.length) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Integrity Summary */}
        <div className="card p-4 mb-6">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-3">Session Summary</p>
          <div className="grid grid-cols-3 gap-3">
            <div className={`p-3 rounded-xl text-center border ${tabSwitches > 0 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
              <p className={`text-xl font-black tabular-nums ${tabSwitches > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{tabSwitches}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Tab Switches</p>
            </div>
            <div className={`p-3 rounded-xl text-center border ${noiseFlagsCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
              <p className={`text-xl font-black tabular-nums ${noiseFlagsCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{noiseFlagsCount}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Noise Flags</p>
            </div>
            <div className={`p-3 rounded-xl text-center border ${faceStatus === 'Good' || faceStatus === 'Excellent' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              <p className={`text-sm font-black ${faceStatus === 'Good' || faceStatus === 'Excellent' ? 'text-emerald-600' : 'text-amber-600'}`}>{faceStatus}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Face Visibility</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 text-center">This summary will be included in the recruiter's report.</p>
        </div>

        {/* Done state: navigate to submission */}
        {done && (
          <button
            onClick={() => navigate(`/candidate/ai-interview/${id}/submitted`)}
            className="btn-primary w-full text-sm py-3 animate-fade-in-up"
          >
            View Submission Confirmation →
          </button>
        )}

        {!done && (
          <p className="text-center text-xs text-slate-400">Do not close this tab. Upload in progress…</p>
        )}
      </div>
    </div>
  );
}
