import axios from 'axios';
const API = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: API,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('studentToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;