import axios, { AxiosError } from 'axios';
import { networkMonitor } from '@/lib/network'
import { store } from '@/redux/store';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    try {
        const bearerToken = store.getState().utils.bearer_token;
        const networkStatus = networkMonitor.getNetworkStatus();
        if (!networkStatus?.online) {
            throw new Error('No internet connection');
        }
        const token = bearerToken;
        const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
        config.headers['Authorization'] = `Bearer ${token}`;
        config.headers['Access'] = `Enter ${accessToken}`;
        // if (token) {
        // }
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