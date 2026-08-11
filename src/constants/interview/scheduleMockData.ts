// c:\Project\TalentForge\Frontend\src\modules\interviews\mocks\scheduleMockData.ts

export type JobStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';

export interface Job {
  id: string;
  title: string;
  department: string;
  status: JobStatus;
}

export type ApplicationStage = 'Applied' | 'Screening' | 'Assessment' | 'AI Interview' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  avatar: string;
  stage: ApplicationStage;
  status: 'ACTIVE' | 'REJECTED' | 'HIRED';
}

export type InterviewType = 'AI' | 'NORMAL';
export type InterviewMode = 'INDIVIDUAL' | 'GROUP';

export interface InterviewDefinition {
  id: string;
  title: string;
  type: InterviewType;
  mode: InterviewMode;
  durationMinutes: number;
}

export interface JobInterview {
  id: string;
  jobId: string;
  interviewId: string;
  displayOrder: number;
  isMandatory: boolean;
}

export interface CompanyMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  department: string;
}

export interface InterviewSession {
  id: string;
  assignmentId: string;
  interviewId: string;
  jobId: string;
  applicationId: string; // Used for INDIVIDUAL
  candidates: {
    id: string;
    name: string;
    avatar: string;
    applicationId: string;
  }[];
  job: {
    id: string;
    title: string;
  };
  interview: {
    id: string;
    title: string;
    type: InterviewType;
    mode: InterviewMode;
    durationMinutes: number;
  };
  interviewers: CompanyMember[];
  scheduledAt: string;
  startedAt: string | null;
  endedAt: string | null;
  status: 'Upcoming' | 'Completed' | 'Cancelled'; // Using Upcoming as matching InterviewsPage
  aiScore: number | null;
}

// ---------------------------------------------------------
// MOCK DATA
// ---------------------------------------------------------

export const mockJobs: Job[] = [
  { id: 'job-1', title: 'Senior Frontend Developer', department: 'Engineering', status: 'ACTIVE' },
  { id: 'job-2', title: 'Backend Engineer', department: 'Engineering', status: 'ACTIVE' },
  { id: 'job-3', title: 'Product Designer', department: 'Design', status: 'ACTIVE' },
  { id: 'job-4', title: 'Data Analyst', department: 'Analytics', status: 'ACTIVE' },
  { id: 'job-5', title: 'HR Manager', department: 'HR', status: 'DRAFT' },
];

export const mockApplications: Application[] = [
  // Senior Frontend Developer Candidates
  { id: 'app-101', jobId: 'job-1', candidateId: 'can-1', candidateName: 'Karan Malhotra', avatar: 'KM', stage: 'Interview', status: 'ACTIVE' },
  { id: 'app-102', jobId: 'job-1', candidateId: 'can-2', candidateName: 'Rahul Sharma', avatar: 'RS', stage: 'Screening', status: 'ACTIVE' },
  { id: 'app-103', jobId: 'job-1', candidateId: 'can-3', candidateName: 'Priya Singh', avatar: 'PS', stage: 'Applied', status: 'ACTIVE' },
  { id: 'app-104', jobId: 'job-1', candidateId: 'can-4', candidateName: 'Ananya Joshi', avatar: 'AJ', stage: 'AI Interview', status: 'ACTIVE' },
  { id: 'app-105', jobId: 'job-1', candidateId: 'can-5', candidateName: 'Aditya Kulkarni', avatar: 'AK', stage: 'Interview', status: 'ACTIVE' },

  // Backend Engineer Candidates
  { id: 'app-201', jobId: 'job-2', candidateId: 'can-6', candidateName: 'Vikram Iyer', avatar: 'VI', stage: 'Interview', status: 'ACTIVE' },
  { id: 'app-202', jobId: 'job-2', candidateId: 'can-7', candidateName: 'Sneha Reddy', avatar: 'SR', stage: 'Screening', status: 'ACTIVE' },

  // Product Designer Candidates
  { id: 'app-301', jobId: 'job-3', candidateId: 'can-8', candidateName: 'Neha Patel', avatar: 'NP', stage: 'Applied', status: 'ACTIVE' },
  
  // Data Analyst Candidates
  { id: 'app-401', jobId: 'job-4', candidateId: 'can-9', candidateName: 'Aman Verma', avatar: 'AV', stage: 'Assessment', status: 'ACTIVE' },
];

export const mockInterviewDefinitions: InterviewDefinition[] = [
  { id: 'int-def-1', title: 'AI Frontend Interview', type: 'AI', mode: 'INDIVIDUAL', durationMinutes: 30 },
  { id: 'int-def-2', title: 'Frontend Technical Round', type: 'NORMAL', mode: 'INDIVIDUAL', durationMinutes: 60 },
  { id: 'int-def-3', title: 'Frontend Group Discussion', type: 'NORMAL', mode: 'GROUP', durationMinutes: 45 },
  
  { id: 'int-def-4', title: 'Backend System Design', type: 'NORMAL', mode: 'INDIVIDUAL', durationMinutes: 60 },
  { id: 'int-def-5', title: 'AI Backend Assessment', type: 'AI', mode: 'INDIVIDUAL', durationMinutes: 45 },
  
  { id: 'int-def-6', title: 'Design Portfolio Review', type: 'NORMAL', mode: 'INDIVIDUAL', durationMinutes: 45 },
  { id: 'int-def-7', title: 'HR Culture Fit', type: 'NORMAL', mode: 'INDIVIDUAL', durationMinutes: 30 },
];

export const mockJobInterviews: JobInterview[] = [
  // Senior Frontend Developer
  { id: 'ji-1', jobId: 'job-1', interviewId: 'int-def-1', displayOrder: 1, isMandatory: true },
  { id: 'ji-2', jobId: 'job-1', interviewId: 'int-def-2', displayOrder: 2, isMandatory: true },
  { id: 'ji-3', jobId: 'job-1', interviewId: 'int-def-3', displayOrder: 3, isMandatory: false },
  { id: 'ji-4', jobId: 'job-1', interviewId: 'int-def-7', displayOrder: 4, isMandatory: true },

  // Backend Engineer
  { id: 'ji-5', jobId: 'job-2', interviewId: 'int-def-5', displayOrder: 1, isMandatory: true },
  { id: 'ji-6', jobId: 'job-2', interviewId: 'int-def-4', displayOrder: 2, isMandatory: true },
  { id: 'ji-7', jobId: 'job-2', interviewId: 'int-def-7', displayOrder: 3, isMandatory: true },

  // Product Designer
  { id: 'ji-8', jobId: 'job-3', interviewId: 'int-def-6', displayOrder: 1, isMandatory: true },
  
  // Data Analyst
  { id: 'ji-9', jobId: 'job-4', interviewId: 'int-def-7', displayOrder: 1, isMandatory: true },
];

export const mockCompanyMembers: CompanyMember[] = [
  { id: 'cm-1', name: 'Arjun Mehta', role: 'Senior Engineering Manager', avatar: 'AM', department: 'Engineering' },
  { id: 'cm-2', name: 'Priya Kapoor', role: 'Technical Recruiter', avatar: 'PK', department: 'HR' },
  { id: 'cm-3', name: 'Rahul Verma', role: 'Engineering Lead', avatar: 'RV', department: 'Engineering' },
  { id: 'cm-4', name: 'Sneha Gupta', role: 'Design Lead', avatar: 'SG', department: 'Design' },
  { id: 'cm-5', name: 'Lamine Yamal', role: 'Admin', avatar: 'LY', department: 'Operations' },
];
