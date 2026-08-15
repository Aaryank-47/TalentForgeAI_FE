// ─────────────────────────────────────────────────────────────
// TalentForge AI — Candidate Interview Detail Page (Phase 6)
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Clock, Video, Users, CheckCircle,
  XCircle, MapPin, Info, Play,
} from 'lucide-react';
import {
  getInterviewSessionById,
  toLiveInterview
} from '../../../services/interviewSession.service';
import type { InterviewSession } from '../../../types/interviewSession.types';
import { LiveInterviewStatusBadge } from '../../../components/live-interview/LiveInterviewStatusBadge';

const CandidateLiveInterviewDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<InterviewSession | undefined>(undefined);

  useEffect(() => {
    if (id) {
      const found = getInterviewSessionById(id);
      setSession(found);
    }
  }, [id]);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-slate-500 text-sm">Interview Session not found.</p>
        <button onClick={() => navigate('/candidate/live-interviews')} className="mt-4 btn-secondary text-sm">
          ← Back
        </button>
      </div>
    );
  }

  const mappedInterview = toLiveInterview(session);
  const isJoinable = ['SCHEDULED', 'IN_PROGRESS', 'Upcoming', 'Live', 'Today'].includes(session.status);
  const isCompleted = session.status === 'COMPLETED';

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
            className={`w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg`}
          >
            TF
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-xl font-display font-bold text-slate-900">{mappedInterview.title}</h1>
              <LiveInterviewStatusBadge status={mappedInterview.status} size="md" />
            </div>
            <p className="text-sm text-slate-500">{session.job?.title} · {session.interview?.mode} Session</p>

            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {mappedInterview.date}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {mappedInterview.timeStart} – {mappedInterview.timeEnd}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Video className="w-3.5 h-3.5 text-slate-400" />
                <span className="capitalize">Video Room</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {mappedInterview.timezone}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-3 mt-6 flex-wrap">
          {isJoinable && (
            <button
              onClick={() => navigate(`/candidate/live-interviews/${session.id}/room`)}
              id="join-interview-btn"
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-colors ${
                session.status === 'IN_PROGRESS'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'btn-primary'
              }`}
            >
              {session.status === 'IN_PROGRESS' && (
                <span className="w-2 h-2 bg-white rounded-full animate-recording-pulse" />
              )}
              <Play className="w-4 h-4" />
              {session.status === 'IN_PROGRESS' ? 'Join Now' : 'Join Interview'}
            </button>
          )}
          {isCompleted && (
            <button
              onClick={() => navigate(`/candidate/live-interviews/${session.id}/feedback`)}
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
          {session.interviewers?.map((r) => (
            <div key={r.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${r.avatarColor || 'from-slate-400 to-slate-600'} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
              >
                {r.initials}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{r.name}</p>
                <p className="text-xs text-slate-500">{r.role}</p>
              </div>
              <span className="text-[10px] bg-violet-100 text-violet-700 font-semibold px-2 py-0.5 rounded-full capitalize">
                Interviewer
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
          Please ensure a quiet environment with good lighting. Keep your camera on throughout the interview. You may be asked to share your screen for coding tasks.
        </p>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Camera', allowed: true },
            { label: 'Microphone', allowed: true },
            { label: 'Screen Share', allowed: true },
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
