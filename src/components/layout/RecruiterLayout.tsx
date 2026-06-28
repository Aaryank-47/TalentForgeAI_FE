import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  GitBranch,
  ClipboardList,
  Video,
  BarChart3,
  MessageSquare,
  UsersRound,
  Settings,
  Bell,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Bot,
  LogOut,
  User,
  Workflow,
  Library,
  Building,
  CheckCircle,
  Zap,
  Search
} from 'lucide-react';
import jobportal from '../../assets/jobportal_logo2.jpg';

type NavItemConfig = {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
};

type NavGroupConfig = {
  name: string;
  items: (NavItemConfig | NavMenuConfig)[];
};

type NavMenuConfig = {
  name: string;
  icon: React.ElementType;
  badge?: number;
  submenu: NavItemConfig[];
};

const navStructure: (NavItemConfig | NavGroupConfig)[] = [
  { name: 'Dashboard', href: '/recruiter/dashboard', icon: LayoutDashboard },
  {
    name: 'RECRUITMENT',
    items: [
      { name: 'Jobs', href: '/recruiter/jobs', icon: Briefcase },
      { name: 'Candidates', href: '/recruiter/candidates', icon: Users },
      { name: 'Pipeline', href: '/recruiter/pipeline', icon: GitBranch },
    ],
  },
  {
    name: 'HIRING',
    items: [
      { name: 'Hiring Workflows', href: '/recruiter/workflows', icon: Workflow },
      { name: 'Assessments', href: '/recruiter/assessments', icon: ClipboardList },
      {
        name: 'Interviews',
        icon: Video,
        submenu: [
          { name: 'AI Interviews', href: '/recruiter/ai-interviews', icon: Bot },
          { name: 'Live Interviews', href: '/recruiter/interviews', icon: Video },
          { name: 'Interview Templates', href: '/recruiter/interview-templates', icon: Library },
          { name: 'Question Bank', href: '/recruiter/question-library', icon: Library },
        ],
      },
    ],
  },
  { name: 'Analytics', href: '/recruiter/analytics', icon: BarChart3 },
  {
    name: 'COMMUNICATION',
    items: [
      { name: 'Messages', href: '/recruiter/messages', icon: MessageSquare, badge: 3 },
      { name: 'Notifications', href: '/recruiter/notifications', icon: Bell },
    ],
  },
  {
    name: 'ORGANIZATION',
    items: [
      { name: 'Team', href: '/recruiter/team', icon: UsersRound },
      { name: 'Company Profile', href: '/recruiter/company', icon: Building },
    ],
  },
];

