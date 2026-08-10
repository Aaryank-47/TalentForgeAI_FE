import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { HiringProvider } from './context/HiringContext.tsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* AuthProvider must be outermost so all contexts and guards can access auth state */}
    <AuthProvider>
      <HiringProvider>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            className: 'text-sm font-medium shadow-lg',
            duration: 3500,
            style: { borderRadius: '12px', padding: '12px 16px' },
          }}
        />
      </HiringProvider>
    </AuthProvider>
  </StrictMode>,
)
