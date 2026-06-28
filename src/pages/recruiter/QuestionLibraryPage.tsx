import { useState } from 'react';
import { aiQuestions, mcqQuestions, dsaQuestions } from '../../constants/questionBankMockData';
import type { AIInterviewQuestion, MCQQuestion, DSAQuestion } from '../../types/question.types';
import { Badge } from '../../components/ui/Badge';
import { Plus, Search, Pencil, Trash2, Library, Code2, CheckSquare, Bot } from 'lucide-react';

type Tab = 'ai' | 'mcq' | 'dsa';

export default function QuestionLibraryPage() {
  const [activeTab, setActiveTab] = useState<Tab>('ai');
  const [search, setSearch] = useState('');

  // Local state for mock data
  const [aiList, setAiList] = useState(aiQuestions);
  const [mcqList, setMcqList] = useState(mcqQuestions);
  const [dsaList, setDsaList] = useState(dsaQuestions);

  const tabs = [
    { id: 'ai', label: 'AI Interview', icon: Bot, count: aiList.length },
    { id: 'mcq', label: 'MCQ Bank', icon: CheckSquare, count: mcqList.length },
    { id: 'dsa', label: 'DSA Problems', icon: Code2, count: dsaList.length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Question Bank</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage company-wide questions for AI Interviews, MCQs, and DSA assessments.
          </p>
        </div>
        <button className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Question
        </button>
      </div>

      <div className="flex border-b border-slate-200 gap-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 pb-3 px-1 border-b-2 transition-colors ${
                isActive ? 'border-primary-600 text-primary-700 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          className="input-field pl-9 text-sm"
          placeholder="Search questions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {activeTab === 'ai' && aiList.filter(q => q.text.toLowerCase().includes(search.toLowerCase())).map(q => (
          <div key={q.id} className="card p-4 flex items-start gap-4">
            <Bot className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-800 font-medium">{q.text}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Badge variant="purple">{q.category}</Badge>
                <Badge variant={q.difficulty === 'hard' ? 'danger' : q.difficulty === 'medium' ? 'warning' : 'default'}>{q.difficulty}</Badge>
                {q.expectedTimeMinutes && <span className="text-xs text-slate-500 border px-2 py-0.5 rounded bg-slate-50">{q.expectedTimeMinutes} mins</span>}
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"><Pencil className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}

        {activeTab === 'mcq' && mcqList.filter(q => q.question.toLowerCase().includes(search.toLowerCase())).map(q => (
          <div key={q.id} className="card p-4 flex items-start gap-4">
            <CheckSquare className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-800 font-medium">{q.question}</p>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">Options: {q.options.join(', ')}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Badge variant="info">{q.category}</Badge>
                <Badge variant={q.difficulty === 'hard' ? 'danger' : q.difficulty === 'medium' ? 'warning' : 'default'}>{q.difficulty}</Badge>
                <span className="text-xs text-slate-500 border px-2 py-0.5 rounded bg-slate-50">+{q.marks} / -{q.negativeMarks || 0}</span>
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"><Pencil className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}

        {activeTab === 'dsa' && dsaList.filter(q => q.title.toLowerCase().includes(search.toLowerCase())).map(q => (
          <div key={q.id} className="card p-4 flex items-start gap-4">
            <Code2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-800 font-medium">{q.title}</p>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{q.problemStatement}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Badge variant="success">{q.category}</Badge>
                <Badge variant={q.difficulty === 'hard' ? 'danger' : q.difficulty === 'medium' ? 'warning' : 'default'}>{q.difficulty}</Badge>
                <span className="text-xs text-slate-500 border px-2 py-0.5 rounded bg-slate-50">{q.visibleTestCases.length} Public / {q.hiddenTestCases.length} Hidden</span>
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"><Pencil className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
