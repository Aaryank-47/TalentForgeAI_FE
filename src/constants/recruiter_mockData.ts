export const applicationData = [
  { name: 'Mon', applicants: 18, interviews: 4 },
  { name: 'Tue', applicants: 28, interviews: 7 },
  { name: 'Wed', applicants: 55, interviews: 12 },
  { name: 'Thu', applicants: 42, interviews: 9 },
  { name: 'Fri', applicants: 63, interviews: 15 },
  { name: 'Sat', applicants: 22, interviews: 5 },
  { name: 'Sun', applicants: 30, interviews: 8 },
];

export const pipelineStagesDashboard = [
  { stage: 'Applied', count: 421, color: '#2563EB', pct: 100 },
  { stage: 'Screening', count: 210, color: '#3B82F6', pct: 50 },
  { stage: 'Assessment', count: 120, color: '#60A5FA', pct: 28 },
  { stage: 'Interview', count: 68, color: '#93C5FD', pct: 16 },
  { stage: 'Offer', count: 24, color: '#22C55E', pct: 6 },
  { stage: 'Hired', count: 12, color: '#16A34A', pct: 3 },
];

export const recentActivity = [
  { type: 'applied', icon: '👤', text: 'Rahul Sharma applied for Senior Frontend Developer', time: '2 min ago', color: 'bg-blue-100 text-blue-700' },
  { type: 'assessment', icon: '✅', text: 'Ananya Joshi completed Frontend Assessment (88%)', time: '18 min ago', color: 'bg-green-100 text-green-700' },
  { type: 'interview', icon: '🎥', text: 'AI Interview completed — Vikram Iyer (92 score)', time: '1h ago', color: 'bg-purple-100 text-purple-700' },
  { type: 'offer', icon: '📋', text: 'Offer sent to Tanmay Joshi for Backend Engineer', time: '2h ago', color: 'bg-amber-100 text-amber-700' },
  { type: 'hired', icon: '🎉', text: 'Saurabh Mishra joined as Product Designer', time: '1d ago', color: 'bg-emerald-100 text-emerald-700' },
  { type: 'applied', icon: '👤', text: 'Priya Singh applied for UX Researcher', time: '1d ago', color: 'bg-blue-100 text-blue-700' },
];

export const upcomingInterviewsDashboard = [
  { name: 'Rahul Sharma', role: 'Senior Frontend Developer', time: 'Today, 10:00 AM', type: 'AI Interview', avatar: 'RS', color: 'from-blue-500 to-blue-700' },
  { name: 'Ananya Joshi', role: 'Product Designer', time: 'Today, 2:00 PM', type: 'HR Round', avatar: 'AJ', color: 'from-purple-500 to-purple-700' },
  { name: 'Vikram Iyer', role: 'Backend Engineer', time: 'Tomorrow, 11:00 AM', type: 'Technical', avatar: 'VI', color: 'from-emerald-500 to-emerald-700' },
  { name: 'Sneha Reddy', role: 'Data Analyst', time: 'Jun 25, 3:00 PM', type: 'Final Round', avatar: 'SR', color: 'from-amber-500 to-amber-700' },
];

export const activeJobPipelines = [
  { role: 'Senior Frontend Developer', dept: 'Engineering', stats: [128, 32, 24, 8], status: 'Active' },
  { role: 'Product Designer', dept: 'Design', stats: [64, 18, 12, 3], status: 'Active' },
  { role: 'Backend Developer (Node.js)', dept: 'Engineering', stats: [96, 24, 14, 2], status: 'Active' },
  { role: 'HR Operations Manager', dept: 'HR', stats: [42, 12, 6, 1], status: 'Active' },
  { role: 'Marketing Specialist', dept: 'Marketing', stats: [28, 8, 4, 0], status: 'Draft' },
];

