// ─────────────────────────────────────────────────────────────
// TalentForge AI — Evaluation Panel (recruiter sidebar)
// Live rating input while interview is in progress
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import type { FeedbackRating, HiringRecommendation } from '../../types/interview.types';
import { evaluationDimensions, ratingEmojis } from '../../constants/feedback.mock';

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
    {value > 0 && (
      <span className="ml-1 text-[10px] text-slate-400">{ratingEmojis[value as FeedbackRating]}</span>
    )}
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
            Object.values(ratings).filter(Boolean).length) *
            20
        )
      : 0;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 flex-shrink-0 bg-slate-50">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-900">Live Evaluation</p>
          {avgScore > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="text-xs font-bold text-white bg-primary-600 px-2 py-0.5 rounded-full">
                {avgScore}/100
              </div>
            </div>
          )}
        </div>
        <p className="text-[10px] text-slate-500 mt-0.5">Rate as the interview progresses</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Dimension ratings */}
        <div className="space-y-3">
          {evaluationDimensions.map(({ key, label, icon }) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{icon}</span>
                  <span className="text-xs font-medium text-slate-700">{label}</span>
                </div>
                <RatingInput
                  value={ratings[key] ?? 0}
                  onChange={(r) => setRatings((prev) => ({ ...prev, [key]: r }))}
                />
              </div>
              {/* Progress bar preview */}
              <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-300"
                  style={{ width: `${((ratings[key] ?? 0) / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Overall score preview */}
        {avgScore > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${(avgScore / 100) * 94.25} 94.25`}
                  style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[11px] font-bold text-slate-900">{avgScore}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Overall Score</p>
              <p className="text-[10px] text-slate-500">Based on your ratings</p>
            </div>
          </div>
        )}

        {/* Recommendation */}
        <div>
          <p className="text-xs font-bold text-slate-900 mb-2">Recommendation</p>
          <div className="grid grid-cols-2 gap-1.5">
            {RECOMMENDATIONS.map(({ value, label, color }) => (
              <button
                key={value}
                onClick={() => setRecommendation(recommendation === value ? null : value)}
                className={`py-2 text-[10px] font-bold rounded-lg transition-all ${
                  recommendation === value
                    ? color
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div>
          <p className="text-xs font-bold text-slate-900 mb-2">Quick Notes</p>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add observations during the interview..."
            rows={3}
            className="w-full bg-white text-slate-900 text-xs placeholder-slate-400 border border-slate-200 rounded-xl p-3 resize-none focus:outline-none focus:border-primary-500"
          />
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all ${
            saved
              ? 'bg-emerald-600 text-white'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
        >
          {saved ? '✓ Saved' : 'Save Evaluation'}
        </button>

        <p className="text-[10px] text-slate-500 text-center">
          Full evaluation can be submitted after the interview ends
        </p>
      </div>
    </div>
  );
};

export default EvaluationPanel;
