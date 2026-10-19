import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// The app's starting point: finds the empty <div id="root"> in index.html and
// fills it with the App component. StrictMode adds extra development-only checks.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