// JobsPage
export const jobsList = [
  { id: 1, title: 'Senior Frontend Developer', dept: 'Engineering', type: 'Full-time', exp: '3-5 years', location: 'Bangalore, India', remote: true, applications: 128, status: 'Active', created: 'May 12, 2024', color: 'from-blue-500 to-blue-700' },
  { id: 2, title: 'Product Designer', dept: 'Design', type: 'Full-time', exp: '2-4 years', location: 'Remote', remote: true, applications: 64, status: 'Active', created: 'May 10, 2024', color: 'from-purple-500 to-purple-700' },
  { id: 3, title: 'Backend Developer (Node.js)', dept: 'Engineering', type: 'Full-time', exp: '3-5 years', location: 'Hyderabad, India', remote: false, applications: 96, status: 'Active', created: 'May 8, 2024', color: 'from-emerald-500 to-emerald-700' },
  { id: 4, title: 'HR Operations Manager', dept: 'HR', type: 'Full-time', exp: '5-7 years', location: 'Mumbai, India', remote: false, applications: 42, status: 'Active', created: 'May 15, 2024', color: 'from-rose-500 to-rose-700' },
  { id: 5, title: 'Marketing Specialist', dept: 'Marketing', type: 'Full-time', exp: '2-3 years', location: 'Delhi, India', remote: true, applications: 28, status: 'Draft', created: 'May 14, 2024', color: 'from-amber-500 to-amber-700' },
  { id: 6, title: 'Data Analyst', dept: 'Analytics', type: 'Full-time', exp: '2-4 years', location: 'Pune, India', remote: false, applications: 57, status: 'Archived', created: 'Apr 28, 2024', color: 'from-slate-500 to-slate-700' },
];

export const jobsTabs = ['All Jobs', 'Active', 'Draft', 'Archived'];
export const jobDepartments = ['All Departments', 'Engineering', 'Design', 'HR', 'Marketing', 'Analytics'];

// CandidatesPage
export const candidatesList = [
  { id: 1, name: 'Rahul Sharma', initials: 'RS', color: 'from-blue-500 to-blue-700', job: 'Senior Frontend Developer', location: 'Bangalore, India', source: 'LinkedIn', experience: '2.5 yrs', match: 92, stage: 'Applied', skills: ['React', 'JS', 'TS'], email: 'rahul@email.com' },
  { id: 2, name: 'Ananya Joshi', initials: 'AJ', color: 'from-purple-500 to-purple-700', job: 'Product Designer', location: 'Mumbai, India', source: 'Career Page', experience: '3 yrs', match: 88, stage: 'Assessment', skills: ['Figma', 'UI/UX', 'React'], email: 'ananya@email.com' },
  { id: 3, name: 'Vikram Iyer', initials: 'VI', color: 'from-emerald-500 to-emerald-700', job: 'Senior Frontend Developer', location: 'Chennai, India', source: 'LinkedIn', experience: '3 yrs', match: 85, stage: 'Screening', skills: ['React', 'Node.js', 'JS'], email: 'vikram@email.com' },
  { id: 4, name: 'Priya Singh', initials: 'PS', color: 'from-rose-500 to-rose-700', job: 'UX Researcher', location: 'Delhi, India', source: 'Indeed', experience: '3 yrs', match: 89, stage: 'Applied', skills: ['Next.js', 'React', 'TS'], email: 'priya@email.com' },
  { id: 5, name: 'Karan Malhotra', initials: 'KM', color: 'from-amber-500 to-amber-700', job: 'Senior Frontend Developer', location: 'Pune, India', source: 'Referral', experience: '2 yrs', match: 80, stage: 'Interview', skills: ['React', 'JS'], email: 'karan@email.com' },
  { id: 6, name: 'Sneha Reddy', initials: 'SR', color: 'from-teal-500 to-teal-700', job: 'Backend Engineer', location: 'Hyderabad, India', source: 'Naukri', experience: '2.2 yrs', match: 82, stage: 'Screening', skills: ['Node.js', 'React'], email: 'sneha@email.com' },
  { id: 7, name: 'Aditya Kulkarni', initials: 'AK', color: 'from-indigo-500 to-indigo-700', job: 'Senior Frontend Developer', location: 'Bangalore, India', source: 'LinkedIn', experience: '3 yrs', match: 88, stage: 'AI Interview', skills: ['React', 'TS', 'Redux'], email: 'aditya@email.com' },
  { id: 8, name: 'Neha Patel', initials: 'NP', color: 'from-pink-500 to-pink-700', job: 'Data Analyst', location: 'Ahmedabad, India', source: 'Career Page', experience: '1.8 yrs', match: 75, stage: 'Applied', skills: ['Python', 'SQL', 'Power BI'], email: 'neha@email.com' },
];

