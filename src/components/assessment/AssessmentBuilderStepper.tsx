import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
  description: string;
}

interface AssessmentBuilderStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
}

const AssessmentBuilderStepper: React.FC<AssessmentBuilderStepperProps> = ({
  steps, currentStep, onStepClick,
}) => {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, i) => {
        const done = step.id < currentStep;
        const active = step.id === currentStep;
        const isLast = i === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div
              className={`flex flex-col items-center gap-1.5 flex-shrink-0 ${done && onStepClick ? 'cursor-pointer' : ''}`}
              onClick={() => done && onStepClick?.(step.id)}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm ${
                done
                  ? 'bg-emerald-500 text-white'
                  : active
                  ? 'bg-primary-600 text-white shadow-primary-600/30 shadow-md'
                  : 'bg-slate-100 text-slate-400 border-2 border-slate-200'
              }`}>
                {done ? <Check className="w-4 h-4" /> : <span>{step.id}</span>}
              </div>
              <div className="text-center hidden sm:block">
                <p className={`text-[11px] font-semibold whitespace-nowrap ${
                  active ? 'text-primary-700' : done ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  {step.label}
                </p>
                <p className={`text-[10px] whitespace-nowrap ${active ? 'text-primary-500' : 'text-slate-400'}`}>
                  {step.description}
                </p>
              </div>
            </div>

            {!isLast && (
              <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${done ? 'bg-emerald-400' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default AssessmentBuilderStepper;
