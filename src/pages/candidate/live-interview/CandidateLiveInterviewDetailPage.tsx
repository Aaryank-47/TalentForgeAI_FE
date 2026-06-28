// ─────────────────────────────────────────────────────────────
// TalentForge AI — Candidate Interview Detail Page
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Clock, Video, Users, CheckCircle,
  XCircle, MapPin, Info, Play,
} from 'lucide-react';
import { getInterviewById } from '../../../constants/interview.mock';
import { getRecruitersByIds } from '../../../constants/participants.mock';
import { LiveInterviewStatusBadge } from '../../../components/live-interview/LiveInterviewStatusBadge';

const CandidateLiveInterviewDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const interview = getInterviewById(id ?? '');

  if (!interview) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-slate-500 text-sm">Interview not found.</p>
        <button onClick={() => navigate('/candidate/live-interviews')} className="mt-4 btn-secondary text-sm">
          ← Back
        </button>
      </div>
    );
  }

  const recruiters = getRecruitersByIds(interview.recruiterIds);
  const isJoinable = ['Live', 'Waiting', 'Today', 'Upcoming'].includes(interview.status);
  const isCompleted = interview.status === 'Completed';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('/candidate/live-interviews')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        My Interviews
      </button>

      {/* Hero */}
      <div className="card p-6">
        <div className="flex items-start gap-5 flex-wrap">
          <div
            className={`w-16 h-16 rounded-2xl ${interview.companyColor} flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg`}
          >
            {interview.companyLogo}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-xl font-display font-bold text-slate-900">{interview.title}</h1>
              <LiveInterviewStatusBadge status={interview.status} size="md" />
            </div>
            <p className="text-sm text-slate-500">{interview.company} · {interview.jobTitle}</p>

            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {interview.date}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {interview.timeStart} – {interview.timeEnd}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Video className="w-3.5 h-3.5 text-slate-400" />
                <span className="capitalize">{interview.meetingType.replace('-', ' ')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {interview.timezone}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-3 mt-6 flex-wrap">
          {isJoinable && (
            <button
              onClick={() => navigate(`/candidate/live-interviews/${interview.id}/room`)}
              id="join-interview-btn"
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-colors ${
                interview.status === 'Live'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'btn-primary'
              }`}
            >
              {interview.status === 'Live' && (
                <span className="w-2 h-2 bg-white rounded-full animate-recording-pulse" />
              )}
              <Play className="w-4 h-4" />
              {interview.status === 'Live' ? 'Join Now' : 'Join Interview'}
            </button>
          )}
          {isCompleted && (
            <button
              onClick={() => navigate(`/candidate/live-interviews/${interview.id}/feedback`)}
              className="btn-primary text-sm"
            >
              Submit Feedback
            </button>
          )}
        </div>
      </div>

      {/* Interviewers */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-400" />
          Your Interview Panel
        </h3>
        <div className="space-y-3">
          {recruiters.map((r) => (
            <div key={r.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${r.avatarColor} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
              >
                {r.initials}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{r.name}</p>
                <p className="text-xs text-slate-500">{r.title}</p>
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
          <Info className="w-4 h-4 text-slate-400" />
          Instructions for You
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          {interview.settings.instructions}
        </p>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Camera', allowed: interview.settings.allowCamera },
            { label: 'Microphone', allowed: interview.settings.allowMicrophone },
            { label: 'Screen Share', allowed: interview.settings.allowScreenShare },
          ].map(({ label, allowed }) => (
            <div
              key={label}
              className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium ${
                allowed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              {allowed ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Tech check reminder */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-blue-900 mb-2">⚙️ Before You Join</h3>
        <ul className="space-y-1.5 text-xs text-blue-700">
          {[
            'Test your microphone and camera in browser settings',
            'Ensure you have a stable internet connection (>5 Mbps)',
            'Use Chrome or Edge for best compatibility',
            'Close unnecessary browser tabs',
            'Join 2-3 minutes early',
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2">
              <span className="font-bold flex-shrink-0">·</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CandidateLiveInterviewDetailPage;
