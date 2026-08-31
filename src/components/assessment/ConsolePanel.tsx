import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export interface ConsoleOutput {
  type: 'idle' | 'success' | 'error' | 'info';
  message: string;
  detail?: string;
  testResults?: {
    passed: number;
    total: number;
  };
}

interface ConsolePanelProps {
  output: ConsoleOutput | null;
}

const ConsolePanel: React.FC<ConsolePanelProps> = ({ output }) => {
  if (!output) {
    return (
      <div className="h-full bg-slate-900 flex items-center justify-center text-slate-500 text-xs font-mono">
        Click "Run" to test your code against visible test cases.
      </div>
    );
  }

  const isSuccess = output.type === 'success';

  return (
    <div className="flex flex-col h-full bg-slate-900 p-3 overflow-y-auto font-mono text-xs">
      <div className="flex items-center gap-2 mb-2">
        {isSuccess ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        ) : output.type === 'error' ? (
          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
        )}
        <span className={isSuccess ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
          {output.message}
        </span>
        {output.testResults && (
          <span className="text-slate-400 text-[11px] ml-auto">
            Passed {output.testResults.passed}/{output.testResults.total} tests
          </span>
        )}
      </div>

      {output.detail && (
        <pre className="text-slate-300 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60 overflow-x-auto whitespace-pre-wrap">
          {output.detail}
        </pre>
      )}
    </div>
  );
};

export default ConsolePanel;
