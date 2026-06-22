import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/auth/AuthPage';
import SignupRolePage from './pages/SignupRolePage';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import AtsPipeline from './pages/recruiter/AtsPipeline';
import CandidateDetail from './pages/recruiter/CandidateDetail';
import JobManagement from './pages/recruiter/JobManagement';
import AnalyticsDashboard from './pages/recruiter/AnalyticsDashboard';
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes — single AuthPage handles login & register state */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        {/* Role selection page */}
        <Route path="/signup-role" element={<SignupRolePage />} />

        {/* Protected Routes - Wrapping with MainLayout for Dashboard Shell */}
        <Route element={<MainLayout />}>
          {/* Candidate Routes */}
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />

          {/* Recruiter Routes */}
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/pipeline" element={<AtsPipeline />} />
          <Route path="/recruiter/candidate/:id" element={<CandidateDetail />} />
          <Route path="/recruiter/jobs" element={<JobManagement />} />
          <Route path="/recruiter/analytics" element={<AnalyticsDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

