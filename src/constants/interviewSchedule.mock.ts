// ─────────────────────────────────────────────────────────────
// TalentForge AI — Interview Schedule / Calendar Mock Data
// ─────────────────────────────────────────────────────────────
import type { ScheduleEntry } from '../types/interview.types';
import { mockInterviews } from './interview.mock';

// ─── Group interviews by date ─────────────────────────────────
export const scheduleByDate: ScheduleEntry[] = [
  {
    date: '2026-06-28',
    interviews: mockInterviews.filter((iv) => iv.dateISO === '2026-06-28'),
  },
  {
    date: '2026-06-29',
    interviews: mockInterviews.filter((iv) => iv.dateISO === '2026-06-29'),
  },
  {
    date: '2026-07-02',
    interviews: mockInterviews.filter((iv) => iv.dateISO === '2026-07-02'),
  },
  {
    date: '2026-07-05',
    interviews: mockInterviews.filter((iv) => iv.dateISO === '2026-07-05'),
  },
];

// ─── Calendar Weeks (for June–July 2026 view) ─────────────────
export const calendarMonthLabel = 'June – July 2026';

export const calendarDays = [
  { dateISO: '2026-06-23', label: 'Mon 23', hasInterview: false },
  { dateISO: '2026-06-24', label: 'Tue 24', hasInterview: false },
  { dateISO: '2026-06-25', label: 'Wed 25', hasInterview: false },
  { dateISO: '2026-06-26', label: 'Thu 26', hasInterview: false },
  { dateISO: '2026-06-27', label: 'Fri 27', hasInterview: false },
  { dateISO: '2026-06-28', label: 'Sat 28', hasInterview: true },
  { dateISO: '2026-06-29', label: 'Sun 29', hasInterview: true },
  { dateISO: '2026-06-30', label: 'Mon 30', hasInterview: false },
  { dateISO: '2026-07-01', label: 'Tue 1', hasInterview: false },
  { dateISO: '2026-07-02', label: 'Wed 2', hasInterview: true },
  { dateISO: '2026-07-03', label: 'Thu 3', hasInterview: false },
  { dateISO: '2026-07-04', label: 'Fri 4', hasInterview: false },
  { dateISO: '2026-07-05', label: 'Sat 5', hasInterview: true },
  { dateISO: '2026-07-06', label: 'Sun 6', hasInterview: false },
];

// ─── Timeslot grid ────────────────────────────────────────────
export const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
];

// ─── Today's interviews ───────────────────────────────────────
export const todaysInterviews = mockInterviews.filter(
  (iv) => iv.dateISO === '2026-06-28'
);
