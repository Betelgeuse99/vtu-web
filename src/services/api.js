import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'https://dreamhatcher-paystack-backend.onrender.com',
  headers: { 'Content-Type': 'application/json' },
  timeout: 35000,
});

API.interceptors.request.use((config) => {
  const session = JSON.parse(localStorage.getItem('vtu_session') || 'null');
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
        const session = JSON.parse(localStorage.getItem('vtu_session') || 'null');
        if (session?.refresh_token) {
          const res = await axios.post(
            `${API.defaults.baseURL}/auth/refresh`,
            { refresh_token: session.refresh_token }
          );
          if (res.data.success) {
            const newSession = { ...session, ...res.data.session };
            localStorage.setItem('vtu_session', JSON.stringify(newSession));
            originalRequest.headers.Authorization = `Bearer ${res.data.session.access_token}`;
            return API(originalRequest);
          }
        }
      } catch {
        localStorage.removeItem('vtu_session');
        localStorage.removeItem('vtu_user');
        window.location.hash = '#/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
