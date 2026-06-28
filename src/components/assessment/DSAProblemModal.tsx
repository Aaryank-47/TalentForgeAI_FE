import React, { useState } from 'react';
import { X, Code2, ChevronRight } from 'lucide-react';
import type { DSAProblem } from '../../types/assessment';
import MonacoEditorWrapper from './MonacoEditorWrapper';
import LanguageSelector from './LanguageSelector';

interface DSAProblemModalProps {
  problem: DSAProblem | null;
  onClose: () => void;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

const difficultyColor = (d: string) =>
  d === 'Easy' ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
  : d === 'Medium' ? 'text-amber-700 bg-amber-50 border-amber-200'
  : 'text-red-700 bg-red-50 border-red-200';

const DSAProblemModal: React.FC<DSAProblemModalProps> = ({ problem, onClose, onSelect, isSelected }) => {
  const [activeTab, setActiveTab] = useState<'problem' | 'code'>('problem');
  const [selectedLang, setSelectedLang] = useState('javascript');

  if (!problem) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{problem.title}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
                <span className="text-[10px] text-slate-500">{problem.category} • {problem.points} pts</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onSelect && (
              <button
                onClick={() => onSelect(problem.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                    : 'bg-violet-600 text-white hover:bg-violet-700'
                }`}
              >
                {isSelected ? 'Remove Problem' : 'Add Problem'}
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          {(['problem', 'code'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-violet-600 text-violet-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'problem' ? 'Problem Statement' : 'Starter Code'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'problem' && (
            <div className="p-5 space-y-5">
              {/* Statement */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Description</h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{problem.statement}</p>
              </div>

              {/* Constraints */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Constraints</h3>
                <ul className="space-y-1">
                  {problem.constraints.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">{c}</code>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Examples */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Examples</h3>
                <div className="space-y-3">
                  {problem.examples.map((ex, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <p className="text-xs font-bold text-slate-700 mb-2">Example {i + 1}</p>
                      <div className="space-y-1">
                        <div className="flex gap-2 text-xs font-mono">
                          <span className="text-slate-500 w-16 flex-shrink-0">Input:</span>
                          <code className="text-slate-800">{ex.input}</code>
                        </div>
                        <div className="flex gap-2 text-xs font-mono">
                          <span className="text-slate-500 w-16 flex-shrink-0">Output:</span>
                          <code className="text-emerald-700 font-semibold">{ex.output}</code>
                        </div>
                        {ex.explanation && (
                          <div className="flex gap-2 text-xs mt-1">
                            <span className="text-slate-500 w-16 flex-shrink-0">Explanation:</span>
                            <span className="text-slate-600">{ex.explanation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supported Languages */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Supported Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {problem.supportedLanguages.map(lang => (
                    <span key={lang} className="text-xs bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 capitalize font-medium">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="p-5 space-y-3">
              <LanguageSelector
                value={selectedLang}
                onChange={setSelectedLang}
                languages={problem.supportedLanguages}
              />
              <div className="h-64 rounded-xl overflow-hidden border border-slate-200">
                <MonacoEditorWrapper
                  language={selectedLang}
                  value={problem.starterCode[selectedLang] || '// No starter code for this language'}
                  onChange={() => {}}
                  readOnly
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DSAProblemModal;
