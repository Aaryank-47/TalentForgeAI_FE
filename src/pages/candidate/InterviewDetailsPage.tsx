import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Clock, Layers, Mic, Info, Target, ArrowLeft, Loader2 } from 'lucide-react';
import { interviewApi } from '../../services/api/interview.api';
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: realDetail, isLoading } = useQuery({
    queryKey: ['candidate-session-details', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const res: any = await interviewApi.getCandidateSessionDetails(id);
        return res?.data || res;
      } catch {
        return null;
      }
    },
    enabled: Boolean(id),
  });

  const fallbackDetail = aiInterviewData.interviewDetail;
  const detail = realDetail || fallbackDetail;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Stepper */}
      <div className="card p-4">
        <InterviewStepper steps={STEPS} currentStep={0} />
      </div>

      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
            {detail.companyLogo || (detail.company || 'TF').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-slate-900">{detail.role}</h1>
            <p className="text-slate-500">{detail.company} {detail.department ? `· ${detail.department}` : ''}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full border border-violet-200 font-semibold">{detail.interviewType || 'Conversational AI'}</span>
              <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200 font-semibold">{detail.language || 'English'}</span>
              {detail.difficulty && (
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-semibold">{detail.difficulty}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Key Details */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Clock className="w-5 h-5 text-primary-600" />, label: 'Estimated Time', value: detail.estimatedDuration || `${detail.durationMinutes || 25} mins`, bg: 'bg-blue-50' },
          { icon: <Layers className="w-5 h-5 text-violet-600" />, label: 'Questions', value: `${detail.questionCount || 5} Questions`, bg: 'bg-violet-50' },
          { icon: <Mic className="w-5 h-5 text-emerald-600" />, label: 'Format', value: 'Verbal / Voice & Text', bg: 'bg-emerald-50' },
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
          {(detail.format || [
            'One question presented dynamically by the AI interviewer at a time.',
            'Respond verbally using your microphone or type your answer.',
            'The AI evaluates your response depth and asks adaptive follow-ups.',
            'Session is timed and automatically evaluated upon completion.'
          ]).map((item: string, i: number) => (
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
          {(detail.evaluationCriteria || [
            { label: 'Technical Depth & Accuracy', weight: '40%' },
            { label: 'Problem Solving & Approach', weight: '30%' },
            { label: 'Communication & Articulation', weight: '20%' },
            { label: 'System Design & Best Practices', weight: '10%' }
          ]).map((c: any) => (
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
