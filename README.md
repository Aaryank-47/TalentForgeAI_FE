# TalentForge AI — Frontend

The TalentForge AI Frontend is a modern, responsive Single Page Application (SPA) built with React and TypeScript. It serves as the primary user interface for both candidates applying for jobs and recruiters managing the hiring process, integrating AI-driven interviews, live technical assessments, and real-time communication.

## Overview

- **Purpose**: Provides the candidate application portal, recruiter dashboard, AI interview interface, and live assessment environments.
- **Target Users**: Candidates (job seekers) and Employers/Recruiters.
- **Major Workflows**: Candidate job discovery and application, AI and live interviews, recruiter job posting, pipeline management, and candidate assessment.
- **Relationship with Backend**: Communicates with the TalentForge backend via a centralized REST API client and uses Socket.IO for real-time events.

## Live Application

Current known production frontend:
https://talent-forge-ai-fe.vercel.app

## Screenshots

*(Screenshots can be added here in the future once UI assets are finalized and captured in the `public/` or `assets/` directories).*

## Key Features

- [x] **Authentication**: Role-based signup, login, password recovery, and secure token refresh handling.
- [x] **Dashboards**: Dedicated portals for Candidates and Recruiters.
- [x] **Job Discovery & Management**: Job searching, saving jobs (Candidate) and creating/managing job postings (Recruiter).
- [x] **Applications**: Applying to jobs and tracking application status.
- [x] **Assessments**: Pre-checks, taking assessments, project submissions, and live machine coding.
- [x] **Interviews (Live & AI)**: AI-driven automated interviews, live recruiter-candidate video rooms, and interview scheduling/history.
- [x] **Hiring Pipelines**: Customizable hiring workflows and interview templates.
- [x] **Real-time Functionality**: Socket.IO integration for live interview signaling and resume parsing status.
- [x] **AI Features**: AI interview generation, question delivery, and response evaluation.

## User Roles

The frontend enforces strict role-based access control with two primary roles:

1. **CANDIDATE**: Can browse jobs, apply, take assessments, participate in AI/Live interviews, manage their profile/resume, and view their application statuses.
2. **EMPLOYER (Recruiter)**: Can create jobs, manage the candidate pipeline, create assessments, schedule/conduct interviews, configure hiring workflows, and review AI interview feedback.

## Application Workflows

**Candidate Workflow**:
Registration → Login → Profile/Resume Setup → Browse Jobs → Apply → Complete Pre-checks → Participate in AI Interview / Live Assessment → Track Application Status.

**Recruiter Workflow**:
Registration → Login → Company/Workspace Setup → Recruiter Dashboard → Create Hiring Workflow / Templates → Post Job → Review Candidates in Pipeline → Schedule/Conduct Interviews → Evaluate Feedback.

## Page / Route Overview

| Route | Page | Access | Purpose |
|------|------|--------|---------|
| `/` | LandingPage | Public | Main landing page |
| `/login`, `/register` | AuthPage | Public | User authentication |
| `/signup-role` | SignupRolePage | Public | Role selection during registration |
| `/candidate/home` | CandidateHomePage | CANDIDATE | Candidate dashboard |
| `/candidate/jobs` | FindJobsPage | CANDIDATE | Job discovery |
| `/candidate/applications` | MyApplicationsPage | CANDIDATE | Track job applications |
| `/candidate/ai-interview/:id/*`| CandidateAIInterviewPage| CANDIDATE | AI Interview flow (details, system check, room) |
| `/candidate/assessments/:id/*` | AssessmentTakePage | CANDIDATE | Assessment execution and live coding |
| `/recruiter/dashboard` | RecruiterDashboard | EMPLOYER | Main recruiter metrics and overview |
| `/recruiter/jobs` | JobsPage | EMPLOYER | Job posting management |
| `/recruiter/pipeline` | PipelinePage | EMPLOYER | Candidate pipeline tracking |
| `/recruiter/workflows` | HiringWorkflowsPage | EMPLOYER | Custom hiring workflow builder |
| `/recruiter/live-interviews`| RecruiterLiveInterviewsPage| EMPLOYER | Live interview scheduling and rooms |

## Frontend Architecture

- **React Component Architecture**: Organized into feature-based and role-based directories (`candidate/`, `recruiter/`, `auth/`).
- **Pages**: Top-level route components mapping to URLs.
- **Layouts**: `CandidateLayout` and `RecruiterLayout` wrap their respective portals to provide consistent navigation/sidebars.
- **Contexts**: React Context is used for domain-specific state (e.g., `AuthContext`, `HiringContext`, `InterviewContext`, `MediaProvider`).
- **Services/API Layer**: Centralized API client (`apiClient.ts`) handles all HTTP requests, interceptors, and token refresh logic.
- **Route Guards**: `ProtectedRoute`, `RoleRoute`, and `PublicRoute` enforce authentication and authorization at the router level.

