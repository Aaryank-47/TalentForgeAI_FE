import type { InterviewQuestion, QuestionCategory, Difficulty } from '../../types/hiring';
import { QUESTION_CATEGORIES, generateId } from '../../constants/hiring_mockData';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

interface ManualQuestionsEditorProps {
  questions: InterviewQuestion[];
  onChange: (questions: InterviewQuestion[]) => void;
}

export function ManualQuestionsEditor({ questions, onChange }: ManualQuestionsEditorProps) {
  const sorted = [...questions].sort((a, b) => a.order - b.order);

  const addQuestion = () => {
    const q: InterviewQuestion = {
      id: generateId('q'),
      text: '',
      category: 'technical',
      difficulty: 'medium',
      order: questions.length,
      timeLimitSeconds: 120,
    };
    onChange([...questions, q]);
  };

  const updateQuestion = (id: string, updates: Partial<InterviewQuestion>) => {
    onChange(questions.map(q => (q.id === id ? { ...q, ...updates } : q)));
  };

  const removeQuestion = (id: string) => {
    onChange(questions.filter(q => q.id !== id).map((q, i) => ({ ...q, order: i })));
  };

  const moveQuestion = (index: number, direction: -1 | 1) => {
    const items = [...sorted];
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    onChange(items.map((q, i) => ({ ...q, order: i })));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">Manual Questions ({sorted.length})</p>
        <button type="button" onClick={addQuestion} className="btn-primary text-xs flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add Question
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-8 text-sm text-slate-500">
          No questions yet. Add your first question above.
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((q, index) => (
            <div key={q.id} className="border border-[#E5E7EB] rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <GripVertical className="w-4 h-4 text-slate-300 mt-2 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Q{index + 1}</span>
                    <div className="flex gap-1 ml-auto">
                      <button type="button" onClick={() => moveQuestion(index, -1)} disabled={index === 0} className="p-1 rounded hover:bg-slate-100 disabled:opacity-30">
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      </button>
                      <button type="button" onClick={() => moveQuestion(index, 1)} disabled={index === sorted.length - 1} className="p-1 rounded hover:bg-slate-100 disabled:opacity-30">
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      </button>
                      <button type="button" onClick={() => removeQuestion(q.id)} className="p-1 rounded hover:bg-red-50">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                  <textarea
                    className="input-field text-sm resize-none h-20"
                    value={q.text}
                    onChange={e => updateQuestion(q.id, { text: e.target.value })}
                    placeholder="Enter your interview question..."
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <select
                      className="input-field text-sm"
                      value={q.category}
                      onChange={e => updateQuestion(q.id, { category: e.target.value as QuestionCategory })}
                    >
                      {QUESTION_CATEGORIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                    <select
                      className="input-field text-sm"
                      value={q.difficulty}
                      onChange={e => updateQuestion(q.id, { difficulty: e.target.value as Difficulty })}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    <input
                      type="number"
                      className="input-field text-sm"
                      value={q.timeLimitSeconds ?? 120}
                      onChange={e => updateQuestion(q.id, { timeLimitSeconds: Number(e.target.value) })}
                      placeholder="Time (sec)"
                      title="Time limit in seconds"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
