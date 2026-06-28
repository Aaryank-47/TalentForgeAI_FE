import React, { useState } from 'react';
import { Hash, Clock, Percent, Search, Filter } from 'lucide-react';
import ProblemCard from './ProblemCard';
import DSAProblemModal from './DSAProblemModal';
import { mockDSAProblems, DSA_CATEGORIES } from '../../constants/assessment_mockData';
import type { DSAConfig, DSAProblem } from '../../types/assessment';

interface DSABuilderProps {
  config: DSAConfig;
  onChange: (config: DSAConfig) => void;
}

const DSABuilder: React.FC<DSABuilderProps> = ({ config, onChange }) => {
  const [previewProblem, setPreviewProblem] = useState<DSAProblem | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const set = <K extends keyof DSAConfig>(key: K, val: DSAConfig[K]) =>
    onChange({ ...config, [key]: val });

  const toggleProblem = (id: string) => {
    const ids = config.selectedProblemIds.includes(id)
      ? config.selectedProblemIds.filter(p => p !== id)
      : [...config.selectedProblemIds, id];
    onChange({ ...config, selectedProblemIds: ids });
  };

  const filtered = mockDSAProblems.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    return matchSearch && matchCat && matchDiff;
  });

  const totalMarks = config.selectedProblemIds.length * config.marksPerQuestion;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Problems Selected', value: config.selectedProblemIds.length, color: 'bg-violet-50', textColor: 'text-violet-600' },
          { label: 'Marks/Problem', value: config.marksPerQuestion, color: 'bg-blue-50', textColor: 'text-blue-600' },
          { label: 'Total Marks', value: totalMarks, color: 'bg-emerald-50', textColor: 'text-emerald-600' },
          { label: 'Total Duration', value: `${config.totalDuration} min`, color: 'bg-amber-50', textColor: 'text-amber-600' },
        ].map(item => (
          <div key={item.label} className={`${item.color} rounded-xl p-3`}>
            <p className="text-2xl font-display font-bold text-slate-900">{item.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Config */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4">DSA Configuration</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Marks per Problem</label>
            <input type="number" min={1} value={config.marksPerQuestion} onChange={e => set('marksPerQuestion', Number(e.target.value))}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Total Duration (min)</label>
            <input type="number" min={30} value={config.totalDuration} onChange={e => set('totalDuration', Number(e.target.value))}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Passing Score (%)</label>
            <input type="number" min={0} max={100} value={config.passingScore} onChange={e => set('passingScore', Number(e.target.value))}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
      </div>

      {/* Problem Bank */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Problem Bank</h3>
          <span className="text-xs text-slate-500">{mockDSAProblems.length} problems available</span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-40">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search problems..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" />
          </div>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-slate-700">
            <option value="All">All Categories</option>
            {DSA_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={selectedDifficulty} onChange={e => setSelectedDifficulty(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-slate-700">
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {['All', ...DSA_CATEGORIES.slice(0, 8)].map(cat => (
            <button key={cat} type="button" onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-colors ${
                selectedCategory === cat
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600 bg-white'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Problem list */}
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {filtered.map(p => (
            <ProblemCard
              key={p.id}
              problem={p}
              selected={config.selectedProblemIds.includes(p.id)}
              onSelect={toggleProblem}
              onPreview={setPreviewProblem}
            />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Filter className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No problems match your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Problem Preview Modal */}
      <DSAProblemModal
        problem={previewProblem}
        onClose={() => setPreviewProblem(null)}
        onSelect={toggleProblem}
        isSelected={previewProblem ? config.selectedProblemIds.includes(previewProblem.id) : false}
      />
    </div>
  );
};

export default DSABuilder;
