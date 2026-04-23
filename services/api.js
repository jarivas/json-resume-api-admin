import axios from 'axios';

// Avoid a top-level import of `useAuthStore` to prevent a circular dependency
// between `services/api` and `stores/auth`. The store is imported dynamically
// inside the request interceptor.

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

api.interceptors.request.use(async (config) => {
  try {
    const mod = await import('../stores/auth');
    const useAuthStore = mod.useAuthStore;
    const auth = useAuthStore();
    // Don't try to refresh while calling auth endpoints to avoid recursion
    const url = config.url || '';
    const isAuthEndpoint = url.includes('/authentication/refresh') || url.includes('/authentication/refresh-token') || url.includes('/authentication/login');
    if (!isAuthEndpoint) {
      try {
        if (auth && typeof auth.isTokenExpiringSoon === 'function' && auth.isTokenExpiringSoon(30)) {
          // attempt a refresh before the request if token is about to expire
          if (typeof auth.refreshToken === 'function') {
            await auth.refreshToken();
          }
        }
      } catch (e) {
        // ignore refresh errors here; request will proceed and likely fail with 401
      }
    }

    if (auth?.token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
  } catch (e) {
    // If dynamic import fails in test environment, just continue without auth header
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
        const mod = await import('../stores/auth');
        const useAuthStore = mod.useAuthStore;
        const auth = useAuthStore();
        // Ensure local state is cleared
        if (auth && typeof auth.logout === 'function') auth.logout();
      } catch (e) {
        // ignore
      }
      try {
        const mod = await import('../router');
        const router = mod.default;
        if (router && typeof router.push === 'function') router.push('/login');
      } catch (e) {
        // ignore
      }
    }
    return Promise.reject(error);
  }
);

export default api;
