import React, { useState } from 'react';
import { Hash, Clock, Minus, Percent } from 'lucide-react';
import QuestionBank from './QuestionBank';
import { mockMCQQuestions, MCQ_CATEGORIES } from '../../constants/assessment_mockData';
import type { MCQConfig } from '../../types/assessment';

interface MCQBuilderProps {
  config: MCQConfig;
  onChange: (config: MCQConfig) => void;
}

const MCQBuilder: React.FC<MCQBuilderProps> = ({ config, onChange }) => {
  const set = <K extends keyof MCQConfig>(key: K, val: MCQConfig[K]) =>
    onChange({ ...config, [key]: val });

  const toggleQuestion = (id: string) => {
    const ids = config.selectedQuestionIds.includes(id)
      ? config.selectedQuestionIds.filter(q => q !== id)
      : [...config.selectedQuestionIds, id];
    onChange({ ...config, selectedQuestionIds: ids });
  };

  const totalMarks = config.selectedQuestionIds.length * config.marksPerQuestion;

  return (
    <div className="space-y-6">
      {/* Config Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: 'Questions Selected',
            value: config.selectedQuestionIds.length,
            icon: <Hash className="w-4 h-4 text-blue-600" />,
            bg: 'bg-blue-50',
          },
          {
            label: 'Marks/Question',
            value: config.marksPerQuestion,
            icon: <Percent className="w-4 h-4 text-violet-600" />,
            bg: 'bg-violet-50',
          },
          {
            label: 'Total Marks',
            value: totalMarks,
            icon: <Hash className="w-4 h-4 text-emerald-600" />,
            bg: 'bg-emerald-50',
          },
          {
            label: 'Time Limit',
            value: `${config.timeLimit} min`,
            icon: <Clock className="w-4 h-4 text-amber-600" />,
            bg: 'bg-amber-50',
          },
        ].map(item => (
          <div key={item.label} className={`${item.bg} rounded-xl p-3 border border-white/50`}>
            <div className="flex items-center gap-2 mb-1">{item.icon}</div>
            <p className="text-2xl font-display font-bold text-slate-900">{item.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Config Fields */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4">MCQ Configuration</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Marks per Question</label>
            <input
              type="number"
              min={1}
              value={config.marksPerQuestion}
              onChange={e => set('marksPerQuestion', Number(e.target.value))}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Negative Marking</label>
            <div className="relative">
              <Minus className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="number"
                min={0}
                step={0.25}
                value={config.negativeMarking}
                onChange={e => set('negativeMarking', Number(e.target.value))}
                className="w-full text-sm border border-slate-200 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">0 = disabled</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Passing Score (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={config.passingScore}
              onChange={e => set('passingScore', Number(e.target.value))}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Time Limit (min)</label>
            <input
              type="number"
              min={5}
              value={config.timeLimit}
              onChange={e => set('timeLimit', Number(e.target.value))}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Question Bank */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Question Bank</h3>
          <span className="text-xs text-slate-500">{mockMCQQuestions.length} questions available</span>
        </div>
        <QuestionBank
          questions={mockMCQQuestions}
          selectedIds={config.selectedQuestionIds}
          onToggle={toggleQuestion}
          categories={MCQ_CATEGORIES}
        />
      </div>
    </div>
  );
};

export default MCQBuilder;
