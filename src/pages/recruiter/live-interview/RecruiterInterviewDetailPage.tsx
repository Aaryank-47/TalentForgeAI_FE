// ─────────────────────────────────────────────────────────────
// TalentForge AI — Recruiter Interview Detail Page
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Clock, Video, Users, Play, RefreshCw,
  XCircle, MapPin, CheckCircle, FileText, Download, Edit3,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getInterviewById } from '../../../constants/interview.mock';
import { getRecruitersByIds, getCandidateById } from '../../../constants/participants.mock';
import { LiveInterviewStatusBadge } from '../../../components/live-interview/LiveInterviewStatusBadge';
import { RescheduleModal, CancelInterviewModal } from '../../../components/live-interview/InterviewModals';
import { mockRecruiterEvaluations } from '../../../constants/feedback.mock';

const RecruiterInterviewDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const interview = getInterviewById(id ?? '');
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'evaluation' | 'notes'>('overview');

  if (!interview) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-slate-500 text-sm">Interview not found.</p>
        <button onClick={() => navigate('/recruiter/live-interviews')} className="mt-4 btn-secondary text-sm">
          ← Back to Interviews
        </button>
      </div>
    );
  }

  const recruiters = getRecruitersByIds(interview.recruiterIds);
  const candidate = getCandidateById(interview.candidateId);
  const evaluation = mockRecruiterEvaluations.find((ev) => ev.interviewId === interview.id);
  const isActive = ['Scheduled', 'Upcoming', 'Today', 'Waiting'].includes(interview.status);
  const isLive = interview.status === 'Live';
  const isCompleted = interview.status === 'Completed';

  const handleReschedule = () => { toast.success('Interview rescheduled!'); setRescheduleOpen(false); };
  const handleCancel = () => { toast.error('Interview cancelled.'); setCancelOpen(false); };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('/recruiter/live-interviews')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Interviews
      </button>

      {/* Header card */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl ${interview.companyColor} flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md`}
            >
              {interview.companyLogo}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-xl font-display font-bold text-slate-900">{interview.title}</h1>
                <LiveInterviewStatusBadge status={interview.status} size="md" />
              </div>
              <p className="text-sm text-slate-500">{interview.company} · {interview.jobTitle}</p>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {interview.date}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {interview.timeStart} – {interview.timeEnd} ({interview.duration})
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {interview.timezone}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Video className="w-3.5 h-3.5 text-slate-400" />
                  <span className="capitalize">{interview.meetingType.replace('-', ' ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {(isActive || isLive) && (
              <button
                onClick={() => navigate(`/recruiter/live-interviews/${interview.id}/room`)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-colors ${
                  isLive
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'btn-primary'
                }`}
              >
                {isLive && <span className="w-2 h-2 rounded-full bg-white animate-recording-pulse" />}
                <Play className="w-4 h-4" />
                {isLive ? 'Join Live' : 'Start Interview'}
              </button>
            )}
            {isCompleted && (
              <button
                onClick={() => navigate(`/recruiter/live-interviews/${interview.id}/feedback`)}
                className="btn-primary text-sm flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                {evaluation ? 'View Evaluation' : 'Submit Evaluation'}
              </button>
            )}
            {isActive && (
              <>
                <button
                  onClick={() => setRescheduleOpen(true)}
                  className="btn-secondary text-sm flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reschedule
                </button>
                <button
                  onClick={() => setCancelOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-red-200 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E5E7EB]">
        <div className="flex gap-0">
          {(['overview', 'evaluation', 'notes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium border-b-2 capitalize transition-colors ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Candidate & Recruiters */}
          <div className="lg:col-span-2 space-y-5">
            {/* Candidate */}
            <div className="card p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                Candidate
              </h3>
              {candidate && (
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${candidate.avatarColor} flex items-center justify-center text-white font-bold flex-shrink-0`}
                  >
                    {candidate.initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{candidate.name}</p>
                    <p className="text-xs text-slate-500">{candidate.title} · {candidate.experience}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{candidate.email}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {candidate.skills.slice(0, 5).map((s) => (
                        <span key={s} className="text-[10px] bg-primary-50 text-primary-700 border border-primary-100 px-2 py-0.5 rounded-full font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs text-primary-600 font-semibold hover:text-primary-700">
                    <Download className="w-3.5 h-3.5" />
                    Resume
                  </button>
                </div>
              )}
            </div>

            {/* Interviewers */}
            <div className="card p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                Interview Panel ({recruiters.length})
              </h3>
              <div className="space-y-3">
                {recruiters.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div
                      className={`w-9 h-9 rounded-full bg-gradient-to-br ${r.avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                    >
                      {r.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-900">{r.name}</p>
                      <p className="text-[10px] text-slate-500">{r.title} · {r.email}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                      r.role === 'recruiter' ? 'bg-primary-100 text-primary-700' : 'bg-violet-100 text-violet-700'
                    }`}>
                      {r.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="card p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                Interview Instructions
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{interview.settings.instructions}</p>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: 'Camera', allowed: interview.settings.allowCamera },
                  { label: 'Microphone', allowed: interview.settings.allowMicrophone },
                  { label: 'Screen Share', allowed: interview.settings.allowScreenShare },
                ].map(({ label, allowed }) => (
                  <div key={label} className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium ${allowed ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    {allowed ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Meta */}
          <div className="space-y-4">
            <div className="card p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Interview Details</h3>
              {[
                { label: 'Type', value: interview.type },
                { label: 'Duration', value: interview.duration },
                { label: 'Meeting', value: interview.meetingType.replace('-', ' ') },
                { label: 'Timezone', value: interview.timezone },
                { label: 'Recording', value: interview.recordingEnabled ? 'Enabled' : 'Disabled' },
                { label: 'Room ID', value: interview.roomId ?? 'N/A' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start">
                  <span className="text-xs text-slate-400">{label}</span>
                  <span className="text-xs font-semibold text-slate-900 text-right capitalize max-w-[150px]">{value}</span>
                </div>
              ))}
            </div>

            {interview.notes && (
              <div className="card p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-slate-400" />
                  Recruiter Notes
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{interview.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'evaluation' && (
        <div className="max-w-2xl">
          {evaluation ? (
            <div className="card p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-display font-bold text-slate-900">Evaluation Summary</h3>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-display font-black text-primary-600">{evaluation.overallScore}</div>
                  <div className="text-xs text-slate-400">/100</div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Communication', score: evaluation.communication * 20 },
                  { label: 'Technical', score: evaluation.technical * 20 },
                  { label: 'Problem Solving', score: evaluation.problemSolving * 20 },
                  { label: 'Behaviour', score: evaluation.behaviour * 20 },
                  { label: 'Culture Fit', score: evaluation.cultureFit * 20 },
                ].map(({ label, score }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">{label}</span>
                      <span className="font-bold text-slate-800">{score}/100</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: `${score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-700 mb-1">Recommendation</p>
                <span className="inline-block px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">{evaluation.recommendation}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700 mb-2">Comments</p>
                <p className="text-xs text-slate-600 leading-relaxed">{evaluation.comments}</p>
              </div>
            </div>
          ) : (
            <div className="card p-10 text-center">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-900 mb-1">No evaluation yet</p>
              <p className="text-xs text-slate-500 mb-4">Submit an evaluation after the interview is completed.</p>
              <button
                onClick={() => navigate(`/recruiter/live-interviews/${interview.id}/feedback`)}
                className="btn-primary text-sm"
              >
                Submit Evaluation
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="card p-6 max-w-2xl">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Interview Notes</h3>
          <textarea
            defaultValue={interview.notes}
            rows={8}
            placeholder="Add notes about this interview..."
            className="input-field text-sm resize-none w-full"
          />
          <button
            onClick={() => toast.success('Notes saved!')}
            className="mt-3 btn-primary text-sm"
          >
            Save Notes
          </button>
        </div>
      )}

      {/* Modals */}
      <RescheduleModal
        isOpen={rescheduleOpen}
        interview={interview}
        onClose={() => setRescheduleOpen(false)}
        onConfirm={handleReschedule}
      />
      <CancelInterviewModal
        isOpen={cancelOpen}
        interview={interview}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
      />
    </div>
  );
};

export default RecruiterInterviewDetailPage;
