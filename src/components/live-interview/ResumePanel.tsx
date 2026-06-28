// ─────────────────────────────────────────────────────────────
// TalentForge AI — Resume Panel (sidebar)
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { FileText, Download, ExternalLink, Briefcase, GraduationCap, Code2 } from 'lucide-react';
import { getCandidateById } from '../../constants/participants.mock';

interface ResumePanelProps {
  candidateId: string;
}

export const ResumePanel: React.FC<ResumePanelProps> = ({ candidateId }) => {
  const candidate = getCandidateById(candidateId);

  if (!candidate) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-slate-500">
        <FileText className="w-8 h-8 mb-2 opacity-40" />
        <p className="text-xs">Candidate data unavailable</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 flex-shrink-0 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${candidate.avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
            >
              {candidate.initials}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{candidate.name}</p>
              <p className="text-[10px] text-slate-500">{candidate.title}</p>
            </div>
          </div>
          <button
            className="flex items-center gap-1 text-[10px] text-primary-600 hover:text-primary-700 font-medium"
            title="Download Resume"
          >
            <Download className="w-3.5 h-3.5" />
            PDF
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Contact */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Contact</p>
          <p className="text-xs text-slate-700">{candidate.email}</p>
          <p className="text-xs text-slate-600">{candidate.experience} of experience</p>
        </div>

        {/* Skills */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Code2 className="w-3.5 h-3.5 text-slate-500" />
            <p className="text-xs font-bold text-slate-900">Skills</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.map((skill) => (
              <span
                key={skill}
                className="text-[10px] bg-primary-50 border border-primary-200 text-primary-700 px-2 py-0.5 rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Applied for */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-3.5 h-3.5 text-slate-500" />
            <p className="text-xs font-bold text-slate-900">Applied For</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <p className="text-xs font-semibold text-slate-900">{candidate.jobTitle}</p>
          </div>
        </div>

        {/* Education placeholder */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
            <p className="text-xs font-bold text-slate-900">Education</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <p className="text-xs font-semibold text-slate-900">B.Tech — Computer Science</p>
            <p className="text-[10px] text-slate-500 mt-0.5">IIT Bombay · 2016 – 2020</p>
          </div>
        </div>

        {/* Full profile link */}
        <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold hover:border-slate-300 hover:bg-slate-50 transition-colors">
          <ExternalLink className="w-3.5 h-3.5" />
          View Full Profile
        </button>
      </div>
    </div>
  );
};

export default ResumePanel;
