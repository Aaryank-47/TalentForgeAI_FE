import React, { useState, useEffect, useCallback } from 'react';
import {
  Download, Calendar, TrendingUp, TrendingDown, ArrowUp, ArrowDown,
  Clock, Briefcase, Sparkles, CheckCircle2, Target, RefreshCw, AlertCircle,
  BarChart2, FileText, Loader2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { analyticsApi, type AnalyticsOverviewResponse } from '../../services/api/analytics.api';
import toast from 'react-hot-toast';

const AnalyticsPage = () => {
  const [period, setPeriod] = useState('Last 6 Months');
  const [data, setData] = useState<AnalyticsOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentWorkspace = useSelector((state: RootState) => state.workspace.currentWorkspace);
  const companyId = currentWorkspace?.type === 'COMPANY' ? currentWorkspace.id : undefined;

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await analyticsApi.getOverview(companyId, period);
      setData(res.data);
    } catch (err: any) {
      console.error('Failed to load analytics:', err);
      setError(err?.message || 'Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [companyId, period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExportReport = () => {
    if (!data) return;
    try {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += '=== TALENTFORGE AI ANALYTICS REPORT ===\n';
      csvContent += `Period: ${data.period}\n\n`;

      csvContent += '--- KEY PERFORMANCE INDICATORS ---\n';
      csvContent += `Metric,Value,Trend\n`;
      csvContent += `Time to Hire,${data.kpis.timeToHire.value},${data.kpis.timeToHire.trend}\n`;
      csvContent += `Open Jobs,${data.kpis.openJobs.value},${data.kpis.openJobs.trend}\n`;
      csvContent += `Total Hires,${data.kpis.totalHires.value},${data.kpis.totalHires.trend}\n`;
      csvContent += `Offer Acceptance,${data.kpis.offerAcceptance.value},${data.kpis.offerAcceptance.trend}\n`;
      csvContent += `Interview Success,${data.kpis.interviewSuccess.value},${data.kpis.interviewSuccess.trend}\n\n`;

      csvContent += '--- HIRING FUNNEL ---\n';
      csvContent += `Stage,Count\n`;
      data.funnelData.forEach(f => {
        csvContent += `${f.stage},${f.count}\n`;
      });
      csvContent += '\n';

      csvContent += '--- ASSESSMENT PERFORMANCE ---\n';
      csvContent += `Assessment,Attempts,Avg Score\n`;
      data.assessmentPerfData.forEach(a => {
        csvContent += `"${a.name}",${a.attempts},${a.avg}%\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `TalentForge_Analytics_${period.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Analytics report exported successfully.');
    } catch (e) {
      toast.error('Failed to export report.');
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4">
        <Loader2 className="w-9 h-9 text-primary-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading real-time recruitment analytics...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="card p-8 text-center space-y-4 max-w-md mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Failed to Load Analytics</h3>
          <p className="text-xs text-slate-500 mt-1">{error}</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="btn-primary text-sm inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  const kpis = data?.kpis || {
    timeToHire: { value: '0 Days', trend: '0%', positive: true },
    openJobs: { value: '0', trend: '+0', positive: true },
    totalHires: { value: '0', trend: '+0%', positive: true },
    offerAcceptance: { value: '0%', trend: '+0%', positive: true },
    interviewSuccess: { value: '0%', trend: '+0%', positive: true },
  };

  const funnelData = data?.funnelData || [];
  const timeToHireData = data?.timeToHireData || [];
  const sourceData = data?.sourceData || [];
  const interviewSuccessData = data?.interviewSuccessData || [];
  const jobsFilled = data?.jobsFilledData || [];
  const assessmentPerf = data?.assessmentPerfData || [];
  const funnelBaseCount = funnelData[0]?.count || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Analytics & Reports</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Data-driven insights from live recruitment records.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={period}
              onChange={e => setPeriod(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <button onClick={handleExportReport} className="btn-secondary text-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Time To Hire', value: kpis.timeToHire.value, trend: kpis.timeToHire.trend, positive: kpis.timeToHire.positive, icon: Clock, color: 'text-blue-600 bg-blue-50' },
          { label: 'Open Jobs', value: kpis.openJobs.value, trend: kpis.openJobs.trend, positive: kpis.openJobs.positive, icon: Briefcase, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Total Hires', value: kpis.totalHires.value, trend: kpis.totalHires.trend, positive: kpis.totalHires.positive, icon: Sparkles, color: 'text-amber-600 bg-amber-50' },
          { label: 'Offer Acceptance', value: kpis.offerAcceptance.value, trend: kpis.offerAcceptance.trend, positive: kpis.offerAcceptance.positive, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Interview Success', value: kpis.interviewSuccess.value, trend: kpis.interviewSuccess.trend, positive: kpis.interviewSuccess.positive, icon: Target, color: 'text-purple-600 bg-purple-50' },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${k.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-xs font-bold flex items-center gap-0.5 ${k.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                  {k.positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {k.trend}
                </span>
              </div>
              <p className="text-2xl font-display font-bold text-[#0F172A]">{k.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring Funnel */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-[#0F172A] text-base">Hiring Funnel</h3>
            <span className="text-xs text-slate-400">Conversion rates</span>
          </div>
          {funnelBaseCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <BarChart2 className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs font-medium text-slate-500">No application data recorded yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Funnel metrics will appear once candidates apply.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {funnelData.map((f) => {
                const pct = funnelBaseCount > 0 ? Math.round((f.count / funnelBaseCount) * 100) : 0;
                return (
                  <div key={f.stage} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-24 flex-shrink-0">{f.stage}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                      <div
                        className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-700"
                        style={{ width: `${Math.max(5, pct)}%`, backgroundColor: f.color }}
                      >
                        <span className="text-[10px] text-white font-bold">{f.count}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 w-8">{pct}%</span>
                  </div>
                );
              })}
            </div>
          )}
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
            {data?.timeToHireSummary?.isFaster ? (
              <TrendingDown className="w-4 h-4 text-emerald-500" />
            ) : (
              <TrendingUp className="w-4 h-4 text-amber-500" />
            )}
            <span className={`font-semibold ${data?.timeToHireSummary?.isFaster ? 'text-emerald-600' : 'text-amber-600'}`}>
              {data?.timeToHireSummary?.comparisonText || '0% change'}
            </span>
            <span className="text-slate-500">time to hire vs previous period</span>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Effectiveness */}
        <div className="card p-6">
          <h3 className="font-display font-bold text-[#0F172A] text-base mb-4">Source Effectiveness</h3>
          {sourceData.every(s => s.count === 0) ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="w-7 h-7 text-slate-300 mb-2" />
              <p className="text-xs font-medium text-slate-500">No applicant source data</p>
              <p className="text-[10px] text-slate-400">Sources will populate as candidates apply.</p>
            </div>
          ) : (
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
          )}
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
        </div>
        <div className="overflow-x-auto">
          {assessmentPerf.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">No assessments found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Created assessments and candidate attempt scores will display here.</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
