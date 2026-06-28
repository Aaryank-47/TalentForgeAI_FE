// ─────────────────────────────────────────────────────────────
// TalentForge AI — Chat Panel
// In-room text chat (mock state, no backend)
// ─────────────────────────────────────────────────────────────
import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';

export const ChatPanel: React.FC = () => {
  const { chatMessages, sendChatMessage, currentUser } = useInterview();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendChatMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2 flex-shrink-0">
        <MessageSquare className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-bold text-slate-900">Chat</span>
        <span className="ml-auto text-[10px] text-slate-500">
          {chatMessages.length} messages
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {chatMessages.map((msg) => {
          const isMe = msg.senderId === currentUser?.id;
          const isSystem = msg.isSystem;

          if (isSystem) {
            return (
              <div key={msg.id} className="text-center">
                <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full border border-slate-200">
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col gap-0.5 ${isMe ? 'items-end' : 'items-start'}`}
            >
              {/* Sender label */}
              {!isMe && (
                <div className="flex items-center gap-1.5 px-1">
                  <div
                    className={`w-4 h-4 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0`}
                  >
                    {msg.senderInitials.charAt(0)}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">{msg.senderName}</span>
                </div>
              )}
              {/* Bubble */}
              <div
                className={`max-w-[88%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                  isMe
                    ? 'bg-primary-600 text-white rounded-tr-sm shadow-sm'
                    : 'bg-slate-100 text-slate-700 rounded-tl-sm border border-slate-200'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-500 px-1">{msg.timestamp}</span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-200 flex-shrink-0 bg-slate-50">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Enter to send)"
            rows={2}
            className="flex-1 bg-white text-slate-900 text-xs placeholder-slate-400 border border-slate-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:border-primary-500 min-h-[44px] max-h-[80px]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
