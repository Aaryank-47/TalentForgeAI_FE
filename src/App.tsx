import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { MediaProvider } from './context/MediaProvider';
import { ProtectedRoute, RoleRoute, PublicRoute } from './components/auth/RouteGuards';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/auth/AuthPage';
import SignupRolePage from './pages/SignupRolePage';
import SelectCompanyPage from './pages/auth/SelectCompanyPage';
import OnboardingPage from './pages/auth/OnboardingPage';

// ─── Candidate Layout ─────────────────────────────────────────
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
import NotificationsPage from './pages/recruiter/NotificationsPage';

// ─── Live Interview Module — Recruiter ─────────────────────
import RecruiterLiveInterviewsPage from './pages/recruiter/live-interview/RecruiterLiveInterviewsPage';
import RecruiterInterviewCalendarPage from './pages/recruiter/live-interview/RecruiterInterviewCalendarPage';
import RecruiterInterviewDetailPage from './pages/recruiter/live-interview/RecruiterInterviewDetailPage';
import RecruiterInterviewHistoryPage from './pages/recruiter/live-interview/RecruiterInterviewHistoryPage';
import RecruiterLiveRoomPage from './pages/recruiter/live-interview/RecruiterLiveRoomPage';
import RecruiterInterviewFeedbackPage from './pages/recruiter/live-interview/RecruiterInterviewFeedbackPage';

// ─── Live Interview Module — Candidate ─────────────────────
import CandidateLiveInterviewsPage from './pages/candidate/live-interview/CandidateLiveInterviewsPage';
import CandidateLiveInterviewDetailPage from './pages/candidate/live-interview/CandidateLiveInterviewDetailPage';
import CandidateLiveRoomPage from './pages/candidate/live-interview/CandidateLiveRoomPage';
import CandidateLiveInterviewHistoryPage from './pages/candidate/live-interview/CandidateLiveInterviewHistoryPage';
import CandidateLiveInterviewFeedbackPage from './pages/candidate/live-interview/CandidateLiveInterviewFeedbackPage';

// ─── AI Interview Review (Recruiter) ──────────────────────
import AIInterviewsPage from './pages/recruiter/AIInterviewsPage';
import AIInterviewDetailPage from './pages/recruiter/AIInterviewDetailPage';

// ─── Assessment Module ─────────────────────────────────────
import CreateAssessmentPage from './pages/recruiter/CreateAssessmentPage';
import EditAssessmentPage from './pages/recruiter/EditAssessmentPage';
import AssessmentPreCheckPage from './pages/candidate/AssessmentPreCheckPage';
import AssessmentTakePage from './pages/candidate/AssessmentTakePage';
import ProjectSubmissionPage from './pages/candidate/ProjectSubmissionPage';
import LiveMachineCodingPage from './pages/candidate/LiveMachineCodingPage';

