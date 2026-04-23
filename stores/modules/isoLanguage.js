import { defineStore } from 'pinia';
import api from '../../services/api';

export const useIsoLanguageStore = defineStore('isoLanguage', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll() {
      if (this.items.length) return;
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/iso/language');
        this.items = response.data ?? [];
      } catch (e) {
        this.error = e.response?.data?.message || e.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
