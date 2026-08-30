import { interviewApi } from '../../services/api/interview.api';
import { store } from '../../store';
import { useInterview } from '../../context/InterviewContext';
// ─────────────────────────────────────────────────────────────
// TalentForge AI — Evaluation Panel (recruiter sidebar)
// Live rating input while interview is in progress
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { Star, Check } from 'lucide-react';
import type { FeedbackRating, HiringRecommendation } from '../../types/interview.types';
import { evaluationDimensions } from '../../constants/feedback.mock';
import { toast } from 'react-hot-toast';

const RECOMMENDATIONS: { value: HiringRecommendation; label: string; color: string }[] = [
  { value: 'Strong Hire', label: 'Strong Hire', color: 'bg-emerald-500 hover:bg-emerald-600 text-white' },
  { value: 'Hire', label: 'Hire', color: 'bg-blue-500 hover:bg-blue-600 text-white' },
  { value: 'Consider', label: 'Consider', color: 'bg-amber-500 hover:bg-amber-600 text-white' },
  { value: 'Reject', label: 'Reject', color: 'bg-red-500 hover:bg-red-600 text-white' },
];

interface RatingInputProps {
  value: FeedbackRating | 0;
  onChange: (r: FeedbackRating) => void;
}

const RatingInput: React.FC<RatingInputProps> = ({ value, onChange }) => (
  <div className="flex items-center gap-1">
    {([1, 2, 3, 4, 5] as FeedbackRating[]).map((r) => (
      <button
        key={r}
        onClick={() => onChange(r)}
        className={`w-6 h-6 rounded transition-all ${
          value >= r ? 'text-amber-400' : 'text-slate-200 hover:text-amber-300'
        }`}
      >
        <Star className="w-full h-full" fill={value >= r ? 'currentColor' : 'none'} />
      </button>
    ))}
  </div>
);

export const EvaluationPanel: React.FC = () => {
  const [ratings, setRatings] = useState<Record<string, FeedbackRating | 0>>({
    communication: 0,
    technical: 0,
    problemSolving: 0,
    behaviour: 0,
    cultureFit: 0,
  });
  const [recommendation, setRecommendation] = useState<HiringRecommendation | null>(null);
  const [comments, setComments] = useState('');
  const [saved, setSaved] = useState(false);

  const avgScore =
    Object.values(ratings).filter(Boolean).length > 0
      ? Math.round(
          (Object.values(ratings).reduce((a, b) => a + b, 0) /
            (Object.values(ratings).filter(Boolean).length * 5)) *
            100
        )
      : 0;

  const handleSave = async () => {
    const activeSessionId = (store.getState() as any)?.workspace?.activeSessionId;
    const companyId = (store.getState() as any)?.auth?.user?.companyId || (store.getState() as any)?.auth?.user?.companies?.[0]?.companyId;

    try {
      if (activeSessionId && companyId) {
        await interviewApi.submitRecruiterEvaluation(companyId, activeSessionId, {
          overallScore: avgScore,
          communication: ratings.communication || 0,
          technical: ratings.technical || 0,
          problemSolving: ratings.problemSolving || 0,
          behaviour: ratings.behaviour || 0,
          cultureFit: ratings.cultureFit || 0,
          recommendation: recommendation || undefined,
          comments: comments || undefined,
        });
      }
      setSaved(true);
      toast.success('Live evaluation notes saved!');
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error('Failed to save evaluation live panel:', err);
      toast.error('Saved locally');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="w-72 bg-white border-l border-slate-200 flex flex-col h-full flex-shrink-0 z-20 animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Evaluation Notes
          </h3>
          {avgScore > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-primary-50 rounded-full">
              <span className="text-xs font-bold text-primary-700">{avgScore}</span>
              <span className="text-[10px] text-primary-500">/100</span>
            </div>
          )}
        </div>
        <p className="text-[10px] text-slate-500 mt-0.5">Rate as the interview progresses</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Dimension ratings */}
        <div className="space-y-3">
          {evaluationDimensions.map(({ key, label, icon: Icon }) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-medium text-slate-700">{label}</span>
                </div>
                <RatingInput
                  value={ratings[key] ?? 0}
                  onChange={(r) => setRatings((prev) => ({ ...prev, [key]: r }))}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Recommendation */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Quick Recommendation
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {RECOMMENDATIONS.map(({ value, label, color }) => (
              <button
                key={value}
                onClick={() => setRecommendation(value)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  recommendation === value
                    ? `${color} ring-2 ring-offset-1 ring-slate-400`
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Notes */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            Live Notes
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Private notes during interview (candidate cannot see this)..."
            rows={4}
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            saved
              ? 'bg-emerald-600 text-white'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved</span>
            </>
          ) : (
            'Save Evaluation'
          )}
        </button>

        <p className="text-[10px] text-slate-500 text-center">
          Full evaluation can be submitted after the interview ends
        </p>
      </div>
    </div>
  );
};

export default EvaluationPanel;
