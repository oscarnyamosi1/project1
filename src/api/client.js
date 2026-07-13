import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL,
  timeout: 10000,
});

// ---- Request interceptor — attach token --------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ---- Response interceptor — normalize errors ---------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = {
      status: error?.response?.status ?? 0,
      message:
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong. Please try again.',
      data: error?.response?.data ?? null,
    };

    if (normalized.status === 401) {
      localStorage.removeItem('wp_token');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        const base = import.meta.env.BASE_URL.replace(/\/$/, '');
        window.location.href = `${base}/login`;
      }
    }

    return Promise.reject(normalized);
  },
);

// ---- Mock helper -------------------------------------------------------
// Frontend-only: simulate network with realistic latency.
export const mockResponse = (data, delay = 320) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), delay));

export default api;
