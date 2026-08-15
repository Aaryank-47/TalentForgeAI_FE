// c:\Project\TalentForge\Frontend\src\constants\interview\scheduleMockData.ts
import type {
  Job,
  Application,
  Interview,
  JobInterview,
  CompanyMember,
  InterviewAssignment,
  InterviewSession
} from '../../types/interviewSession.types';

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

export const mockInterviews: Interview[] = [
  {
    id: 'int-def-1',
    title: 'AI Frontend Interview',
    description: 'An AI-powered screening round covering HTML, CSS, JavaScript, and React basics.',
    instructions: 'Ensure you are in a quiet room. Your camera and microphone must remain on.',
    type: 'AI',
    mode: 'INDIVIDUAL',
    status: 'ACTIVE',
    durationMinutes: 30
  },
  {
    id: 'int-def-2',
    title: 'Frontend Technical Round',
    description: 'Live coding and architectural discussion with senior frontend engineers.',
    instructions: 'Be prepared to share your screen and write React code. Have a stable internet connection.',
    type: 'NORMAL',
    mode: 'INDIVIDUAL',
    status: 'ACTIVE',
    durationMinutes: 60
  },
  {
    id: 'int-def-3',
    title: 'Frontend Group Discussion',
    description: 'Collaborative product ideation and design session with multiple candidates.',
    instructions: 'Be respectful and active in communication. This is a group activity.',
    type: 'NORMAL',
    mode: 'GROUP',
    status: 'ACTIVE',
    durationMinutes: 45
  },
  {
    id: 'int-def-4',
    title: 'Backend System Design',
    description: 'Scalability, caching, databases, and message queues session.',
    instructions: 'Be ready to draw diagrams using whiteboard tools.',
    type: 'NORMAL',
    mode: 'INDIVIDUAL',
    status: 'ACTIVE',
    durationMinutes: 60
  },
  {
    id: 'int-def-5',
    title: 'AI Backend Assessment',
    description: 'Automated backend logic, data structures, and database query questions.',
    instructions: 'You will have 45 minutes to complete the AI-assisted assessment.',
    type: 'AI',
    mode: 'INDIVIDUAL',
    status: 'ACTIVE',
    durationMinutes: 45
  },
  {
    id: 'int-def-6',
    title: 'Design Portfolio Review',
    description: 'Walkthrough of past design work and user experience case studies.',
    instructions: 'Prepare to present 2-3 design case studies from your portfolio.',
    type: 'NORMAL',
    mode: 'INDIVIDUAL',
    status: 'ACTIVE',
    durationMinutes: 45
  },
  {
    id: 'int-def-7',
    title: 'HR Culture Fit',
    description: 'Conversational round focusing on soft skills, values, and company fit.',
    instructions: 'Relaxed conversation. No technical coding required.',
    type: 'NORMAL',
    mode: 'INDIVIDUAL',
    status: 'ACTIVE',
    durationMinutes: 30
  }
];

export const mockJobInterviews: JobInterview[] = [
  { id: 'ji-1', jobId: 'job-1', interviewId: 'int-def-1', displayOrder: 1, isMandatory: true },
  { id: 'ji-2', jobId: 'job-1', interviewId: 'int-def-2', displayOrder: 2, isMandatory: true },
  { id: 'ji-3', jobId: 'job-1', interviewId: 'int-def-3', displayOrder: 3, isMandatory: false },
  { id: 'ji-4', jobId: 'job-1', interviewId: 'int-def-7', displayOrder: 4, isMandatory: true },
  { id: 'ji-5', jobId: 'job-2', interviewId: 'int-def-5', displayOrder: 1, isMandatory: true },
  { id: 'ji-6', jobId: 'job-2', interviewId: 'int-def-4', displayOrder: 2, isMandatory: true },
  { id: 'ji-7', jobId: 'job-2', interviewId: 'int-def-7', displayOrder: 3, isMandatory: true },
  { id: 'ji-8', jobId: 'job-3', interviewId: 'int-def-6', displayOrder: 1, isMandatory: true },
  { id: 'ji-9', jobId: 'job-4', interviewId: 'int-def-7', displayOrder: 1, isMandatory: true },
];

