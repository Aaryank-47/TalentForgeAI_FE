import React, { useState } from 'react';
import { Download, Calendar, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area, FunnelChart, Funnel, LabelList,
} from 'recharts';

import {
  timeToHireData,
  sourceEffectivenessData as sourceData,
  funnelAnalyticsData as funnelData,
  interviewSuccessData,
  assessmentPerfData as assessmentPerf,
  jobsFilledData as jobsFilled,
} from '../../constants/recruiter_mockData';


const AnalyticsPage = () => {
  const [period, setPeriod] = useState('Last 6 Months');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Analytics & Reports</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Data-driven insights to optimize your hiring process.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={period}
              onChange={e => setPeriod(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {['Last 30 Days', 'Last 6 Months', 'This Year', 'Last Year'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <button className="btn-secondary text-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Time To Hire', value: '28 Days', trend: '-15%', positive: true, icon: '⏱' },
          { label: 'Open Jobs', value: '18', trend: '+3', positive: false, icon: '💼' },
          { label: 'Total Hires', value: '42', trend: '+32%', positive: true, icon: '🎉' },
          { label: 'Offer Acceptance', value: '84%', trend: '+2%', positive: true, icon: '✅' },
          { label: 'Interview Success', value: '76%', trend: '+5%', positive: true, icon: '🎯' },
        ].map(k => (
          <div key={k.label} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{k.icon}</span>
              <span className={`text-xs font-bold flex items-center gap-0.5 ${k.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                {k.positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {k.trend}
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-[#0F172A]">{k.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring Funnel */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-[#0F172A] text-base">Hiring Funnel</h3>
            <span className="text-xs text-slate-400">Conversion rates</span>
          </div>
          <div className="space-y-2">
            {funnelData.map((f, i) => {
              const pct = Math.round((f.count / funnelData[0].count) * 100);
              const prevPct = i === 0 ? 100 : Math.round((funnelData[i - 1].count / funnelData[0].count) * 100);
              return (
                <div key={f.stage} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-24 flex-shrink-0">{f.stage}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                    <div
                      className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: f.color }}
                    >
                      <span className="text-[10px] text-white font-bold">{f.count}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 w-8">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time to Hire Trend */}
        <div className="card p-6">
          <h3 className="font-display font-bold text-[#0F172A] text-base mb-4">Time To Hire Trend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeToHireData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="tth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} unit=" d" />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '12px' }} formatter={(v: any) => [`${v} days`, 'Avg. Time to Hire']} />
                <Area type="monotone" dataKey="days" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#tth)" dot={{ r: 4, fill: '#2563EB', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <TrendingDown className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-600 font-semibold">38% faster</span>
            <span className="text-slate-500">time to hire vs last year</span>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Effectiveness */}
        <div className="card p-6">
          <h3 className="font-display font-bold text-[#0F172A] text-base mb-4">Source Effectiveness</h3>
          <div className="flex items-center gap-4">
            <div className="h-40">
              <PieChart width={140} height={140}>
                <Pie data={sourceData} cx={65} cy={65} innerRadius={42} outerRadius={65} paddingAngle={2} dataKey="value">
                  {sourceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </div>
            <div className="space-y-2 flex-1">
              {sourceData.map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-xs text-slate-600">{s.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interview Success Rates */}
        <div className="card p-6">
          <h3 className="font-display font-bold text-[#0F172A] text-base mb-4">Interview Success Rates</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={interviewSuccessData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94A3B8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} unit="%" />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="success" fill="#2563EB" radius={[4, 4, 0, 0]} name="Success" />
                <Bar dataKey="rejected" fill="#E5E7EB" radius={[4, 4, 0, 0]} name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Jobs Filled vs Open */}
        <div className="card p-6">
          <h3 className="font-display font-bold text-[#0F172A] text-base mb-4">Jobs Filled vs Open</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobsFilled} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} barSize={14} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="open" fill="#DBEAFE" radius={[4, 4, 0, 0]} name="Open" />
                <Bar dataKey="filled" fill="#2563EB" radius={[4, 4, 0, 0]} name="Filled" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Assessment Performance Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <h3 className="font-display font-bold text-[#0F172A] text-base">Assessment Performance</h3>
          <button className="text-xs text-primary-600 hover:text-primary-700 font-semibold">View All Analytics →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {['Assessment', 'Total Attempts', 'Avg. Score', 'Performance'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {assessmentPerf.map((a, i) => (
                <tr key={a.name} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-medium text-slate-400 w-5">{i + 1}.</span>
                      <span className="text-sm font-semibold text-slate-900">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">{a.attempts}</td>
                  <td className="px-5 py-3.5 text-sm font-bold text-slate-900">{a.avg}%</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-700"
                          style={{ width: `${a.avg}%`, backgroundColor: a.avg >= 80 ? '#22C55E' : a.avg >= 70 ? '#3B82F6' : '#F59E0B' }}
                        />
                      </div>
                      <span className={`text-xs font-semibold ${a.avg >= 80 ? 'text-emerald-600' : a.avg >= 70 ? 'text-blue-600' : 'text-amber-600'}`}>
                        {a.avg >= 80 ? 'Excellent' : a.avg >= 70 ? 'Good' : 'Average'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
