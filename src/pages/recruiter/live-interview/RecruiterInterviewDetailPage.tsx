// ─────────────────────────────────────────────────────────────
// TalentForge AI — Recruiter Interview Detail Page (Phase 6)
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Clock, Video, Users, Play, RefreshCw,
  XCircle, MapPin, Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContext';
import { interviewApi } from '../../../services/api/interview.api';
import {
  rescheduleInterviewSession,
  cancelInterviewSession,
  toLiveInterview
} from '../../../services/interviewSession.service';
import { LiveInterviewStatusBadge } from '../../../components/live-interview/LiveInterviewStatusBadge';
import { RescheduleModal, CancelInterviewModal } from '../../../components/live-interview/InterviewModals';

const RecruiterInterviewDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const companyId = user?.companyId || user?.companies?.[0]?.companyId;
  
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes'>('overview');

  const { data: sessionResponse, isLoading, refetch } = useQuery({
    queryKey: ['session', id],
    queryFn: () => interviewApi.getSessionById(companyId as string, id as string),
    enabled: !!id && !!companyId,
  });

  const session = sessionResponse as any;

  // Extract participants from the session data
  const candidates = session?.participants
    ?.filter((p: any) => p.participantType === 'CANDIDATE')
    ?.map((p: any) => ({
      id: p.id,
      name: p.assignment?.application?.candidate?.fullName || 'Candidate',
      email: p.assignment?.application?.candidate?.user?.email || 'No email',
      avatar: (p.assignment?.application?.candidate?.fullName || 'C').charAt(0).toUpperCase()
    })) || [];

  const interviewers = session?.participants
    ?.filter((p: any) => p.participantType === 'INTERVIEWER')
    ?.map((p: any) => {
      const u = p.companyMember?.user;
      const emp = u?.employer;
      const adm = u?.admin;
      const name = emp?.fullName || adm?.fullName || u?.email?.split('@')[0] || 'Interviewer';
      const role = emp?.designation || adm?.designation || p.companyMember?.role || 'Staff';
      const department = emp?.department || adm?.department || 'Recruitment';
      return {
        id: p.id,
        name,
        role,
        department,
        initials: (name || 'I').charAt(0).toUpperCase(),
        avatarColor: 'from-slate-500 to-slate-700'
      };
    }) || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
        <p className="text-slate-500 text-sm mt-4">Loading session details...</p>
      </div>
    );
  }

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

  const handleRescheduleConfirm = async (newDate: string, newTime: string) => {
    try {
      const newISO = new Date(`${newDate}T${newTime}`).toISOString();
      await interviewApi.updateSession(companyId as string, session.id, { scheduledAt: newISO });
      toast.success('Interview rescheduled successfully!');
      setRescheduleOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reschedule interview');
    }
  };

  const handleCancelConfirm = async () => {
    try {
      await interviewApi.cancelSession(companyId as string, session.id);
      toast.success('Interview cancelled successfully.');
      setCancelOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to cancel interview');
    }
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
                {session.job?.title || 'Software Developer'} · {session.interview?.mode || 'INDIVIDUAL'} Session
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
                  Video Room
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {(isActive || isLive) && (
              <button
                onClick={async () => {
                  try {
                    if (companyId && session.id && session.status !== 'IN_PROGRESS') {
                      await interviewApi.startSession(companyId, session.id);
                    }
                  } catch (err) {
                    console.warn('Could not update session status:', err);
                  }
                  navigate(`/recruiter/live-interviews/${session.id}/room`);
                }}
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
                Candidates ({candidates.length})
              </h3>
              <div className="space-y-4">
                {candidates.map((cand: any) => (
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
                {candidates.length === 0 && (
                  <p className="text-xs text-slate-400">No candidates are currently assigned to this session.</p>
                )}
              </div>
            </div>

            {/* Interviewers */}
            <div className="card p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                Interview Panel ({interviewers.length})
              </h3>
              <div className="space-y-3">
                {interviewers.map((r: any) => (
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
                {interviewers.length === 0 && (
                  <p className="text-xs text-slate-400">No interviewers assigned to this session.</p>
                )}
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
                <div key={label} className="flex justify-between items-start gap-3">
                  <span className="text-xs text-slate-400 flex-shrink-0">{label}</span>
                  <span className="text-xs font-semibold text-slate-900 text-right break-all max-w-[200px]">
                    {value || '—'}
                  </span>
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
