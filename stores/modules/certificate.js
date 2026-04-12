import { defineStore } from 'pinia';
import defaultApi from '../../services/api';

export function createCertificateStore(api = defaultApi) {
  return defineStore('certificate', {
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
          const response = await api.get('/certificate');
          this.items = response.data;
        } catch (e) {
          this.error = e.response?.data?.message ?? null;
        } finally {
          this.loading = false;
        }
      },
      async create(data) {
        try {
          await api.post('/certificate', data);
          await this.fetchAll();
          this.error = null;
        } catch (e) {
          this.error = e.response?.data?.message ?? null;
        }
      },
      async update(id, data) {
        try {
          await api.patch(`/certificate/${id}`, data);
          await this.fetchAll();
          this.error = null;
        } catch (e) {
          this.error = e.response?.data?.message ?? null;
        }
      },
      async remove(id) {
        try {
          await api.delete(`/certificate/${id}`);
          await this.fetchAll();
          this.error = null;
        } catch (e) {
          this.error = e.response?.data?.message ?? null;
        }
      },
      async importFromUrl(url) {
        try {
          await api.post('/import/certificate', { url });
          await this.fetchAll();
          this.error = null;
        } catch (e) {
          try {
            await api.post('/import/resume', { url });
            await this.fetchAll();
            this.error = null;
          } catch (err) {
            this.error = e.response?.data?.message ?? err.response?.data?.message ?? null;
          }
        }
      },
      async importFile(file) {
        try {
          const fd = new FormData();
          fd.append('file', file);
          await api.post('/import/certificate', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
          await this.fetchAll();
          this.error = null;
        } catch (e) {
          try {
            const fd = new FormData();
            fd.append('file', file);
            await api.post('/import/resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            await this.fetchAll();
            this.error = null;
          } catch (err) {
            this.error = e.response?.data?.message ?? err.response?.data?.message ?? null;
          }
        }
      },
    },
  });
}

export const useCertificateStore = createCertificateStore();
