import React from 'react';
import { MonitorPlay, Clock, MessageSquare, Code2, StickyNote } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../constants/assessment_mockData';
import type { MachineCodingConfig } from '../../types/assessment';

interface MachineCodingBuilderProps {
  config: MachineCodingConfig;
  onChange: (config: MachineCodingConfig) => void;
}

const MachineCodingBuilder: React.FC<MachineCodingBuilderProps> = ({ config, onChange }) => {
  const set = <K extends keyof MachineCodingConfig>(key: K, val: MachineCodingConfig[K]) =>
    onChange({ ...config, [key]: val });

  const toggleLang = (lang: string) => {
    const langs = config.supportedLanguages.includes(lang)
      ? config.supportedLanguages.filter(l => l !== lang)
      : [...config.supportedLanguages, lang];
    set('supportedLanguages', langs);
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl">
        <MonitorPlay className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-rose-800">Live Machine Coding Interview</p>
          <p className="text-xs text-rose-600 mt-0.5">
            This is a real-time session where the recruiter and candidate collaborate in a shared coding environment.
            Camera, microphone, and screen sharing will be active throughout.
          </p>
        </div>
      </div>

      {/* Session Config */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          Session Configuration
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Session Duration (min)</label>
            <input
              type="number"
              min={30}
              max={180}
              value={config.duration}
              onChange={e => set('duration', Number(e.target.value))}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Coding Topic</label>
            <input
              type="text"
              placeholder="e.g. Build a REST API with authentication"
              value={config.topic}
              onChange={e => set('topic', e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-slate-500" />
          Coding Instructions
        </h3>
        <textarea
          rows={4}
          value={config.instructions}
          onChange={e => set('instructions', e.target.value)}
          placeholder="Instructions shown to the candidate at the start of the session..."
          className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      {/* Shared Notes Template */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-slate-500" />
          Shared Notes Template
        </h3>
        <textarea
          rows={3}
          value={config.sharedNotes}
          onChange={e => set('sharedNotes', e.target.value)}
          placeholder="Pre-fill the shared notes area for the session..."
          className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      {/* Supported Languages */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-slate-500" />
          Supported Languages
        </h3>
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_LANGUAGES.map(lang => {
            const active = config.supportedLanguages.includes(lang.value);
            return (
              <button
                key={lang.value}
                type="button"
                onClick={() => toggleLang(lang.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                  active
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-600 bg-white'
                }`}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
        {config.supportedLanguages.length === 0 && (
          <p className="text-xs text-red-500 mt-2">Select at least one language</p>
        )}
      </div>
    </div>
  );
};

export default MachineCodingBuilder;
