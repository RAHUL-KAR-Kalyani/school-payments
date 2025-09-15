import axios from 'axios';
const api = axios.create({
    baseURL: import.meta.env.BACKEND_URL || 'http://localhost:8000',
    headers: { 'Content-Type': 'application/json' }
});

// attach token
api.interceptors.request.use(cfg => {
    const token = localStorage.getItem('token');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

export default api;
