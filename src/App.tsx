import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/auth/AuthPage';
import SignupRolePage from './pages/SignupRolePage';

// ─── Candidate Layout ─────────────────────────────────────
import CandidateLayout from './components/layout/CandidateLayout';

// Candidate Pages
import CandidateHomePage from './pages/candidate/CandidateHomePage';
import FindJobsPage from './pages/candidate/FindJobsPage';
import MyApplicationsPage from './pages/candidate/MyApplicationsPage';
import CandidateAssessmentsPage from './pages/candidate/CandidateAssessmentsPage';
import CandidateInterviewsPage from './pages/candidate/CandidateInterviewsPage';
import CandidateProfilePage from './pages/candidate/CandidateProfilePage';
import CandidateSettingsPage from './pages/candidate/CandidateSettingsPage';
import CandidateMessagesPage from './pages/candidate/CandidateMessagesPage';
import SavedJobsPage from './pages/candidate/SavedJobsPage';

// ─── Recruiter Layout ─────────────────────────────────────
import RecruiterLayout from './components/layout/RecruiterLayout';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import JobsPage from './pages/recruiter/JobsPage';
import CreateJobPage from './pages/recruiter/CreateJobPage';
import CandidatesPage from './pages/recruiter/CandidatesPage';
import PipelinePage from './pages/recruiter/PipelinePage';
import AssessmentsPage from './pages/recruiter/AssessmentsPage';
import InterviewsPage from './pages/recruiter/InterviewsPage';
import AnalyticsPage from './pages/recruiter/AnalyticsPage';
import MessagesPage from './pages/recruiter/MessagesPage';
import SettingsPage from './pages/recruiter/SettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/signup-role" element={<SignupRolePage />} />

        {/* ─── Candidate Module ─── */}
        <Route element={<CandidateLayout />}>
          <Route path="/candidate/home" element={<CandidateHomePage />} />
          <Route path="/candidate/dashboard" element={<CandidateHomePage />} />
          <Route path="/candidate/jobs" element={<FindJobsPage />} />
          <Route path="/candidate/applications" element={<MyApplicationsPage />} />
          <Route path="/candidate/assessments" element={<CandidateAssessmentsPage />} />
          <Route path="/candidate/interviews" element={<CandidateInterviewsPage />} />
          <Route path="/candidate/messages" element={<CandidateMessagesPage />} />
          <Route path="/candidate/saved" element={<SavedJobsPage />} />
          <Route path="/candidate/profile" element={<CandidateProfilePage />} />
          <Route path="/candidate/resume" element={<CandidateProfilePage />} />
          <Route path="/candidate/settings" element={<CandidateSettingsPage />} />
        </Route>

        {/* ─── Recruiter Module ─── */}
        <Route element={<RecruiterLayout />}>
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/jobs" element={<JobsPage />} />
          <Route path="/recruiter/jobs/create" element={<CreateJobPage />} />
          <Route path="/recruiter/candidates" element={<CandidatesPage />} />
          <Route path="/recruiter/pipeline" element={<PipelinePage />} />
          <Route path="/recruiter/assessments" element={<AssessmentsPage />} />
          <Route path="/recruiter/interviews" element={<InterviewsPage />} />
          <Route path="/recruiter/analytics" element={<AnalyticsPage />} />
          <Route path="/recruiter/messages" element={<MessagesPage />} />
          <Route path="/recruiter/settings" element={<SettingsPage />} />
          <Route path="/recruiter/team" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
