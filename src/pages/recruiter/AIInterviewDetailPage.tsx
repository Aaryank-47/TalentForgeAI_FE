import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Play, Pause, SkipForward, Download, Search, AlertTriangle } from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer,
} from 'recharts';
import {
  aiInterviewCompleted,
  interviewTranscript,
  aiEvaluationReport,
  integrityReport,
} from '../../constants/recruiter_mockData';
import {
  EvaluationCard,
  ProgressBar,
  TranscriptCard,
  RiskBadge,
} from '../../components/interview/InterviewComponents';
import {
  TabSwitchIndicator,
  NoiseDetectionIndicator,
  FaceDetectionIndicator,
} from '../../modules/shared/system-check/SystemCheck';

type Tab = 'overview' | 'recording' | 'transcript' | 'ai-report' | 'integrity' | 'feedback';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'overview', label: 'Overview', icon: '📋' },
  { key: 'recording', label: 'Recording', icon: '🎥' },
  { key: 'transcript', label: 'Transcript', icon: '📝' },
  { key: 'ai-report', label: 'AI Report', icon: '🤖' },
  { key: 'integrity', label: 'Integrity', icon: '🔒' },
  { key: 'feedback', label: 'Feedback', icon: '✍️' },
];

const FEEDBACK_OPTIONS = ['Strong Hire', 'Hire', 'Consider', 'Reject'];

