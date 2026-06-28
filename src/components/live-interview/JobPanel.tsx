// ─────────────────────────────────────────────────────────────
// TalentForge AI — Job Panel (sidebar)
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { Briefcase, MapPin, Clock, ExternalLink, CheckCircle } from 'lucide-react';
import type { LiveInterview } from '../../types/interview.types';

interface JobPanelProps {
  interview: LiveInterview;
}

const mockJobDetails = {
  jobTitle: 'Senior Frontend Developer',
  company: 'Google',
  location: 'Bangalore, India',
  type: 'Full-time · Remote',
  experience: '3-5 years',
  salary: '₹18 – ₹28 LPA',
  department: 'Engineering',
  description:
    'We are looking for a passionate Frontend Developer to join our team and help build amazing user experiences at scale. You will work with a world-class engineering team on products used by billions of people.',
  responsibilities: [
    'Build responsive and accessible web applications',
    'Collaborate with designers and backend engineers',
    'Optimise Core Web Vitals and application performance',
    'Mentor junior developers and conduct code reviews',
    'Contribute to engineering best practices',
  ],
  requirements: [
    '3-5 years of React / TypeScript experience',
    'Strong CSS and responsive design skills',
    'Familiarity with RESTful APIs and GraphQL',
    'Experience with testing frameworks (Jest, RTL)',
  ],
};

export const JobPanel: React.FC<JobPanelProps> = ({ interview }) => {
  const job = { ...mockJobDetails, jobTitle: interview.jobTitle, company: interview.company };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 flex-shrink-0 bg-slate-50">
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-xl ${interview.companyColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
          >
            {interview.companyLogo}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{job.jobTitle}</p>
            <p className="text-xs text-slate-500">{job.company}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Quick meta */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: MapPin, label: job.location },
            { icon: Clock, label: job.type },
            { icon: Briefcase, label: job.experience },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-[10px] text-slate-600">
              <Icon className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold">
            <span>{job.salary}</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-xs font-bold text-slate-900 mb-2">About the Role</p>
          <p className="text-xs text-slate-600 leading-relaxed">{job.description}</p>
        </div>

        {/* Responsibilities */}
        <div>
          <p className="text-xs font-bold text-slate-900 mb-2">Responsibilities</p>
          <ul className="space-y-1.5">
            {job.responsibilities.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                <CheckCircle className="w-3 h-3 text-primary-600 flex-shrink-0 mt-0.5" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Requirements */}
        <div>
          <p className="text-xs font-bold text-slate-900 mb-2">Requirements</p>
          <ul className="space-y-1.5">
            {job.requirements.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                <CheckCircle className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold hover:border-slate-300 hover:bg-slate-50 transition-colors">
          <ExternalLink className="w-3.5 h-3.5" />
          View Full Job Posting
        </button>
      </div>
    </div>
  );
};

export default JobPanel;
