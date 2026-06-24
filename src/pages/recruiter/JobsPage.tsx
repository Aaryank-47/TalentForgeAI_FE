import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, Share2, Eye, Edit2, Archive, MoreHorizontal,
  Briefcase, MapPin, Users, Calendar, Globe, TrendingUp, ChevronDown,
} from 'lucide-react';

import {
  jobsList as jobs,
  jobsTabs as tabs,
  jobDepartments as departments,
} from '../../constants/recruiter_mockData';


const statusStyle = (s: string) => ({
  Active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Draft: 'bg-slate-100 text-slate-600 border border-slate-200',
  Archived: 'bg-red-50 text-red-600 border border-red-200',
})[s] || 'bg-slate-100 text-slate-600';

const JobsPage = () => {
  const [activeTab, setActiveTab] = useState('All Jobs');
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All Departments');
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  const filtered = jobs.filter(j => {
    const matchTab = activeTab === 'All Jobs' || j.status === activeTab.replace('s', '').trim() || (activeTab === 'Active' && j.status === 'Active') || (activeTab === 'Draft' && j.status === 'Draft') || (activeTab === 'Archived' && j.status === 'Archived');
    const matchTab2 = activeTab === 'All Jobs' ? true : j.status === activeTab.replace(' Jobs', '');
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.dept.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === 'All Departments' || j.dept === dept;
    return matchTab2 && matchSearch && matchDept;
  });

  const counts = {
    'All Jobs': jobs.length,
    'Active': jobs.filter(j => j.status === 'Active').length,
    'Draft': jobs.filter(j => j.status === 'Draft').length,
    'Archived': jobs.filter(j => j.status === 'Archived').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">All Jobs</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Manage all your job openings and track applicants.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary text-sm flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-500" />
            Share Career Page
          </button>
          <Link to="/recruiter/jobs/create" className="btn-primary text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New Job
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E5E7EB]">
        <div className="flex items-center gap-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {counts[tab as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs by title, department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-72"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={dept}
              onChange={e => setDept(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {departments.map(d => <option key={d}>{d}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select className="appearance-none pl-3 pr-8 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Sort: Newest</option>
              <option>Sort: Most Applied</option>
              <option>Sort: Alphabetical</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {['Job Title', 'Department', 'Applications', 'Status', 'Posted On', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filtered.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${job.color} flex items-center justify-center flex-shrink-0`}>
                        <Briefcase className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A] group-hover:text-primary-600 transition-colors">{job.title}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-slate-400">{job.exp} • {job.type}</span>
                          {job.remote && (
                            <span className="text-[10px] font-medium bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">Remote</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">{job.dept}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-700">{job.applications}</span>
                      <span className="text-xs text-slate-400">Applicants</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-500">{job.created}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button title="View" className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button title="Edit" className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button title="Share" className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <button
                          title="More"
                          onClick={() => setMenuOpen(menuOpen === job.id ? null : job.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {menuOpen === job.id && (
                          <div className="absolute right-0 top-8 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-20 w-44 overflow-hidden">
                            {['Publish', 'Close Job', 'Duplicate', 'Archive'].map(action => (
                              <button key={action} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-[#E5E7EB] bg-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing {filtered.length} of {jobs.length} jobs</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg text-slate-500 disabled:opacity-50 hover:bg-white" disabled>Previous</button>
            <button className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg bg-primary-600 text-white">1</button>
            <button className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg text-slate-500 hover:bg-white">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
