import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') ? localStorage.getItem('token') || '' : '',
    expiresAt: (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function' && localStorage.getItem('expiresAt')) ? Number(localStorage.getItem('expiresAt')) : 0,
    loading: false,
    error: null,
    _refreshTimerId: null,
    _refreshing: false,
  }),
  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/authentication/login', { email, password });
        this.token = response.data.token;
        // expiresAt may be returned as ISO string or numeric timestamp (ms)
        const expires = response.data.expiresAt;
        this.expiresAt = expires ? (typeof expires === 'number' ? expires : Date.parse(expires)) : 0;
        if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
          localStorage.setItem('token', this.token);
          localStorage.setItem('expiresAt', String(this.expiresAt));
        }
        this.user = response.data.user || null;
        this._startRefreshTimer();
      } catch (e) {
        if (e.response?.data?.errors) {
          this.error = Object.values(e.response.data.errors).flat().join(' ');
        } else {
          this.error = e.response?.data?.message || 'Login failed';
        }
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.token = '';
      this.user = null;
      this.expiresAt = 0;
      if (typeof localStorage !== 'undefined' && typeof localStorage.removeItem === 'function') {
        localStorage.removeItem('token');
        localStorage.removeItem('expiresAt');
      }
      this._clearRefreshTimer();
    },

    _clearRefreshTimer() {
      if (this._refreshTimerId) {
        clearTimeout(this._refreshTimerId);
        this._refreshTimerId = null;
      }
    },

    _startRefreshTimer() {
      this._clearRefreshTimer();
      if (!this.expiresAt) return;
      const msUntilRefresh = this.expiresAt - Date.now() - 30000; // 30 seconds before expiry
      const delay = msUntilRefresh > 0 ? msUntilRefresh : 0;
      this._refreshTimerId = setTimeout(() => {
        this.refreshToken().catch(() => {
          // If refresh fails, ensure the user is logged out
          this.logout();
        });
      }, delay);
    },

    isTokenExpiringSoon(seconds = 30) {
      if (!this.expiresAt) return true;
      return (this.expiresAt - Date.now()) <= seconds * 1000;
    },

    async refreshToken() {
      if (this._refreshing) return;
      try {
        this._refreshing = true;
        const response = await api.post('/authentication/refresh-token');
        this.token = response.data.token;
        const expires = response.data.expiresAt;
        this.expiresAt = expires ? (typeof expires === 'number' ? expires : Date.parse(expires)) : 0;
        if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
          localStorage.setItem('token', this.token);
          localStorage.setItem('expiresAt', String(this.expiresAt));
        }
        this._startRefreshTimer();
      } catch (e) {
        // If refresh fails we should logout to avoid using an invalid token
        this.logout();
        throw e;
      } finally {
        this._refreshing = false;
      }
    },
  },
});
