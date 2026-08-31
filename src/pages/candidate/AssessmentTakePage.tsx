import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ChevronRight,
  AlertTriangle,
  Play,
  Maximize2,
  Volume2,
  Terminal,
  Sun,
  Moon,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useMedia } from '../../context/MediaProvider';
import AssessmentMonitoringPanel from '../../components/assessment/AssessmentMonitoringPanel';
import MonacoEditorWrapper from '../../components/assessment/MonacoEditorWrapper';
import { assessmentApi } from '../../services/api/assessment.api';
import { runMockCode, submitMockCode } from '../../constants/assessment_candidate_mock';
import type { MockExecutionResult } from '../../types/assessment';

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
  const [searchParams] = useSearchParams();
  const invitationToken = searchParams.get('token') || '';

  // Attempt backend tracking state
  const [attemptId, setAttemptId] = useState<string>('');
  const [attemptDetails, setAttemptDetails] = useState<any>(null);
  const [_isLoadingDetails, setIsLoadingDetails] = useState<boolean>(true);

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

  const assessmentIdFromUrl = id || '';
  const applicationIdFromUrl = searchParams.get('applicationId') || '';

  // Initialize attempt with token if present or query invitation
  useEffect(() => {
    const initAttempt = async () => {
      try {
        let currentAttemptId = attemptId;
        let tokenToUse = invitationToken;

        // If no token in URL, query candidate invitations directly
        if (!tokenToUse) {
          try {
            const invitations = await assessmentApi.getMyAssessmentInvitations();
            for (const inv of (invitations || [])) {
              if (applicationIdFromUrl && inv.application?.id !== applicationIdFromUrl) continue;
              if (inv?.token) {
                if (!assessmentIdFromUrl || inv.assessment?.id === assessmentIdFromUrl || inv.assessmentId === assessmentIdFromUrl) {
                  tokenToUse = inv.token;
                  if (inv.attempt?.id) {
                    currentAttemptId = inv.attempt.id;
                    setAttemptId(inv.attempt.id);
                  }
                  break;
                }
              }
            }
          } catch (e) {
            console.warn('Failed to query candidate invitations:', e);
          }
        }

        if (tokenToUse && !currentAttemptId) {
          try {
            const startRes = await assessmentApi.startAssessmentAttempt(tokenToUse);
            if (startRes?.attemptId) {
              currentAttemptId = startRes.attemptId;
              setAttemptId(startRes.attemptId);
            }
          } catch (err: any) {
            console.warn('Attempt might already be started:', err);
          }
        }

        if (currentAttemptId) {
          const details = await assessmentApi.getAttemptDetails(currentAttemptId);
          if (details) {
            setAttemptDetails(details);
            if (details.remainingSeconds !== undefined) {
              setSecondsLeft(details.remainingSeconds);
            }
          }
        }
      } catch (err: any) {
        console.error('Failed to load attempt details:', err);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    initAttempt();
  }, [invitationToken, attemptId, applicationIdFromUrl, assessmentIdFromUrl]);

  // Extract real sections and questions from attemptDetails
  const allSections: any[] = attemptDetails?.sections || [];
  
  // Flatten all questions by type
  const realMcqQuestions = allSections.flatMap((s: any) => (s.questions || []).filter((q: any) => q.type === 'MCQ' || q.type === 'MULTIPLE_CHOICE' || (q.options && q.options.length > 0)));
  const realDsaQuestions = allSections.flatMap((s: any) => (s.questions || []).filter((q: any) => q.type === 'DSA' || q.type === 'CODING' || q.type === 'PROJECT'));

  const activeMCQs = realMcqQuestions;
  const activeDSAs = realDsaQuestions;

  // Active section: 'mcq' | 'dsa'
  const [activeSection, setActiveSection] = useState<'mcq' | 'dsa'>('mcq');

  // Auto-switch between sections if one is empty
  useEffect(() => {
    if (activeMCQs.length === 0 && activeDSAs.length > 0 && activeSection !== 'dsa') {
      setActiveSection('dsa');
    } else if (activeDSAs.length === 0 && activeMCQs.length > 0 && activeSection !== 'mcq') {
      setActiveSection('mcq');
    }
  }, [activeMCQs.length, activeDSAs.length, activeSection]);

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

  // DSA workspace state with safe default
  const currentDsaProblem: any = activeDSAs[dsaIndex] || activeDSAs[0] || {
    id: 'placeholder-dsa',
    title: 'Coding Problem',
    problemStatement: 'No coding problem available in this section.',
    category: 'DSA',
    difficulty: 'MEDIUM',
    marks: 10,
    starterCode: {},
    sampleTestcases: [],
    examples: [],
    constraints: []
  };
  const [selectedLang, setSelectedLang] = useState('javascript');
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('light');

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
        const starter = currentDsaProblem.starterCode?.[selectedLang] || 
                       (typeof currentDsaProblem.starterCode === 'string' ? currentDsaProblem.starterCode : '') ||
                       '// Write your solution here\nfunction solution() {\n  \n}\n';
        setCodeMap((prev) => ({
          ...prev,
          [codeKey]: starter,
        }));
      }
    }
  }, [currentDsaProblem, selectedLang, codeMap]);

  const activeCode = currentDsaProblem
    ? codeMap[`${currentDsaProblem.id}-${selectedLang}`] || 
      currentDsaProblem.starterCode?.[selectedLang] || 
      (typeof currentDsaProblem.starterCode === 'string' ? currentDsaProblem.starterCode : '') ||
      ''
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
    let warningTimeout: ReturnType<typeof setTimeout>;
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

  const handleAutoSubmit = async () => {
    if (attemptId) {
      try {
        await assessmentApi.submitAssessmentAttempt(attemptId);
      } catch (err) {
        console.error('Auto-submit attempt error:', err);
      }
    }
    setSubmitted(true);
  };

  const handleManualSubmit = async () => {
    if (attemptId) {
      try {
        await assessmentApi.submitAssessmentAttempt(attemptId);
        toast.success('Assessment submitted successfully!');
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Assessment submission recorded.');
      }
    }
    setSubmitted(true);
  };

  const selectMcqAnswer = (qId: string, optionIdx: number, optionId?: string) => {
    setMcqAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
    setMcqStatuses((prev) => ({ ...prev, [qId]: 'answered' }));

    // Send answer to backend if attempt is active
    if (attemptId) {
      const selectedOptionId = optionId || activeMcq.options?.[optionIdx]?.id || String(optionIdx);
      assessmentApi.saveAssessmentAnswer(attemptId, qId, {
        selectedOptionIds: [selectedOptionId],
        meta: {
          answeredAt: new Date().toISOString(),
          timeSpentSeconds: 10
        }
      }).catch(err => console.warn('Failed to save MCQ answer:', err));
    }
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

    // Save code to backend if attempt is active
    if (attemptId && currentDsaProblem.id) {
      assessmentApi.saveAssessmentAnswer(attemptId, currentDsaProblem.id, {
        codeResponse: {
          code: activeCode,
          language: selectedLang
        },
        meta: {
          language: selectedLang,
          languageId: selectedLang,
          action: 'run_code',
          answeredAt: new Date().toISOString()
        }
      }).catch(err => console.warn('Failed to save code answer:', err));
    }

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

    // Save and submit code to backend if attempt is active
    if (attemptId && currentDsaProblem.id) {
      assessmentApi.saveAssessmentAnswer(attemptId, currentDsaProblem.id, {
        codeResponse: {
          code: activeCode,
          language: selectedLang
        },
        meta: {
          language: selectedLang,
          languageId: selectedLang,
          action: 'submit_code',
          answeredAt: new Date().toISOString()
        }
      }).catch(err => console.warn('Failed to save submitted code answer:', err));
    }

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

  const activeMcq: any = activeMCQs[mcqIndex] || activeMCQs[0] || {
    id: 'placeholder',
    question: 'No questions available in this section.',
    options: [],
    category: 'General',
    difficulty: 'EASY',
    marks: 0
  };

  // Calculations for legend/completion
  const totalQuestions = activeMCQs.length + activeDSAs.length;
  const mcqAnsweredCount = Object.values(mcqAnswers).filter((a) => a !== null).length;
  const dsaAnsweredCount = activeDSAs.filter((p) => {
    const code = codeMap[`${p.id}-${selectedLang}`] || codeMap[p.id];
    const starter = p.starterCode?.[selectedLang] || (typeof p.starterCode === 'string' ? p.starterCode : '') || '';
    return code && code.trim().length > 10 && code.trim() !== starter.trim();
  }).length;
  const totalAnsweredCount = Math.min(totalQuestions, mcqAnsweredCount + dsaAnsweredCount);

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
        <div className="bg-white max-w-2xl w-full rounded-2xl border border-slate-200 p-8 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Assessment Submitted Successfully!</h2>
            <p className="text-sm text-slate-500">
              Your exam code and response files have been securely transmitted to the TalentForge AI evaluation engine.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-800">Attempt Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-500 uppercase font-bold">MCQ SECTION</p>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  {mcqAnsweredCount} / {activeMCQs.length} Answered
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-500 uppercase font-bold">DSA PROBLEMS</p>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  {dsaAnsweredCount} / {activeDSAs.length} Coded
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-500 uppercase font-bold">PROCTORING STATUS</p>
                <p className="text-lg font-bold text-emerald-600 mt-1">Active Monitoring Complete</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-500 uppercase font-bold">VIOLATIONS LOGGED</p>
                <p className="text-lg font-bold text-amber-600 mt-1">
                  {violationCount + tabSwitches} Warnings
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 text-center">
            <button
              onClick={() => navigate('/candidate/assessments')}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-md"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!_isLoadingDetails && totalQuestions === 0) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 p-8 shadow-xl text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-500">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">No Questions Available</h2>
            <p className="text-sm text-slate-500 mt-1">This assessment does not have any active questions.</p>
          </div>
          <button
            onClick={handleManualSubmit}
            className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-md"
          >
            End Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans h-screen overflow-hidden">
      {/* Fullscreen Enforcer Overlay */}
      {!isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-rose-200 max-w-lg w-full p-8 rounded-2xl text-center space-y-6 shadow-2xl">
            <AlertCircle className="w-16 h-16 text-rose-600 mx-auto animate-pulse" />
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Fullscreen Mode Required</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                To continue the assessment securely and prevent monitoring flags, you must remain in fullscreen mode.
                Exiting fullscreen increments the violation count.
              </p>
            </div>
            {fullscreenTimeWarning && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg animate-pulse">
                CRITICAL WARNING: Fullscreen disabled for too long! Return to fullscreen immediately.
              </div>
            )}
            <button
              onClick={requestFullscreen}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Maximize2 className="w-4 h-4" />
              Enter Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="h-14 border-b border-slate-200 bg-white px-4 flex items-center justify-between flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center font-black text-white text-base shadow-sm">TF</div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              {attemptDetails?.assessmentTitle || 'TalentForge Technical Assessment'}
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                Live
              </span>
            </h1>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          {activeMCQs.length > 0 && (
            <button
              onClick={() => setActiveSection('mcq')}
              className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
                activeSection === 'mcq' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              MCQ Section ({activeMCQs.length})
            </button>
          )}
          {activeDSAs.length > 0 && (
            <button
              onClick={() => setActiveSection('dsa')}
              className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
                activeSection === 'dsa' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              DSA Section ({activeDSAs.length})
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Timer Display */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 text-slate-700 font-mono text-sm font-semibold">
            <Volume2 className="w-4 h-4 text-slate-500" />
            <span>{formatTime(secondsLeft)}</span>
          </div>

          <button
            onClick={handleManualSubmit}
            className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
          >
            End Assessment
          </button>
        </div>
      </header>

      {/* Main Workspace Split */}
      <div className="flex flex-1 min-h-0 relative">
        
        {/* LEFT COLUMN: Question navigator list & Quick actions */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* Question Navigator Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Question Navigator ({activeSection === 'mcq' ? (activeMCQs.length > 0 ? `${mcqIndex + 1}/${activeMCQs.length}` : '0/0') : (activeDSAs.length > 0 ? `${dsaIndex + 1}/${activeDSAs.length}` : '0/0')})
              </h3>

              {activeSection === 'mcq' ? (
                <div className="grid grid-cols-5 gap-2">
                  {activeMCQs.map((q: any, idx: number) => {
                    const status = mcqStatuses[q.id] || 'unanswered';
                    const isCurrent = idx === mcqIndex;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setMcqIndex(idx)}
                        className={`w-9 h-9 rounded-lg border text-xs font-bold transition-all flex items-center justify-center ${
                          isCurrent
                            ? 'bg-primary-600 border-primary-600 text-white shadow-sm ring-2 ring-primary-500/20'
                            : status === 'answered'
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : status === 'marked'
                            ? 'bg-primary-50 border-primary-300 text-primary-700'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {activeDSAs.map((p: any, idx: number) => {
                    const hasCoded = Boolean(codeMap[`${p.id}-${selectedLang}`]?.trim());
                    const isCurrent = idx === dsaIndex;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setDsaIndex(idx)}
                        className={`w-14 h-9 rounded-lg border text-xs font-bold transition-all flex items-center justify-center ${
                          isCurrent
                            ? 'bg-primary-600 border-primary-600 text-white shadow-sm ring-2 ring-primary-500/20'
                            : hasCoded
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        Q{idx + 1}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Grid Legend */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Legend</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded bg-slate-900" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-300" />
                    <span>Not Answered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded bg-primary-100 border border-primary-300" />
                    <span>Marked</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded bg-primary-600" />
                    <span>Current</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="space-y-2 border-t border-slate-200 pt-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                  <span>Completed</span>
                  <span>{totalAnsweredCount} / {totalQuestions}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-primary-600 transition-all duration-300"
                    style={{
                      width: `${
                        (totalAnsweredCount /
                          Math.max(1, totalQuestions)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 border-t border-slate-200 pt-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Actions</h3>
              <div className="space-y-2">
                {activeSection === 'mcq' ? (
                  <>
                    <button
                      onClick={() => handleMcqMark(activeMcq.id)}
                      className="w-full py-2 bg-primary-50 hover:bg-primary-100 border border-primary-200 text-primary-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Mark for Review
                    </button>
                    <button
                      onClick={() => handleMcqClear(activeMcq.id)}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
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
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Reset Starter Code
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-slate-200 text-[10px] text-slate-500 text-center leading-relaxed">
            Evaluation log and screen shares are cryptographically recorded. Do not switch windows.
          </div>
        </aside>

        {/* CENTER COLUMN: Question Description / MCQ details & Testcase Runners */}
        <section className="flex-1 bg-slate-50/60 border-r border-slate-200 flex flex-col min-w-0 overflow-y-auto">
          {activeSection === 'mcq' ? (
            // Render MCQ Question Panel
            <div className="p-6 max-w-3xl mx-auto w-full space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold bg-primary-50 border border-primary-200 px-2.5 py-1 rounded-full text-primary-700">
                  Question {mcqIndex + 1}
                </span>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                  {activeMcq.category}
                </span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {activeMcq.difficulty}
                </span>
                <span className="text-xs text-slate-500 font-medium ml-auto">{activeMcq.marks} Marks</span>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-xl text-sm font-semibold text-slate-900 leading-relaxed shadow-sm space-y-2">
                <p className="font-bold text-slate-900 text-base">{activeMcq.title || `Question ${mcqIndex + 1}`}</p>
                <p className="text-slate-700 text-sm font-normal">{activeMcq.problemStatement || activeMcq.description || activeMcq.question}</p>
              </div>

              <div className="space-y-3 pt-3">
                {(activeMcq.options || []).map((opt: any, idx: number) => {
                  const isSelected = mcqAnswers[activeMcq.id] === idx;
                  const optText = typeof opt === 'string' ? opt : (opt?.text || opt?.optionText || '');
                  const optId = typeof opt === 'object' && opt?.id ? opt.id : undefined;

                  return (
                    <button
                      key={idx}
                      onClick={() => selectMcqAnswer(activeMcq.id, idx, optId)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                        isSelected
                          ? 'border-primary-600 bg-primary-50/70 shadow-sm text-slate-900 font-medium'
                          : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 shadow-sm'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                        isSelected ? 'bg-primary-600 text-white shadow-sm' : 'bg-slate-100 border border-slate-200 text-slate-600'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-xs md:text-sm">{optText}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-8">
                <button
                  onClick={() => setMcqIndex((i) => Math.max(0, i - 1))}
                  disabled={mcqIndex === 0}
                  className="px-4 py-2 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg shadow-sm disabled:opacity-40"
                >
                  Previous
                </button>
                {mcqIndex < activeMCQs.length - 1 ? (
                  <button
                    onClick={() => setMcqIndex((i) => i + 1)}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                  >
                    Next Question
                  </button>
                ) : activeDSAs.length > 0 ? (
                  <button
                    onClick={() => setActiveSection('dsa')}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                  >
                    Proceed to Coding <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleManualSubmit}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" /> Submit Assessment
                  </button>
                )}
              </div>
            </div>
          ) : (
            // Render DSA Problem Description & Testcases
            <div className="flex flex-col h-full min-h-0">
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold bg-primary-50 border border-primary-200 px-2.5 py-1 rounded-full text-primary-700">
                    Question {dsaIndex + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                    {currentDsaProblem.category || currentDsaProblem.type || 'DSA'}
                  </span>
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    {currentDsaProblem.difficulty || 'MEDIUM'}
                  </span>
                  <span className="text-xs text-slate-500 font-medium ml-auto">{currentDsaProblem.marks || currentDsaProblem.points || 10} Marks</span>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-900">{currentDsaProblem.title}</h2>
                  <p className="text-slate-700 text-sm whitespace-pre-line leading-relaxed">
                    {currentDsaProblem.problemStatement || currentDsaProblem.description || currentDsaProblem.statement}
                  </p>
                </div>

                {/* Sample Testcases / Examples */}
                {(currentDsaProblem.sampleTestcases || currentDsaProblem.examples || []).length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Example Testcases</h3>
                    {(currentDsaProblem.sampleTestcases || currentDsaProblem.examples || []).map((ex: any, idx: number) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs font-mono shadow-sm">
                        <div>
                          <span className="text-slate-500 font-sans font-semibold">Input: </span> <span className="text-slate-800">{ex.input}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-sans font-semibold">Expected Output: </span> <span className="text-primary-700 font-semibold">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className="text-slate-600 font-sans text-[11px] pt-1 border-t border-slate-100">
                            <span className="font-bold text-slate-500">Explanation: </span>{ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Examples */}
                {(currentDsaProblem.examples || []).length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Examples</h3>
                    <div className="space-y-3">
                      {(currentDsaProblem.examples || []).map((ex: any, idx: number) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-sm">
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Example {idx + 1}</p>
                          <div className="space-y-1 font-mono text-xs text-slate-700">
                            <div className="flex">
                              <span className="text-slate-500 w-16 flex-shrink-0 font-sans font-semibold">Input:</span>
                              <code className="text-slate-800">{ex.input}</code>
                            </div>
                            <div className="flex">
                              <span className="text-slate-500 w-16 flex-shrink-0 font-sans font-semibold">Output:</span>
                              <code className="text-primary-700 font-semibold">{ex.output}</code>
                            </div>
                            {ex.explanation && (
                              <p className="text-slate-600 mt-1 font-sans text-xs leading-normal">{ex.explanation}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Constraints */}
                {(currentDsaProblem.constraints || []).length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Constraints</h3>
                    <ul className="space-y-1.5 list-disc pl-4 text-xs text-slate-600">
                      {(currentDsaProblem.constraints || []).map((c: string, idx: number) => (
                        <li key={idx}>
                          <code className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-800 text-xs">{c}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Custom Testcase input panel */}
              <div className="border-t border-slate-200 p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Custom Testcase</h3>
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning || isSubmitting}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-50 border border-primary-200 rounded-lg transition-colors shadow-sm"
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono text-xs text-slate-800 focus:outline-none focus:border-primary-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Output</label>
                    <textarea
                      value={customOutput}
                      readOnly
                      placeholder="Output values will appear here..."
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono text-xs text-slate-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* DSA Problem Navigation Controls */}
              <div className="border-t border-slate-200 p-4 bg-slate-50 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (dsaIndex > 0) {
                      setDsaIndex((i) => i - 1);
                    } else if (activeMCQs.length > 0) {
                      setActiveSection('mcq');
                    }
                  }}
                  disabled={dsaIndex === 0 && activeMCQs.length === 0}
                  className="px-4 py-2 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg shadow-sm disabled:opacity-40"
                >
                  {dsaIndex === 0 && activeMCQs.length > 0 ? '← Back to MCQs' : 'Previous Problem'}
                </button>
                {dsaIndex < activeDSAs.length - 1 ? (
                  <button
                    onClick={() => setDsaIndex((i) => i + 1)}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1"
                  >
                    Next Problem <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleManualSubmit}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" /> Submit Assessment
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: Monaco Code Editor workspace & compiler logs */}
        {activeSection === 'dsa' && (
          <section className="w-[45%] bg-white flex flex-col flex-shrink-0 min-w-0 border-r border-slate-200">
            {/* Toolbar */}
            <div className="h-11 border-b border-slate-200 bg-white px-3 flex items-center justify-between flex-shrink-0 shadow-sm">
              <div className="flex items-center gap-2">
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg px-2.5 py-1 focus:outline-none focus:border-primary-500"
                >
                  <option value="javascript">JavaScript (Node.js)</option>
                  <option value="python">Python (3.x)</option>
                  <option value="java">Java (JDK 17)</option>
                  <option value="cpp">C++ (GCC 14)</option>
                </select>

                <button
                  onClick={() => setEditorTheme((t) => (t === 'vs-dark' ? 'light' : 'vs-dark'))}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  title="Toggle Editor Theme"
                >
                  {editorTheme === 'vs-dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning || isSubmitting}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg disabled:opacity-40 shadow-sm"
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
            <div className="flex-1 min-h-0 bg-white">
              <MonacoEditorWrapper
                language={selectedLang}
                value={activeCode}
                onChange={handleCodeChange}
                theme={editorTheme}
              />
            </div>

            {/* Bottom Console tab results panel */}
            <div className="h-48 border-t border-slate-200 flex flex-col flex-shrink-0 bg-slate-50">
              <div className="h-9 bg-white border-b border-slate-200 px-3 flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => setBottomTab('testcases')}
                  className={`px-3 h-full text-xs font-semibold border-b-2 flex items-center gap-1.5 ${
                    bottomTab === 'testcases'
                      ? 'border-primary-600 text-primary-700'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Testcases
                </button>
                <button
                  onClick={() => setBottomTab('console')}
                  className={`px-3 h-full text-xs font-semibold border-b-2 flex items-center gap-1.5 ${
                    bottomTab === 'console'
                      ? 'border-primary-600 text-primary-700'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Terminal className="w-3 h-3" />
                  Console Output
                </button>

                {consoleResult && bottomTab === 'console' && (
                  <div className="ml-auto flex items-center gap-3 text-[10px] font-bold">
                    {consoleResult.runtimeMs > 0 && (
                      <span className="text-slate-500 font-mono">Runtime: {consoleResult.runtimeMs} ms</span>
                    )}
                    {consoleResult.memoryMb > 0 && (
                      <span className="text-slate-500 font-mono">Memory: {consoleResult.memoryMb} MB</span>
                    )}
                    <span className="flex items-center gap-1">
                      {consoleResult.type === 'success' ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Passed
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1">
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
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-sans">Example Testcases</p>
                    <div className="space-y-2">
                      {(currentDsaProblem.sampleTestcases || currentDsaProblem.examples || []).map((ex: any, idx: number) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-1 shadow-sm">
                          <span className="text-[10px] text-slate-500 font-bold font-sans">CASE {idx + 1}</span>
                          <div className="flex text-slate-700">
                            <span className="w-12 text-slate-500 font-sans font-semibold">Input:</span>
                            <code>{ex.input}</code>
                          </div>
                          <div className="flex text-slate-700">
                            <span className="w-12 text-slate-500 font-sans font-semibold">Output:</span>
                            <code className="text-primary-700 font-semibold">{ex.output}</code>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    {isRunning ? (
                      <div className="flex items-center gap-2 text-slate-500">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Running code against test suite...
                      </div>
                    ) : isSubmitting ? (
                      <div className="flex items-center gap-2 text-slate-500">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Submitting and compiling all testcases (including hidden validations)...
                      </div>
                    ) : consoleResult ? (
                      <div className="space-y-2">
                        <p className={`font-bold ${consoleResult.type === 'success' ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {consoleResult.message}
                        </p>
                        <pre className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 overflow-x-auto whitespace-pre-wrap shadow-sm">
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
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                      : 'bg-rose-50 border-rose-200 text-rose-700'
                                  }`}
                                >
                                  <span>Testcase {idx + 1}</span>
                                  {isPassed ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-rose-600" />}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic font-sans">Click "Run Code" or "Submit" to compile and check code performance.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* PERSISTENT AI PROCTORING PANEL SIDEBAR */}
        <aside className="w-64 bg-white border-l border-slate-200 p-4 overflow-y-auto flex-shrink-0">
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
            className="flex items-start gap-3 p-3 bg-white border border-rose-300 text-slate-800 rounded-xl shadow-2xl animate-bounce relative"
          >
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-900">{alert.title}</p>
              <p className="text-[10px] text-rose-700 leading-normal">{alert.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentTakePage;
