import React, { useState, useEffect } from 'react';
import { Play, Send, Maximize2, Minimize2 } from 'lucide-react';
import type { DSAProblem } from '../../types/assessment';
import MonacoEditorWrapper from './MonacoEditorWrapper';
import LanguageSelector from './LanguageSelector';
import ProblemStatementPanel from './ProblemStatementPanel';
import TestcasePanel from './TestcasePanel';
import ConsolePanel from './ConsolePanel';
import type { ConsoleOutput } from './ConsolePanel';
import AssessmentTimer from './AssessmentTimer';

interface CodingWorkspaceProps {
  problem: DSAProblem;
  totalSeconds: number;
  onSubmit?: (code: string, language: string) => void;
  showTimer?: boolean;
}

type BottomTab = 'testcases' | 'console';

const MOCK_RUN_SUCCESS: ConsoleOutput = {
  type: 'success',
  message: 'All visible test cases passed!',
  detail: 'Runtime: 68 ms\nMemory: 42.1 MB',
  testResults: { passed: 3, total: 3 },
};

const MOCK_RUN_ERROR: ConsoleOutput = {
  type: 'error',
  message: 'Wrong Answer on Test Case 2',
  detail: 'Expected: [1,2]\nGot: [2,1]',
  testResults: { passed: 1, total: 3 },
};

const CodingWorkspace: React.FC<CodingWorkspaceProps> = ({
  problem, totalSeconds, onSubmit, showTimer = true,
}) => {
  const [selectedLang, setSelectedLang] = useState(problem.supportedLanguages[0] ?? 'javascript');
  const [code, setCode] = useState(problem.starterCode[selectedLang] ?? '');
  const [bottomTab, setBottomTab] = useState<BottomTab>('testcases');
  const [consoleOutput, setConsoleOutput] = useState<ConsoleOutput>({ type: 'idle', message: '' });
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    setCode(problem.starterCode[selectedLang] ?? `// Write your ${selectedLang} solution here\n`);
  }, [selectedLang, problem.id]);

  // Timer
  useEffect(() => {
    if (!showTimer) return;
    const interval = setInterval(() => {
      setSecondsLeft(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [showTimer]);

  const handleRun = () => {
    setIsRunning(true);
    setBottomTab('console');
    setTimeout(() => {
      setConsoleOutput(Math.random() > 0.3 ? MOCK_RUN_SUCCESS : MOCK_RUN_ERROR);
      setIsRunning(false);
    }, 1500);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit?.(code, selectedLang);
    }, 1000);
  };

  return (
    <div className={`flex flex-col bg-slate-900 ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'}`}>
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700 flex-shrink-0">
        <LanguageSelector
          value={selectedLang}
          onChange={setSelectedLang}
          languages={problem.supportedLanguages}
        />

        <div className="flex items-center gap-2">
          {showTimer && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-700 rounded-lg">
              <AssessmentTimer secondsLeft={secondsLeft} totalSeconds={totalSeconds} compact />
            </div>
          )}

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-400 border border-emerald-600/50 rounded-lg hover:bg-emerald-600/20 transition-colors disabled:opacity-50"
          >
            {isRunning ? (
              <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            Run
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            Submit
          </button>

          <button
            onClick={() => setIsFullscreen(f => !f)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Split: Problem + Editor */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Problem */}
        <div className="w-[38%] border-r border-slate-700 overflow-hidden flex-shrink-0">
          <ProblemStatementPanel problem={problem} />
        </div>

        {/* Right: Editor + Bottom Panels */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Monaco Editor */}
          <div className="flex-1 min-h-0">
            <MonacoEditorWrapper
              language={selectedLang}
              value={code}
              onChange={setCode}
              theme="vs-dark"
            />
          </div>

          {/* Bottom Panels */}
          <div className="h-44 border-t border-slate-700 flex flex-col flex-shrink-0">
            {/* Tabs */}
            <div className="flex items-center bg-slate-800 border-b border-slate-700">
              {(['testcases', 'console'] as BottomTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setBottomTab(tab)}
                  className={`px-4 py-2 text-xs font-medium capitalize transition-colors border-b-2 ${
                    bottomTab === tab
                      ? 'border-primary-400 text-primary-400'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Panel Content */}
            <div className="flex-1 min-h-0">
              {bottomTab === 'testcases' ? (
                <TestcasePanel problem={problem} />
              ) : (
                <ConsolePanel output={consoleOutput} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingWorkspace;
