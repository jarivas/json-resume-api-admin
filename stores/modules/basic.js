import { defineStore } from 'pinia';
import defaultApi from '../../services/api';

export function createBasicStore(api = defaultApi) {
  return defineStore('basic', {
    state: () => ({
      item: null,
      loading: false,
      error: null,
    }),
    actions: {
      async fetchAll() {
        this.loading = true;
        this.error = null;
        try {
          const response = await api.get('/basic');
          this.item = response.data.data?.[0] ?? null;
        } catch (e) {
          this.error = e.response?.data?.message ?? null;
        } finally {
          this.loading = false;
        }
      },
      async create(data) {
        try {
          await api.post('/basic', data);
          await this.fetchAll();
          this.error = null;
        } catch (e) {
          this.error = e.response?.data?.message ?? null;
        }
      },
      async update(id, data) {
        try {
          // If API uses a singular endpoint for basics, support both PATCH /basic/:id and PATCH /basic
          const path = id ? `/basic/${id}` : '/basic'
          await api.patch(path, data);
          await this.fetchAll();
          this.error = null;
        } catch (e) {
          this.error = e.response?.data?.message ?? null;
        }
      },
      async remove(id) {
        try {
          const path = id ? `/basic/${id}` : '/basic'
          await api.delete(path);
          await this.fetchAll();
          this.error = null;
        } catch (e) {
          this.error = e.response?.data?.message ?? null;
        }
      },
    },
  });
}

export const useBasicStore = createBasicStore();
