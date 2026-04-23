import { defineStore } from 'pinia';
import api from '../../services/api';

export const useAiRequestStore = defineStore('aiRequest', {
  state: () => ({
    items: [],
    currentPage: 1,
    lastPage: 1,
    total: 0,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchPage(page = 1) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/ai-request/${page}`);
        const data = response.data;
        this.items = data.data ?? [];
        this.currentPage = data.current_page ?? page;
        this.lastPage = data.last_page ?? 1;
        this.total = data.total ?? 0;
      } catch (e) {
        this.error = e.response?.data?.message || e.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
