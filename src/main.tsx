import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { store } from './store'
import { queryClient } from './lib/queryClient'
import { AuthProvider } from './context/AuthContext.tsx'
import { HiringProvider } from './context/HiringContext.tsx'
import { Toaster } from 'react-hot-toast'

// Security guarantee: Purge any legacy/stale token keys from localStorage.
// All access tokens live exclusively in-memory (Redux state) and refresh tokens in HttpOnly cookies.
const SENSITIVE_STORAGE_KEYS = [
  'tf_access_token',
  'authToken',
  'userToken',
  'userData',
  'userId',
  'tf_mock_role',
  'token',
  'accessToken',
];
try {
  SENSITIVE_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
} catch {
  // Ignore localStorage access restrictions if any
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
