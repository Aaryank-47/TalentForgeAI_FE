// ─────────────────────────────────────────────────────────────
// TalentForge AI — Recruiter Interview Detail Page (Phase 6)
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Clock, Video, Users, Play, RefreshCw,
  XCircle, MapPin, Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getInterviewSessionById,
  rescheduleInterviewSession,
  cancelInterviewSession,
  toLiveInterview
} from '../../../services/interviewSession.service';
import type { InterviewSession } from '../../../types/interviewSession.types';
import { LiveInterviewStatusBadge } from '../../../components/live-interview/LiveInterviewStatusBadge';
import { RescheduleModal, CancelInterviewModal } from '../../../components/live-interview/InterviewModals';

const RecruiterInterviewDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [session, setSession] = useState<InterviewSession | undefined>(undefined);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes'>('overview');

  const loadSession = () => {
    if (id) {
      const found = getInterviewSessionById(id);
      setSession(found);
    }
  };

  useEffect(() => {
    loadSession();
  }, [id]);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-slate-500 text-sm">Interview Session not found.</p>
        <button onClick={() => navigate('/recruiter/live-interviews')} className="mt-4 btn-secondary text-sm">
          ← Back to Interviews
        </button>
      </div>
    );
  }

  // Convert to LiveInterview shape for compatible elements
  const mappedInterview = toLiveInterview(session);

  const isActive = ['SCHEDULED', 'Upcoming'].includes(session.status);
  const isLive = session.status === 'IN_PROGRESS';

  const handleRescheduleConfirm = (newDate: string, newTime: string) => {
    const newISO = new Date(`${newDate}T${newTime}`).toISOString();
    rescheduleInterviewSession(session.id, newISO);
    toast.success('Interview rescheduled!');
    setRescheduleOpen(false);
    loadSession();
  };

  const handleCancelConfirm = () => {
    cancelInterviewSession(session.id);
    toast.error('Interview cancelled.');
    setCancelOpen(false);
    loadSession();
  };

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
              className={`w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md`}
            >
              TF
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-xl font-display font-bold text-slate-900">
                  {mappedInterview.title}
                </h1>
                <LiveInterviewStatusBadge status={mappedInterview.status} size="md" />
              </div>
              <p className="text-sm text-slate-500">
                {session.job?.title} · {session.interview?.mode} Session
              </p>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {mappedInterview.date}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {mappedInterview.timeStart} – {mappedInterview.timeEnd} ({mappedInterview.duration})
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {mappedInterview.timezone}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Video className="w-3.5 h-3.5 text-slate-400" />
                  <span className="capitalize">Video Room</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {(isActive || isLive) && (
              <button
                onClick={() => navigate(`/recruiter/live-interviews/${session.id}/room`)}
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
          {(['overview', 'notes'] as const).map((tab) => (
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
          {/* Left: Candidates & Panel */}
          <div className="lg:col-span-2 space-y-5">
            {/* Candidates */}
            <div className="card p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                Candidates ({session.candidates?.length || 0})
              </h3>
              <div className="space-y-4">
                {session.candidates?.map((cand) => (
                  <div key={cand.id} className="flex items-start gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold flex-shrink-0`}
                    >
                      {cand.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">{cand.name}</p>
                      <p className="text-xs text-slate-500">{cand.email}</p>
                    </div>
                    <button className="flex items-center gap-1.5 text-xs text-primary-600 font-semibold hover:text-primary-700">
                      <Download className="w-3.5 h-3.5" />
                      Resume
                    </button>
                  </div>
                ))}
                {(!session.candidates || session.candidates.length === 0) && (
                  <p className="text-xs text-slate-400">No candidates are currently assigned to this session.</p>
                )}
              </div>
            </div>

            {/* Interviewers */}
            <div className="card p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                Interview Panel ({session.interviewers?.length || 0})
              </h3>
              <div className="space-y-3">
                {session.interviewers?.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div
                      className={`w-9 h-9 rounded-full bg-gradient-to-br ${r.avatarColor || 'from-slate-400 to-slate-600'} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                    >
                      {r.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-900">{r.name}</p>
                      <p className="text-[10px] text-slate-500">{r.role} · {r.department}</p>
                    </div>
                    <span className="text-[10px] bg-violet-100 text-violet-700 font-semibold px-2 py-0.5 rounded-full capitalize">
                      Interviewer
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Meta */}
          <div className="space-y-4">
            <div className="card p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Session Details</h3>
              {[
                { label: 'Type', value: mappedInterview.type },
                { label: 'Duration', value: mappedInterview.duration },
                { label: 'Mode', value: session.interview?.mode },
                { label: 'Timezone', value: mappedInterview.timezone },
                { label: 'Recording', value: 'Enabled' },
                { label: 'Room ID', value: mappedInterview.roomId },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start">
                  <span className="text-xs text-slate-400">{label}</span>
                  <span className="text-xs font-semibold text-slate-900 text-right capitalize max-w-[150px]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="card p-6 max-w-2xl">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Interview Notes</h3>
          <textarea
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
        interview={mappedInterview}
        onClose={() => setRescheduleOpen(false)}
        onConfirm={(newDate, newTime) => handleRescheduleConfirm(newDate, newTime)}
      />
      <CancelInterviewModal
        isOpen={cancelOpen}
        interview={mappedInterview}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancelConfirm}
      />
    </div>
  );
};

export default RecruiterInterviewDetailPage;
