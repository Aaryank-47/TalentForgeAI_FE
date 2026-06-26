import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { aiInterviewData } from '../../constants/candidate_mockData';
import { InterviewStepper } from '../../components/interview/InterviewComponents';

const STEPS = [
  { label: 'Details' },
  { label: 'Preparation' },
  { label: 'System Check' },
  { label: 'Consent' },
  { label: 'Waiting Room' },
  { label: 'Interview' },
];

export default function PreparationCenterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { preparation, interviewDetail } = aiInterviewData;
  const [checklist, setChecklist] = useState(preparation.environmentChecklist.map(i => ({ ...i })));
  const [expandedPractice, setExpandedPractice] = useState<number | null>(null);

  const toggleCheck = (idx: number) => {
    setChecklist(prev => prev.map((item, i) => i === idx ? { ...item, done: !item.done } : item));
  };

  const allChecked = checklist.every(i => i.done);
  const doneCount = checklist.filter(i => i.done).length;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Stepper */}
      <div className="card p-4">
        <InterviewStepper steps={STEPS} currentStep={1} />
      </div>

      <div>
        <h1 className="text-xl font-display font-bold text-slate-900">Preparation Center</h1>
        <p className="text-sm text-slate-500 mt-1">Get yourself ready before the interview begins.</p>
      </div>

      {/* Interview Tips */}
      <div className="card p-5">
        <h3 className="font-bold text-slate-900 mb-4">Interview Tips</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {preparation.tips.map(tip => (
            <div key={tip.title} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="text-2xl mb-2">{tip.icon}</div>
              <p className="text-sm font-semibold text-slate-800 mb-1">{tip.title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
            <div className="text-2xl mb-2">🌐</div>
            <p className="text-sm font-semibold text-primary-800 mb-1">Stable Internet</p>
            <p className="text-xs text-primary-600 leading-relaxed">Use a stable Wi-Fi connection. Avoid switching networks during the interview.</p>
          </div>
        </div>
      </div>

      {/* Environment Checklist */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">Environment Checklist</h3>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${allChecked ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
            {doneCount}/{checklist.length} Done
          </span>
        </div>
        <div className="space-y-2">
          {checklist.map((item, i) => (
            <button
              key={item.id}
              onClick={() => toggleCheck(i)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${item.done ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-primary-200 hover:bg-primary-50/30'}`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                {item.done && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className={`text-sm ${item.done ? 'text-emerald-800 line-through opacity-70' : 'text-slate-700'}`}>{item.label}</span>
            </button>
          ))}
        </div>
        {!allChecked && (
          <p className="text-xs text-amber-600 mt-3 text-center">Complete all checklist items before proceeding</p>
        )}
      </div>

      {/* Practice Questions */}
      <div className="card p-5">
        <h3 className="font-bold text-slate-900 mb-4">Practice Questions</h3>
        <p className="text-xs text-slate-500 mb-3">Practice answering these out loud to warm up.</p>
        <div className="space-y-2">
          {preparation.practiceQuestions.map((q, i) => (
            <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedPractice(expandedPractice === i ? null : i)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <span className="text-sm text-slate-700 font-medium">{q}</span>
                </div>
                {expandedPractice === i ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
              </button>
              {expandedPractice === i && (
                <div className="px-4 pb-4 bg-slate-50 border-t border-slate-200">
                  <div className="mt-3 p-3 bg-primary-50 rounded-xl border border-primary-100">
                    <p className="text-xs text-primary-700 font-semibold mb-1">💡 Tip: Use the STAR method</p>
                    <p className="text-xs text-primary-600">Structure your answer: <strong>S</strong>ituation → <strong>T</strong>ask → <strong>A</strong>ction → <strong>R</strong>esult</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* About this interview */}
      <div className="card p-4 bg-blue-50 border-blue-200">
        <p className="text-xs text-blue-700 font-semibold mb-1">📋 About Your Interview</p>
        <p className="text-xs text-blue-600">
          You will be answering {interviewDetail.questionCount} questions in approximately {interviewDetail.estimatedDuration}.
          The AI interviewer will ask each question verbally. Wait for it to finish before responding.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(`/candidate/ai-interview/${id}/details`)} className="btn-secondary flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={() => navigate(`/candidate/ai-interview/${id}/system-check`)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          System Check <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
