import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App.jsx'
import './index.css'
import { registerServiceWorker } from './utils/pushNotifications.js'

// Register Service Worker
registerServiceWorker();

// Create a dark theme for Material UI
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#0ea5e9',
            light: '#38bdf8',
            dark: '#0284c7',
        },
        secondary: {
            main: '#d946ef',
            light: '#e879f9',
            dark: '#c026d3',
        },
        background: {
            default: '#0f172a',
            paper: '#1e293b',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '8px',
                },
            },
        },
    },
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>,
)
