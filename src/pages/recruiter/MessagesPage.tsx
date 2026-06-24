import React, { useState } from 'react';
import { Search, Send, MoreHorizontal, Paperclip, Smile } from 'lucide-react';

import {
  messageThreads as threads,
  chatMessages as messages,
} from '../../constants/recruiter_mockData';


const MessagesPage = () => {
  const [active, setActive] = useState(threads[0]);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');


  return (
    <div style={{ height: 'calc(100vh - 8rem)' }} className="flex gap-0 overflow-hidden card">
      {/* Thread list */}
      <div className="w-72 flex-shrink-0 border-r border-[#E5E7EB] flex flex-col">
        <div className="p-4 border-b border-[#E5E7EB]">
          <h2 className="font-display font-bold text-[#0F172A] text-base mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-[#E5E7EB] rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.filter(t => t.name.toLowerCase().includes(search.toLowerCase())).map(t => (
            <div
              key={t.id}
              onClick={() => setActive(t)}
              className={`px-4 py-3.5 flex items-center gap-3 cursor-pointer border-b border-[#E5E7EB] transition-colors ${active.id === t.id ? 'bg-primary-50' : 'hover:bg-slate-50'}`}
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 relative`}>
                {t.initials}
                {t.active && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold text-slate-900 ${active.id === t.id ? 'text-primary-700' : ''}`}>{t.name}</p>
                  <span className="text-[10px] text-slate-400">{t.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{t.preview}</p>
              </div>
              {t.unread > 0 && (
                <span className="w-5 h-5 bg-primary-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {t.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat view */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat header */}
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${active.color} flex items-center justify-center text-white text-xs font-bold`}>
              {active.initials}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{active.name}</p>
              <p className="text-[10px] text-emerald-600 font-medium">Online</p>
            </div>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'recruiter' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl text-sm ${
                m.from === 'recruiter'
                  ? 'bg-primary-600 text-white rounded-br-sm'
                  : 'bg-white border border-[#E5E7EB] text-slate-700 rounded-bl-sm shadow-sm'
              }`}>
                <p className="leading-relaxed">{m.text}</p>
                <p className={`text-[10px] mt-1 ${m.from === 'recruiter' ? 'text-primary-200' : 'text-slate-400'}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-5 py-4 bg-white border-t border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && message.trim() && setMessage('')}
              className="flex-1 py-2.5 px-4 bg-slate-50 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
              <Smile className="w-5 h-5" />
            </button>
            <button
              className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-40"
              disabled={!message.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