export const mockCompanyMembers: CompanyMember[] = [
  { id: 'cm-1', name: 'Arjun Mehta', role: 'Senior Engineering Manager', avatar: 'AM', department: 'Engineering', email: 'arjun@company.com', initials: 'AM', avatarColor: 'from-blue-500 to-blue-700' },
  { id: 'cm-2', name: 'Priya Kapoor', role: 'Technical Recruiter', avatar: 'PK', department: 'HR', email: 'priya@company.com', initials: 'PK', avatarColor: 'from-purple-500 to-purple-700' },
  { id: 'cm-3', name: 'Rahul Verma', role: 'Engineering Lead', avatar: 'RV', department: 'Engineering', email: 'rahul@company.com', initials: 'RV', avatarColor: 'from-emerald-500 to-emerald-700' },
  { id: 'cm-4', name: 'Sneha Gupta', role: 'Design Lead', avatar: 'SG', department: 'Design', email: 'sneha@company.com', initials: 'SG', avatarColor: 'from-rose-500 to-rose-700' },
  { id: 'cm-5', name: 'Lamine Yamal', role: 'Operations Admin', avatar: 'LY', department: 'Operations', email: 'lamine@company.com', initials: 'LY', avatarColor: 'from-amber-500 to-amber-700' },
];

export const mockInterviewAssignments: InterviewAssignment[] = [
  {
    id: 'asg-1',
    interviewId: 'int-def-2',
    applicationId: 'app-101',
    creationSource: 'RECRUITER',
    candidate: {
      id: 'can-1',
      name: 'Karan Malhotra',
      email: 'karan@email.com',
      initials: 'KM',
      avatarColor: 'from-blue-500 to-blue-700',
      title: 'Senior Frontend Developer',
      experience: '5 years',
      skills: ['React', 'TypeScript', 'Tailwind', 'Next.js']
    }
  },
  {
    id: 'asg-2',
    interviewId: 'int-def-2',
    applicationId: 'app-105',
    creationSource: 'RECRUITER',
    candidate: {
      id: 'can-5',
      name: 'Aditya Kulkarni',
      email: 'aditya@email.com',
      initials: 'AK',
      avatarColor: 'from-teal-500 to-teal-700',
      title: 'React Specialist',
      experience: '4 years',
      skills: ['React', 'Redux', 'Webpack', 'CSS']
    }
  },
  {
    id: 'asg-3',
    interviewId: 'int-def-3',
    applicationId: 'app-101',
    creationSource: 'RECRUITER',
    candidate: {
      id: 'can-1',
      name: 'Karan Malhotra',
      email: 'karan@email.com',
      initials: 'KM',
      avatarColor: 'from-blue-500 to-blue-700',
      title: 'Senior Frontend Developer',
      experience: '5 years',
      skills: ['React', 'TypeScript']
    }
  },
  {
    id: 'asg-4',
    interviewId: 'int-def-3',
    applicationId: 'app-105',
    creationSource: 'RECRUITER',
    candidate: {
      id: 'can-5',
      name: 'Aditya Kulkarni',
      email: 'aditya@email.com',
      initials: 'AK',
      avatarColor: 'from-teal-500 to-teal-700',
      title: 'React Specialist',
      experience: '4 years',
      skills: ['React', 'Redux']
    }
  }
];

export let mockInterviewSessions: InterviewSession[] = [
  {
    id: 'sess-1',
    interviewId: 'int-def-2',
    status: 'SCHEDULED',
    scheduledAt: '2026-08-18T10:00:00.000Z',
    startedAt: null,
    endedAt: null,
    participants: [
      { id: 'part-1', sessionId: 'sess-1', participantType: 'CANDIDATE', assignmentId: 'asg-1' },
      { id: 'part-2', sessionId: 'sess-1', participantType: 'INTERVIEWER', companyMemberId: 'cm-1' },
      { id: 'part-3', sessionId: 'sess-1', participantType: 'INTERVIEWER', companyMemberId: 'cm-2' }
    ]
  },
  {
    id: 'sess-2',
    interviewId: 'int-def-3',
    status: 'SCHEDULED',
    scheduledAt: '2026-08-19T14:30:00.000Z',
    startedAt: null,
    endedAt: null,
    participants: [
      { id: 'part-4', sessionId: 'sess-2', participantType: 'CANDIDATE', assignmentId: 'asg-3' },
      { id: 'part-5', sessionId: 'sess-2', participantType: 'CANDIDATE', assignmentId: 'asg-4' },
      { id: 'part-6', sessionId: 'sess-2', participantType: 'INTERVIEWER', companyMemberId: 'cm-3' }
    ]
  }
];
