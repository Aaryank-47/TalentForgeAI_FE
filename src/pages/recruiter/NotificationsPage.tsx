import React, { useState } from 'react';
import { Bell, CheckCircle, Clock, AlertCircle, Check, Trash2, Search } from 'lucide-react';

const mockNotifications = [
  {
    id: 1,
    type: 'success',
    title: 'AI Interview Complete',
    message: 'Sarah Jenkins completed her frontend interview.',
    time: '2 mins ago',
    unread: true,
  },
  {
    id: 2,
    type: 'info',
    title: 'New Application',
    message: 'Michael Chen applied for the Senior Backend Developer position.',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: 3,
    type: 'warning',
    title: 'Upcoming Interview',
    message: 'Technical interview with David Kim starts in 30 minutes.',
    time: '2 hours ago',
    unread: false,
  },
  {
    id: 4,
    type: 'success',
    title: 'Offer Accepted',
    message: 'Emily Rodriguez has accepted the Product Manager offer.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 5,
    type: 'info',
    title: 'Assessment Score Ready',
    message: 'Alex Patel scored 92% on the React Coding Assessment.',
    time: 'Yesterday',
    unread: false,
  },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all'); // all, unread
  const [search, setSearch] = useState('');

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === 'all' || (filter === 'unread' && n.unread);
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'success': return 'bg-emerald-100 text-emerald-600';
      case 'warning': return 'bg-amber-100 text-amber-600';
      default: return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Notifications</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Stay updated with your hiring pipeline activities.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={markAllAsRead}
            className="btn-secondary text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Mark all read
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'unread' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Unread
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="card divide-y divide-[#E5E7EB]">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-5 flex items-start gap-4 transition-colors hover:bg-slate-50 ${notification.unread ? 'bg-primary-50/30' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconBg(notification.type)}`}>
                {getIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className={`text-sm font-bold ${notification.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                      {notification.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-xs text-slate-400 whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5" />
                      {notification.time}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity focus-within:opacity-100">
                      {notification.unread && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {notification.unread && (
                <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
              )}
            </div>
          ))
        ) : (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No notifications</h3>
            <p className="text-sm text-slate-500">You're all caught up! There are no notifications to show.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