export default function AIInterviewDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [playing, setPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);

  const candidate = aiInterviewCompleted.find(iv => iv.id === id) || aiInterviewCompleted[0];
  const report = aiEvaluationReport;
  const integrity = integrityReport;

  const filteredTranscript = interviewTranscript.filter(t =>
    t.question.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
    t.answer.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  // Mock playback total: 16 min 30 sec = 990 seconds
  const TOTAL_SECONDS = 990;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const QUESTION_MARKERS = [0, 125, 272, 407, 528, 635, 755, 845];

  return (
    <div className="space-y-5">
      {/* Back + Header */}
      <div className="flex items-start gap-4">
        <button onClick={() => navigate('/recruiter/ai-interviews')} className="btn-secondary flex items-center gap-2 text-sm flex-shrink-0 mt-1">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${candidate.color} flex items-center justify-center text-white text-lg font-bold flex-shrink-0`}>
            {candidate.initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-display font-bold text-slate-900">{candidate.candidate}</h1>
            <p className="text-slate-500 text-sm">{candidate.role} · {candidate.date} · {candidate.duration}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full border border-primary-200">AI Score: {candidate.aiScore}</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                candidate.recommendation === 'Strong Hire' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                candidate.recommendation === 'Hire' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                candidate.recommendation === 'Consider' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-red-50 text-red-700 border-red-200'
              }`}>{candidate.recommendation}</span>
              <RiskBadge level={candidate.riskLevel} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-0 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.key ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-5">
            {/* Score Summary */}
            <div className="card p-5">
              <h3 className="font-bold text-slate-900 mb-4">Score Summary</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {report.dimensions.map(d => (
                  <div key={d.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-base">{d.icon}</span>
                      <span className="text-xs text-slate-600 font-medium">{d.label}</span>
                    </div>
                    <p className="text-xl font-black text-slate-900">{d.score}</p>
                    <ProgressBar value={d.score} color={d.color} height="h-1.5" />
                  </div>
                ))}
              </div>
            </div>

            {/* AI Summary */}
            <div className="card p-5">
              <h3 className="font-bold text-slate-900 mb-3">AI Summary</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{report.aiSummary}</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs font-semibold text-emerald-700 mb-2">✅ Strengths</p>
                  <ul className="space-y-1">
                    {report.strengths.map(s => (
                      <li key={s} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <span className="text-emerald-500 flex-shrink-0">•</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-700 mb-2">⚠️ Areas to Improve</p>
                  <ul className="space-y-1">
                    {report.areasForImprovement.map(s => (
                      <li key={s} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <span className="text-amber-500 flex-shrink-0">•</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Integrity Banner */}
            {candidate.riskLevel !== 'None' && (
              <div className={`card p-4 border-2 flex items-start gap-3 ${candidate.riskLevel === 'High' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
                <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${candidate.riskLevel === 'High' ? 'text-red-500' : 'text-amber-500'}`} />
                <div>
                  <p className={`text-sm font-bold ${candidate.riskLevel === 'High' ? 'text-red-800' : 'text-amber-800'}`}>
                    {candidate.riskLevel} Integrity Risk Detected
                  </p>
                  <p className="text-xs mt-0.5 text-slate-600">{integrity.riskDetail}</p>
                  <button onClick={() => setActiveTab('integrity')} className="text-xs font-semibold text-primary-600 mt-2 hover:underline">View Integrity Report →</button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Evaluation Card */}
          <div className="space-y-4">
            <EvaluationCard recommendation={candidate.recommendation} score={candidate.aiScore} />
            <div className="card p-4">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Quick Stats</p>
              {[
                { label: 'Duration', value: candidate.duration },
                { label: 'Questions', value: `${interviewTranscript.length} answered` },
                { label: 'Avg Confidence', value: `${Math.round(interviewTranscript.reduce((a, t) => a + t.confidence, 0) / interviewTranscript.length)}%` },
                { label: 'Total Words', value: `${interviewTranscript.reduce((a, t) => a + t.wordCount, 0)} words` },
                { label: 'Tab Switches', value: String(candidate.tabSwitches) },
                { label: 'Noise Flags', value: String(candidate.noiseFlags) },
              ].map(stat => (
                <div key={stat.label} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0 text-xs">
                  <span className="text-slate-500">{stat.label}</span>
                  <span className="font-bold text-slate-800">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── RECORDING TAB ── */}
      {activeTab === 'recording' && (
        <div className="space-y-5">
          {/* Mock Video Player */}
          <div className="card overflow-hidden">
            <div className="bg-slate-900 relative flex items-center justify-center" style={{ height: 360 }}>
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950" />
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4 text-white text-4xl shadow-lg">
                  {candidate.initials[0]}
                </div>
                <p className="text-white font-semibold">{candidate.candidate}</p>
                <p className="text-slate-400 text-sm mt-1">{candidate.role}</p>
              </div>
              {/* Question markers on video */}
              <div className="absolute bottom-16 left-4 right-4 flex items-center gap-1">
                {QUESTION_MARKERS.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setPlaybackTime(t)}
                    className="text-[9px] font-bold bg-primary-600/70 text-white px-1.5 py-0.5 rounded hover:bg-primary-600 transition-colors"
                  >
                    Q{i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 bg-slate-900 border-t border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setPlaying(p => !p)}
                  className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white hover:bg-primary-700 transition-colors flex-shrink-0"
                >
                  {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <span className="text-xs text-slate-400 tabular-nums w-12 flex-shrink-0">{formatTime(playbackTime)}</span>
                <div className="flex-1 relative">
                  <div className="w-full bg-slate-700 rounded-full h-1.5 cursor-pointer">
                    <div
                      className="h-1.5 rounded-full bg-primary-500"
                      style={{ width: `${(playbackTime / TOTAL_SECONDS) * 100}%` }}
                    />
                    {/* Question markers */}
                    {QUESTION_MARKERS.map((t, i) => (
                      <div
                        key={i}
                        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-slate-900 cursor-pointer hover:scale-125 transition-transform"
                        style={{ left: `${(t / TOTAL_SECONDS) * 100}%` }}
                        onClick={() => setPlaybackTime(t)}
                        title={`Q${i + 1}: ${interviewTranscript[i]?.category}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-slate-400 tabular-nums w-12 flex-shrink-0 text-right">{formatTime(TOTAL_SECONDS)}</span>
                <button className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white">
                  <SkipForward className="w-4 h-4" />
                </button>
                {/* Speed control */}
                <select
                  value={playbackSpeed}
                  onChange={e => setPlaybackSpeed(Number(e.target.value))}
                  className="bg-slate-700 text-slate-300 text-xs rounded px-2 py-1 outline-none"
                >
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(s => (
                    <option key={s} value={s}>{s}x</option>
                  ))}
                </select>
                <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 opacity-50 cursor-not-allowed">
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Question Markers List */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-3">Question Markers</h3>
            <div className="space-y-2">
              {interviewTranscript.map((t, i) => (
                <button
                  key={t.questionId}
                  onClick={() => setPlaybackTime(QUESTION_MARKERS[i] || 0)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-primary-200 hover:bg-primary-50/30 text-left transition-all"
                >
                  <span className="text-xs font-bold text-primary-600 tabular-nums w-10 flex-shrink-0">{t.timestamp}</span>
                  <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                  <p className="text-xs text-slate-700 truncate">{t.question}</p>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">{t.duration}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TRANSCRIPT TAB ── */}
      {activeTab === 'transcript' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search transcript…"
              value={transcriptSearch}
              onChange={e => setTranscriptSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="space-y-4">
            {filteredTranscript.map(t => (
              <TranscriptCard
                key={t.questionId}
                order={t.order}
                question={t.question}
                answer={t.answer}
                timestamp={t.timestamp}
                duration={t.duration}
                confidence={t.confidence}
                category={t.category}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── AI REPORT TAB ── */}
      {activeTab === 'ai-report' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Left: Charts */}
            <div className="xl:col-span-2 space-y-5">
              {/* Radar Chart */}
              <div className="card p-5">
                <h3 className="font-bold text-slate-900 mb-4">Competency Radar</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={report.radarData} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} tickCount={5} />
                    <Radar name="Score" dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} strokeWidth={2} dot={{ r: 4, fill: '#2563eb' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Question Performance */}
              <div className="card p-5">
                <h3 className="font-bold text-slate-900 mb-4">Question Performance</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={report.questionPerformance} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="question" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="score" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Confidence Trend */}
              <div className="card p-5">
                <h3 className="font-bold text-slate-900 mb-4">Confidence Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={report.confidenceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="question" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Line type="monotone" dataKey="confidence" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 4, fill: '#22c55e' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Response Times */}
              <div className="card p-5">
                <h3 className="font-bold text-slate-900 mb-4">Response Time (seconds)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={report.responseTimes} barSize={24}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="question" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="seconds" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right: Score Details */}
            <div className="space-y-4">
              <EvaluationCard recommendation={report.recommendation} score={report.overallScore} />

              <div className="card p-4 space-y-3">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Score Breakdown</p>
                {report.dimensions.map(d => (
                  <ProgressBar key={d.label} value={d.score} label={`${d.icon} ${d.label}`} color={d.color} />
                ))}
              </div>

              {/* Talking Ratio */}
              <div className="card p-4">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Talking Ratio</p>
                <div className="flex rounded-full overflow-hidden h-4 mb-3">
                  <div className="bg-primary-500 flex items-center justify-center text-white text-[9px] font-bold" style={{ width: `${report.talkingRatio.candidate}%` }}>
                    {report.talkingRatio.candidate}%
                  </div>
                  <div className="bg-slate-200 flex items-center justify-center text-slate-500 text-[9px] font-bold" style={{ width: `${report.talkingRatio.silence}%` }}>
                    {report.talkingRatio.silence}%
                  </div>
                  <div className="bg-violet-400 flex items-center justify-center text-white text-[9px] font-bold" style={{ width: `${report.talkingRatio.ai}%` }}>
                    {report.talkingRatio.ai}%
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {[
                    { label: 'Candidate', color: 'bg-primary-500', val: report.talkingRatio.candidate },
                    { label: 'Silence', color: 'bg-slate-300', val: report.talkingRatio.silence },
                    { label: 'AI', color: 'bg-violet-400', val: report.talkingRatio.ai },
                  ].map(r => (
                    <div key={r.label} className="flex items-center gap-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${r.color}`} />
                      <span className="text-xs text-slate-600">{r.label}: {r.val}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-slate-400 bg-slate-50 rounded-xl p-3 border border-slate-200 leading-relaxed">
                Evaluated at {report.evaluatedAt}. All scores are AI-generated and advisory. Final decisions remain with the recruiter.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── INTEGRITY TAB ── */}
      {activeTab === 'integrity' && (
        <div className="space-y-5 max-w-2xl">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Integrity & Monitoring Report</h3>
              <RiskBadge level={candidate.riskLevel} />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-5">{integrity.riskDetail}</p>

            <div className="space-y-3">
              <TabSwitchIndicator count={integrity.tabSwitchCount} lastAt={integrity.tabSwitchTimestamps[integrity.tabSwitchTimestamps.length - 1]} />
              <NoiseDetectionIndicator flags={integrity.noiseFlags} compliant={integrity.onlyCandidateVoice} />
              <FaceDetectionIndicator status={integrity.faceVisibility.status} pct={integrity.faceVisibility.percentVisible} />
            </div>
          </div>

          {/* Detail Breakdown */}
          {integrity.tabSwitchCount > 0 && (
            <div className="card p-5">
              <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Tab Switch Events
              </h4>
              <div className="space-y-2">
                {integrity.tabSwitchTimestamps.map((ts, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="text-sm text-amber-800 font-medium">Switch #{i + 1}</span>
                    <span className="text-sm font-bold text-amber-700 tabular-nums">{ts}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {integrity.noiseFlags > 0 && (
            <div className="card p-5">
              <h4 className="font-bold text-slate-900 mb-3">Noise Events</h4>
              <div className="space-y-2">
                {integrity.noiseFlagTimestamps.map((ts, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                    <div>
                      <span className="text-sm text-amber-800 font-medium">Noise Event #{i + 1}</span>
                      <p className="text-xs text-amber-600">{integrity.noiseType}</p>
                    </div>
                    <span className="text-sm font-bold text-amber-700 tabular-nums">{ts}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card p-4 border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-500 font-semibold mb-1">⚖️ Recruiter Discretion</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              All integrity data is provided for informational purposes only. The final hiring decision
              remains entirely with the recruiter. Tab switches and noise events may have innocent explanations.
              Use this data as one factor in your holistic evaluation.
            </p>
          </div>
        </div>
      )}

      {/* ── FEEDBACK TAB ── */}
      {activeTab === 'feedback' && (
        <div className="space-y-5 max-w-2xl">
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-4">Recruiter Decision</h3>
            <p className="text-sm text-slate-600 mb-4">Select your recommendation for this candidate:</p>
            <div className="grid grid-cols-2 gap-3">
              {FEEDBACK_OPTIONS.map(opt => {
                const styles: Record<string, string> = {
                  'Strong Hire': 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100',
                  'Hire': 'border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100',
                  'Consider': 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100',
                  'Reject': 'border-red-300 bg-red-50 text-red-800 hover:bg-red-100',
                };
                const selected = selectedDecision === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setSelectedDecision(opt)}
                    className={`p-4 rounded-xl border-2 font-bold text-sm transition-all ${selected ? `${styles[opt]} ring-2 ring-offset-2 ring-primary-400` : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-3">Recruiter Notes</h3>
            <textarea
              value={recruiterNotes}
              onChange={e => setRecruiterNotes(e.target.value)}
              rows={6}
              placeholder="Add your evaluation notes, observations, or reasons for your decision…"
              className="w-full text-sm border border-slate-200 rounded-xl p-3.5 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-300"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-slate-400">{recruiterNotes.length} characters</span>
              <button
                disabled={!selectedDecision}
                className={`btn-primary text-sm px-6 py-2 ${!selectedDecision ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Save Feedback
              </button>
            </div>
          </div>

          {/* AI Recommendation for reference */}
          <div className="card p-4 bg-violet-50 border-violet-200">
            <p className="text-xs text-violet-700 font-semibold mb-1">🤖 AI Recommendation (for reference)</p>
            <p className="text-sm font-bold text-violet-900">{report.recommendation}</p>
            <p className="text-xs text-violet-600 mt-1">AI Score: {report.overallScore}/100 · {report.evaluatedAt}</p>
          </div>
        </div>
      )}
    </div>
  );
}
