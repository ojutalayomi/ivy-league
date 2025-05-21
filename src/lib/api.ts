import axios, { AxiosError } from 'axios';
import { networkMonitor } from '@/lib/network'

export const api = axios.create({
    baseURL: process.env.VITE_API_URL,
    // withCredentials: true,
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
        const token = "";
        if (token) {
            config.headers['X-Secondary-Authorization'] = `Bearer ${token}`;
        }
        return config;
    } catch (error) {
        console.error('Network check failed:', error);
        throw new Error('Network check failed');
    }
});
  
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);