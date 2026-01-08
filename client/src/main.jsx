import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App.jsx'
import './index.css'
import { registerServiceWorker } from './utils/pushNotifications.js'
import { ThemeProvider } from './context/ThemeContext.jsx'

// Register Service Worker
registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <ThemeProvider>
                <CssBaseline />
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ThemeProvider>
        </GoogleOAuthProvider>
    </React.StrictMode>,
)