const NavItem: React.FC<{
  item: NavItemConfig;
  active: boolean;
  collapsed?: boolean;
  isSubmenu?: boolean;
}> = ({ item, active, collapsed, isSubmenu }) => {
  const Icon = item.icon;
  return (
    <Link
      to={item.href}
      title={collapsed ? item.name : undefined}
      className={`group flex items-center gap-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 relative ${
        isSubmenu ? 'px-3 pl-10' : 'px-3'
      } ${
        active
          ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/20'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      <Icon className={`flex-shrink-0 ${isSubmenu ? 'h-4 w-4' : 'h-5 w-5'} ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
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

const NavMenu: React.FC<{
  menu: NavMenuConfig;
  currentPath: string;
  collapsed?: boolean;
}> = ({ menu, currentPath, collapsed }) => {
  const isActive = menu.submenu.some(sub => currentPath === sub.href || currentPath.startsWith(sub.href + '/'));
  const [isOpen, setIsOpen] = useState(isActive);
  const Icon = menu.icon;

  if (collapsed) {
    return (
      <div className="relative group">
        <button
          className={`w-full flex justify-center items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
            isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Icon className={`flex-shrink-0 h-5 w-5 ${isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
          {menu.badge && <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full" />}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
          isActive && !isOpen ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        <Icon className={`flex-shrink-0 h-5 w-5 ${isActive && !isOpen ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
        <span className="flex-1 truncate text-left">{menu.name}</span>
        {menu.badge && !isOpen && (
          <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-700">
            {menu.badge}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="space-y-1 mt-1">
          {menu.submenu.map(sub => (
            <NavItem
              key={sub.name}
              item={sub}
              active={currentPath === sub.href || currentPath.startsWith(sub.href + '/')}
              isSubmenu
            />
          ))}
        </div>
      )}
    </div>
  );
};

const RecruiterLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const sidebarWidth = sidebarCollapsed ? 'w-[68px]' : 'w-[240px]';

  return (
    <div className="h-screen flex overflow-hidden bg-[#F8FAFC] font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
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

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
          <nav className={`px-3 space-y-4 ${sidebarCollapsed ? 'px-2' : ''}`}>
            {navStructure.map((section, idx) => {
              if ('items' in section) {
                return (
                  <div key={idx} className="space-y-1">
                    {!sidebarCollapsed && (
                      <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 mb-2 mt-4 uppercase">
                        {section.name}
                      </p>
                    )}
                    {sidebarCollapsed && idx > 0 && <div className="h-px bg-slate-100 my-2 mx-2" />}
                    
                    {section.items.map(item => {
                      if ('submenu' in item) {
                        return <NavMenu key={item.name} menu={item as NavMenuConfig} currentPath={location.pathname} collapsed={sidebarCollapsed} />;
                      }
                      return (
                        <NavItem
                          key={item.name}
                          item={item as NavItemConfig}
                          active={isActive(item.href)}
                          collapsed={sidebarCollapsed}
                        />
                      );
                    })}
                  </div>
                );
              }

              return (
                <NavItem
                  key={section.name}
                  item={section as NavItemConfig}
                  active={isActive(section.href)}
                  collapsed={sidebarCollapsed}
                />
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-[#E5E7EB] flex-shrink-0 space-y-1">
          <NavItem
            item={{ name: 'Settings', href: '/recruiter/settings', icon: Settings }}
            active={isActive('/recruiter/settings')}
            collapsed={sidebarCollapsed}
          />

          {/* Upgrade Card (hide if collapsed) */}
          {!sidebarCollapsed && (
            <div className="bg-[#2563EB] rounded-xl p-4 mt-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
                <Zap className="w-4 h-4 fill-white text-white" />
                Upgrade to Pro
              </div>
              <p className="text-white/80 text-xs mb-3">Unlock advanced hiring tools, analytics and more.</p>
              <button className="w-full bg-white text-[#2563EB] text-xs font-bold py-2 rounded-lg hover:bg-slate-50 transition-colors">
                Upgrade Plan
              </button>
            </div>
          )}

          {/* Collapse Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`
              mt-2 flex items-center w-full p-2 text-xs font-medium text-slate-500
              hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors
              ${sidebarCollapsed ? 'justify-center' : 'gap-2'}
            `}
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Search */}
            <div className="hidden sm:flex items-center relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input 
                type="text" 
                placeholder="Search candidates, jobs, tasks..." 
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm w-[300px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
              <div className="absolute right-3 flex items-center gap-1">
                <kbd className="hidden lg:inline-flex items-center justify-center px-1.5 h-5 text-[10px] font-medium text-slate-500 bg-white border border-slate-200 rounded">⌘K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition-colors">
              <Zap className="w-4 h-4 fill-white" />
              Upgrade
            </button>
            
            <div className="w-px h-6 bg-slate-200 hidden sm:block" />

            {/* Notifications */}
            <div className="relative">
              <button 
                className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              </button>
              
              {/* Notif Dropdown Mock */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-100 p-4 z-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900">Notifications</h3>
                    <button className="text-xs text-primary-600 font-medium">Mark all read</button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">AI Interview Complete</p>
                        <p className="text-xs text-slate-500 mt-0.5">Sarah Jenkins completed her frontend interview.</p>
                        <p className="text-[10px] text-slate-400 mt-1">2 mins ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 hover:bg-slate-50 p-1 pr-2 rounded-xl transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="h-9 w-9 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  LY
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold text-slate-900 leading-none">Lamine Yamal</p>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">HR Manager</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-100 mb-2 md:hidden">
                    <p className="text-sm font-bold text-slate-900">Lamine Yamal</p>
                    <p className="text-xs text-slate-500">HR Manager</p>
                  </div>
                  <Link to="/recruiter/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <User className="w-4 h-4 text-slate-400" /> My Profile
                  </Link>
                  <Link to="/recruiter/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <Settings className="w-4 h-4 text-slate-400" /> Account Settings
                  </Link>
                  <div className="h-px bg-slate-100 my-2" />
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-[#F8FAFC]">
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto min-h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecruiterLayout;
