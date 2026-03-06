import axios from 'axios';

// Get base URL depending on environment
// VITE_API_URL must be set in Vercel's Environment Variables dashboard
export const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001';

// Create a globally configured axios instance
const api = axios.create({
    baseURL: baseURL,
});

// ✅ Auto-attach JWT token to every request if user is logged in
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.token) {
            config.headers['Authorization'] = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Handle 401 globally (token expired / invalid) — clear user and redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            // Only redirect if not already on auth pages
            if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
