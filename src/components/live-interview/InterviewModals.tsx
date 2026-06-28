// ─────────────────────────────────────────────────────────────
// TalentForge AI — Reschedule Modal
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { X, Calendar, Clock, RefreshCw } from 'lucide-react';
import type { LiveInterview } from '../../types/interview.types';

interface RescheduleModalProps {
  isOpen: boolean;
  interview: LiveInterview | null;
  onClose: () => void;
  onConfirm: (date: string, time: string, reason: string) => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  interview,
  onClose,
  onConfirm,
}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  if (!isOpen || !interview) return null;

  const handleConfirm = () => {
    if (!date || !time) return;
    onConfirm(date, time, reason);
    setDate('');
    setTime('');
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-slate-900">Reschedule Interview</h2>
              <p className="text-xs text-slate-500">{interview.candidateName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Current schedule */}
          <div className="bg-slate-50 rounded-xl p-3 border border-[#E5E7EB]">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-1">
              Current Schedule
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {interview.date} · {interview.timeStart} ({interview.duration})
            </p>
          </div>

          {/* New date & time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                <Calendar className="w-3.5 h-3.5 inline mr-1" />
                New Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                <Clock className="w-3.5 h-3.5 inline mr-1" />
                New Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input-field text-sm"
                required
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Reason for Rescheduling
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Optional: explain the reason for rescheduling..."
              rows={3}
              className="input-field text-sm resize-none"
            />
          </div>

          <p className="text-xs text-slate-500 bg-blue-50 border border-blue-100 rounded-xl p-3">
            📧 The candidate will be notified automatically via email.
          </p>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-[#E5E7EB] bg-slate-50/60">
          <button onClick={onClose} className="btn-secondary text-sm flex-1">Cancel</button>
          <button
            onClick={handleConfirm}
            disabled={!date || !time}
            className="btn-primary text-sm flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Cancel Interview Modal
// ─────────────────────────────────────────────────────────────
interface CancelInterviewModalProps {
  isOpen: boolean;
  interview: LiveInterview | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const CancelInterviewModal: React.FC<CancelInterviewModalProps> = ({
  isOpen,
  interview,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');

  if (!isOpen || !interview) return null;

  const handleConfirm = () => {
    onConfirm(reason);
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <X className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-slate-900">Cancel Interview</h2>
              <p className="text-xs text-slate-500">{interview.candidateName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="text-sm font-semibold text-red-800 mb-1">Are you sure?</p>
            <p className="text-xs text-red-600 leading-relaxed">
              Cancelling <strong>{interview.title}</strong> scheduled for{' '}
              <strong>{interview.date}</strong> at <strong>{interview.timeStart}</strong>. This
              action cannot be undone.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Reason for Cancellation
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for the candidate..."
              rows={3}
              className="input-field text-sm resize-none"
            />
          </div>

          <p className="text-xs text-slate-500 bg-blue-50 border border-blue-100 rounded-xl p-3">
            📧 The candidate will be notified automatically via email.
          </p>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-[#E5E7EB] bg-slate-50/60">
          <button onClick={onClose} className="btn-secondary text-sm flex-1">Keep Interview</button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg transition-colors flex-1"
          >
            Cancel Interview
          </button>
        </div>
      </div>
    </div>
  );
};
