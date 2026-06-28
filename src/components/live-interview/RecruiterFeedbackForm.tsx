// ─────────────────────────────────────────────────────────────
// TalentForge AI — Recruiter Post-Interview Evaluation Form
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { Star, CheckCircle, Send, Plus, X } from 'lucide-react';
import type { FeedbackRating, HiringRecommendation } from '../../types/interview.types';
import { evaluationDimensions, ratingLabels, ratingEmojis } from '../../constants/feedback.mock';

const RECOMMENDATIONS: { value: HiringRecommendation; label: string; emoji: string; color: string; selected: string }[] = [
  { value: 'Strong Hire', label: 'Strong Hire', emoji: '🚀', color: 'border-emerald-200 bg-emerald-50 text-emerald-700', selected: 'border-emerald-400 bg-emerald-100 text-emerald-800 ring-2 ring-emerald-300' },
  { value: 'Hire', label: 'Hire', emoji: '✅', color: 'border-blue-200 bg-blue-50 text-blue-700', selected: 'border-blue-400 bg-blue-100 text-blue-800 ring-2 ring-blue-300' },
  { value: 'Consider', label: 'Consider', emoji: '🤔', color: 'border-amber-200 bg-amber-50 text-amber-700', selected: 'border-amber-400 bg-amber-100 text-amber-800 ring-2 ring-amber-300' },
  { value: 'Reject', label: 'Reject', emoji: '❌', color: 'border-red-200 bg-red-50 text-red-600', selected: 'border-red-400 bg-red-100 text-red-700 ring-2 ring-red-300' },
  { value: 'Strong Reject', label: 'Strong Reject', emoji: '🚫', color: 'border-red-300 bg-red-100 text-red-700', selected: 'border-red-500 bg-red-200 text-red-900 ring-2 ring-red-400' },
];

interface StarRatingProps {
  value: FeedbackRating | 0;
  onChange: (r: FeedbackRating) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex gap-1">
      {([1, 2, 3, 4, 5] as FeedbackRating[]).map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          className={`w-7 h-7 transition-all hover:scale-110 ${
            value >= r ? 'text-amber-400' : 'text-slate-300 hover:text-amber-300'
          }`}
        >
          <Star className="w-full h-full" fill={value >= r ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
    {value > 0 && (
      <span className="text-xs font-medium text-slate-500">
        {ratingEmojis[value as FeedbackRating]} {ratingLabels[value as FeedbackRating]}
      </span>
    )}
  </div>
);

interface RecruiterFeedbackFormProps {
  candidateName: string;
  interviewTitle: string;
  onSubmit: (data: Record<string, unknown>) => void;
}

export const RecruiterFeedbackForm: React.FC<RecruiterFeedbackFormProps> = ({
  candidateName,
  interviewTitle,
  onSubmit,
}) => {
  const [ratings, setRatings] = useState<Record<string, FeedbackRating | 0>>({
    communication: 0,
    technical: 0,
    problemSolving: 0,
    behaviour: 0,
    cultureFit: 0,
  });
  const [recommendation, setRecommendation] = useState<HiringRecommendation | null>(null);
  const [comments, setComments] = useState('');
  const [strength, setStrength] = useState('');
  const [strengths, setStrengths] = useState<string[]>([]);
  const [improvement, setImprovement] = useState('');
  const [improvements, setImprovements] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const avgScore =
    Object.values(ratings).filter(Boolean).length === Object.values(ratings).length
      ? Math.round(
          (Object.values(ratings).reduce((a, b) => a + b, 0) /
            Object.values(ratings).length) * 20
        )
      : 0;

  const allRated = Object.values(ratings).every((r) => r > 0) && recommendation !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allRated) return;
    onSubmit({ ...ratings, recommendation, comments, strengths, improvements, overallScore: avgScore });
    setSubmitted(true);
  };

