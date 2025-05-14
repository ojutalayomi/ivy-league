import axios, { AxiosError } from 'axios';
import { networkMonitor } from '@/lib/network'

export const api = axios.create({
    baseURL: "http://192.168.141.216:5001", // Use the local development URL
    // withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const { online } = networkMonitor.getNetworkStatus();
    if (!online) throw new Error('No internet connection');
    const token = "";
    if (token) {
      config.headers['X-Secondary-Authorization'] = `Bearer ${token}`;
    }
    return config;
});
  
  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      console.error('API Error:', error);
    }
  );