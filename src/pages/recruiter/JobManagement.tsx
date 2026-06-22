import React from 'react';
import { Plus, Search, Filter, MoreHorizontal, Users, MapPin, Clock } from 'lucide-react';

const JobManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Job Management</h1>
          <p className="text-sm text-slate-500 mt-1">Create, manage, and track all your job postings.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create New Job
        </button>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white shadow-sm">
        <div className="flex gap-4 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="input-field pl-9 text-sm w-full"
              placeholder="Search jobs by title or department..."
            />
          </div>
          <select className="input-field text-sm w-36">
            <option>All Status</option>
            <option>Active</option>
            <option>Draft</option>
            <option>Closed</option>
          </select>
        </div>
        <button className="btn-secondary text-sm flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" /> More Filters
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidates</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Posted Date</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              <JobRow 
                title="Senior Frontend Developer"
                department="Engineering"
                location="San Francisco (Hybrid)"
                status="Active"
                candidates={45}
                date="Oct 12, 2026"
              />
              <JobRow 
                title="Product Marketing Manager"
                department="Marketing"
                location="Remote"
                status="Active"
                candidates={120}
                date="Oct 10, 2026"
              />
              <JobRow 
                title="UX Researcher"
                department="Design"
                location="New York (On-site)"
                status="Draft"
                candidates={0}
                date="-"
              />
              <JobRow 
                title="Backend Engineer (Go)"
                department="Engineering"
                location="Remote"
                status="Closed"
                candidates={85}
                date="Sep 15, 2026"
              />
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-border bg-slate-50 flex items-center justify-between">
          <span className="text-sm text-slate-500">Showing 1 to 4 of 4 jobs</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-border rounded text-sm text-slate-500 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-border rounded text-sm text-slate-500 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobRow = ({ title, department, location, status, candidates, date }: any) => {
  const getStatusColor = (s: string) => {
    switch(s) {
      case 'Active': return 'bg-success/10 text-success';
      case 'Draft': return 'bg-slate-100 text-slate-600';
      case 'Closed': return 'bg-error/10 text-error';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors group cursor-pointer">
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors font-display">{title}</span>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {department}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {location}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Users className="w-4 h-4 text-slate-400" /> {candidates}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock className="w-4 h-4 text-slate-400" /> {date}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-slate-400 hover:text-primary-600 transition-colors">
          <MoreHorizontal className="w-5 h-5 ml-auto" />
        </button>
      </td>
    </tr>
  );
};

export default JobManagement;
