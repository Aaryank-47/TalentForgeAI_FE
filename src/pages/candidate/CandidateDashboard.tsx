import React from 'react';
import { FileText, Clock, PlayCircle, CheckCircle2, ChevronRight } from 'lucide-react';

const CandidateDashboard = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-slate-900">Welcome back, Alex!</h1>
        <p className="text-sm text-slate-500 mt-1">Here is the status of your current applications and pending tasks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 font-display">Active Applications</h2>
          
          <ApplicationCard 
            role="Senior Frontend Developer"
            company="TechCorp Inc."
            status="Action Required"
            statusColor="text-warning bg-warning/10"
            date="Applied Oct 12, 2026"
          >
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <PlayCircle className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">AI Technical Interview</h4>
                  <p className="text-xs text-slate-500">Estimated time: 30-45 mins</p>
                </div>
              </div>
              <button className="btn-primary text-sm px-4 py-2">Start Assessment</button>
            </div>
          </ApplicationCard>

          <ApplicationCard 
            role="Lead UI Engineer"
            company="DesignSystem LLC"
            status="Under Review"
            statusColor="text-slate-700 bg-slate-100"
            date="Applied Oct 08, 2026"
          >
            <div className="mt-4 relative">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-100">
                <div style={{ width: "33%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"></div>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span className="text-primary-600">Applied</span>
                <span>Screening</span>
                <span>Interview</span>
                <span>Offer</span>
              </div>
            </div>
          </ApplicationCard>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 font-display">Your Profile Profile</h2>
          
          <div className="card p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-xl font-bold text-slate-600 border-2 border-white shadow-sm">
                AJ
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Alex Johnson</h3>
                <p className="text-sm text-slate-500">Frontend Engineer</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Profile Completion</span>
                <span className="font-semibold text-slate-700">85%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-success h-1.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <button className="w-full mt-4 btn-secondary text-sm flex justify-center items-center gap-2">
                <FileText className="w-4 h-4" /> Update Resume
              </button>
            </div>
          </div>

          <div className="card p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 text-sm">Recent Activity</h3>
            </div>
            <ul className="divide-y divide-border">
              <li className="p-4 flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-700">Completed Cognitive Assessment for <span className="font-medium">TechCorp Inc.</span></p>
                  <span className="text-xs text-slate-400">2 days ago</span>
                </div>
              </li>
              <li className="p-4 flex gap-3">
                <FileText className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-700">Uploaded new resume <span className="font-medium">alex_resume_v2.pdf</span></p>
                  <span className="text-xs text-slate-400">5 days ago</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const ApplicationCard = ({ role, company, status, statusColor, date, children }: any) => (
  <div className="card p-6 hover:border-primary-200 transition-colors">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h3 className="text-lg font-bold text-slate-900 font-display">{role}</h3>
        <p className="text-slate-600 text-sm">{company}</p>
      </div>
      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${statusColor}`}>
        {status}
      </span>
    </div>
    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
      <Clock className="w-3.5 h-3.5" /> {date}
    </div>
    {children}
  </div>
);

export default CandidateDashboard;