  const addStrength = () => {
    if (strength.trim()) {
      setStrengths((prev) => [...prev, strength.trim()]);
      setStrength('');
    }
  };
  const addImprovement = () => {
    if (improvement.trim()) {
      setImprovements((prev) => [...prev, improvement.trim()]);
      setImprovement('');
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-fade-in-up">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Evaluation Submitted</h2>
        <p className="text-slate-500 max-w-md leading-relaxed">
          Your evaluation of <strong>{candidateName}</strong> has been saved. The hiring team can now review your assessment.
        </p>
        {recommendation && (
          <div className="mt-5 px-6 py-3 bg-primary-50 border border-primary-100 rounded-xl">
            <p className="text-sm font-bold text-primary-700">Your Recommendation: {recommendation}</p>
            {avgScore > 0 && <p className="text-xs text-primary-500 mt-0.5">Overall Score: {avgScore}/100</p>}
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Context */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 text-white">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
          Candidate Evaluation
        </p>
        <h3 className="text-base font-display font-bold">{candidateName}</h3>
        <p className="text-sm text-slate-300 mt-0.5">{interviewTitle}</p>
        {avgScore > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <div className="text-2xl font-display font-black">{avgScore}</div>
            <div className="text-sm text-slate-400">/100 avg score</div>
          </div>
        )}
      </div>

      {/* Skill Ratings */}
      <div className="card p-5 space-y-5">
        <h4 className="text-sm font-bold text-slate-900">Skill Assessment</h4>
        {evaluationDimensions.map(({ key, label, icon }) => (
          <div key={key} className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{icon}</span>
              <p className="text-sm text-slate-700 font-medium">{label}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <StarRating
                value={ratings[key] ?? 0}
                onChange={(r) => setRatings((prev) => ({ ...prev, [key]: r }))}
              />
              {ratings[key] > 0 && (
                <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${((ratings[key]) / 5) * 100}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div className="card p-5">
        <h4 className="text-sm font-bold text-slate-900 mb-3">Hiring Recommendation <span className="text-red-500">*</span></h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {RECOMMENDATIONS.map(({ value, label, emoji, color, selected }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRecommendation(value)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                recommendation === value ? selected : color + ' hover:opacity-90'
              }`}
            >
              <span className="text-base">{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Strengths */}
      <div className="card p-5">
        <h4 className="text-sm font-bold text-slate-900 mb-3">Strengths Observed</h4>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={strength}
            onChange={(e) => setStrength(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addStrength())}
            placeholder="Add a strength and press Enter..."
            className="input-field text-sm flex-1"
          />
          <button type="button" onClick={addStrength} className="btn-secondary px-3 py-2">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {strengths.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {strengths.map((s, i) => (
              <span key={i} className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full font-medium">
                {s}
                <button type="button" onClick={() => setStrengths((prev) => prev.filter((_, j) => j !== i))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Improvements */}
      <div className="card p-5">
        <h4 className="text-sm font-bold text-slate-900 mb-3">Areas for Improvement</h4>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={improvement}
            onChange={(e) => setImprovement(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImprovement())}
            placeholder="Add an area and press Enter..."
            className="input-field text-sm flex-1"
          />
          <button type="button" onClick={addImprovement} className="btn-secondary px-3 py-2">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {improvements.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {improvements.map((s, i) => (
              <span key={i} className="flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full font-medium">
                {s}
                <button type="button" onClick={() => setImprovements((prev) => prev.filter((_, j) => j !== i))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Comments */}
      <div className="card p-5">
        <h4 className="text-sm font-bold text-slate-900 mb-2">Detailed Comments</h4>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Share your overall assessment of the candidate's performance..."
          rows={5}
          className="input-field text-sm resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={!allRated}
        className="w-full btn-primary py-3.5 text-base font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5" />
        Submit Evaluation
      </button>

      {!allRated && (
        <p className="text-xs text-slate-400 text-center">
          Please rate all skills and select a recommendation.
        </p>
      )}
    </form>
  );
};

export default RecruiterFeedbackForm;
