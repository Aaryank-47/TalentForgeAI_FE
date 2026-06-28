// ─────────────────────────────────────────────────────────────
// TalentForge AI — Recruiter Interview Calendar Page
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { calendarDays, timeSlots, calendarMonthLabel } from '../../../constants/interviewSchedule.mock';
import { mockInterviews } from '../../../constants/interview.mock';
import { LiveInterviewStatusBadge } from '../../../components/live-interview/LiveInterviewStatusBadge';
import { CreateInterviewModal } from '../../../components/live-interview/CreateInterviewModal';
import toast from 'react-hot-toast';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const RecruiterInterviewCalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-06-28');
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();

  const selectedDayInterviews = mockInterviews.filter(
    (iv) => iv.dateISO === selectedDate
  );

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Interview Calendar</h1>
          <p className="text-sm text-slate-500 mt-0.5">View and manage scheduled interviews by date.</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar panel */}
        <div className="card p-5 lg:col-span-2">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-5">
            <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-display font-bold text-slate-900">{calendarMonthLabel}</h2>
            <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid (2-week window) */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(({ dateISO, label, hasInterview }) => {
              const isSelected = selectedDate === dateISO;
              const isToday = dateISO === '2026-06-28';
              return (
                <button
                  key={dateISO}
                  onClick={() => setSelectedDate(dateISO)}
                  className={`relative flex flex-col items-center justify-center h-14 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                      : isToday
                      ? 'bg-primary-50 text-primary-700 font-bold border border-primary-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{label}</span>
                  {hasInterview && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1 ${
                        isSelected ? 'bg-white' : 'bg-primary-500'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Time slots (selected day) */}
          {selectedDayInterviews.length > 0 && (
            <div className="mt-6 border-t border-[#E5E7EB] pt-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                Schedule for {formatDate(selectedDate)}
              </h3>
              <div className="space-y-3">
                {timeSlots.map((slot) => {
                  const interview = selectedDayInterviews.find(
                    (iv) => iv.timeStart === slot
                  );
                  return (
                    <div key={slot} className="flex items-start gap-3">
                      <div className="w-16 text-[10px] font-medium text-slate-400 pt-1 flex-shrink-0">
                        {slot}
                      </div>
                      {interview ? (
                        <button
                          onClick={() => navigate(`/recruiter/live-interviews/${interview.id}`)}
                          className={`flex-1 p-3 rounded-xl border text-left transition-all hover:shadow-sm ${
                            interview.status === 'Live'
                              ? 'bg-emerald-50 border-emerald-200'
                              : 'bg-primary-50 border-primary-100'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-900">{interview.title}</span>
                            <LiveInterviewStatusBadge status={interview.status} />
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {interview.candidateName} · {interview.duration}
                          </span>
                        </button>
                      ) : (
                        <div className="flex-1 h-8 border border-dashed border-slate-200 rounded-xl hover:border-primary-300 hover:bg-primary-50/30 transition-colors cursor-pointer" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {selectedDayInterviews.length === 0 && (
            <div className="mt-6 border-t border-[#E5E7EB] pt-5 text-center py-8">
              <p className="text-sm text-slate-400">No interviews on {formatDate(selectedDate)}</p>
              <button
                onClick={() => setCreateOpen(true)}
                className="mt-3 text-xs text-primary-600 font-semibold hover:text-primary-700"
              >
                + Schedule one
              </button>
            </div>
          )}
        </div>

        {/* Right: upcoming summary */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Upcoming Interviews</h3>
            <div className="space-y-3">
              {mockInterviews
                .filter((iv) => ['Scheduled', 'Upcoming', 'Today', 'Live'].includes(iv.status))
                .slice(0, 5)
                .map((iv) => (
                  <button
                    key={iv.id}
                    onClick={() => navigate(`/recruiter/live-interviews/${iv.id}`)}
                    className="w-full flex items-start gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg ${iv.companyColor} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}
                    >
                      {iv.companyLogo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{iv.title}</p>
                      <p className="text-[10px] text-slate-500">{iv.date} · {iv.timeStart}</p>
                    </div>
                    <LiveInterviewStatusBadge status={iv.status} />
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      <CreateInterviewModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={() => { toast.success('Interview scheduled!'); setCreateOpen(false); }}
      />
    </div>
  );
};

export default RecruiterInterviewCalendarPage;
