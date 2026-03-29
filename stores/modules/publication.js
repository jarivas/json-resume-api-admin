import { defineStore } from 'pinia';
import api from '../../services/api';

export const usePublicationStore = defineStore('publication', {
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
        const response = await api.get('/publication');
        this.items = response.data;
      } catch (e) {
        this.error = e.response?.data?.message || e.message;
      } finally {
        this.loading = false;
      }
    },
    async create(data) {
      try {
        await api.post('/publication', data);
        await this.fetchAll();
        this.error = null;
      } catch (e) {
        this.error = e.response?.data?.message || e.message;
      }
    },
    async update(id, data) {
      try {
        await api.patch(`/publication/${id}`, data);
        await this.fetchAll();
        this.error = null;
      } catch (e) {
        this.error = e.response?.data?.message || e.message;
      }
    },
    async remove(id) {
      try {
        await api.delete(`/publication/${id}`);
        await this.fetchAll();
        this.error = null;
      } catch (e) {
        this.error = e.response?.data?.message || e.message;
      }
    },
  },
});
