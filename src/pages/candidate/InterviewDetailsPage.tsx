import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Clock, Layers, Mic, Info, Target, ArrowLeft } from 'lucide-react';
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

export default function InterviewDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const detail = aiInterviewData.interviewDetail;
  const pending = aiInterviewData.pendingInterviews.find(iv => iv.id === id) || aiInterviewData.pendingInterviews[0];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Stepper */}
      <div className="card p-4">
        <InterviewStepper steps={STEPS} currentStep={0} />
      </div>

      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 ${pending.companyColor} rounded-2xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0`}>
            {pending.companyLogo}
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-slate-900">{detail.role}</h1>
            <p className="text-slate-500">{detail.company} · {detail.department}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full border border-violet-200 font-semibold">{detail.interviewType}</span>
              <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200 font-semibold">{detail.language}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Details */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Clock className="w-5 h-5 text-primary-600" />, label: 'Estimated Time', value: detail.estimatedDuration, bg: 'bg-blue-50' },
          { icon: <Layers className="w-5 h-5 text-violet-600" />, label: 'Questions', value: `${detail.questionCount} Questions`, bg: 'bg-violet-50' },
          { icon: <Mic className="w-5 h-5 text-emerald-600" />, label: 'Format', value: 'Verbal Only', bg: 'bg-emerald-50' },
        ].map(item => (
          <div key={item.label} className="card p-4 text-center">
            <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              {item.icon}
            </div>
            <p className="text-xs text-slate-500 font-medium">{item.label}</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Format */}
      <div className="card p-5">
        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-primary-500" /> Interview Format
        </h3>
        <ul className="space-y-2">
          {detail.format.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
              <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Evaluation Criteria */}
      <div className="card p-5">
        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-500" /> Evaluation Criteria
        </h3>
        <div className="space-y-2.5">
          {detail.evaluationCriteria.map(c => (
            <div key={c.label} className="flex items-center justify-between">
              <span className="text-sm text-slate-700">{c.label}</span>
              <span className="text-sm font-bold text-primary-600">{c.weight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/candidate/ai-interview')} className="btn-secondary flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={() => navigate(`/candidate/ai-interview/${id}/preparation`)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          Start Preparation <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
