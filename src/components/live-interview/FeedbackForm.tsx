// ─────────────────────────────────────────────────────────────
// TalentForge AI — Candidate Post-Interview Feedback Form
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { Star, CheckCircle, Send } from 'lucide-react';
import type { FeedbackRating } from '../../types/interview.types';
import { ratingLabels, ratingEmojis } from '../../constants/feedback.mock';

interface FeedbackFormProps {
  interviewTitle: string;
  company: string;
  recruiterName: string;
  onSubmit: (data: Record<string, FeedbackRating | string | boolean>) => void;
}

const RATING_CATEGORIES = [
  { key: 'recruiterRating', label: 'Recruiter / Interviewer', icon: '👤', description: 'How was the interviewer?' },
  { key: 'companyRating', label: 'Company Impression', icon: '🏢', description: 'How do you feel about the company?' },
  { key: 'experienceRating', label: 'Interview Experience', icon: '🎯', description: 'How was the overall experience?' },
  { key: 'platformRating', label: 'Platform Experience', icon: '💻', description: 'How was TalentForge AI platform?' },
];

interface StarRatingProps {
  value: FeedbackRating | 0;
  onChange: (r: FeedbackRating) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange }) => (
  <div className="flex items-center gap-2">
    <div className="flex gap-1">
      {([1, 2, 3, 4, 5] as FeedbackRating[]).map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          className={`w-8 h-8 transition-all hover:scale-110 ${
            value >= r ? 'text-amber-400' : 'text-slate-300 hover:text-amber-300'
          }`}
        >
          <Star className="w-full h-full" fill={value >= r ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
    {value > 0 && (
      <span className="text-sm font-medium text-slate-600 flex items-center gap-1">
        <span>{ratingEmojis[value as FeedbackRating]}</span>
        <span>{ratingLabels[value as FeedbackRating]}</span>
      </span>
    )}
  </div>
);

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  interviewTitle,
  company,
  recruiterName,
  onSubmit,
}) => {
  const [ratings, setRatings] = useState<Record<string, FeedbackRating | 0>>({
    recruiterRating: 0,
    companyRating: 0,
    experienceRating: 0,
    platformRating: 0,
  });
  const [comments, setComments] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const allRated = Object.values(ratings).every((r) => r > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allRated) return;
    const overallRating = Math.round(
      Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length
    ) as FeedbackRating;
    onSubmit({
      ...ratings,
      overallRating,
      comments,
      wouldRecommend: wouldRecommend ?? false,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-fade-in-up">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Thank you! 🎉</h2>
        <p className="text-slate-500 max-w-md leading-relaxed">
          Your feedback helps us improve the interview experience for everyone. We truly appreciate you taking the time.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Context */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100 rounded-2xl p-5">
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-1">
          Interview Completed
        </p>
        <h3 className="text-base font-display font-bold text-slate-900">{interviewTitle}</h3>
        <p className="text-sm text-slate-600 mt-0.5">
          {company} · Interviewer: {recruiterName}
        </p>
      </div>

      {/* Rating categories */}
      <div className="space-y-4">
        {RATING_CATEGORIES.map(({ key, label, icon, description }) => (
          <div key={key} className="card p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{icon}</span>
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                </div>
                <p className="text-xs text-slate-500">{description}</p>
              </div>
              <StarRating
                value={ratings[key] ?? 0}
                onChange={(r) => setRatings((prev) => ({ ...prev, [key]: r }))}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Would recommend */}
      <div className="card p-5">
        <p className="text-sm font-semibold text-slate-900 mb-3">
          Would you recommend this company to other candidates?
        </p>
        <div className="flex gap-3">
          {[
            { value: true, label: '👍 Yes, definitely', color: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
            { value: false, label: '👎 Not really', color: 'border-red-200 bg-red-50 text-red-600' },
          ].map(({ value, label, color }) => (
            <button
              key={String(value)}
              type="button"
              onClick={() => setWouldRecommend(value)}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl border-2 transition-all ${
                wouldRecommend === value
                  ? color
                  : 'border-[#E5E7EB] text-slate-600 hover:border-slate-300 bg-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div className="card p-5">
        <label className="text-sm font-semibold text-slate-900 block mb-2">
          Additional Comments
        </label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Share anything else about your experience..."
          rows={4}
          className="input-field text-sm resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!allRated}
        className="w-full btn-primary py-3.5 text-base font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5" />
        Submit Feedback
      </button>

      {!allRated && (
        <p className="text-xs text-slate-400 text-center">
          Please rate all categories before submitting.
        </p>
      )}
    </form>
  );
};

export default FeedbackForm;
