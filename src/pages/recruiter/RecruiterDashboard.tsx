import React from 'react';
import { Users, Briefcase, Clock, CheckCircle2, MoreVertical, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', applicants: 400 },
  { name: 'Tue', applicants: 300 },
  { name: 'Wed', applicants: 550 },
  { name: 'Thu', applicants: 450 },
  { name: 'Fri', applicants: 600 },
  { name: 'Sat', applicants: 200 },
  { name: 'Sun', applicants: 300 },
];

const RecruiterDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Overview of your hiring activities and pipeline.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Briefcase className="w-4 h-4" /> Create New Job
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Active Jobs" value="12" change="+2 from last week" icon={<Briefcase className="w-5 h-5 text-primary-600" />} />
        <KpiCard title="Total Candidates" value="1,432" change="+120 from last week" icon={<Users className="w-5 h-5 text-primary-600" />} />
        <KpiCard title="Interviews Scheduled" value="24" change="+4 from last week" icon={<Clock className="w-5 h-5 text-primary-600" />} />
        <KpiCard title="Hired This Month" value="8" change="On track" icon={<CheckCircle2 className="w-5 h-5 text-success" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900 font-display">Candidate Application Volume</h2>
            <select className="text-sm border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApplicants" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="applicants" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorApplicants)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Needed / Recent */}
        <div className="card p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900 font-display">Needs Attention</h2>
            <span className="bg-warning/10 text-warning text-xs font-semibold px-2.5 py-0.5 rounded-full">4 Tasks</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ul className="divide-y divide-border">
              <TaskItem 
                title="Review AI Interview Results" 
                subtitle="Sarah Jenkins • Senior Frontend Developer" 
                time="2 hours ago" 
              />
              <TaskItem 
                title="Schedule Final Round" 
                subtitle="Michael Chang • Product Manager" 
                time="4 hours ago" 
              />
              <TaskItem 
                title="Approve Offer Letter" 
                subtitle="Emily Davis • UX Designer" 
                time="1 day ago" 
              />
              <TaskItem 
                title="Provide Feedback" 
                subtitle="Alex Wong • Backend Engineer" 
                time="1 day ago" 
              />
            </ul>
          </div>
          <div className="p-4 border-t border-border bg-slate-50/50">
            <button className="w-full text-sm font-medium text-primary-600 hover:text-primary-700 flex justify-center items-center gap-1">
              View All Tasks <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Pipelines Summary */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-slate-900 font-display mb-6">Active Job Pipelines</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Job Role</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Sourced</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">AI Screened</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Interview</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Offer</th>
                <th scope="col" className="relative px-3 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              <PipelineRow role="Senior Frontend Developer" department="Engineering" stats={[45, 12, 4, 1]} />
              <PipelineRow role="Product Marketing Manager" department="Marketing" stats={[120, 24, 6, 0]} />
              <PipelineRow role="UX Researcher" department="Design" stats={[85, 18, 3, 1]} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, change, icon }: any) => (
  <div className="card px-4 py-5 sm:p-6 flex flex-col justify-between group hover:border-primary-200 transition-colors">
    <div className="flex items-center justify-between mb-4">
      <div className="bg-primary-50 rounded-lg p-2 group-hover:bg-primary-100 transition-colors">{icon}</div>
      <MoreVertical className="w-4 h-4 text-slate-400 cursor-pointer" />
    </div>
    <div>
      <dt className="text-sm font-medium text-slate-500 truncate">{title}</dt>
      <dd className="mt-1 text-3xl font-semibold text-slate-900 font-display">{value}</dd>
      <dd className="mt-2 text-xs text-slate-500">{change}</dd>
    </div>
  </div>
);

const TaskItem = ({ title, subtitle, time }: any) => (
  <li className="p-4 hover:bg-slate-50 cursor-pointer transition-colors group">
    <div className="flex justify-between items-start">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 w-2 h-2 rounded-full bg-warning"></div>
        <div>
          <p className="text-sm font-medium text-slate-900 group-hover:text-primary-600 transition-colors">{title}</p>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>
      </div>
      <span className="text-xs text-slate-400 whitespace-nowrap">{time}</span>
    </div>
  </li>
);

const PipelineRow = ({ role, department, stats }: any) => (
  <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
    <td className="px-3 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-slate-900 group-hover:text-primary-600 transition-colors">{role}</div>
      <div className="text-xs text-slate-500">{department}</div>
    </td>
    {stats.map((stat: number, idx: number) => (
      <td key={idx} className="px-3 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          stat > 0 ? 'bg-slate-100 text-slate-800' : 'bg-slate-50 text-slate-400'
        }`}>
          {stat}
        </span>
      </td>
    ))}
    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
      <a href="#" className="text-slate-400 hover:text-primary-600">
        <MoreVertical className="w-5 h-5 ml-auto" />
      </a>
    </td>
  </tr>
);

export default RecruiterDashboard;
