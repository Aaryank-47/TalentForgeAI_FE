import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HiringProvider } from './context/HiringContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HiringProvider>
      <App />
    </HiringProvider>
  </StrictMode>,
)
