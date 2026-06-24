import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Home, Briefcase, FileText, ClipboardList, Video, MessageSquare,
  Bookmark, User, FileText as Resume, Settings, Bell, Search,
  Menu, X, ChevronDown, Zap, LogOut, ChevronRight, Bot,
} from 'lucide-react';
import jobportal from '../../assets/jobportal_logo2.jpg';

const mainNav = [
  { name: 'Home', href: '/candidate/home', icon: Home },
  { name: 'Find Jobs', href: '/candidate/jobs', icon: Briefcase },
  { name: 'My Applications', href: '/candidate/applications', icon: FileText },
  { name: 'Assessments', href: '/candidate/assessments', icon: ClipboardList },
  { name: 'Interviews', href: '/candidate/interviews', icon: Video },
];

const secondaryNav = [
  { name: 'Messages', href: '/candidate/messages', icon: MessageSquare, badge: 3 },
  { name: 'Saved Jobs', href: '/candidate/saved', icon: Bookmark },
  { name: 'Profile', href: '/candidate/profile', icon: User },
  { name: 'Resume', href: '/candidate/resume', icon: Resume },
  { name: 'Settings', href: '/candidate/settings', icon: Settings },
];

const notifications = [
  { icon: '📅', text: 'Interview scheduled: Google Frontend Developer — May 16, 11:00 AM', time: '2h ago', unread: true },
  { icon: '🤖', text: "AI Interview complete — You've cleared Infosys round", time: '5h ago', unread: true },
  { icon: '📋', text: 'Assessment assigned by TechNova: React Developer Test', time: '1d ago', unread: false },
  { icon: '🎉', text: 'Offer extended by Flipkart — View and respond', time: '2d ago', unread: false },
];

interface NavItemProps {
  item: { name: string; href: string; icon: React.ElementType; badge?: number };
  active: boolean;
  collapsed?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ item, active, collapsed }) => {
  const Icon = item.icon;
  return (
    <Link
      to={item.href}
      title={collapsed ? item.name : undefined}
      className={`group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 relative ${active
          ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/20'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        } ${collapsed ? 'justify-center' : ''}`}
    >
      <Icon className={`flex-shrink-0 h-[18px] w-[18px] ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
      {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
      {!collapsed && item.badge && (
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-primary-100 text-primary-700'}`}>
          {item.badge}
        </span>
      )}
      {collapsed && item.badge && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full" />
      )}
    </Link>
  );
};

const CandidateLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const sidebarWidth = sidebarCollapsed ? 'w-[68px]' : 'w-[230px]';

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="h-screen flex overflow-hidden bg-[#F8FAFC] font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-50
          flex flex-col bg-white border-r border-[#E5E7EB]
          transition-all duration-300 ease-in-out flex-shrink-0
          ${sidebarWidth}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-[#E5E7EB] flex-shrink-0 ${sidebarCollapsed ? 'justify-center px-2' : 'px-4 gap-3'}`}>
          <div className="bg-[#2563EB] p-1.5 rounded-lg flex-shrink-0">
            <img src={jobportal} className="h-5 w-5 brightness-0 invert" alt="TalentForge" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-display font-bold text-[17px] text-[#0F172A] leading-tight">
              TalentForge<span className="text-[#2563EB]"> AI</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
          <nav className={`space-y-0.5 ${sidebarCollapsed ? 'px-2' : 'px-3'}`}>
            {!sidebarCollapsed && (
              <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Main</p>
            )}
            {mainNav.map((item) => (
              <NavItem key={item.name} item={item} active={isActive(item.href)} collapsed={sidebarCollapsed} />
            ))}
          </nav>

          <div className="mx-3 my-4 border-t border-[#E5E7EB]" />

          <nav className={`space-y-0.5 ${sidebarCollapsed ? 'px-2' : 'px-3'}`}>
            {!sidebarCollapsed && (
              <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Others</p>
            )}
            {secondaryNav.map((item) => (
              <NavItem key={item.name} item={item} active={isActive(item.href)} collapsed={sidebarCollapsed} />
            ))}
          </nav>
        </div>

        {/* Upgrade Banner */}
        {!sidebarCollapsed && (
          <div className="m-3 p-4 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-500 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-white fill-white" />
              <span className="text-sm font-bold">Upgrade to Premium</span>
            </div>
            <p className="text-[11px] text-amber-100 mb-3 leading-relaxed">
              Unlock exclusive jobs, early access and boost your profile visibility.
            </p>
            <button className="w-full bg-white text-amber-700 text-xs font-bold py-2 rounded-lg hover:bg-amber-50 transition-colors">
              Upgrade Now
            </button>
          </div>
        )}

        {/* Help */}
        {!sidebarCollapsed && (
          <div className="mx-3 mb-2 pb-2 border-t border-[#E5E7EB] pt-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 px-3">
              <span className="text-slate-400">?</span>
              <span>Need Help?</span>
            </div>
            <button className="px-3 mt-1 text-xs text-primary-600 hover:text-primary-700 font-medium">
              Visit Help Center →
            </button>
          </div>
        )}

        {/* Collapse toggle */}
        <div className="border-t border-[#E5E7EB] p-3">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors text-sm ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
            {!sidebarCollapsed && <span className="text-xs font-medium">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center px-4 md:px-6 gap-4 flex-shrink-0 z-30">
          {/* Mobile menu */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Global search */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs, companies, skills..."
                className="w-full pl-9 pr-16 py-2 text-sm bg-slate-50 border border-[#E5E7EB] rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 text-[10px] text-slate-400 font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                ⌘ K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-[#E5E7EB] shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 text-sm">Notifications</h3>
                    <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">Mark all read</button>
                  </div>
                  {notifications.map((n, i) => (
                    <div key={i} className={`px-4 py-3 flex items-start gap-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-[#E5E7EB] last:border-0 ${n.unread ? 'bg-primary-50/30' : ''}`}>
                      <span className="text-lg flex-shrink-0">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 leading-relaxed">{n.text}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                      </div>
                      {n.unread && <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1" />}
                    </div>
                  ))}
                  <div className="px-4 py-3">
                    <button className="w-full text-xs text-center text-primary-600 hover:text-primary-700 font-medium">View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold">
                  AS
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-slate-900 leading-none">Aaryan </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Frontend Developer</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-[#E5E7EB] shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#E5E7EB]">
                    <p className="text-sm font-semibold text-slate-900">Aaryan </p>
                    <p className="text-xs text-slate-500">aaryan@email.com</p>
                  </div>
                  {[
                    { icon: User, label: 'My Profile', href: '/candidate/profile' },
                    { icon: Settings, label: 'Settings', href: '/candidate/settings' },
                  ].map(({ icon: Icon, label, href }) => (
                    <Link key={label} to={href} onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <Icon className="w-4 h-4 text-slate-400" />
                      {label}
                    </Link>
                  ))}
                  <div className="border-t border-[#E5E7EB]">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CandidateLayout;
