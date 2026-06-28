import React, { useState } from 'react';
import { HelpCircle, Code, Settings } from 'lucide-react';
import MCQBuilder from './MCQBuilder';
import DSABuilder from './DSABuilder';
import type { MixedConfig } from '../../types/assessment';

interface MixedAssessmentBuilderProps {
  config: MixedConfig;
  onChange: (config: MixedConfig) => void;
}

const MixedAssessmentBuilder: React.FC<MixedAssessmentBuilderProps> = ({ config, onChange }) => {
  const [activeTab, setActiveTab] = useState<'mcq' | 'dsa'>('mcq');

  const handleMcqChange = (mcqConfig: MixedConfig['mcq']) => {
    onChange({
      ...config,
      mcq: mcqConfig,
    });
  };

  const handleDsaChange = (dsaConfig: MixedConfig['dsa']) => {
    onChange({
      ...config,
      dsa: dsaConfig,
    });
  };

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('mcq')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'mcq'
              ? 'border-primary-600 text-primary-600 bg-primary-50/30'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>MCQ Questions</span>
          <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 font-semibold">
            {config.mcq.selectedQuestionIds.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('dsa')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'dsa'
              ? 'border-primary-600 text-primary-600 bg-primary-50/30'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>DSA Problems</span>
          <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 font-semibold">
            {config.dsa.selectedProblemIds.length}
          </span>
        </button>
      </div>

      {/* Builder Contents */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        {activeTab === 'mcq' ? (
          <div>
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-500" />
                Configure Multiple Choice Questions
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Select from question bank and configure timing & scoring</p>
            </div>
            <MCQBuilder config={config.mcq} onChange={handleMcqChange} />
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-500" />
                Configure Coding & DSA Problems
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Select algorithm problems and configure compiler environments</p>
            </div>
            <DSABuilder config={config.dsa} onChange={handleDsaChange} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MixedAssessmentBuilder;
