import { defineStore } from 'pinia';
import defaultApi from '../../services/api';

export function createEducationStore(api = defaultApi) {
  return defineStore('education', {
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
          const response = await api.get('/education');
          this.items = response.data.data ?? [];
        } catch (e) {
          this.error = e.response?.data?.message ?? null;
        } finally {
          this.loading = false;
        }
      },
      async create(data) {
        try {
          await api.post('/education', data);
          await this.fetchAll();
          this.error = null;
        } catch (e) {
          this.error = e.response?.data?.message ?? null;
        }
      },
      async update(id, data) {
        try {
          await api.patch(`/education/${id}`, data);
          await this.fetchAll();
          this.error = null;
        } catch (e) {
          this.error = e.response?.data?.message ?? null;
        }
      },
      async remove(id) {
        try {
          await api.delete(`/education/${id}`);
          await this.fetchAll();
          this.error = null;
        } catch (e) {
          this.error = e.response?.data?.message ?? null;
        }
      },
      async importFromUrl(url) {
        try {
          await api.post('/import/education', { url });
          await this.fetchAll();
          this.error = null;
        } catch (e) {
          this.error = e.response?.data?.message ?? e.message ?? null;
        }
      },
      async importFile(file) {
        try {
          const fd = new FormData();
          fd.append('file', file);
          await api.post('/import/education', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
          await this.fetchAll();
          this.error = null;
        } catch (e) {
          this.error = e.response?.data?.message ?? e.message ?? null;
        }
      },
    },
  });
}

export const useEducationStore = createEducationStore();
