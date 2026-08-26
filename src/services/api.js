import axios from 'axios';
import { getSession, setSession, clearAuth } from '../utils/storage';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'https://dreamhatcher-paystack-backend.onrender.com',
  headers: { 'Content-Type': 'application/json' },
  timeout: 35000,
});

API.interceptors.request.use((config) => {
  const session = getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const session = getSession();
        if (session?.refresh_token) {
          const res = await axios.post(
            `${API.defaults.baseURL}/auth/refresh`,
            { refresh_token: session.refresh_token }
          );
          if (res.data.success) {
            const newSession = { ...session, ...res.data.session };
            setSession(newSession, true);
            originalRequest.headers.Authorization = `Bearer ${res.data.session.access_token}`;
            return API(originalRequest);
          }
        }
      } catch {
        clearAuth();
        window.location.hash = '#/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
