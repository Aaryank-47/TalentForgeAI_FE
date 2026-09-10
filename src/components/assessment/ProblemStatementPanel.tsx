import React from 'react';
import type { DSAProblem } from '../../types/assessment';

interface ProblemStatementPanelProps {
  problem: DSAProblem;
}

const ProblemStatementPanel: React.FC<ProblemStatementPanelProps> = ({ problem }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 overflow-y-auto p-4 space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {problem.category}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary-900/40 text-primary-300 border border-primary-700/50">
            {problem.difficulty}
          </span>
        </div>
        <h2 className="text-lg font-bold text-white">{problem.title}</h2>
      </div>

      <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
        {problem.statement || (problem as any).description}
      </div>

      {problem.constraints && problem.constraints.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Constraints</h3>
          <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 bg-slate-800/60 rounded-lg p-3 border border-slate-700/50">
            {problem.constraints.map((c, i) => (
              <li key={i} className="font-mono text-[11px]">{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProblemStatementPanel;
