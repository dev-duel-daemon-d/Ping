import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'

// Pages
import Home from './pages/Home'
import PingLanding from './pages/PingLanding'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'

function App() {
    return (
        <AuthProvider>
            <SocketProvider>
                <div className="min-h-screen bg-slate-900">
                    <Routes>
                        <Route path="/" element={<PingLanding />} />
                        <Route path="/login" element={<AuthPage />} />
                        <Route path="/register" element={<AuthPage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </SocketProvider>
        </AuthProvider>
    )
}

export default App
