import axios from 'axios';

// Avoid a top-level import of `useAuthStore` to prevent a circular dependency
// between `services/api` and `stores/auth`. The store is imported dynamically
// inside the request interceptor.

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

api.interceptors.request.use(async (config) => {
  try {
    // Avoid importing the auth store here to prevent circular dependencies
    // and Vite static/dynamic import warnings. Read token directly from
    // localStorage which `useAuthStore` also persists to.
    const token = (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') ? localStorage.getItem('token') : null;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

// Response interceptor: if a request fails due to authentication, clear auth and
// redirect to login so the user isn't left on a protected page with an invalid token.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      try {
        // Clear persisted token/state without importing the store to avoid
        // circular/static-dynamic import warnings.
        if (typeof localStorage !== 'undefined' && typeof localStorage.removeItem === 'function') {
          localStorage.removeItem('token');
          localStorage.removeItem('expiresAt');
        }
      } catch (e) {
        // ignore
      }
      try {
        if (typeof window !== 'undefined' && window.location) {
          // Avoid importing the router here to prevent circular dependencies
          // and the Vite dynamic-import-with-static-import warning.
          window.location.replace('/login');
        }
      } catch (e) {
        // ignore
      }
    }
    return Promise.reject(error);
  }
);

export default api;
