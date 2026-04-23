import { defineStore } from 'pinia';
import api from '../../services/api';

export const useWorkStore = defineStore('work', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/work');
        this.items = response.data.data ?? [];
      } catch (e) {
        this.error = e.response?.data?.message || e.message;
      } finally {
        this.loading = false;
      }
    },
    async create(data) {
      try {
        await api.post('/work', data);
        await this.fetchAll();
        this.error = null;
      } catch (e) {
        this.error = e.response?.data?.message || e.message;
      }
    },
    async update(id, data) {
      try {
        await api.patch(`/work/${id}`, data);
        await this.fetchAll();
        this.error = null;
      } catch (e) {
        this.error = e.response?.data?.message || e.message;
      }
    },
    async remove(id) {
      try {
        await api.delete(`/work/${id}`);
        await this.fetchAll();
        this.error = null;
      } catch (e) {
        this.error = e.response?.data?.message || e.message;
      }
    },
  },
});
