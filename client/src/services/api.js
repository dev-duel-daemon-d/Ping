import axios from 'axios'

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Only redirect if not already on auth pages
            if (!window.location.pathname.includes('/login') &&
                !window.location.pathname.includes('/register')) {
                localStorage.removeItem('token')
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    verifyEmail: (data) => api.post('/auth/verify-email', data),
    resendOTP: (data) => api.post('/auth/resend-otp', data),
    googleLogin: (token) => api.post('/auth/google', { token }),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
    forgotPassword: (email) => api.post('/auth/forgotpassword', { email }),
    resetPassword: (token, password) => api.put(`/auth/resetpassword/${token}`, { password }),
}

export const userService = {
    getProfile: (username) => api.get(`/users/${username}`),
    updateProfile: (data) => api.put('/users/profile', data),
    changePassword: (data) => api.put('/users/change-password', data),
    deleteAccount: () => api.delete('/users/profile'),
    updatePreferences: (data) => api.put('/users/preferences', data),
    search: (query) => api.get(`/search?q=${query}`),
    getExploreUsers: () => api.get('/users/explore'),
}

export const connectionService = {
    sendRequest: (userId) => api.post(`/connections/request/${userId}`),
    acceptRequest: (requestId) => api.put(`/connections/accept/${requestId}`),
    getConnections: (userId) => userId
        ? api.get(`/connections?userId=${userId}`)
        : api.get('/connections'),
    getPendingRequests: () => api.get('/connections/pending'),
}

export const messageService = {
    getHistory: (userId) => api.get(`/messages/history/${userId}`),
    getConversations: () => api.get(`/messages/conversations`),
    markRead: (senderId) => api.put(`/messages/read/${senderId}`),
}

export const notificationService = {
    getAll: () => api.get('/notifications'),
    markRead: (id) => api.put(`/notifications/${id}/read`),
    markAllRead: () => api.put('/notifications/read-all'),
}

export const tournamentService = {
    getAll: () => api.get('/tournaments'),
    getById: (id) => api.get(`/tournaments/${id}`),
    create: (data) => api.post('/tournaments', data),
    join: (id) => api.post(`/tournaments/${id}/join`),
}

export const teamService = {
    getAll: () => api.get('/teams'),
    create: (data) => api.post('/teams', data),
    join: (id) => api.post(`/teams/${id}/join`),
}

export const uploadService = {
    uploadImage: (formData) => api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
}

export const profileService = {
    // Get profile data
    getData: () => api.get('/profile/data'),
    getDataByUsername: (username) => api.get(`/profile/data/${username}`),

    // Team History
    addTeam: (data) => api.post('/profile/team-history', data),
    updateTeam: (id, data) => api.put(`/profile/team-history/${id}`, data),
    deleteTeam: (id) => api.delete(`/profile/team-history/${id}`),

    // Tournament Experience
    addTournament: (data) => api.post('/profile/tournaments', data),
    updateTournament: (id, data) => api.put(`/profile/tournaments/${id}`, data),
    deleteTournament: (id) => api.delete(`/profile/tournaments/${id}`),

    // Gaming Setup
    updateSetup: (data) => api.put('/profile/setup', data),

    // Socials
    updateSocials: (data) => api.put('/profile/socials', data),

    // Game Experience
    addGame: (data) => api.post('/profile/games', data),
    updateGame: (id, data) => api.put(`/profile/games/${id}`, data),
    deleteGame: (id) => api.delete(`/profile/games/${id}`),
}

export const gameService = {
    getAll: () => api.get('/games'),
}

export const postService = {
    create: (data) => api.post('/posts', data),
    getAll: (type, authorId) => api.get('/posts', { params: { type, authorId } }),
    getById: (id) => api.get(`/posts/${id}`),
    delete: (id) => api.delete(`/posts/${id}`),
    like: (id) => api.put(`/posts/${id}/like`),
    comment: (id, text) => api.post(`/posts/${id}/comment`, { text }),
    deleteComment: (id, commentId) => api.delete(`/posts/${id}/comment/${commentId}`),
}

export const enchantmentService = {
    toggle: (userId) => api.post(`/enchantments/${userId}`),
    getStatus: (userId) => api.get(`/enchantments/${userId}/status`),
    getCount: (userId) => api.get(`/enchantments/${userId}/count`),
}

export default api