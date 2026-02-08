import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

const apiClient = axios.create({
    baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
        // We can add global error notifications here if needed
        return Promise.reject(new Error(message));
    }
);

export default apiClient;
