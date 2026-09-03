# TalentForge AI - Frontend

This is the frontend Single Page Application (SPA) for **TalentForge AI**, built to provide a seamless, dynamic, and responsive experience for candidates, recruiters, and administrators.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Framer Motion
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [React Query](https://tanstack.com/query/latest)
- **Routing**: [React Router](https://reactrouter.com/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Webcam & AI**: [React Webcam](https://www.npmjs.com/package/react-webcam) & [MediaPipe Vision](https://developers.google.com/mediapipe)

## 📦 Key Features

- **Modern UI/UX**: Clean, responsive design using Tailwind CSS with interactive micro-animations powered by Framer Motion.
- **Interactive ATS Dashboard**: Drag-and-drop Kanban board for tracking candidate progression.
- **Candidate Assessment Portal**: Integrated online coding IDE using Monaco Editor supporting multiple languages.
- **AI Video Interviews**: Asynchronous video recording utilizing React Media Recorder and Webcam functionalities.
- **AI Proctoring**: Client-side monitoring for tab switches, browser focus, and webcam verification using MediaPipe.
- **Secure File Uploads**: Direct client-to-Cloudinary upload mechanism for resumes and media, reducing backend load.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v20 or higher)
- Backend API running locally or accessible remotely.

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repo-url>
   cd TalentForgeAI/Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root of the `Frontend` directory. You will typically need:
   - `VITE_API_BASE_URL` (URL of your backend Express server)
   - Additional public keys (e.g., Razorpay, Cloudinary cloud name).

### Running the Application

- **Development Mode**:
  ```bash
  npm run dev
  ```
  This starts the Vite development server.

- **Production Build**:
  ```bash
  npm run build
  ```
  This type-checks and builds the app for production in the `dist` folder.

- **Preview Production Build**:
  ```bash
  npm run preview
  ```

- **Linting**:
  ```bash
  npm run lint
  ```

## 🏗️ Project Structure

- `src/` - Application source code.
  - `components/` - Reusable UI components.
  - `pages/` - Page-level components matching routes.
  - `services/` - API client configurations and React Query hooks.
  - `store/` - Redux slices and store configuration.
  - `lib/` - Utility functions, types, and permissions logic.

## 📄 License

ISC License (Private)