// ─── Auth Pages (missing auth flows) ─────────────────────────
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import AcceptInvitationPage from './pages/auth/AcceptInvitationPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* ─── Fully Public Routes (no auth required) ─── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup-role" element={<SignupRolePage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/invitations/accept" element={<AcceptInvitationPage />} />

        {/* ─── Auth Routes (redirect authenticated users to their portal) ─── */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* ─── All Authenticated Routes ─── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/select-company" element={<SelectCompanyPage />} />
          <Route path="/select-workspace" element={<SelectCompanyPage />} />

          {/* ─── AI Interview & Assessment Flows (Requires MediaProvider) ─── */}
          <Route element={<MediaProvider><Outlet /></MediaProvider>}>
            {/* Candidate-only fullscreen routes (outside layout) */}
            <Route element={<RoleRoute allowedRoles={['CANDIDATE']} redirectTo="/recruiter/dashboard" />}>
              <Route path="/candidate/ai-interview/:id/room" element={<InterviewRoomPage />} />
              <Route path="/candidate/ai-interview/:id/uploading" element={<UploadingPage />} />
              <Route path="/candidate/ai-interview/:id/submitted" element={<SubmissionSuccessPage />} />
              <Route path="/candidate/assessments/:id/preparation" element={<AssessmentPreCheckPage />} />
              <Route path="/candidate/assessments/:id/take" element={<AssessmentTakePage />} />
              <Route path="/candidate/assessments/:id/live" element={<LiveMachineCodingPage />} />
              {/* BACKEND DEPENDENCY: Live Interview backend not yet implemented */}
              <Route path="/candidate/interviews/:id/room" element={<CandidateLiveRoomPage />} />
            </Route>

            {/* Recruiter-only fullscreen routes */}
            <Route element={<RoleRoute allowedRoles={['EMPLOYER']} redirectTo="/candidate/home" />}>
              {/* BACKEND DEPENDENCY: Live Interview backend not yet implemented */}
              <Route path="/recruiter/interviews/:id/room" element={<RecruiterLiveRoomPage />} />
            </Route>

            {/* Candidate AI Interview flow — within CandidateLayout */}
            <Route element={<RoleRoute allowedRoles={['CANDIDATE']} redirectTo="/recruiter/dashboard" />}>
              <Route element={<CandidateLayout />}>
                <Route path="/candidate/ai-interview" element={<CandidateAIInterviewPage />} />
                <Route path="/candidate/ai-interview/:id/details" element={<InterviewDetailsPage />} />
                <Route path="/candidate/ai-interview/:id/preparation" element={<PreparationCenterPage />} />
                <Route path="/candidate/ai-interview/:id/system-check" element={<SystemCheckPage />} />
                <Route path="/candidate/ai-interview/:id/consent" element={<ConsentPage />} />
                <Route path="/candidate/ai-interview/:id/waiting-room" element={<WaitingRoomPage />} />
                <Route path="/candidate/ai-interview/:id/status" element={<InterviewStatusPage />} />
              </Route>
            </Route>
          </Route>

          {/* ─── Candidate Module ─── */}
          <Route element={<RoleRoute allowedRoles={['CANDIDATE']} redirectTo="/recruiter/dashboard" />}>
            <Route element={<CandidateLayout />}>
              <Route path="/candidate/home" element={<CandidateHomePage />} />
              <Route path="/candidate/dashboard" element={<CandidateHomePage />} />
              <Route path="/candidate/jobs" element={<FindJobsPage />} />
              <Route path="/candidate/applications" element={<MyApplicationsPage />} />
              <Route path="/candidate/assessments" element={<CandidateAssessmentsPage />} />
              <Route path="/candidate/assessments/:id/submit" element={<ProjectSubmissionPage />} />
              <Route path="/candidate/interviews" element={<CandidateInterviewsPage />} />
              {/* BACKEND DEPENDENCY: Live Interview module not yet implemented */}
              <Route path="/candidate/live-interviews" element={<CandidateLiveInterviewsPage />} />
              <Route path="/candidate/live-interviews/history" element={<CandidateLiveInterviewHistoryPage />} />
              <Route path="/candidate/live-interviews/:id" element={<CandidateLiveInterviewDetailPage />} />
              <Route path="/candidate/live-interviews/:id/feedback" element={<CandidateLiveInterviewFeedbackPage />} />
              <Route path="/candidate/messages" element={<CandidateMessagesPage />} />
              <Route path="/candidate/saved" element={<SavedJobsPage />} />
              <Route path="/candidate/profile" element={<CandidateProfilePage />} />
              <Route path="/candidate/resume" element={<CandidateProfilePage />} />
              <Route path="/candidate/settings" element={<CandidateSettingsPage />} />
            </Route>
          </Route>

          {/* ─── Recruiter / Employer Module ─── */}
          <Route element={<RoleRoute allowedRoles={['EMPLOYER']} redirectTo="/candidate/home" />}>
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
              <Route path="/recruiter/assessments/:id/edit" element={<EditAssessmentPage />} />
              <Route path="/recruiter/assessments/edit/:id" element={<EditAssessmentPage />} />
              <Route path="/recruiter/interviews" element={<InterviewsPage />} />
              {/* BACKEND DEPENDENCY: Live Interview module not yet implemented */}
              <Route path="/recruiter/live-interviews" element={<RecruiterLiveInterviewsPage />} />
              <Route path="/recruiter/live-interviews/calendar" element={<RecruiterInterviewCalendarPage />} />
              <Route path="/recruiter/live-interviews/history" element={<RecruiterInterviewHistoryPage />} />
              <Route path="/recruiter/live-interviews/:id" element={<RecruiterInterviewDetailPage />} />
              <Route path="/recruiter/live-interviews/:id/feedback" element={<RecruiterInterviewFeedbackPage />} />
              {/* BACKEND DEPENDENCY: AI Interview backend not yet implemented */}
              <Route path="/recruiter/ai-interviews" element={<AIInterviewsPage />} />
              <Route path="/recruiter/ai-interviews/:id" element={<AIInterviewDetailPage />} />
              {/* BACKEND DEPENDENCY: Analytics endpoints not yet implemented */}
              <Route path="/recruiter/analytics" element={<AnalyticsPage />} />
              <Route path="/recruiter/messages" element={<MessagesPage />} />
              <Route path="/recruiter/notifications" element={<NotificationsPage />} />
              <Route path="/recruiter/settings" element={<SettingsPage />} />
              <Route path="/recruiter/team" element={<SettingsPage />} />
              <Route path="/recruiter/company" element={<SettingsPage />} />
            </Route>
          </Route>

        </Route>{/* end ProtectedRoute */}

        {/* ─── Catch-all: redirect unknown paths to home ─── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
