import React, { useState } from 'react';
import { FolderGit2, FileText, Tag, Upload, X, Plus, Calendar } from 'lucide-react';
import type { ProjectConfig, SubmissionType } from '../../types/assessment';

interface ProjectAssessmentBuilderProps {
  config: ProjectConfig;
  onChange: (config: ProjectConfig) => void;
}

const SUBMISSION_TYPE_OPTIONS: { type: SubmissionType; label: string }[] = [
  { type: 'github', label: 'GitHub Repository' },
  { type: 'live_url', label: 'Live Deployment URL' },
  { type: 'zip', label: 'ZIP Upload' },
  { type: 'documentation', label: 'Documentation (PDF)' },
  { type: 'video', label: 'Video Demo' },
  { type: 'notes', label: 'Additional Notes' },
];

const TECH_STACK_OPTIONS = [
  'React', 'Vue', 'Angular', 'Next.js', 'TypeScript', 'Node.js', 'Express',
  'FastAPI', 'Django', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'MySQL',
  'Redis', 'Docker', 'AWS', 'Firebase', 'GraphQL', 'REST API',
];

const ProjectAssessmentBuilder: React.FC<ProjectAssessmentBuilderProps> = ({ config, onChange }) => {
  const [techInput, setTechInput] = useState('');
  const set = <K extends keyof ProjectConfig>(key: K, val: ProjectConfig[K]) =>
    onChange({ ...config, [key]: val });

  const toggleSubmissionType = (type: SubmissionType) => {
    const types = config.submissionTypes.includes(type)
      ? config.submissionTypes.filter(t => t !== type)
      : [...config.submissionTypes, type];
    set('submissionTypes', types);
  };

  const addTech = (tech: string) => {
    if (tech.trim() && !config.techStack.includes(tech.trim())) {
      set('techStack', [...config.techStack, tech.trim()]);
    }
    setTechInput('');
  };

  const removeTech = (tech: string) => {
    set('techStack', config.techStack.filter(t => t !== tech));
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <FolderGit2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-800">Take-Home Project Assignment</p>
          <p className="text-xs text-amber-600 mt-0.5">
            Candidates receive this assignment and have the specified number of days to complete and submit their work.
          </p>
        </div>
      </div>

      {/* Basic Info */}
      <div className="card p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Assignment Details</h3>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Assignment Title *</label>
          <input
            type="text"
            value={config.title}
            onChange={e => set('title', e.target.value)}
            placeholder="e.g. Build a Full-Stack Todo Application"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Brief Description</label>
          <textarea
            rows={3}
            value={config.description}
            onChange={e => set('description', e.target.value)}
            placeholder="A brief overview of what the candidate will build..."
            className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Difficulty</label>
            <select
              value={config.difficulty}
              onChange={e => set('difficulty', e.target.value as 'Easy' | 'Medium' | 'Hard')}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Maximum Marks</label>
            <input
              type="number"
              min={1}
              value={config.maximumMarks}
              onChange={e => set('maximumMarks', Number(e.target.value))}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Deadline (days)
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={config.deadlineDays}
              onChange={e => set('deadlineDays', Number(e.target.value))}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Requirements (Rich Text simulation) */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" />
          Detailed Requirements
        </h3>
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          {/* Toolbar */}
          <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center gap-1.5">
            {['B', 'I', 'U', '≡', '• List', '1. List', '{}'].map(btn => (
              <button key={btn} type="button" className="px-2 py-1 text-xs font-mono text-slate-600 hover:bg-slate-200 rounded transition-colors">
                {btn}
              </button>
            ))}
          </div>
          <textarea
            rows={8}
            value={config.requirements}
            onChange={e => set('requirements', e.target.value)}
            placeholder="## Project Requirements&#10;&#10;### Frontend&#10;- Feature 1&#10;- Feature 2&#10;&#10;### Backend&#10;- API Endpoint 1"
            className="w-full text-sm px-4 py-3 focus:outline-none resize-none font-mono bg-white"
          />
        </div>
      </div>

      {/* PDF Upload */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Attachments</h3>
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-amber-400 hover:bg-amber-50/30 cursor-pointer transition-colors group">
          <Upload className="w-6 h-6 text-slate-400 group-hover:text-amber-600 mx-auto mb-2 transition-colors" />
          <p className="text-sm font-medium text-slate-600">Upload PDF or additional files</p>
          <p className="text-xs text-slate-400 mt-1">PDF, DOCX, ZIP up to 20MB</p>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Tag className="w-4 h-4 text-slate-500" />
          Required Tech Stack
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {config.techStack.map(tech => (
            <span key={tech} className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200 rounded-lg">
              {tech}
              <button type="button" onClick={() => removeTech(tech)} className="hover:text-red-600 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {TECH_STACK_OPTIONS.filter(t => !config.techStack.includes(t)).map(tech => (
            <button
              key={tech}
              type="button"
              onClick={() => addTech(tech)}
              className="flex items-center gap-1 px-2 py-1 text-xs border border-slate-200 rounded-lg text-slate-600 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50 transition-colors"
            >
              <Plus className="w-3 h-3" />
              {tech}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={techInput}
            onChange={e => setTechInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTech(techInput)}
            placeholder="Add custom technology..."
            className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="button"
            onClick={() => addTech(techInput)}
            className="px-3 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Submission Types */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Submission Methods</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SUBMISSION_TYPE_OPTIONS.map(opt => {
            const active = config.submissionTypes.includes(opt.type);
            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => toggleSubmissionType(opt.type)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition-all ${
                  active
                    ? 'border-amber-300 bg-amber-50 text-amber-800'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  active ? 'bg-amber-500 border-amber-500' : 'border-slate-300'
                }`}>
                  {active && <div className="w-2 h-2 bg-white rounded-sm" />}
                </div>
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectAssessmentBuilder;
