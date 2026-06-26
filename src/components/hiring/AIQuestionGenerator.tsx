import { useState } from 'react';
import type { InterviewQuestion, ExperienceLevel, Difficulty } from '../../types/hiring';
import { MOCK_AI_GENERATED_QUESTIONS, generateId } from '../../constants/hiring_mockData';
import { ManualQuestionsEditor } from './ManualQuestionsEditor';
import { Sparkles, RefreshCw, Eye, Save } from 'lucide-react';
import { FormField } from '../ui/FormField';

interface AIQuestionGeneratorProps {
  questions: InterviewQuestion[];
  onChange: (questions: InterviewQuestion[]) => void;
  jobRole: string;
  experienceLevel: string;
  skills: string[];
}

export function AIQuestionGenerator({
  questions,
  onChange,
  jobRole,
  experienceLevel,
  skills,
}: AIQuestionGeneratorProps) {
  const [params, setParams] = useState({
    jobRole: jobRole || 'Software Engineer',
    experienceLevel: (experienceLevel || 'mid') as ExperienceLevel,
    requiredSkills: skills.length ? skills : ['React', 'JavaScript'],
    difficulty: 'medium' as Difficulty,
    questionCount: 10,
    durationMinutes: 25,
  });
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(questions.length > 0);
  const [newSkill, setNewSkill] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const generate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    const generatedQuestions: InterviewQuestion[] = MOCK_AI_GENERATED_QUESTIONS.slice(0, params.questionCount).map((q, i) => ({
      id: generateId('q'),
      text: q.text.replace('React', params.requiredSkills[0] ?? 'React'),
      category: q.category,
      difficulty: params.difficulty,
      order: i,
      timeLimitSeconds: Math.floor((params.durationMinutes * 60) / params.questionCount),
    }));
    onChange(generatedQuestions);
    setGenerated(true);
    setGenerating(false);
  };

  const regenerate = () => {
    setGenerated(false);
    generate();
  };

  const addSkill = () => {
    if (newSkill.trim() && !params.requiredSkills.includes(newSkill.trim())) {
      setParams(p => ({ ...p, requiredSkills: [...p.requiredSkills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (s: string) =>
    setParams(p => ({ ...p, requiredSkills: p.requiredSkills.filter(x => x !== s) }));

  return (
    <div className="space-y-5">
      {!generated ? (
        <>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-violet-600" />
            <p className="text-sm font-semibold text-slate-900">AI Question Generation</p>
          </div>
          <p className="text-xs text-slate-500">
            Provide role details and AI will generate a complete interview question set.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Job Role" required>
              <input
                className="input-field mt-1 text-sm"
                value={params.jobRole}
                onChange={e => setParams(p => ({ ...p, jobRole: e.target.value }))}
              />
            </FormField>
            <FormField label="Experience Level">
              <select
                className="input-field mt-1 text-sm"
                value={params.experienceLevel}
                onChange={e => setParams(p => ({ ...p, experienceLevel: e.target.value as ExperienceLevel }))}
              >
                <option value="entry">Entry Level</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
                <option value="executive">Executive</option>
              </select>
            </FormField>
            <FormField label="Difficulty">
              <select
                className="input-field mt-1 text-sm"
                value={params.difficulty}
                onChange={e => setParams(p => ({ ...p, difficulty: e.target.value as Difficulty }))}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </FormField>
            <FormField label="Question Count">
              <input
                type="number"
                min={1}
                max={30}
                className="input-field mt-1 text-sm"
                value={params.questionCount}
                onChange={e => setParams(p => ({ ...p, questionCount: Number(e.target.value) }))}
              />
            </FormField>
            <FormField label="Interview Duration (minutes)">
              <input
                type="number"
                min={5}
                className="input-field mt-1 text-sm"
                value={params.durationMinutes}
                onChange={e => setParams(p => ({ ...p, durationMinutes: Number(e.target.value) }))}
              />
            </FormField>
          </div>

          <FormField label="Required Skills">
            <div className="flex flex-wrap gap-2 mt-1 mb-2">
              {params.requiredSkills.map(s => (
                <span key={s} className="flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-700 rounded-full text-xs font-medium border border-violet-200">
                  {s}
                  <button type="button" onClick={() => removeSkill(s)} className="hover:text-violet-900">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="input-field flex-1 text-sm"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill()}
                placeholder="Add skill..."
              />
              <button type="button" onClick={addSkill} className="btn-secondary text-sm">Add</button>
            </div>
          </FormField>

          <button
            type="button"
            onClick={generate}
            disabled={generating || !params.jobRole.trim()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${generating ? 'animate-pulse' : ''}`} />
            {generating ? 'Generating Questions...' : 'Generate AI Questions'}
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{questions.length} Questions Generated</p>
              <p className="text-xs text-slate-500">Edit, delete, reorder, or regenerate below</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowPreview(!showPreview)} className="btn-secondary text-xs flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> {showPreview ? 'Hide Preview' : 'Preview'}
              </button>
              <button type="button" onClick={regenerate} disabled={generating} className="btn-secondary text-xs flex items-center gap-1.5">
                <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} /> Regenerate
              </button>
              <button type="button" className="btn-secondary text-xs flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5" /> Save as Template
              </button>
            </div>
          </div>

          {showPreview && (
            <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-[#E5E7EB]">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Candidate Preview</p>
              {questions.map((q, i) => (
                <div key={q.id} className="bg-white rounded-lg p-3 border border-[#E5E7EB]">
                  <p className="text-xs text-slate-400 mb-1">Question {i + 1} · {q.timeLimitSeconds}s</p>
                  <p className="text-sm text-slate-800">{q.text}</p>
                </div>
              ))}
            </div>
          )}

          <ManualQuestionsEditor questions={questions} onChange={onChange} />
        </>
      )}
    </div>
  );
}