## State Management

- **Redux Toolkit**: Manages global authentication state (`authSlice` for tokens) and workspace state (`workspaceSlice`).
- **React Context**: Manages scoped state (e.g., media devices, active interview session, hiring context).
- **React Query**: Used for data fetching, caching, and server state management.
- **Local State**: Standard React `useState` and form libraries (like React Hook Form) manage component-level state.

## API Integration

Communication with the backend is centralized in [`src/services/api/apiClient.ts`](file:///c:/Project/TalentForge/Frontend/src/services/api/apiClient.ts).

- **Base URL**: Configured dynamically via `VITE_API_BASE_URL` (defaults to `http://localhost:3000/api/v1`).
- **Authorization Headers**: Automatically attaches `Authorization: Bearer <token>` from the in-memory Redux store (`authSlice`).
- **Multi-Tenant Context Headers**: Automatically attaches `x-company-id` header when operating inside an active company workspace (`workspaceSlice`).
- **HttpOnly Cookies**: All requests specify `credentials: 'include'` to send and receive HttpOnly cookies for refresh token management.
- **Single-Flight Concurrency Interceptor**: Intercepts `401 Unauthorized` responses. Parallel failed requests are queued behind a deduplicated refresh promise (`executeRefreshToken()`). Only a single refresh request is sent to `/auth/new-refresh-token`. Upon success, all queued HTTP requests update their headers and retry automatically.

---

## Authentication

TalentForge AI enforces a secure enterprise-grade authentication workflow designed around zero token storage in browser local storage.

### 🛡️ Authentication Architecture

1. **In-Memory Access Tokens**:
   - Access tokens are stored strictly in-memory inside the Redux state (`authSlice`).
   - On application startup (`main.tsx`), `localStorage` and `sessionStorage` are actively sanitized to ensure no sensitive access tokens persist across sessions.

2. **HttpOnly Cookie Refresh Tokens**:
   - Long-lived refresh tokens are managed via secure, HttpOnly, SameSite cookies.
   - Cross-site request security is strictly enforced with browser cookie policies.

3. **Session Rehydration**:
   - On application launch, the SPA performs a silent session rehydration by fetching the user profile from `/auth/me`.
   - If the in-memory access token is missing or expired, `apiClient` automatically executes a single-flight silent refresh using the HttpOnly cookie without interrupting user interaction.

4. **Multi-Device Limit & Session Control**:
   - Accounts are limited to a maximum number of concurrent active device sessions (default: 3).
   - Attempting to log in beyond the device limit triggers a device limit error modal in the UI.
   - Users can choose to:
     - Clear all active device sessions by providing their password (`/auth/deviceLimit/logout/all-devices`).
     - Perform a **Force OTP Login** (`/auth/otp/force-login`) which revokes existing sessions and authorizes the current device.

5. **Authentication Workflows Supported**:
   - **Email & Password**: Registration and login for Candidate, Employer, and Company Owner roles.
   - **Passwordless OTP Login**: Direct OTP login via email with Redis-backed rate limiting.
   - **Email Verification**: Account activation using 6-digit email OTPs.
   - **Password Recovery**: Secure OTP-driven password reset issuing single-use JWT reset tokens.

---

## Assessments

The application features a comprehensive assessment UI:
- **Pre-checks**: Hardware and network checks before starting.
- **Execution**: Interfaces for multiple-choice questions (MCQs), project submissions, and live machine coding tasks.
- **Recruiter View**: Builders for creating assessments (`CreateAssessmentPage`) and viewing results.

## Interviews

- **Live Interviews**: Real-time video rooms for recruiters and candidates (`CandidateLiveRoomPage`, `RecruiterLiveRoomPage`), scheduling, and feedback submission.
- **AI Interviews**: Automated interviews where the candidate interacts with an AI agent. The flow includes system checks, consent, waiting room, the actual fullscreen interview room, and uploading/submission statuses.

## AI Features

The frontend currently integrates directly with AI models (via OpenRouter) for certain features (like generating interview questions or evaluating responses in real-time).

- **Workflow**: The UI constructs prompts based on the interview context, sends them to the AI API, and parses the response to drive the UI (e.g., asking the next question or providing feedback).

> [!WARNING]
> **SECURITY NOTE**: Currently, the `VITE_OPENROUTER_API_KEY` is exposed to the browser via Vite environment variables. This is for development purposes only. In production, these AI requests MUST be proxied through the backend to secure the API key.

## Real-Time Features

Implemented using **Socket.IO** (`socket.io-client`):
- **Interview Socket**: Manages live interview rooms, signaling for WebRTC (video/audio), chat messages, and live coding collaboration.
- **Resume Socket**: Listens for real-time updates on background resume parsing and candidate profiling.

## Technology Stack

| Technology | Purpose |
|-----------|---------|
| React (v19) | UI Library |
| TypeScript | Static typing |
| Vite | Build tool and dev server |
| React Router (v7) | SPA Routing |
| Tailwind CSS (v4) | Utility-first styling |
| Redux Toolkit & React Query | State and server data management |
| React Hook Form & Zod | Form handling and validation |
| Socket.IO Client | Real-time WebSocket communication |
| Framer Motion | UI animations |
| Lucide React / React Icons | Iconography |
| Monaco Editor | In-browser code editor for assessments |

## Project Structure

```
src/
├── assets/         # Static assets (images, icons)
├── components/     # Reusable UI components, layouts, auth guards
├── constants/      # App-wide constants (e.g., query keys)
├── context/        # React Context providers (Auth, Hiring, Media)
├── hooks/          # Custom React hooks
├── lib/            # Third-party library configurations (e.g., React Query)
├── modules/        # Feature-specific module logic
├── pages/          # Route components (Candidate, Recruiter, Auth, etc.)
├── services/       # API clients, Socket services, AI services
├── store/          # Redux store and slices
├── types/          # TypeScript interfaces and types
├── utils/          # Utility functions
├── App.tsx         # Main router configuration
└── main.tsx        # Application entry point
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | The base URL for the TalentForge backend API. |
| `VITE_OPENROUTER_API_KEY` | **(DEV ONLY)** API key for AI generation. Highly sensitive; do not use in production. |
| `VITE_OPENROUTER_MODEL` | The default AI model to use for AI features. |

## Local Development

Ensure you have Node.js installed, then run:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Production Build

To build the application for production:

```bash
# Compiles TypeScript and builds the Vite project to the `dist` directory
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

## Deployment

The application is deployed on **Vercel**.
- **Configuration**: Uses a `vercel.json` file to handle SPA routing by rewriting all requests `/(.*)` to `/index.html`.
- **Environment**: Environment variables must be configured in the Vercel project settings.

## Error Handling & UX

- **API Failures**: Centralized in `apiClient.ts`, converting HTTP errors into custom `ApiError` instances.
- **Toast Notifications**: `react-hot-toast` is used to display success and error messages to the user.
- **Loading States**: Handled via React Query's `isLoading` states and custom skeleton loaders.
- **Session Expiry**: Automatically handled by the API client which redirects or triggers a re-login flow if the refresh token expires.

## Performance Considerations

- **Code Splitting**: Native to Vite and React Router (when configured with lazy loading).
- **Caching**: React Query extensively caches API responses to prevent redundant network requests.
- **Memoization**: Standard React hooks (`useMemo`, `useCallback`) are used in complex views (like the pipeline or live interview rooms).

## Security Considerations

- **Token Storage**: Access tokens are kept strictly in-memory (Redux). LocalStorage is actively purged of sensitive keys on boot in `main.tsx`.
- **XSS Protection**: Handled natively by React's rendering engine.
- **Environment Variables**: Care must be taken not to expose secret keys via `VITE_` prefixed variables (see AI Features).

## Testing

*(Testing configuration (Vitest/Jest) is not currently present in the immediate `package.json` setup. Unit and E2E tests are planned for future implementation.)*
- **Linting**: Run `npm run lint` (ESLint) to catch syntax and stylistic issues.
- **TypeScript**: Run `tsc -b` during the build process to strictly check types.

## Known Limitations

- **Backend Dependencies**: Several routes (e.g., Live Interviews, AI Interview backend integration, Analytics endpoints) currently point to frontend views but require the corresponding backend services to be fully functional to operate end-to-end.
- **Client-side AI**: AI features currently rely on a client-side exposed API key, which is not suitable for production.

## Future Improvements

- Migrate client-side AI calls to a backend proxy endpoint.
- Implement comprehensive E2E testing (e.g., Cypress or Playwright).
- Finalize integration with backend Live Interview and WebRTC signaling services.

## Troubleshooting

- **CORS Issues**: Ensure the backend is configured to accept requests from the frontend origin (e.g., `http://localhost:5173`).
- **401 Unauthorized loops**: Clear your cookies and refresh if the refresh token mechanism enters an invalid state.
- **Routing returning 404 on reload (Production)**: Ensure the `vercel.json` rewrite rule is correctly applied if deploying outside of Vercel.

## License
*(No explicit license is currently defined in the frontend repository.)*
