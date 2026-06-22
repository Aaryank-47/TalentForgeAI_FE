import React from 'react';
import { Download, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

const timeToHireData = [
  { name: 'Jan', days: 45 },
  { name: 'Feb', days: 42 },
  { name: 'Mar', days: 38 },
  { name: 'Apr', days: 35 },
  { name: 'May', days: 30 },
  { name: 'Jun', days: 28 },
];

const sourceData = [
  { name: 'LinkedIn', value: 45 },
  { name: 'Direct', value: 25 },
  { name: 'Referral', value: 20 },
  { name: 'Agency', value: 10 },
];
const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

const conversionData = [
  { stage: 'Applied', count: 1000 },
  { stage: 'Screened', count: 400 },
  { stage: 'Interviewed', count: 150 },
  { stage: 'Offered', count: 50 },
  { stage: 'Hired', count: 42 },
];

const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Analytics & Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Data-driven insights to optimize your hiring process.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
            <select className="input-field pl-9 text-sm py-2">
              <option>Last 6 Months</option>
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <button className="btn-secondary text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Average Time to Hire" value="28 Days" trend="-15%" isPositive={true} />
        <StatCard title="Cost per Hire" value="$4,250" trend="-5%" isPositive={true} />
        <StatCard title="Offer Acceptance Rate" value="84%" trend="+2%" isPositive={true} />
        <StatCard title="Candidate NPS" value="72" trend="-3" isPositive={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time to Hire Chart */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-900 font-display mb-6">Time to Hire Trend (Days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeToHireData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="days" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source of Hire */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-900 font-display mb-6">Source of Hire</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Conversion */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-bold text-slate-900 font-display mb-6">Pipeline Conversion Funnel</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={conversionData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#1E293B', fontWeight: 500 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={32}>
                  {conversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === conversionData.length - 1 ? '#22c55e' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, isPositive }: any) => (
  <div className="card p-5 border-l-4 border-l-primary-500">
    <h4 className="text-sm font-medium text-slate-500">{title}</h4>
    <div className="mt-2 flex items-baseline gap-3">
      <span className="text-3xl font-display font-bold text-slate-900">{value}</span>
      <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-success' : 'text-error'}`}>
        {isPositive ? <ArrowUp className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDown className="w-3.5 h-3.5 mr-0.5" />}
        {trend}
      </span>
    </div>
  </div>
);

export default AnalyticsDashboard;
