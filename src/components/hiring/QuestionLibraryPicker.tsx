import { useState } from 'react';
import { useHiring } from '../../context/HiringContext';
import { QUESTION_CATEGORIES } from '../../constants/hiring_mockData';
import type { QuestionCategory } from '../../types/hiring';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';

interface QuestionLibraryPickerProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function QuestionLibraryPicker({ selectedIds, onChange }: QuestionLibraryPickerProps) {
  const { questionLibrary } = useHiring();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<QuestionCategory | 'all'>('all');

  const filtered = questionLibrary.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(search.toLowerCase()) ||
      q.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || q.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggle = (id: string) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter(x => x !== id) : [...selectedIds, id]);
  };

  const categoryLabel = (cat: QuestionCategory) =>
    QUESTION_CATEGORIES.find(c => c.value === cat)?.label ?? cat;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">
          Question Library ({selectedIds.length} selected)
        </p>
        <Link to="/recruiter/question-library" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
          Manage Library →
        </Link>
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

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filtered.map(q => {
          const selected = selectedIds.includes(q.id);
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => toggle(q.id)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selected ? 'border-primary-300 bg-primary-50/50' : 'border-[#E5E7EB] hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  selected ? 'bg-primary-600 border-primary-600' : 'border-slate-300'
                }`}>
                  {selected && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800">{q.text}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Badge variant="info">{categoryLabel(q.category)}</Badge>
                    <Badge variant={q.difficulty === 'hard' ? 'danger' : q.difficulty === 'medium' ? 'warning' : 'default'}>
                      {q.difficulty}
                    </Badge>
                    {q.tags.map(t => (
                      <span key={t} className="text-[10px] text-slate-400">#{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
