import React from 'react';
import { Code2 } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../constants/assessment_mockData';

interface LanguageSelectorProps {
  value: string;
  onChange: (lang: string) => void;
  languages?: string[];
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange, languages }) => {
  const options = languages
    ? SUPPORTED_LANGUAGES.filter(l => languages.includes(l.value))
    : SUPPORTED_LANGUAGES;

  return (
    <div className="flex items-center gap-2">
      <Code2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-sm border border-slate-700 rounded-lg px-3 py-1.5 bg-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
      >
        {options.map(lang => (
          <option key={lang.value} value={lang.value}>{lang.label}</option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
