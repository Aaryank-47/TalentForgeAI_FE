import React, { useState } from 'react';
import { Send, Search, Paperclip, Smile, MoreVertical } from 'lucide-react';

const threads = [
  { id: 1, name: 'Google Recruiting Team', role: 'Frontend Developer · Interview Scheduled', time: '10:45 AM', last: 'Your interview is confirmed for May 16 at 11:00 AM.', unread: 2, avatar: 'G', color: 'bg-blue-600' },
  { id: 2, name: 'Microsoft HR', role: 'UI/UX Designer · Under Review', time: 'Yesterday', last: 'We are still reviewing your application.', unread: 0, avatar: 'M', color: 'bg-orange-500' },
  { id: 3, name: 'Infosys Talent Team', role: 'Full Stack Developer · Assessment', time: 'May 8', last: 'Please complete the assessment before May 20.', unread: 1, avatar: 'I', color: 'bg-indigo-600' },
  { id: 4, name: 'Swiggy Recruiting', role: 'Backend Engineer · Assessment', time: 'May 7', last: 'Great! Your profile has been shortlisted.', unread: 0, avatar: 'S', color: 'bg-orange-500' },
  { id: 5, name: 'Flipkart HR', role: 'Software Engineer · Offer', time: 'May 15', last: 'Congratulations! We are excited to offer you...', unread: 1, avatar: 'F', color: 'bg-blue-500' },
];

const messages = [
  { id: 1, from: 'recruiter', text: 'Hi Aaryan! We have reviewed your application for the Frontend Developer position.', time: '10:30 AM' },
  { id: 2, from: 'recruiter', text: 'We would like to schedule an AI Interview. Are you available on May 16 at 11:00 AM?', time: '10:31 AM' },
  { id: 3, from: 'me', text: 'Thank you! Yes, I am available on May 16 at 11:00 AM. Looking forward to it!', time: '10:35 AM' },
  { id: 4, from: 'recruiter', text: 'Great! Your interview is confirmed. You will receive a calendar invite shortly. The interview will be AI-conducted and should take approximately 60 minutes.', time: '10:45 AM' },
  { id: 5, from: 'me', text: 'Understood. I will be prepared. Thank you for the opportunity!', time: '10:47 AM' },
];

const CandidateMessagesPage = () => {
  const [selectedThread, setSelectedThread] = useState(threads[0]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');

  return (
    <div className="-m-6 flex h-screen overflow-hidden">
      {/* Thread List */}
      <div className="w-80 flex-shrink-0 flex flex-col border-r border-[#E5E7EB] bg-white overflow-hidden">
        <div className="px-4 py-4 border-b border-[#E5E7EB] flex-shrink-0">
          <h2 className="font-display font-bold text-[#0F172A] text-base mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-[#E5E7EB]">
          {threads.filter(t => t.name.toLowerCase().includes(search.toLowerCase())).map(thread => (
            <div
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              className={`px-4 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors ${selectedThread.id === thread.id ? 'bg-primary-50/40 border-l-2 border-l-primary-500' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${thread.color} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                  {thread.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-bold text-slate-900 truncate">{thread.name}</p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[10px] text-slate-400 whitespace-nowrap">{thread.time}</p>
                      {thread.unread > 0 && (
                        <span className="w-5 h-5 bg-primary-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{thread.unread}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mb-0.5">{thread.role}</p>
                  <p className="text-[11px] text-slate-500 truncate">{thread.last}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat view */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedThread ? (
          <>
            {/* Chat header */}
            <div className="px-6 py-4 border-b border-[#E5E7EB] bg-white flex items-center gap-3 flex-shrink-0">
              <div className={`w-10 h-10 rounded-xl ${selectedThread.color} flex items-center justify-center text-white font-bold`}>
                {selectedThread.avatar}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{selectedThread.name}</p>
                <p className="text-xs text-slate-500">{selectedThread.role}</p>
              </div>
              <button className="ml-auto p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  {msg.from !== 'me' && (
                    <div className={`w-8 h-8 rounded-full ${selectedThread.color} flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mr-2 mt-auto`}>
                      {selectedThread.avatar}
                    </div>
                  )}
                  <div className={`max-w-xs lg:max-w-sm ${msg.from === 'me' ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.from === 'me'
                        ? 'bg-primary-600 text-white rounded-br-sm'
                        : 'bg-white text-slate-800 border border-[#E5E7EB] rounded-bl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-[#E5E7EB] bg-white flex items-center gap-3 flex-shrink-0">
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                className="flex-1 py-2.5 px-4 bg-slate-50 border border-[#E5E7EB] rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyDown={e => e.key === 'Enter' && setInput('')}
              />
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Smile className="w-4 h-4" />
              </button>
              <button
                onClick={() => setInput('')}
                className="p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateMessagesPage;
