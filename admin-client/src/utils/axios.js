import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000', // adjust to your API URL
    headers: {
        'Content-Type': 'application/json'
    }
});

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Don't redirect if trying to verify token or login
            const isAuthEndpoint = 
                error.config.url.includes('/verify-token') || 
                error.config.url.includes('/login');
            
            if (!isAuthEndpoint) {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminInfo');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

