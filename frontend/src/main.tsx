import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@anteacore/shared/theme.css'    // Base CSS variables
import '@anteacore/shared/styles.css'   // Component styles
import './index.css'                    // HealthCore overrides (must be last)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)