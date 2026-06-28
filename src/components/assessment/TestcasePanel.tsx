import React, { useState } from 'react';
import type { DSAProblem } from '../../types/assessment';

interface TestcasePanelProps {
  problem: DSAProblem;
}

const TestcasePanel: React.FC<TestcasePanelProps> = ({ problem }) => {
  const [activeTab, setActiveTab] = useState(0);
  const visibleCases = problem.examples;

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Tabs */}
      <div className="flex items-center border-b border-slate-700 px-3">
        {visibleCases.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-3 py-2 text-xs font-medium transition-colors border-b-2 ${
              activeTab === i
                ? 'border-primary-400 text-primary-400'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Case {i + 1}
          </button>
        ))}
      </div>

      {/* Content */}
      {visibleCases[activeTab] && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1">Input</p>
            <pre className="text-xs text-slate-200 bg-slate-800 rounded-lg p-3 font-mono overflow-x-auto">
              {visibleCases[activeTab].input}
            </pre>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1">Expected Output</p>
            <pre className="text-xs text-emerald-400 bg-slate-800 rounded-lg p-3 font-mono overflow-x-auto">
              {visibleCases[activeTab].output}
            </pre>
          </div>
          {visibleCases[activeTab].explanation && (
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1">Explanation</p>
              <p className="text-xs text-slate-400 leading-relaxed">{visibleCases[activeTab].explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestcasePanel;
