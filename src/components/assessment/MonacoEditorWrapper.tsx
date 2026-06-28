import React from 'react';
import Editor from '@monaco-editor/react';

interface MonacoEditorWrapperProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  theme?: 'vs-dark' | 'light';
}

const MonacoEditorWrapper: React.FC<MonacoEditorWrapperProps> = ({
  language,
  value,
  onChange,
  readOnly = false,
  height = '100%',
  theme = 'vs-dark',
}) => {
  return (
    <Editor
      height={height}
      language={language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : language}
      value={value}
      theme={theme}
      onChange={v => onChange(v ?? '')}
      options={{
        readOnly,
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        tabSize: 2,
        lineNumbers: 'on',
        renderLineHighlight: 'line',
        automaticLayout: true,
        padding: { top: 12, bottom: 12 },
        fontFamily: '"Fira Code", "Cascadia Code", monospace',
        fontLigatures: true,
        smoothScrolling: true,
      }}
      loading={
        <div className="h-full flex items-center justify-center bg-slate-900 text-slate-400 text-sm">
          Loading editor…
        </div>
      }
    />
  );
};

export default MonacoEditorWrapper;
