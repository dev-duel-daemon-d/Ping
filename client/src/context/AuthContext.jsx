import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    const response = await authService.getMe()
                    setUser(response.data.user)
                } catch (error) {
                    console.error('Auth initialization failed:', error)
                    localStorage.removeItem('token')
                    setToken(null)
                    setUser(null)
                }
            }
            setLoading(false)
        }

        initAuth()
    }, [token])

    const login = async (email, password) => {
        const response = await authService.login({ email, password })
        const { token: newToken, user: userData } = response.data
        localStorage.setItem('token', newToken)
        setToken(newToken)
        setUser(userData)
        return userData
    }

    const register = async (username, email, password) => {
        const response = await authService.register({ username, email, password })
        const { token: newToken, user: userData } = response.data
        localStorage.setItem('token', newToken)
        setToken(newToken)
        setUser(userData)
        return userData
    }

    const logout = async () => {
        try {
            await authService.logout()
        } catch (error) {
            console.error('Logout error', error)
        }
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
    }

    const updateUser = (userData) => {
        setUser(prev => ({ ...prev, ...userData }))
    }

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export default AuthContext
