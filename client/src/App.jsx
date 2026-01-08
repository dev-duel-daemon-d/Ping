import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'

// Pages
import Home from './pages/Home'
import PingLanding from './pages/PingLanding'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import Feed from './pages/Feed'
import Contests from './pages/Contests'
import TournamentDetails from './pages/TournamentDetails'
import NotFound from './pages/NotFound'
import Settings from './pages/Settings'

// Components
import ProtectedRoute from './components/ProtectedRoute'

// Landing route component that redirects based on auth status
const LandingRoute = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/feed" replace /> : <PingLanding />;
};

function App() {
    return (
        <AuthProvider>
            <SocketProvider>
                <div className="min-h-screen bg-slate-900">
                    <Routes>
                        <Route path="/" element={<LandingRoute />} />
                        <Route path="/login" element={<AuthPage />} />
                        <Route path="/register" element={<AuthPage />} />
                        <Route
                            path="/feed"
                            element={
                                <ProtectedRoute>
                                    <Feed />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard/:username"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <ProtectedRoute>
                                    <Settings />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/contests"
                            element={
                                <ProtectedRoute>
                                    <Contests />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/contests/:id"
                            element={
                                <ProtectedRoute>
                                    <TournamentDetails />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </SocketProvider>
        </AuthProvider>
    )
}

export default App
