import axios, { AxiosError } from 'axios';
import { networkMonitor } from '@/lib/network'

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    try {
        const networkStatus = networkMonitor.getNetworkStatus();
        if (!networkStatus?.online) {
            throw new Error('No internet connection');
        }
        const token = import.meta.env.VITE_BEARER_TOKEN;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        config.headers['ngrok-skip-browser-warning'] = 'true';
        return config;
    } catch {
        throw new Error('Network check failed');
    }
});
  
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);