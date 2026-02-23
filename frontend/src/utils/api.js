import axios from 'axios';

// Get base URL depending on environment
// VITE_API_URL is injected by Vercel
export const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Create a globally configured axios instance
const api = axios.create({
    baseURL: baseURL
});

export default api;
