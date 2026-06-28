// ─────────────────────────────────────────────────────────────
// TalentForge AI — Notes Panel (shared across sidebars)
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { FileText, Save, Trash2 } from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';

export const NotesPanel: React.FC = () => {
  const { notes, currentNoteContent, setCurrentNoteContent, saveNote } = useInterview();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2 flex-shrink-0 bg-slate-50">
        <FileText className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-semibold text-slate-900">Interview Notes</span>
        <span className="ml-auto text-[10px] text-slate-600 bg-slate-200 border border-slate-300 px-2 py-0.5 rounded-full font-bold">
          {notes.length} saved
        </span>
      </div>

      {/* Textarea */}
      <div className="p-3 flex-shrink-0">
        <textarea
          value={currentNoteContent}
          onChange={(e) => setCurrentNoteContent(e.target.value)}
          placeholder="Type your notes here... (Ctrl+Enter to save)"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              saveNote();
            }
          }}
          className="w-full h-28 bg-white text-slate-900 text-xs placeholder-slate-400 border border-slate-200 rounded-xl p-3 resize-none focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
        <button
          onClick={saveNote}
          disabled={!currentNoteContent.trim()}
          className="mt-2 w-full flex items-center justify-center gap-2 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          Save Note
        </button>
      </div>

      {/* Saved notes list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {notes.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No notes yet</p>
            <p className="text-[10px] text-slate-600 mt-1">Notes saved here are private to you</p>
          </div>
        )}
        {[...notes].reverse().map((note) => (
          <div
            key={note.id}
            className="bg-slate-50 border border-slate-200 rounded-xl p-3"
          >
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-slate-500">
                {new Date(note.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <button className="text-slate-500 hover:text-red-400 transition-colors">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesPanel;
