import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Send,
  AlertTriangle,
  Play,
  Check,
  Maximize2,
  Monitor,
  Camera,
  Volume2,
  Eye,
  Wifi,
  Terminal,
  Sun,
  Moon,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useMedia } from '../../context/MediaProvider';
import AssessmentMonitoringPanel from '../../components/assessment/AssessmentMonitoringPanel';
import MonacoEditorWrapper from '../../components/assessment/MonacoEditorWrapper';
import { mockMCQQuestions } from '../../constants/assessment_mockData';
import { mockDsaProblems, runMockCode, submitMockCode } from '../../constants/assessment_candidate_mock';
import type { MCQQuestion, MockExecutionResult } from '../../types/assessment';

// Force dev server cache invalidate
const TOTAL_SECONDS = 60 * 45; // 45 min

interface AlertBanner {
  id: string;
  title: string;
  desc: string;
}

const AssessmentTakePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Media context
  const {
    cameraStream,
    screenStream,
    deviceState,
    audioState,
    faceState,
    tabSwitches,
    isFullscreen,
    requestFullscreen,
  } = useMedia();

  // Active section: 'mcq' | 'dsa'
  const [activeSection, setActiveSection] = useState<'mcq' | 'dsa'>('mcq');

  // Indexes for questions
  const [mcqIndex, setMcqIndex] = useState(0);
  const [dsaIndex, setDsaIndex] = useState(0);

  // Timer & state
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [submitted, setSubmitted] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [isFocused, setIsFocused] = useState(true);
  const [fullscreenTimeWarning, setFullscreenTimeWarning] = useState(false);

  // MCQ selections & status
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [mcqStatuses, setMcqStatuses] = useState<Record<string, 'unanswered' | 'answered' | 'marked'>>({});

  // DSA workspace state
  const currentDsaProblem = mockDsaProblems[dsaIndex] || mockDsaProblems[0];
  const [selectedLang, setSelectedLang] = useState('javascript');
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');

  // Custom Input / Testcase output
  const [customInput, setCustomInput] = useState('');
  const [customOutput, setCustomOutput] = useState('');
  const [bottomTab, setBottomTab] = useState<'testcases' | 'console'>('testcases');
  const [consoleResult, setConsoleResult] = useState<MockExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time alert list
  const [alerts, setAlerts] = useState<AlertBanner[]>([]);

  // Prevent multiple double violations for the same condition
  const prevTabSwitches = useRef(0);
  const prevFullscreen = useRef(true);

  // Sync starter code
  useEffect(() => {
    if (currentDsaProblem) {
      const codeKey = `${currentDsaProblem.id}-${selectedLang}`;
      if (!codeMap[codeKey]) {
        setCodeMap((prev) => ({
          ...prev,
          [codeKey]: currentDsaProblem.starterCode[selectedLang] || '',
        }));
      }
    }
  }, [currentDsaProblem, selectedLang, codeMap]);

  const activeCode = currentDsaProblem
    ? codeMap[`${currentDsaProblem.id}-${selectedLang}`] || currentDsaProblem.starterCode[selectedLang] || ''
    : '';

  const handleCodeChange = (newCode: string) => {
    if (currentDsaProblem) {
      setCodeMap((prev) => ({
        ...prev,
        [`${currentDsaProblem.id}-${selectedLang}`]: newCode,
      }));
    }
  };

  // Timer countdown
  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 0) {
          handleAutoSubmit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted]);

  // Track window focus/blur
  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
      setIsFocused(false);
      setViolationCount((c) => c + 1);
      triggerAlert('Window Focus Lost', 'You clicked away from the assessment page.');
    };
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Track tab switches
  useEffect(() => {
    if (tabSwitches > prevTabSwitches.current) {
      setViolationCount((c) => c + 1);
      triggerAlert('Tab Switch Detected', 'Switching tabs or minimizing the window is recorded as a violation.');
      prevTabSwitches.current = tabSwitches;
    }
  }, [tabSwitches]);

  // Track fullscreen exit & durations
  useEffect(() => {
    if (!isFullscreen && prevFullscreen.current) {
      setViolationCount((c) => c + 1);
      triggerAlert('Fullscreen Exited', 'The assessment must be taken in fullscreen mode.');
      prevFullscreen.current = false;
    } else if (isFullscreen) {
      prevFullscreen.current = true;
      setFullscreenTimeWarning(false);
    }
  }, [isFullscreen]);

  // Timer for fullscreen validation duration
  useEffect(() => {
    let warningTimeout: NodeJS.Timeout;
    if (!isFullscreen && !submitted) {
      warningTimeout = setTimeout(() => {
        setFullscreenTimeWarning(true);
      }, 8000); // 8 seconds of disabled fullscreen
    }
    return () => clearTimeout(warningTimeout);
  }, [isFullscreen, submitted]);

  // Periodically check proctoring warnings (face, noise, screen share)
  useEffect(() => {
    const checkInterval = setInterval(() => {
      // Check camera stream
      if (!cameraStream) {
        triggerAlert('Camera Disconnected', 'Please reconnect your camera.');
      }
      // Check face visibility
      if (cameraStream && !faceState.detected) {
        triggerAlert('No Face Detected', 'Please keep your face fully visible to the camera.');
      }
      if (cameraStream && faceState.status === 'Multiple Faces') {
        triggerAlert('Multiple Faces Detected', 'Proctoring flagged more than one person in the video feed.');
      }
      // Check environment noise
      if (audioState.noiseLevel === 'High') {
        triggerAlert('High Noise Detected', 'Please maintain silence in your environment.');
      }
      // Check screen sharing
      if (!screenStream && deviceState.hasScreen === false) {
        triggerAlert('Screen Share Stopped', 'You must keep sharing your screen.');
      }
    }, 4000);

    return () => clearInterval(checkInterval);
  }, [cameraStream, screenStream, faceState, audioState, deviceState]);

  const triggerAlert = (title: string, desc: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setAlerts((prev) => [...prev, { id, title, desc }]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 5000);
  };

  const handleAutoSubmit = () => {
    setSubmitted(true);
  };

  const selectMcqAnswer = (qId: string, optionIdx: number) => {
    setMcqAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
    setMcqStatuses((prev) => ({ ...prev, [qId]: 'answered' }));
  };

  const handleMcqMark = (qId: string) => {
    setMcqStatuses((prev) => ({ ...prev, [qId]: 'marked' }));
  };

  const handleMcqClear = (qId: string) => {
    setMcqAnswers((prev) => ({ ...prev, [qId]: null }));
    setMcqStatuses((prev) => ({ ...prev, [qId]: 'unanswered' }));
  };

  const handleRunCode = async () => {
    if (!currentDsaProblem) return;
    setIsRunning(true);
    setBottomTab('console');
    try {
      const res = await runMockCode(currentDsaProblem.id, selectedLang, activeCode, customInput);
      setConsoleResult(res);
      if (res.type === 'success') {
        setCustomOutput(res.detail);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!currentDsaProblem) return;
    setIsSubmitting(true);
    setBottomTab('console');
    try {
      const res = await submitMockCode(currentDsaProblem.id, selectedLang, activeCode);
      setConsoleResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const activeMcq: MCQQuestion = mockMCQQuestions[mcqIndex] || mockMCQQuestions[0];

  // Calculations for legend/completion
  const mcqAnsweredCount = Object.values(mcqAnswers).filter((a) => a !== null).length;
  const dsaAnsweredCount = Object.keys(codeMap).filter((k) => codeMap[k]?.trim().length > 100).length;

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="bg-slate-800 max-w-2xl w-full rounded-2xl border border-slate-700 p-8 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-500">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Assessment Submitted Successfully!</h2>
            <p className="text-sm text-slate-400">
              Your exam code and response files have been securely transmitted to the TalentForge AI evaluation engine.
            </p>
          </div>

          <div className="border-t border-slate-700 pt-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300">Attempt Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
                <p className="text-[10px] text-slate-500 uppercase font-bold">MCQ SECTION</p>
                <p className="text-lg font-bold text-slate-200 mt-1">
                  {mcqAnsweredCount} / {mockMCQQuestions.length} Answered
                </p>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
                <p className="text-[10px] text-slate-500 uppercase font-bold">DSA PROBLEMS</p>
                <p className="text-lg font-bold text-slate-200 mt-1">
                  {dsaAnsweredCount} / {mockDsaProblems.length} Coded
                </p>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
                <p className="text-[10px] text-slate-500 uppercase font-bold">PROCTORING STATUS</p>
                <p className="text-lg font-bold text-emerald-400 mt-1">Active Monitoring Complete</p>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
                <p className="text-[10px] text-slate-500 uppercase font-bold">VIOLATIONS LOGGED</p>
                <p className="text-lg font-bold text-amber-500 mt-1">
                  {violationCount + tabSwitches} Warnings
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 text-center">
            <button
              onClick={() => navigate('/candidate/assessments')}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-955 text-slate-100 flex flex-col font-sans h-screen overflow-hidden">
      {/* Fullscreen Enforcer Overlay */}
      {!isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/30 max-w-lg w-full p-8 rounded-2xl text-center space-y-6 shadow-2xl">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto animate-pulse" />
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Fullscreen Mode Required</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                To continue the assessment securely and prevent monitoring flags, you must remain in fullscreen mode.
                Exiting fullscreen increments the violation count.
              </p>
            </div>
            {fullscreenTimeWarning && (
              <div className="p-3 bg-red-950/40 border border-red-900/30 text-red-400 text-xs font-semibold rounded-lg animate-pulse">
                CRITICAL WARNING: Fullscreen disabled for too long! Return to fullscreen immediately.
              </div>
            )}
            <button
              onClick={requestFullscreen}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <Maximize2 className="w-4 h-4" />
              Enter Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/80 px-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center font-black text-white text-base">TF</div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              TalentForge AI - DSA Assessment
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                Live
              </span>
            </h1>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveSection('mcq')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
              activeSection === 'mcq' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            MCQ Section
          </button>
          <button
            onClick={() => setActiveSection('dsa')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
              activeSection === 'dsa' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            DSA Section
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer Display */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 font-mono text-sm">
            <Volume2 className="w-4 h-4 text-slate-500" />
            <span>{formatTime(secondsLeft)}</span>
          </div>

          <button
            onClick={() => setSubmitted(true)}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors shadow-md"
          >
            End Assessment
          </button>
        </div>
      </header>

      {/* Main Workspace Split */}
      <div className="flex flex-1 min-h-0 relative">
        
        {/* LEFT COLUMN: Question navigator list & Quick actions */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* Question Navigator Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Question Navigator ({activeSection === 'mcq' ? `${mcqIndex + 1}/${mockMCQQuestions.length}` : `${dsaIndex + 1}/${mockDsaProblems.length}`})
              </h3>

              {activeSection === 'mcq' ? (
                <div className="grid grid-cols-5 gap-2">
                  {mockMCQQuestions.map((q, idx) => {
                    const status = mcqStatuses[q.id] || 'unanswered';
                    const isCurrent = idx === mcqIndex;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setMcqIndex(idx)}
                        className={`w-9 h-9 rounded-lg border text-xs font-bold transition-all flex items-center justify-center ${
                          isCurrent
                            ? 'bg-blue-600 border-blue-500 text-white ring-2 ring-blue-500/20'
                            : status === 'answered'
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : status === 'marked'
                            ? 'bg-violet-600 border-violet-50 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {mockDsaProblems.map((p, idx) => {
                    const hasCoded = codeMap[`${p.id}-${selectedLang}`]?.trim().length > 100;
                    const isCurrent = idx === dsaIndex;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setDsaIndex(idx)}
                        className={`w-14 h-9 rounded-lg border text-xs font-bold transition-all flex items-center justify-center ${
                          isCurrent
                            ? 'bg-blue-600 border-blue-500 text-white ring-2 ring-blue-500/20'
                            : hasCoded
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        Q{idx + 1}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Grid Legend */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Legend</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded bg-emerald-600" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700" />
                    <span>Not Answered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded bg-violet-600" />
                    <span>Marked</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded bg-blue-600 animate-pulse" />
                    <span>Current</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="space-y-2 border-t border-slate-800/85 pt-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Progress</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                  <span>Completed</span>
                  <span>{mcqAnsweredCount + dsaAnsweredCount} / {mockMCQQuestions.length + mockDsaProblems.length}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{
                      width: `${
                        ((mcqAnsweredCount + dsaAnsweredCount) /
                          (mockMCQQuestions.length + mockDsaProblems.length)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 border-t border-slate-800/85 pt-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Actions</h3>
              <div className="space-y-2">
                {activeSection === 'mcq' ? (
                  <>
                    <button
                      onClick={() => handleMcqMark(activeMcq.id)}
                      className="w-full py-2 bg-violet-600/20 hover:bg-violet-600/35 border border-violet-500/40 text-violet-300 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Mark for Review
                    </button>
                    <button
                      onClick={() => handleMcqClear(activeMcq.id)}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Clear Response
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      if (currentDsaProblem) {
                        setCodeMap((prev) => ({
                          ...prev,
                          [`${currentDsaProblem.id}-${selectedLang}`]: currentDsaProblem.starterCode[selectedLang] || '',
                        }));
                      }
                    }}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Reset Starter Code
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500 text-center leading-relaxed">
            Evaluation log and screen shares are cryptographically recorded. Do not switch windows.
          </div>
        </aside>

        {/* CENTER COLUMN: Question Description / MCQ details & Testcase Runners */}
        <section className="flex-1 bg-slate-950 border-r border-slate-850 flex flex-col min-w-0 overflow-y-auto">
          {activeSection === 'mcq' ? (
            // Render MCQ Question Panel
            <div className="p-6 max-w-3xl mx-auto w-full space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold bg-primary-600/10 border border-primary-500/35 px-2.5 py-1 rounded-full text-primary-400">
                  Question {mcqIndex + 1}
                </span>
                <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                  {activeMcq.category}
                </span>
                <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/25">
                  {activeMcq.difficulty}
                </span>
                <span className="text-xs text-slate-500 ml-auto">{activeMcq.marks} Marks</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-sm font-semibold text-slate-100 leading-relaxed shadow-sm">
                {activeMcq.question}
              </div>

              <div className="space-y-3 pt-3">
                {activeMcq.options.map((opt, idx) => {
                  const isSelected = mcqAnswers[activeMcq.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => selectMcqAnswer(activeMcq.id, idx)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                        isSelected
                          ? 'border-primary-500 bg-primary-500/10 shadow-lg text-white'
                          : 'border-slate-850 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                        isSelected ? 'bg-primary-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-xs md:text-sm font-medium">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-6 mt-8">
                <button
                  onClick={() => setMcqIndex((i) => Math.max(0, i - 1))}
                  disabled={mcqIndex === 0}
                  className="px-4 py-2 border border-slate-800 text-slate-300 hover:bg-slate-900 text-xs font-semibold rounded-lg disabled:opacity-40"
                >
                  Previous
                </button>
                {mcqIndex < mockMCQQuestions.length - 1 ? (
                  <button
                    onClick={() => setMcqIndex((i) => i + 1)}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-750 text-white text-xs font-semibold rounded-lg shadow"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveSection('dsa')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5"
                  >
                    Proceed to Coding <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            // Render DSA Problem Description & Testcases
            <div className="flex flex-col h-full min-h-0">
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold bg-primary-600/10 border border-primary-500/35 px-2.5 py-1 rounded-full text-primary-400">
                    Question {dsaIndex + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                    {currentDsaProblem.category}
                  </span>
                  <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/25">
                    {currentDsaProblem.difficulty}
                  </span>
                  <span className="text-xs text-slate-500 ml-auto">{currentDsaProblem.points} Points</span>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-white">{currentDsaProblem.title}</h2>
                  <p className="text-slate-300 text-sm whitespace-pre-line leading-relaxed">
                    {currentDsaProblem.statement}
                  </p>
                </div>

                {/* Examples */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Examples</h3>
                  <div className="space-y-3">
                    {currentDsaProblem.examples.map((ex, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Example {idx + 1}</p>
                        <div className="space-y-1 font-mono text-xs text-slate-300">
                          <div className="flex">
                            <span className="text-slate-500 w-16 flex-shrink-0">Input:</span>
                            <code>{ex.input}</code>
                          </div>
                          <div className="flex">
                            <span className="text-slate-500 w-16 flex-shrink-0">Output:</span>
                            <code className="text-emerald-400">{ex.output}</code>
                          </div>
                          {ex.explanation && (
                            <p className="text-slate-450 mt-1 font-sans text-xs leading-normal">{ex.explanation}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Constraints */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Constraints</h3>
                  <ul className="space-y-1.5 list-disc pl-4 text-xs text-slate-400">
                    {currentDsaProblem.constraints.map((c, idx) => (
                      <li key={idx}>
                        <code className="bg-slate-900 px-1.5 py-0.5 rounded font-mono text-slate-300">{c}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Custom Testcase input panel */}
              <div className="border-t border-slate-800 p-4 bg-slate-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Custom Testcase</h3>
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning || isSubmitting}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/30 rounded-lg transition-colors"
                  >
                    {isRunning ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    Run Code
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Input</label>
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Enter values matching parameter order..."
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Output</label>
                    <textarea
                      value={customOutput}
                      readOnly
                      placeholder="Output values will appear here..."
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: Monaco Code Editor workspace & compiler logs */}
        {activeSection === 'dsa' && (
          <section className="w-[45%] bg-slate-900 flex flex-col flex-shrink-0 min-w-0">
            {/* Toolbar */}
            <div className="h-11 border-b border-slate-800 bg-slate-900/60 px-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none"
                >
                  <option value="javascript">JavaScript (Node.js)</option>
                  <option value="python">Python (3.x)</option>
                  <option value="java">Java (JDK 17)</option>
                  <option value="cpp">C++ (GCC 14)</option>
                </select>

                <button
                  onClick={() => setEditorTheme((t) => (t === 'vs-dark' ? 'light' : 'vs-dark'))}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-855 transition-colors"
                  title="Toggle Editor Theme"
                >
                  {editorTheme === 'vs-dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning || isSubmitting}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-lg disabled:opacity-40"
                >
                  Run Code
                </button>
                <button
                  onClick={handleSubmitCode}
                  disabled={isSubmitting || isRunning}
                  className="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-750 text-white text-xs font-bold rounded-lg disabled:opacity-40 shadow-sm"
                >
                  Submit
                </button>
              </div>
            </div>

            {/* Monaco Editor Container */}
            <div className="flex-1 min-h-0 bg-slate-950">
              <MonacoEditorWrapper
                language={selectedLang}
                value={activeCode}
                onChange={handleCodeChange}
                theme={editorTheme}
              />
            </div>

            {/* Bottom Console tab results panel */}
            <div className="h-48 border-t border-slate-850 flex flex-col flex-shrink-0 bg-slate-950">
              <div className="h-9 bg-slate-900 border-b border-slate-850 px-3 flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => setBottomTab('testcases')}
                  className={`px-3 h-full text-xs font-semibold border-b-2 flex items-center gap-1.5 ${
                    bottomTab === 'testcases'
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Testcases
                </button>
                <button
                  onClick={() => setBottomTab('console')}
                  className={`px-3 h-full text-xs font-semibold border-b-2 flex items-center gap-1.5 ${
                    bottomTab === 'console'
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Terminal className="w-3 h-3" />
                  Console Output
                </button>

                {consoleResult && bottomTab === 'console' && (
                  <div className="ml-auto flex items-center gap-3 text-[10px] font-bold">
                    {consoleResult.runtimeMs > 0 && (
                      <span className="text-slate-400 font-mono">Runtime: {consoleResult.runtimeMs} ms</span>
                    )}
                    {consoleResult.memoryMb > 0 && (
                      <span className="text-slate-400 font-mono">Memory: {consoleResult.memoryMb} MB</span>
                    )}
                    <span className="flex items-center gap-1">
                      {consoleResult.type === 'success' ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Passed
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Compilation Error
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
                {bottomTab === 'testcases' ? (
                  <div className="space-y-3">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Example Testcases</p>
                    <div className="space-y-2">
                      {currentDsaProblem.examples.map((ex, idx) => (
                        <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 space-y-1">
                          <span className="text-[10px] text-slate-500 font-bold">CASE {idx + 1}</span>
                          <div className="flex text-slate-300">
                            <span className="w-12 text-slate-500">Input:</span>
                            <code>{ex.input}</code>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    {isRunning ? (
                      <div className="flex items-center gap-2 text-slate-400">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Running code against test suite...
                      </div>
                    ) : isSubmitting ? (
                      <div className="flex items-center gap-2 text-slate-400">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Submitting and compiling all testcases (including hidden validations)...
                      </div>
                    ) : consoleResult ? (
                      <div className="space-y-2">
                        <p className={`font-bold ${consoleResult.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {consoleResult.message}
                        </p>
                        <pre className="text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800 overflow-x-auto whitespace-pre-wrap">
                          {consoleResult.detail}
                        </pre>

                        {/* Testcase matching details */}
                        {consoleResult.type === 'success' && (
                          <div className="flex flex-wrap gap-2 pt-1.5">
                            {Array.from({ length: consoleResult.totalCount }).map((_, idx) => {
                              const isPassed = idx < consoleResult.passedCount;
                              return (
                                <span
                                  key={idx}
                                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold border flex items-center gap-1 ${
                                    isPassed
                                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                                  }`}
                                >
                                  Testcase {idx + 1} {isPassed ? '✓' : '✗'}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-slate-500 italic">Click "Run Code" or "Submit" to compile and check code performance.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* PERSISTENT AI PROCTORING PANEL SIDEBAR */}
        <aside className="w-64 bg-slate-900 border-l border-slate-800 p-4 overflow-y-auto flex-shrink-0">
          <AssessmentMonitoringPanel
            violationCount={violationCount}
            tabSwitches={tabSwitches}
            isFullscreen={isFullscreen}
            isFocused={isFocused}
          />
        </aside>
      </div>

      {/* Reusable Animated Alert Banners overlay */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-3 p-3 bg-red-955 border border-red-500 text-white rounded-xl shadow-2xl animate-bounce relative"
          >
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-white">{alert.title}</p>
              <p className="text-[10px] text-red-300 leading-normal">{alert.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentTakePage;