export const candidateStages = ['All', 'Applied', 'Screening', 'Assessment', 'AI Interview', 'Interview', 'Offer', 'Hired', 'Rejected'];
export const candidateSources = ['All Sources', 'LinkedIn', 'Career Page', 'Indeed', 'Naukri', 'Referral'];

// PipelinePage
export type StageKey = 'Applied' | 'Screening' | 'Assessment' | 'AI Interview' | 'Technical' | 'HR' | 'Offer' | 'Hired' | 'Rejected';

export const PIPELINE_STAGES: { key: StageKey; label: string; color: string; textColor: string; dot: string }[] = [
  { key: 'Applied', label: 'Applied', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700', dot: 'bg-blue-500' },
  { key: 'Screening', label: 'Screening', color: 'bg-amber-50 border-amber-200', textColor: 'text-amber-700', dot: 'bg-amber-500' },
  { key: 'Assessment', label: 'Assessment', color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-700', dot: 'bg-purple-500' },
  { key: 'AI Interview', label: 'AI Interview', color: 'bg-violet-50 border-violet-200', textColor: 'text-violet-700', dot: 'bg-violet-500' },
  { key: 'Technical', label: 'Technical', color: 'bg-indigo-50 border-indigo-200', textColor: 'text-indigo-700', dot: 'bg-indigo-500' },
  { key: 'HR', label: 'HR', color: 'bg-pink-50 border-pink-200', textColor: 'text-pink-700', dot: 'bg-pink-500' },
  { key: 'Offer', label: 'Offer', color: 'bg-emerald-50 border-emerald-200', textColor: 'text-emerald-700', dot: 'bg-emerald-500' },
  { key: 'Hired', label: 'Hired', color: 'bg-green-50 border-green-200', textColor: 'text-green-700', dot: 'bg-green-500' },
  { key: 'Rejected', label: 'Rejected', color: 'bg-red-50 border-red-200', textColor: 'text-red-600', dot: 'bg-red-500' },
];

export const pipelineInitialData: Record<StageKey, any[]> = {
  Applied: [
    { id: 1, name: 'Rahul Sharma', avatar: 'RS', color: 'from-blue-500 to-blue-700', role: 'Senior Frontend Dev', skills: ['React', 'JS', 'TS'], exp: '2.5 yrs', match: 92, source: 'LinkedIn', date: '1d ago' },
    { id: 2, name: 'Priya Singh', avatar: 'PS', color: 'from-rose-500 to-rose-700', role: 'Senior Frontend Dev', skills: ['Next.js', 'React'], exp: '3 yrs', match: 89, source: 'Career Page', date: '1d ago' },
    { id: 3, name: 'Aman Verma', avatar: 'AV', color: 'from-orange-500 to-orange-700', role: 'Senior Frontend Dev', skills: ['React', 'Redux'], exp: '2 yrs', match: 78, source: 'Naukri', date: '3d ago' },
    { id: 4, name: 'Neha Patel', avatar: 'NP', color: 'from-pink-500 to-pink-700', role: 'Senior Frontend Dev', skills: ['React', 'JS'], exp: '1.8 yrs', match: 75, source: 'Referral', date: '4d ago' },
  ],
  Screening: [
    { id: 5, name: 'Vikram Iyer', avatar: 'VI', color: 'from-emerald-500 to-emerald-700', role: 'Senior Frontend Dev', skills: ['React', 'Node.js'], exp: '3 yrs', match: 88, source: 'LinkedIn', date: '1d ago' },
    { id: 6, name: 'Sneha Reddy', avatar: 'SR', color: 'from-teal-500 to-teal-700', role: 'Senior Frontend Dev', skills: ['Node.js', 'React'], exp: '2.2 yrs', match: 82, source: 'Indeed', date: '2d ago' },
    { id: 7, name: 'Karan Malhotra', avatar: 'KM', color: 'from-amber-500 to-amber-700', role: 'Senior Frontend Dev', skills: ['React', 'JS'], exp: '2 yrs', match: 80, source: 'Referral', date: '2d ago' },
  ],
  Assessment: [
    { id: 8, name: 'Arjun Nair', avatar: 'AN', color: 'from-cyan-500 to-cyan-700', role: 'Senior Frontend Dev', skills: ['React', 'TS'], exp: '3 yrs', match: 85, source: 'HackerRank', date: '2d ago', testStatus: 'In Progress' },
    { id: 9, name: 'Pooja Mehta', avatar: 'PM', color: 'from-purple-500 to-purple-700', role: 'Senior Frontend Dev', skills: ['React', 'Next.js'], exp: '2.5 yrs', match: 80, source: 'HackerRank', date: '2d ago', testStatus: 'In Progress' },
    { id: 10, name: 'Rohit Das', avatar: 'RD', color: 'from-slate-500 to-slate-700', role: 'Senior Frontend Dev', skills: ['React', 'JS'], exp: '2 yrs', match: 70, source: 'HackerRank', date: '3d ago' },
  ],
  'AI Interview': [
    { id: 11, name: 'Ananya Joshi', avatar: 'AJ', color: 'from-violet-500 to-violet-700', role: 'Senior Frontend Dev', skills: ['React', 'TS'], exp: '3 yrs', match: 88, source: 'LinkedIn', date: '1d ago', testStatus: 'Completed' },
    { id: 12, name: 'Siddharth Rao', avatar: 'SR2', color: 'from-blue-600 to-blue-800', role: 'Senior Frontend Dev', skills: ['React', 'Next.js'], exp: '2.5 yrs', match: 84, source: 'LinkedIn', date: '2d ago', testStatus: 'Completed' },
    { id: 13, name: 'Megha Kapoor', avatar: 'MK', color: 'from-fuchsia-500 to-fuchsia-700', role: 'Senior Frontend Dev', skills: ['React', 'JS'], exp: '2 yrs', match: 79, source: 'LinkedIn', date: '2d ago', testStatus: 'Completed' },
  ],
  Technical: [
    { id: 14, name: 'Aditya Kulkarni', avatar: 'AK', color: 'from-indigo-500 to-indigo-700', role: 'Senior Frontend Dev', skills: ['React', 'TS'], exp: '3 yrs', match: 88, source: 'LinkedIn', date: '1d ago', interview: 'May 20, 11:00 AM' },
    { id: 15, name: 'Ritika Sharma', avatar: 'RS2', color: 'from-lime-500 to-lime-700', role: 'Senior Frontend Dev', skills: ['React', 'Next.js'], exp: '2.5 yrs', match: 82, source: 'LinkedIn', date: '2d ago', interview: 'May 21, 02:00 PM' },
  ],
  HR: [
    { id: 16, name: 'Kunal Bansal', avatar: 'KB', color: 'from-rose-600 to-rose-800', role: 'Senior Frontend Dev', skills: ['React', 'TS'], exp: '2.5 yrs', match: 93, source: 'LinkedIn', date: '2d ago', interview: 'May 22, 11:00 AM' },
    { id: 17, name: 'Isha Gupta', avatar: 'IG', color: 'from-orange-600 to-orange-800', role: 'Senior Frontend Dev', skills: ['React', 'JS'], exp: '2 yrs', match: 90, source: 'LinkedIn', date: '2d ago', interview: 'May 23, 02:00 PM' },
  ],
  Offer: [
    { id: 18, name: 'Tanmay Joshi', avatar: 'TJ', color: 'from-emerald-600 to-emerald-800', role: 'Senior Frontend Dev', skills: ['React', 'TS'], exp: '3 yrs', match: 95, source: 'LinkedIn', date: '1d ago', badge: 'Offer' },
    { id: 19, name: 'Simran Kaur', avatar: 'SK', color: 'from-sky-600 to-sky-800', role: 'Senior Frontend Dev', skills: ['React', 'Next.js'], exp: '2.5 yrs', match: 91, source: 'LinkedIn', date: '1d ago', badge: 'Offer' },
  ],
  Hired: [
    { id: 20, name: 'Saurabh Mishra', avatar: 'SM', color: 'from-green-600 to-green-800', role: 'Senior Frontend Dev', skills: ['React', 'TS'], exp: '3 yrs', match: 94, source: 'LinkedIn', date: 'May 10, 2024', badge: 'Joined' },
    { id: 21, name: 'Aditi Rao', avatar: 'AR', color: 'from-teal-600 to-teal-800', role: 'Senior Frontend Dev', skills: ['React', 'Next.js'], exp: '2.5 yrs', match: 90, source: 'LinkedIn', date: 'May 6, 2024', badge: 'Joined' },
  ],
  Rejected: [
    { id: 22, name: 'Nikhil Jain', avatar: 'NJ', color: 'from-slate-400 to-slate-600', role: 'Senior Frontend Dev', skills: ['React', 'JS'], exp: '1.5 yrs', match: 0, source: 'LinkedIn', date: '2d ago' },
    { id: 23, name: 'Divya Nair', avatar: 'DN', color: 'from-slate-400 to-slate-600', role: 'Senior Frontend Dev', skills: ['React', 'JS'], exp: '2 yrs', match: 0, source: 'LinkedIn', date: '2d ago' },
  ],
};

// AssessmentsPage
export const assessmentsList = [
  { id: 1, name: 'Frontend Developer Test', type: 'Technical', tags: 'HTML, CSS, JavaScript, React', questions: 30, duration: '60 min', job: 'Senior Frontend Developer', attempts: 128, avgScore: 76, status: 'Active', color: 'bg-blue-500', created: 'May 5, 2024', by: 'Lamine Yamal' },
  { id: 2, name: 'Aptitude Test', type: 'Aptitude', tags: 'Quantitative, Logical, Verbal', questions: 40, duration: '45 min', job: 'Multiple Jobs (5)', attempts: 312, avgScore: 65, status: 'Active', color: 'bg-amber-500', created: 'May 3, 2024', by: 'Lamine Yamal' },
  { id: 3, name: 'Backend Developer Test', type: 'Technical', tags: 'Node.js, Express, MongoDB', questions: 35, duration: '75 min', job: 'Backend Developer (Node.js)', attempts: 96, avgScore: 81, status: 'Active', color: 'bg-emerald-500', created: 'May 1, 2024', by: 'Lamine Yamal' },
  { id: 4, name: 'UI/UX Design Test', type: 'MCQ', tags: 'Design Principles, Figma', questions: 25, duration: '40 min', job: 'Product Designer', attempts: 64, avgScore: 74, status: 'Active', color: 'bg-purple-500', created: 'Apr 29, 2024', by: 'Lamine Yamal' },
  { id: 5, name: 'JavaScript Fundamentals', type: 'MCQ', tags: 'ES6+, Async, OOPs', questions: 20, duration: '30 min', job: 'Junior Frontend Developer', attempts: 156, avgScore: 71, status: 'Draft', color: 'bg-orange-500', created: 'Apr 28, 2024', by: 'Lamine Yamal' },
  { id: 6, name: 'Data Structures & Algorithms', type: 'Technical', tags: 'Arrays, Linked List, Trees', questions: 25, duration: '60 min', job: 'Software Engineer', attempts: 89, avgScore: 76, status: 'Active', color: 'bg-indigo-500', created: 'Apr 25, 2024', by: 'Lamine Yamal' },
  { id: 7, name: 'System Design Assessment', type: 'Technical', tags: 'Scalability, Databases, APIs', questions: 15, duration: '90 min', job: 'Senior Backend Engineer', attempts: 27, avgScore: 88, status: 'Draft', color: 'bg-rose-500', created: 'Apr 22, 2024', by: 'Lamine Yamal' },
  { id: 8, name: 'Communication Skills Test', type: 'Aptitude', tags: 'Grammar, Vocabulary, Reading', questions: 30, duration: '35 min', job: 'Multiple Jobs (2)', attempts: 76, avgScore: 62, status: 'Archived', color: 'bg-slate-400', created: 'Apr 20, 2024', by: 'Lamine Yamal' },
];

export const assessmentScoreDistribution = [
  { name: '90-100%', value: 312, color: '#22C55E' },
  { name: '75-89%', value: 486, color: '#3B82F6' },
  { name: '50-74%', value: 312, color: '#F59E0B' },
  { name: '0-49%', value: 138, color: '#EF4444' },
];

export const assessmentPerformanceTrend = [
  { month: 'Jan', score: 68 }, { month: 'Feb', score: 72 }, { month: 'Mar', score: 75 },
  { month: 'Apr', score: 71 }, { month: 'May', score: 78 }, { month: 'Jun', score: 74 }, { month: 'Jul', score: 76 },
];

export const topAssessments = [
  { name: 'System Design Assessment', score: 88 },
  { name: 'Backend Developer Test', score: 81 },
  { name: 'Frontend Developer Test', score: 76 },
  { name: 'UI/UX Design Test', score: 74 },
  { name: 'JavaScript Fundamentals', score: 71 },
];

export const assessmentRecentResults = [
  { name: 'Rahul Sharma', role: 'Senior Frontend Developer', date: 'May 11, 2024', score: 92, color: 'from-blue-500 to-blue-700', initials: 'RS' },
  { name: 'Ananya Joshi', role: 'Senior Frontend Developer', date: 'May 11, 2024', score: 88, color: 'from-purple-500 to-purple-700', initials: 'AJ' },
  { name: 'Vikram Iyer', role: 'Senior Frontend Developer', date: 'May 11, 2024', score: 76, color: 'from-emerald-500 to-emerald-700', initials: 'VI' },
  { name: 'Sneha Reddy', role: 'Senior Frontend Developer', date: 'May 9, 2024', score: 72, color: 'from-rose-500 to-rose-700', initials: 'SR' },
  { name: 'Aditya Kulkarni', role: 'Senior Frontend Developer', date: 'May 9, 2024', score: 68, color: 'from-amber-500 to-amber-700', initials: 'AK' },
];

// InterviewsPage
export const interviewsList = [
  { id: 1, candidate: 'Rahul Sharma', initials: 'RS', color: 'from-blue-500 to-blue-700', job: 'Senior Frontend Developer', type: 'AI Interview', date: 'Today', time: '10:00 AM', status: 'Upcoming', aiScore: null },
  { id: 2, candidate: 'Ananya Joshi', initials: 'AJ', color: 'from-purple-500 to-purple-700', job: 'Product Designer', type: 'HR Round', date: 'Today', time: '2:00 PM', status: 'Upcoming', aiScore: null },
  { id: 3, candidate: 'Vikram Iyer', initials: 'VI', color: 'from-emerald-500 to-emerald-700', job: 'Backend Engineer', type: 'Technical', date: 'Tomorrow', time: '11:00 AM', status: 'Upcoming', aiScore: null },
  { id: 4, candidate: 'Sneha Reddy', initials: 'SR', color: 'from-amber-500 to-amber-700', job: 'Data Analyst', type: 'Final Round', date: 'Jun 25', time: '3:00 PM', status: 'Upcoming', aiScore: null },
  { id: 5, candidate: 'Karan Malhotra', initials: 'KM', color: 'from-rose-500 to-rose-700', job: 'Senior Frontend Developer', type: 'AI Interview', date: 'Jun 20', time: '11:00 AM', status: 'Completed', aiScore: 88 },
  { id: 6, candidate: 'Aditya Kulkarni', initials: 'AK', color: 'from-indigo-500 to-indigo-700', job: 'Senior Frontend Developer', type: 'Technical', date: 'Jun 19', time: '2:00 PM', status: 'Completed', aiScore: 92 },
  { id: 7, candidate: 'Priya Singh', initials: 'PS', color: 'from-teal-500 to-teal-700', job: 'UX Researcher', type: 'HR Round', date: 'Jun 18', time: '10:00 AM', status: 'Completed', aiScore: 78 },
  { id: 8, candidate: 'Neha Patel', initials: 'NP', color: 'from-orange-500 to-orange-700', job: 'Data Analyst', type: 'AI Interview', date: 'Jun 17', time: '3:00 PM', status: 'Cancelled', aiScore: null },
];

export const interviewAiScores = {
  confidence: 88,
  communication: 92,
  technical: 85,
  problemSolving: 79,
};

// MessagesPage
export const messageThreads = [
  { id: 1, name: 'Rahul Sharma', initials: 'RS', color: 'from-blue-500 to-blue-700', preview: 'Hi, I have a question about the role...', time: '2m', unread: 2, active: true },
  { id: 2, name: 'Priya Singh', initials: 'PS', color: 'from-rose-500 to-rose-700', preview: 'Thank you for the opportunity!', time: '15m', unread: 0, active: false },
  { id: 3, name: 'Vikram Iyer', initials: 'VI', color: 'from-emerald-500 to-emerald-700', preview: 'When is the technical interview?', time: '1h', unread: 1, active: false },
  { id: 4, name: 'Ananya Joshi', initials: 'AJ', color: 'from-purple-500 to-purple-700', preview: 'I can join next Monday.', time: '3h', unread: 0, active: false },
  { id: 5, name: 'Sneha Reddy', initials: 'SR', color: 'from-amber-500 to-amber-700', preview: 'Documents submitted!', time: '1d', unread: 0, active: false },
];

export const chatMessages = [
  { from: 'candidate', text: 'Hi, I have a question about the Senior Frontend Developer role.', time: '10:02 AM' },
  { from: 'recruiter', text: 'Hello Rahul! Sure, go ahead. Happy to help.', time: '10:05 AM' },
  { from: 'candidate', text: 'Is there any relocation support provided for this role?', time: '10:07 AM' },
  { from: 'recruiter', text: 'Yes, we do offer relocation assistance. The details will be shared in the offer letter.', time: '10:10 AM' },
  { from: 'candidate', text: 'Great! Also, when would I hear back about the next steps?', time: '10:12 AM' },
  { from: 'recruiter', text: 'Our team will reach out within 2–3 business days after the technical interview.', time: '10:15 AM' },
];

// AnalyticsPage
export const timeToHireData = [
  { name: 'Jan', days: 45 }, { name: 'Feb', days: 42 }, { name: 'Mar', days: 38 },
  { name: 'Apr', days: 35 }, { name: 'May', days: 30 }, { name: 'Jun', days: 28 },
];

export const sourceEffectivenessData = [
  { name: 'LinkedIn', value: 45, color: '#0077B5' },
  { name: 'Career Page', value: 25, color: '#2563EB' },
  { name: 'Indeed', value: 15, color: '#FF5722' },
  { name: 'Naukri', value: 10, color: '#F59E0B' },
  { name: 'Referral', value: 5, color: '#22C55E' },
];

export const funnelAnalyticsData = [
  { stage: 'Applied', count: 1248, color: '#2563EB' },
  { stage: 'Screening', count: 624, color: '#3B82F6' },
  { stage: 'Assessment', count: 320, color: '#60A5FA' },
  { stage: 'AI Interview', count: 180, color: '#818CF8' },
  { stage: 'Technical', count: 96, color: '#A78BFA' },
  { stage: 'HR Round', count: 48, color: '#C084FC' },
  { stage: 'Offered', count: 28, color: '#22C55E' },
  { stage: 'Hired', count: 18, color: '#16A34A' },
];

export const interviewSuccessData = [
  { name: 'AI Interview', success: 76, rejected: 24 },
  { name: 'Technical', success: 68, rejected: 32 },
  { name: 'HR Round', success: 82, rejected: 18 },
  { name: 'Final Round', success: 88, rejected: 12 },
];

export const assessmentPerfData = [
  { name: 'System Design Assessment', attempts: 27, avg: 88 },
  { name: 'Backend Developer Test', attempts: 96, avg: 81 },
  { name: 'Frontend Developer Test', attempts: 128, avg: 76 },
  { name: 'UI/UX Design Test', attempts: 64, avg: 74 },
  { name: 'JavaScript Fundamentals', attempts: 156, avg: 71 },
];

export const jobsFilledData = [
  { month: 'Jan', open: 12, filled: 4 },
  { month: 'Feb', open: 15, filled: 6 },
  { month: 'Mar', open: 18, filled: 8 },
  { month: 'Apr', open: 14, filled: 10 },
  { month: 'May', open: 20, filled: 12 },
  { month: 'Jun', open: 18, filled: 9 },
];

// SettingsPage
export const settingsTabs = ['Company Profile', 'Team Members', 'Pipeline Stages', 'Email Preferences', 'Subscription & Billing'];

export const settingsTeamMembers = [
  { id: 1, name: 'Lamine Yamal', email: 'lamine@talentforge.ai', role: 'Admin', status: 'Active', avatar: 'LY', color: 'from-blue-500 to-blue-700', initials: 'LY', you: true },
  { id: 2, name: 'Priya Sharma', email: 'priya@talentforge.ai', role: 'Recruiter', status: 'Active', avatar: 'PS', color: 'from-purple-500 to-purple-700', initials: 'PS', you: false },
  { id: 3, name: 'Rahul Mehta', email: 'rahul@talentforge.ai', role: 'Hiring Manager', status: 'Active', avatar: 'RM', color: 'from-emerald-500 to-emerald-700', initials: 'RM', you: false },
  { id: 4, name: 'Sneha Gupta', email: 'sneha@talentforge.ai', role: 'HR', status: 'Pending', avatar: 'SG', color: 'from-amber-500 to-amber-700', initials: 'SG', you: false },
  { id: 5, name: 'Arjun Kumar', email: 'arjun@talentforge.ai', role: 'Recruiter', status: 'Active', avatar: 'AK', color: 'from-rose-500 to-rose-700', initials: 'AK', you: false },
];

export const settingsDefaultStages = [
  { id: 1, name: 'Applied', color: '#2563EB', dot: 'bg-blue-500', removable: false },
  { id: 2, name: 'Screening', color: '#F59E0B', dot: 'bg-amber-500', removable: true },
  { id: 3, name: 'Assessment', color: '#8B5CF6', dot: 'bg-purple-500', removable: true },
  { id: 4, name: 'AI Interview', color: '#7C3AED', dot: 'bg-violet-500', removable: true },
  { id: 5, name: 'Technical', color: '#3B82F6', dot: 'bg-indigo-500', removable: true },
  { id: 6, name: 'HR Round', color: '#EC4899', dot: 'bg-pink-500', removable: true },
  { id: 7, name: 'Offer', color: '#22C55E', dot: 'bg-emerald-500', removable: true },
  { id: 8, name: 'Hired', color: '#16A34A', dot: 'bg-green-500', removable: false },
  { id: 9, name: 'Rejected', color: '#EF4444', dot: 'bg-red-500', removable: false },
];

export const settingsEmailPrefs = [
  { label: 'New Applicant', desc: 'When a candidate applies to your job', key: 'newApplicant' },
  { label: 'Interview Scheduled', desc: 'When an interview is booked', key: 'interview' },
  { label: 'Assessment Completed', desc: 'When a candidate finishes an assessment', key: 'assessment' },
  { label: 'Candidate Moved', desc: 'When stage changes in the pipeline', key: 'moved' },
  { label: 'Offer Accepted', desc: 'When a candidate accepts an offer', key: 'offer' },
];
