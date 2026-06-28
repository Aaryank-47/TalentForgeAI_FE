import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera, Mic, Monitor, Phone, Maximize2, Minimize2,
  StickyNote, Code2, Folder, Terminal, ChevronRight, ChevronDown,
  FileCode, FolderOpen, Plus
} from 'lucide-react';
import MonacoEditorWrapper from '../../components/assessment/MonacoEditorWrapper';
import LanguageSelector from '../../components/assessment/LanguageSelector';
import AssessmentTimer from '../../components/assessment/AssessmentTimer';

const TOTAL_SECONDS = 60 * 60; // 1 hour

// Mock file explorer
const FILE_TREE = [
  { name: 'src', type: 'folder', children: [
    { name: 'index.js', type: 'file' },
    { name: 'App.js', type: 'file' },
    { name: 'api.js', type: 'file' },
  ]},
  { name: 'package.json', type: 'file' },
  { name: 'README.md', type: 'file' },
];

type ChatMessage = { role: 'recruiter' | 'candidate'; text: string; time: string };

const MOCK_CHAT: ChatMessage[] = [
  { role: 'recruiter', text: 'Hi! Welcome to the live coding session. Please take a moment to read the problem statement.', time: '09:00' },
  { role: 'recruiter', text: 'Feel free to ask me any questions about the requirements.', time: '09:01' },
];

const LiveMachineCodingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState('javascript');
  const [code, setCode] = useState(`// Live Machine Coding Session\n// Build a simple Express.js REST API\n\nconst express = require('express');\nconst app = express();\n\napp.use(express.json());\n\n// TODO: Implement the required endpoints\n\napp.listen(3000, () => console.log('Server running on port 3000'));\n`);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_CHAT);
  const [chatInput, setChatInput] = useState('');
  const [notes, setNotes] = useState('Session Notes:\n\n- Build REST API with Express.js\n- Endpoints: GET /users, POST /users, DELETE /users/:id\n- In-memory storage is fine\n');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));
  const [activeFile, setActiveFile] = useState('index.js');
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [outputLines] = useState([
    '> node index.js',
    'Server running on port 3000',
    '',
    '> Waiting for requests...',
  ]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    const interval = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFolder = (name: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setChatMessages(m => [...m, { role: 'candidate', text: chatInput.trim(), time: now }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(m => [...m, {
        role: 'recruiter',
        text: 'Got it! Feel free to continue. You\'re doing great.',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 2000);
  };

  return (
    <div className={`bg-slate-900 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'}`}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">TalentForge Live</span>
          </div>
          <div className="w-px h-5 bg-slate-600" />
          <span className="text-xs text-slate-400">Machine Coding Interview</span>
        </div>

        <div className="flex items-center gap-3">
          <AssessmentTimer secondsLeft={secondsLeft} totalSeconds={TOTAL_SECONDS} compact />

          {/* Participant info */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-700 rounded-lg">
              <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center text-[9px] font-bold text-white">R</div>
              <span className="text-[10px] text-slate-300">Recruiter</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-recording-pulse" />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-700 rounded-lg">
              <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[9px] font-bold text-white">C</div>
              <span className="text-[10px] text-slate-300">You</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-recording-pulse" />
            </div>
          </div>

          <LanguageSelector value={selectedLang} onChange={setSelectedLang} />

          <button
            onClick={() => setIsFullscreen(f => !f)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => navigate('/candidate/assessments')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 rotate-[135deg]" />
            End Session
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Left: File Explorer (collapsible) */}
        {showFileExplorer && (
          <div className="w-48 flex-shrink-0 bg-slate-800 border-r border-slate-700 flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
              <div className="flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Explorer</span>
              </div>
              <button className="p-0.5 rounded hover:bg-slate-700 text-slate-500 hover:text-slate-300">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              {FILE_TREE.map(item => (
                <div key={item.name}>
                  {item.type === 'folder' ? (
                    <>
                      <button
                        onClick={() => toggleFolder(item.name)}
                        className="w-full flex items-center gap-1.5 px-3 py-1 text-[11px] text-slate-300 hover:bg-slate-700/50 transition-colors"
                      >
                        {expandedFolders.has(item.name)
                          ? <ChevronDown className="w-3 h-3" />
                          : <ChevronRight className="w-3 h-3" />
                        }
                        <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                        {item.name}
                      </button>
                      {expandedFolders.has(item.name) && item.children?.map(child => (
                        <button
                          key={child.name}
                          onClick={() => setActiveFile(child.name)}
                          className={`w-full flex items-center gap-1.5 pl-7 pr-3 py-1 text-[11px] transition-colors ${
                            activeFile === child.name
                              ? 'bg-primary-600/30 text-primary-300'
                              : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
                          }`}
                        >
                          <FileCode className="w-3.5 h-3.5 text-slate-500" />
                          {child.name}
                        </button>
                      ))}
                    </>
                  ) : (
                    <button
                      onClick={() => setActiveFile(item.name)}
                      className={`w-full flex items-center gap-1.5 px-3 py-1 text-[11px] transition-colors ${
                        activeFile === item.name
                          ? 'bg-primary-600/30 text-primary-300'
                          : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5 text-slate-500" />
                      {item.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Center: Editor + Output */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tab bar */}
          <div className="flex items-center bg-slate-800 border-b border-slate-700 px-2 gap-1">
            <button
              onClick={() => setShowFileExplorer(f => !f)}
              className="p-1.5 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-700 mr-1"
              title="Toggle Explorer"
            >
              <Folder className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 rounded-t-lg border-t border-l border-r border-slate-600 text-[11px] text-slate-300">
              <FileCode className="w-3 h-3 text-amber-400" />
              {activeFile}
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0">
            <MonacoEditorWrapper
              language={selectedLang}
              value={code}
              onChange={setCode}
              theme="vs-dark"
            />
          </div>

          {/* Output Console */}
          <div className="h-32 border-t border-slate-700 bg-slate-950 flex-shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 border-b border-slate-700 bg-slate-900">
              <Terminal className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Output</span>
            </div>
            <div className="p-3 overflow-y-auto h-full">
              {outputLines.map((line, i) => (
                <p key={i} className={`text-xs font-mono leading-relaxed ${
                  line.startsWith('>') ? 'text-slate-400' : 'text-emerald-400'
                }`}>
                  {line || '\u00A0'}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Camera + Chat/Notes */}
        <div className="w-72 flex-shrink-0 bg-slate-800 border-l border-slate-700 flex flex-col">
          {/* Camera Feeds */}
          <div className="p-3 space-y-2 border-b border-slate-700">
            {/* Recruiter camera */}
            <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video">
              <div className="absolute inset-0 flex items-center justify-center gap-2">
                <Camera className="w-5 h-5 text-slate-600" />
                <span className="text-xs text-slate-600">Recruiter Camera</span>
              </div>
              <div className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-medium">
                Recruiter
              </div>
              <div className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-red-500/90 rounded px-1 py-0.5 text-[9px] text-white font-bold">
                <div className="w-1 h-1 bg-white rounded-full animate-recording-pulse" />
                LIVE
              </div>
            </div>
            {/* Candidate camera (small) */}
            <div className="relative rounded-xl overflow-hidden bg-slate-900 h-16">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] text-slate-600">Your Camera</span>
              </div>
              <div className="absolute bottom-1 left-1.5 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-medium">
                You
              </div>
            </div>
            {/* Controls */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <button className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-emerald-400 transition-colors" title="Mic On">
                <Mic className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-emerald-400 transition-colors" title="Camera On">
                <Camera className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-blue-400 transition-colors" title="Screen Share">
                <Monitor className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat / Notes Tabs */}
          <div className="flex border-b border-slate-700">
            {(['chat', 'notes'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-xs font-semibold capitalize transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'border-primary-400 text-primary-400'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab === 'chat' ? '💬 Chat' : '📝 Notes'}
              </button>
            ))}
          </div>

          {/* Chat */}
          {activeTab === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'candidate' ? 'items-end' : 'items-start'} gap-1`}>
                    <span className="text-[9px] text-slate-600">{msg.role === 'recruiter' ? 'Recruiter' : 'You'} · {msg.time}</span>
                    <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'recruiter'
                        ? 'bg-slate-700 text-slate-200 rounded-tl-sm'
                        : 'bg-primary-600 text-white rounded-tr-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>
              <div className="p-3 border-t border-slate-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Send a message..."
                    className="flex-1 text-xs bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-3 py-2 bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Notes */}
          {activeTab === 'notes' && (
            <div className="flex-1 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <StickyNote className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[10px] text-slate-500 font-medium">Shared Notes (visible to both)</span>
              </div>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full h-full resize-none text-xs bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-primary-500 font-mono leading-relaxed"
                placeholder="Session notes..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveMachineCodingPage;
