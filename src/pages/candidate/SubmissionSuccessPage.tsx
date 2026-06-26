import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Home, Clock, FileText, Copy } from 'lucide-react';
import { aiInterviewData } from '../../constants/candidate_mockData';

export default function SubmissionSuccessPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { submission } = aiInterviewData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="relative inline-flex">
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle className="w-14 h-14 text-emerald-500" />
            </div>
            {/* Rings */}
            <div className="absolute inset-0 rounded-full border-2 border-emerald-300 animate-mic-pulse opacity-60" />
            <div className="absolute -inset-3 rounded-full border-2 border-emerald-200 animate-mic-pulse opacity-40" style={{ animationDelay: '0.4s' }} />
          </div>
          <h1 className="text-3xl font-display font-black text-slate-900 mt-6">Submitted!</h1>
          <p className="text-slate-500 mt-2">Your interview has been submitted successfully.</p>
        </div>

        {/* Submission Card */}
        <div className="card p-6 mb-5">
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
            <div className={`w-14 h-14 ${submission.companyColor} rounded-2xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0`}>
              {submission.companyLogo}
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{submission.role}</h3>
              <p className="text-sm text-slate-500">{submission.company}</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Submission Time', value: submission.submittedAt, icon: <Clock className="w-4 h-4 text-slate-400" /> },
              { label: 'Status', value: submission.status, icon: <FileText className="w-4 h-4 text-slate-400" />, highlight: true },
              { label: 'Expected Completion', value: submission.expectedCompletion, icon: <Clock className="w-4 h-4 text-slate-400" /> },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  {item.icon}
                  {item.label}
                </div>
                <span className={`text-sm font-semibold ${item.highlight ? 'text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200' : 'text-slate-800'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Confirmation Code */}
          <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Confirmation Code</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5 font-mono">{submission.confirmationCode}</p>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* What's next */}
        <div className="card p-4 mb-5 bg-blue-50 border-blue-200">
          <p className="text-xs font-bold text-blue-800 mb-2">What happens next?</p>
          <ol className="space-y-1.5">
            {[
              'Your responses are being analyzed by our AI',
              'A full evaluation report is being generated',
              'The recruiter will review within 24–48 hours',
              'You\'ll receive an email notification with the outcome',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-blue-700">
                <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-800 text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/candidate/ai-interview/${id}/status`)}
            className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            View Interview Status
          </button>
          <button
            onClick={() => navigate('/candidate/ai-interview')}
            className="btn-secondary w-full py-3 text-sm flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
