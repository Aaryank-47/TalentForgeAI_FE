import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Calendar, CheckCircle, AlertTriangle, XCircle, Upload,
  GitBranch, Globe, FileText, Video, StickyNote, FileDown, Timer
} from 'lucide-react';
import SubmissionPanel from '../../components/assessment/SubmissionPanel';
import { mockFullAssessments } from '../../constants/assessment_mockData';
import type { CandidateAttemptStatus, SubmissionType } from '../../types/assessment';

// Demo project assessment
const DEMO_PROJECT = mockFullAssessments[2];
const DEADLINE_DAYS = 3;

// Simulated deadline from now
const DEADLINE = new Date(Date.now() + DEADLINE_DAYS * 24 * 60 * 60 * 1000);

const statusConfig: Record<CandidateAttemptStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: <Clock className="w-4 h-4" /> },
  in_progress: { label: 'In Progress', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: <Timer className="w-4 h-4" /> },
  submitted: { label: 'Submitted', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <CheckCircle className="w-4 h-4" /> },
  late: { label: 'Late Submission', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', icon: <AlertTriangle className="w-4 h-4" /> },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: <XCircle className="w-4 h-4" /> },
  accepted: { label: 'Accepted', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <CheckCircle className="w-4 h-4" /> },
  expired: { label: 'Expired', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: <XCircle className="w-4 h-4" /> },
};

const ProjectSubmissionPage: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<CandidateAttemptStatus>('pending');
  const [timeLeft, setTimeLeft] = useState<number>(
    Math.max(0, Math.floor((DEADLINE.getTime() - Date.now()) / 1000))
  );
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isExpired = timeLeft <= 0 || status === 'expired';

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((DEADLINE.getTime() - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0 && status === 'pending') setStatus('expired');
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (secs: number) => {
    const d = Math.floor(secs / 86400);
    const h = Math.floor((secs % 86400) / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (d > 0) return `${d}d ${h}h ${m}m`;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setStatus('submitted');
      setSubmitting(false);
    }, 1500);
  };

  const project = DEMO_PROJECT.projectConfig!;
  const statusInfo = statusConfig[status];
  const allowedTypes = project.submissionTypes as SubmissionType[];

  // ─── Expired State ────────────────────────────────────────
  if (isExpired && status !== 'submitted') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="card p-10 text-center space-y-5">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Assessment Expired</h2>
            <p className="text-sm text-slate-500 mt-2">
              The submission deadline for this assessment has passed.<br />
              You can no longer submit your work.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl">
            <Clock className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-700">
              Deadline: {DEADLINE.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <button onClick={() => navigate('/candidate/assessments')} className="btn-secondary text-sm">
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  // ─── Submitted State ──────────────────────────────────────
  if (status === 'submitted') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="card p-10 text-center space-y-5">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Submission Received!</h2>
            <p className="text-sm text-slate-500 mt-2">
              Your project has been submitted successfully.<br />
              The recruiter will review and get back to you soon.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-sm">
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100">
                <GitBranch className="w-4 h-4" /> GitHub
              </a>
            )}
            {liveUrl && (
              <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100">
                <Globe className="w-4 h-4" /> Live Demo
              </a>
            )}
          </div>
          <button onClick={() => navigate('/candidate/assessments')} className="btn-secondary text-sm">
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 py-6 px-4">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900">{project.title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{DEMO_PROJECT.name}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${statusInfo.bg} ${statusInfo.border}`}>
          <span className={statusInfo.color}>{statusInfo.icon}</span>
          <span className={`text-sm font-semibold ${statusInfo.color}`}>{statusInfo.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — Assignment Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Description */}
          <div className="card p-5">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Assignment Overview</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{project.description}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              {project.techStack.map(t => (
                <span key={t} className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="card p-5">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Requirements</h2>
            <pre className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-sans">
              {project.requirements}
            </pre>
          </div>

          {/* Submission Form */}
          <div className="card p-5">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Submit Your Work</h2>
            <SubmissionPanel
              allowedTypes={allowedTypes}
              githubUrl={githubUrl}
              liveUrl={liveUrl}
              notes={notes}
              onGithubUrlChange={setGithubUrl}
              onLiveUrlChange={setLiveUrl}
              onNotesChange={setNotes}
            />

            <div className="mt-5">
              <button
                onClick={handleSubmit}
                disabled={submitting || (!githubUrl && !liveUrl && !notes)}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Submit Project
              </button>
            </div>
          </div>
        </div>

        {/* Right — Deadline & Info */}
        <div className="space-y-4">
          {/* Countdown */}
          <div className={`card p-5 ${timeLeft < 86400 ? 'border-red-200 bg-red-50/50' : ''}`}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className={`w-4 h-4 ${timeLeft < 86400 ? 'text-red-600' : 'text-slate-500'}`} />
              <p className={`text-sm font-bold ${timeLeft < 86400 ? 'text-red-700' : 'text-slate-700'}`}>
                Time Remaining
              </p>
            </div>
            <p className={`text-3xl font-display font-black tabular-nums ${timeLeft < 86400 ? 'text-red-600' : 'text-slate-900'}`}>
              {formatTime(timeLeft)}
            </p>
            {timeLeft < 86400 && (
              <p className="text-xs text-red-600 mt-2 font-medium animate-recording-pulse">
                ⚠ Less than 24 hours remaining!
              </p>
            )}
          </div>

          {/* Details */}
          <div className="card p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Assignment Info</h3>
            {[
              { label: 'Difficulty', value: project.difficulty },
              { label: 'Maximum Marks', value: `${project.maximumMarks} pts` },
              { label: 'Deadline', value: `${project.deadlineDays} days` },
              { label: 'Deadline Date', value: DEADLINE.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{item.label}</span>
                <span className="text-xs font-semibold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Allowed Submission Types */}
          <div className="card p-5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Submission Checklist</h3>
            <div className="space-y-2">
              {allowedTypes.map(type => {
                const icons: Record<string, React.ReactNode> = {
                  github: <GitBranch className="w-3.5 h-3.5" />,
                  live_url: <Globe className="w-3.5 h-3.5" />,
                  zip: <FileDown className="w-3.5 h-3.5" />,
                  documentation: <FileText className="w-3.5 h-3.5" />,
                  video: <Video className="w-3.5 h-3.5" />,
                  notes: <StickyNote className="w-3.5 h-3.5" />,
                };
                const labels: Record<string, string> = {
                  github: 'GitHub Repository',
                  live_url: 'Live Deployment URL',
                  zip: 'ZIP Upload',
                  documentation: 'Documentation',
                  video: 'Video Demo',
                  notes: 'Additional Notes',
                };
                return (
                  <div key={type} className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="text-slate-400">{icons[type]}</span>
                    {labels[type]}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSubmissionPage;
