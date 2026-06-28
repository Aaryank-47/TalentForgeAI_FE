import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { MediaProvider } from './context/MediaProvider';
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

// ─── AI Interview Flow (Candidate) ────────────────────────
import CandidateAIInterviewPage from './pages/candidate/CandidateAIInterviewPage';
import InterviewDetailsPage from './pages/candidate/InterviewDetailsPage';
import PreparationCenterPage from './pages/candidate/PreparationCenterPage';
import SystemCheckPage from './pages/candidate/SystemCheckPage';
import ConsentPage from './pages/candidate/ConsentPage';
import WaitingRoomPage from './pages/candidate/WaitingRoomPage';
import InterviewRoomPage from './pages/candidate/InterviewRoomPage';       // Fullscreen — outside layout
import UploadingPage from './pages/candidate/UploadingPage';
import SubmissionSuccessPage from './pages/candidate/SubmissionSuccessPage';
import InterviewStatusPage from './pages/candidate/InterviewStatusPage';

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
import HiringWorkflowsPage from './pages/recruiter/HiringWorkflowsPage';
import WorkflowBuilderPage from './pages/recruiter/WorkflowBuilderPage';
import InterviewTemplatesPage from './pages/recruiter/InterviewTemplatesPage';
import InterviewTemplateEditorPage from './pages/recruiter/InterviewTemplateEditorPage';
import QuestionLibraryPage from './pages/recruiter/QuestionLibraryPage';

// ─── AI Interview Review (Recruiter) ──────────────────────
import AIInterviewsPage from './pages/recruiter/AIInterviewsPage';
import AIInterviewDetailPage from './pages/recruiter/AIInterviewDetailPage';

// ─── Assessment Module ─────────────────────────────────────
import CreateAssessmentPage from './pages/recruiter/CreateAssessmentPage';
import AssessmentPreCheckPage from './pages/candidate/AssessmentPreCheckPage';
import AssessmentTakePage from './pages/candidate/AssessmentTakePage';
import ProjectSubmissionPage from './pages/candidate/ProjectSubmissionPage';
import LiveMachineCodingPage from './pages/candidate/LiveMachineCodingPage';

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

        {/* ─── AI Interview & Assessment Flows (Requires Global MediaProvider) ─── */}
        <Route element={<MediaProvider><Outlet /></MediaProvider>}>
          {/* Fullscreen — outside layout */}
          <Route path="/candidate/ai-interview/:id/room" element={<InterviewRoomPage />} />
          <Route path="/candidate/ai-interview/:id/uploading" element={<UploadingPage />} />
          <Route path="/candidate/ai-interview/:id/submitted" element={<SubmissionSuccessPage />} />
          
          <Route path="/candidate/assessments/:id/preparation" element={<AssessmentPreCheckPage />} />
          <Route path="/candidate/assessments/:id/take" element={<AssessmentTakePage />} />
          <Route path="/candidate/assessments/:id/live" element={<LiveMachineCodingPage />} />

          {/* With CandidateLayout */}
          <Route element={<CandidateLayout />}>
            <Route path="/candidate/ai-interview" element={<CandidateAIInterviewPage />} />
            <Route path="/candidate/ai-interview/:id/*" element={
              <Routes>
                <Route path="details" element={<InterviewDetailsPage />} />
                <Route path="preparation" element={<PreparationCenterPage />} />
                <Route path="system-check" element={<SystemCheckPage />} />
                <Route path="consent" element={<ConsentPage />} />
                <Route path="waiting-room" element={<WaitingRoomPage />} />
                <Route path="status" element={<InterviewStatusPage />} />
              </Routes>
            } />
          </Route>
        </Route>

        {/* ─── Candidate Module ─── */}
        <Route element={<CandidateLayout />}>
          <Route path="/candidate/home" element={<CandidateHomePage />} />
          <Route path="/candidate/dashboard" element={<CandidateHomePage />} />
          <Route path="/candidate/jobs" element={<FindJobsPage />} />
          <Route path="/candidate/applications" element={<MyApplicationsPage />} />
          <Route path="/candidate/assessments" element={<CandidateAssessmentsPage />} />
          <Route path="/candidate/assessments/:id/submit" element={<ProjectSubmissionPage />} />
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
          <Route path="/recruiter/workflows" element={<HiringWorkflowsPage />} />
          <Route path="/recruiter/workflows/:workflowId" element={<WorkflowBuilderPage />} />
          <Route path="/recruiter/interview-templates" element={<InterviewTemplatesPage />} />
          <Route path="/recruiter/interview-templates/:templateId" element={<InterviewTemplateEditorPage />} />
          <Route path="/recruiter/question-library" element={<QuestionLibraryPage />} />
          <Route path="/recruiter/assessments" element={<AssessmentsPage />} />
          <Route path="/recruiter/assessments/create" element={<CreateAssessmentPage />} />
          <Route path="/recruiter/interviews" element={<InterviewsPage />} />

          {/* AI Interview Review */}
          <Route path="/recruiter/ai-interviews" element={<AIInterviewsPage />} />
          <Route path="/recruiter/ai-interviews/:id" element={<AIInterviewDetailPage />} />

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
