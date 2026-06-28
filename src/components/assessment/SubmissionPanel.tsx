import React from 'react';
import { FileText, Upload, Link2, GitBranch, Globe, Video, FileDown, StickyNote } from 'lucide-react';
import type { SubmissionType } from '../../types/assessment';

interface SubmissionPanelProps {
  allowedTypes: SubmissionType[];
  githubUrl: string;
  liveUrl: string;
  notes: string;
  onGithubUrlChange: (v: string) => void;
  onLiveUrlChange: (v: string) => void;
  onNotesChange: (v: string) => void;
  onFileUpload?: (type: SubmissionType) => void;
}

const SUBMISSION_TYPE_CONFIG: Record<SubmissionType, { label: string; icon: React.ReactNode; description: string }> = {
  github: { label: 'GitHub Repository', icon: <GitBranch className="w-4 h-4" />, description: 'Link to your public repository' },
  live_url: { label: 'Live Deployment URL', icon: <Globe className="w-4 h-4" />, description: 'Hosted application URL' },
  zip: { label: 'ZIP Upload', icon: <FileDown className="w-4 h-4" />, description: 'Upload your project as a ZIP file' },
  documentation: { label: 'Documentation', icon: <FileText className="w-4 h-4" />, description: 'Upload PDF or DOCX documentation' },
  video: { label: 'Video Demo', icon: <Video className="w-4 h-4" />, description: 'Record and upload a walkthrough video' },
  notes: { label: 'Additional Notes', icon: <StickyNote className="w-4 h-4" />, description: 'Any extra comments or instructions' },
};

const SubmissionPanel: React.FC<SubmissionPanelProps> = ({
  allowedTypes,
  githubUrl, liveUrl, notes,
  onGithubUrlChange, onLiveUrlChange, onNotesChange,
  onFileUpload,
}) => {
  return (
    <div className="space-y-4">
      {allowedTypes.includes('github') && (
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
            <GitBranch className="w-4 h-4" /> GitHub Repository URL
          </label>
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="url"
              value={githubUrl}
              onChange={e => onGithubUrlChange(e.target.value)}
              placeholder="https://github.com/username/project"
              className="pl-9 pr-4 py-2.5 text-sm w-full border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      )}

      {allowedTypes.includes('live_url') && (
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
            <Globe className="w-4 h-4" /> Live Deployment URL
          </label>
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="url"
              value={liveUrl}
              onChange={e => onLiveUrlChange(e.target.value)}
              placeholder="https://your-project.vercel.app"
              className="pl-9 pr-4 py-2.5 text-sm w-full border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      )}

      {(['zip', 'documentation', 'video'] as SubmissionType[])
        .filter(t => allowedTypes.includes(t))
        .map(type => {
          const cfg = SUBMISSION_TYPE_CONFIG[type];
          return (
            <div key={type}>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                {cfg.icon} {cfg.label}
              </label>
              <div
                onClick={() => onFileUpload?.(type)}
                className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-primary-400 hover:bg-primary-50/50 cursor-pointer transition-colors group"
              >
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-primary-600 mx-auto mb-2 transition-colors" />
                <p className="text-sm font-medium text-slate-600 group-hover:text-primary-700">Click to upload or drag & drop</p>
                <p className="text-xs text-slate-400 mt-1">{cfg.description}</p>
              </div>
            </div>
          );
        })}

      {allowedTypes.includes('notes') && (
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
            <StickyNote className="w-4 h-4" /> Additional Notes
          </label>
          <textarea
            value={notes}
            onChange={e => onNotesChange(e.target.value)}
            rows={4}
            placeholder="Any additional information, setup instructions, or comments..."
            className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>
      )}
    </div>
  );
};

export default SubmissionPanel;
