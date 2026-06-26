import { useState } from 'react';
import { useHiring } from '../../context/HiringContext';
import { QUESTION_CATEGORIES } from '../../constants/hiring_mockData';
import type { QuestionCategory, Difficulty } from '../../types/hiring';
import { Badge } from '../../components/ui/Badge';
import { Plus, Search, Pencil, Trash2, Library } from 'lucide-react';

export default function QuestionLibraryPage() {
  const { questionLibrary, addLibraryQuestion, updateLibraryQuestion, deleteLibraryQuestion } = useHiring();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<QuestionCategory | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    text: '',
    category: 'technical' as QuestionCategory,
    difficulty: 'medium' as Difficulty,
    tags: '',
  });

  const filtered = questionLibrary.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(search.toLowerCase()) ||
      q.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || q.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setForm({ text: '', category: 'technical', difficulty: 'medium', tags: '' });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!form.text.trim()) return;
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (editingId) {
      updateLibraryQuestion(editingId, { text: form.text, category: form.category, difficulty: form.difficulty, tags });
    } else {
      addLibraryQuestion({ text: form.text, category: form.category, difficulty: form.difficulty, tags });
    }
    resetForm();
  };

  const startEdit = (id: string) => {
    const q = questionLibrary.find(x => x.id === id);
    if (!q) return;
    setForm({ text: q.text, category: q.category, difficulty: q.difficulty, tags: q.tags.join(', ') });
    setEditingId(id);
    setShowAddForm(true);
  };

  const categoryLabel = (cat: QuestionCategory) =>
    QUESTION_CATEGORIES.find(c => c.value === cat)?.label ?? cat;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Question Library</h1>
          <p className="text-sm text-slate-500 mt-1">
            Company-wide reusable interview questions for AI and manual interviews.
          </p>
        </div>
        <button onClick={() => { resetForm(); setShowAddForm(true); }} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Question
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {QUESTION_CATEGORIES.map(cat => {
          const count = questionLibrary.filter(q => q.category === cat.value).length;
          return (
            <div key={cat.value} className="card p-3 text-center">
              <p className="text-lg font-bold text-slate-900">{count}</p>
              <p className="text-xs text-slate-500">{cat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input-field pl-9 text-sm"
            placeholder="Search questions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-field text-sm w-full sm:w-48"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value as QuestionCategory | 'all')}
        >
          <option value="all">All Categories</option>
          {QUESTION_CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {showAddForm && (
        <div className="card p-5 space-y-4">
          <h2 className="text-base font-semibold text-slate-900">{editingId ? 'Edit Question' : 'Add Question'}</h2>
          <textarea
            className="input-field h-24 resize-none text-sm"
            value={form.text}
            onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
            placeholder="Enter interview question..."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select className="input-field text-sm" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as QuestionCategory }))}>
              {QUESTION_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <select className="input-field text-sm" value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as Difficulty }))}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <input className="input-field text-sm" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="Tags (comma-separated)" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="btn-primary text-sm">{editingId ? 'Update' : 'Add'} Question</button>
            <button onClick={resetForm} className="btn-secondary text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(q => (
          <div key={q.id} className="card p-4 flex items-start gap-4">
            <Library className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-800">{q.text}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Badge variant="info">{categoryLabel(q.category)}</Badge>
                <Badge variant={q.difficulty === 'hard' ? 'danger' : q.difficulty === 'medium' ? 'warning' : 'default'}>{q.difficulty}</Badge>
                {q.tags.map(t => <span key={t} className="text-[10px] text-slate-400">#{t}</span>)}
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Used {q.usageCount} times</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => startEdit(q.id)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => deleteLibraryQuestion(q.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
