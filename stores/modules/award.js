import { defineStore } from 'pinia';
import defaultApi from '../../services/api';

export function createAwardStore(api = defaultApi) {
  return defineStore('award', {
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
          const response = await api.get('/award');
          this.items = response.data.data ?? [];
        } catch (e) {
          this.error = e.response?.data?.message ?? null;
        } finally {
          this.loading = false;
        }
      },
      async create(data) {
        try {
          await api.post('/award', data);
          await this.fetchAll();
          this.error = null;
        } catch (e) {
          this.error = e.response?.data?.message ?? null;
        }
      },
      async update(id, data) {
        try {
          await api.patch(`/award/${id}`, data);
          await this.fetchAll();
          this.error = null;
        } catch (e) {
          this.error = e.response?.data?.message ?? null;
        }
      },
      async remove(id) {
        try {
          await api.delete(`/award/${id}`);
          await this.fetchAll();
          this.error = null;
        } catch (e) {
          this.error = e.response?.data?.message ?? null;
        }
      },
    },
  });
}

// Default export for app usage
export const useAwardStore = createAwardStore();
