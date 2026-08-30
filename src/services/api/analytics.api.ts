/**
 * TalentForge — Analytics API Service
 */

import { api } from './apiClient';

export interface KpiMetric {
  value: string;
  trend: string;
  positive: boolean;
}

export interface FunnelStageData {
  stage: string;
  count: number;
  color: string;
}

export interface TimeToHireTrendData {
  name: string;
  days: number;
}

export interface SourceEffectivenessData {
  name: string;
  value: number;
  count: number;
  color: string;
}

export interface InterviewSuccessData {
  name: string;
  success: number;
  rejected: number;
}

export interface JobsFilledData {
  month: string;
  open: number;
  filled: number;
}

export interface AssessmentPerfData {
  name: string;
  attempts: number;
  avg: number;
}

export interface AnalyticsOverviewResponse {
  period: string;
  kpis: {
    timeToHire: KpiMetric;
    openJobs: KpiMetric;
    totalHires: KpiMetric;
    offerAcceptance: KpiMetric;
    interviewSuccess: KpiMetric;
  };
  funnelData: FunnelStageData[];
  timeToHireData: TimeToHireTrendData[];
  timeToHireSummary: {
    comparisonText: string;
    isFaster: boolean;
  };
  sourceData: SourceEffectivenessData[];
  interviewSuccessData: InterviewSuccessData[];
  jobsFilledData: JobsFilledData[];
  assessmentPerfData: AssessmentPerfData[];
}

export interface DashboardKpi {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'warn';
}

export interface ApplicationVolumePoint {
  name: string;
  applicants: number;
  interviews: number;
}

export interface PipelineStageDashboard {
  stage: string;
  count: number;
  color: string;
  pct: number;
}

export interface UpcomingInterviewDashboard {
  id: string;
  name: string;
  role: string;
  time: string;
  type: string;
  avatar: string;
  color: string;
}

export interface RecentActivityDashboard {
  id: string;
  type: 'applied' | 'assessment' | 'interview' | 'offer' | 'hired';
  text: string;
  time: string;
  color: string;
}

export interface ActiveJobPipelineDashboard {
  id: string;
  role: string;
  dept: string;
  stats: [number, number, number, number];
  status: string;
}

export interface InterviewSummaryDashboard {
  totalInterviews: number;
  completedCount: number;
  scheduledCount: number;
  inProgressCount: number;
  cancelledCount: number;
  completionRate: number;
  avgDurationMinutes: number | null;
  avgScore: number | null;
  hasAnyData: boolean;
}

export interface RecruiterDashboardResponse {
  kpis: {
    openJobs: DashboardKpi;
    applicantsThisWeek: DashboardKpi;
    pendingReviews: DashboardKpi;
    todaysInterviews: DashboardKpi;
  };
  applicationVolume: ApplicationVolumePoint[];
  pipelineStages: PipelineStageDashboard[];
  upcomingInterviews: UpcomingInterviewDashboard[];
  interviewSummary: InterviewSummaryDashboard;
  recentActivity: RecentActivityDashboard[];
  activeJobPipelines: ActiveJobPipelineDashboard[];
  statsFooter: {
    offerAcceptRate: string;
    avgTimeToHire: string;
  };
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export const analyticsApi = {
  
  getOverview: async (
    companyId?: string,
    period: string = 'Last 6 Months'
  ): Promise<ApiResponse<AnalyticsOverviewResponse>> => {
    const endpoint = companyId ? `/analytics/${companyId}/overview` : '/analytics/overview';
    return api.get<ApiResponse<AnalyticsOverviewResponse>>(endpoint, {
      params: { period },
    });
  },

  
  getDashboard: async (
    companyId?: string,
    timeframe: string = '7d'
  ): Promise<ApiResponse<RecruiterDashboardResponse>> => {
    const endpoint = companyId ? `/analytics/${companyId}/dashboard` : '/analytics/dashboard';
    return api.get<ApiResponse<RecruiterDashboardResponse>>(endpoint, {
      params: { timeframe },
    });
  },
};
